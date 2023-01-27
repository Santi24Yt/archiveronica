import { spawn } from "node:child_process";
import { PassThrough } from "node:stream";
import type { APIApplicationCommandInteractionDataBasicOption } from "discord-api-types/v10";

import type Command from "../Command.js";

// aaainterface VideoInfo {
//   id: string;
//   title: string;
//   fulltitle: string;
//   ext: string;
//   alt_title: string;
//   description: string;
//   display_id: string;
//   uploader: string;
//   license: string;
//   creator: string;
//   timestamp: number;
//   upload_date: string;
//   release_timestamp: number;
//   release_date: string;
//   modified_timestamp: number;
//   modified_date: string;
//   uploader_id: string;
//   channel: string;
//   channel_id: string;
//   channel_follower_count: number;
//   location: string;
//   duration: number;
//   duration_string: string;
//   view_count: number;
//   concurrent_view_count: number;
//   like_count: number;
//   dislike_count: number;
//   repost_count: number;
//   average_rating: number;
//   comment_count: number;
//   age_limit: number;
//   live_status:
//     | "is_live"
//     | "is_upcoming"
//     | "not_live"
//     | "post_live"
//     | "was_live";
//   is_live: boolean;
//   was_live: boolean;
//   playable_in_embed: string;
//   availability:
//     | "needs_auth"
//     | "premium_only"
//     | "private"
//     | "public"
//     | "subscriber_only"
//     | "unlisted";
//   start_time: number;
//   end_time: number;
//   extractor: string;
//   extractor_key: string;
//   epoch: number;
//   autonumber: number;
//   video_autonumber: number;
//   n_entries: number;
//   playlist_id: string;
//   playlist_title: string;
//   playlist: string;
//   playlist_count: number;
//   playlist_index: number;
//   playlist_autonumber: number;
//   playlist_uploader: string;
//   playlist_uploader_id: string;
//   webpage_url: string;
//   webpage_url_basename: string;
//   webpage_url_domain: string;
//   original_url: string;
// }

const ytdl: Command = {
  json: {
    name: "ytdl",
    description: "Downloads 8mb of a youtube video",
    type: 1,
    options: [
      {
        type: 3,
        name: "url",
        description: "a valid youtube url",
        required: true,
      },
      {
        type: 5,
        name: "audio-only",
        description: "only download audio",
      },
    ],
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
  exec: async (ctx) => {
    const urlOption = ctx.findOption(
      "url"
    ) as APIApplicationCommandInteractionDataBasicOption;

    const audioOption = ctx.findOption("audio-only") as
      | APIApplicationCommandInteractionDataBasicOption
      | undefined;

    ctx.defer();

    try {
      const ytdlpOptions = [
        urlOption.value as string,
        "-o",
        "-",
        "--no-part",
        "--no-playlist",
        "--quiet",
        "-f",
        "best*[vcodec!=none][acodec!=none][ext~='mp4|gif|webm|mov']/bestvideo+bestaudio",
        "--format-sort-force",
        "-S",
      ];

      let sortParameters = "hasaud,";

      sortParameters +=
        audioOption !== undefined && (audioOption.value as boolean)
          ? "+hasvid,"
          : "hasvid,";

      sortParameters += "+size,+filesize,+fs_approx,+res,+br";

      ytdlpOptions.push(
        sortParameters,
        "--downloader-args",
        "'-f mp4 -movflags frag_keyframe+empty_moov'"
      );

      const ytdlProcess = spawn("yt-dlp", ytdlpOptions);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      ytdlProcess.on("error", async (error: unknown) => {
        const errorMessage =
          typeof error === "string" ? error : (error as Error).message;
        await (errorMessage.includes(
          'is not a valid URL. Set --default-search "ytsearch" (or run  yt-dlp "ytsearch'
        )
          ? ctx.editTextDeferred(
              `${urlOption.value as string} is not a valid url`
            )
          : ctx.editTextDeferred(
              `Unknown error ocurred, contact devs\nError: ${errorMessage}`
            ));
        console.error(error);
      });

      const stream = new PassThrough();
      ytdlProcess.stdout.pipe(stream);

      let stderrData = "";
      ytdlProcess.stderr.on("data", (chunk) => {
        stderrData += (chunk as Buffer).toString();
      });

      let file = Buffer.from("");
      let fileSizeOnBytes = 0;

      // 8 * 1024 * 1024 (8Mb)
      const MAX_FILE_SIZE = 8_388_608;

      stream.on("error", (error) => {
        ytdlProcess.emit("error", error);
      });

      stream.on("data", (chunk) => {
        fileSizeOnBytes += (chunk as Buffer).byteLength;
        if (fileSizeOnBytes > MAX_FILE_SIZE) {
          stream.emit("end");
          return;
        }
        file = Buffer.concat([file, chunk]);
      });

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      stream.on("end", async () => {
        if (file.toString() === "" && stderrData !== "") {
          ytdlProcess.emit("error", stderrData);
          return;
        }
        stream.destroy();
        ytdlProcess.kill();
        await ctx.editDeferred(
          {
            content: `<${urlOption.value as string}>`,
          },
          [
            {
              filename: "video.mp4",
              value: file,
            },
          ]
        );
      });
    } catch (error) {
      await ctx.editTextDeferred(
        `Unknown error ocurred, contact devs\nError: ${error as string}`
      );
    }
  },
};

export default ytdl;
