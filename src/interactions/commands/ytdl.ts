/* eslint-disable @typescript-eslint/naming-convention */
import type { APIApplicationCommandInteractionDataBasicOption } from "discord-api-types/v10";

import YTDlpWrap from "yt-dlp-wrap";
import type Command from "../Command.js";

// eslint-disable-next-line new-cap
const ytdlp = new YTDlpWrap.default();

interface VideoInfo {
  id: string;
  title: string;
  fulltitle: string;
  ext: string;
  alt_title: string;
  description: string;
  display_id: string;
  uploader: string;
  license: string;
  creator: string;
  timestamp: number;
  upload_date: string;
  release_timestamp: number;
  release_date: string;
  modified_timestamp: number;
  modified_date: string;
  uploader_id: string;
  channel: string;
  channel_id: string;
  channel_follower_count: number;
  location: string;
  duration: number;
  duration_string: string;
  view_count: number;
  concurrent_view_count: number;
  like_count: number;
  dislike_count: number;
  repost_count: number;
  average_rating: number;
  comment_count: number;
  age_limit: number;
  live_status:
    | "is_live"
    | "is_upcoming"
    | "not_live"
    | "post_live"
    | "was_live";
  is_live: boolean;
  was_live: boolean;
  playable_in_embed: string;
  availability:
    | "needs_auth"
    | "premium_only"
    | "private"
    | "public"
    | "subscriber_only"
    | "unlisted";
  start_time: number;
  end_time: number;
  extractor: string;
  extractor_key: string;
  epoch: number;
  autonumber: number;
  video_autonumber: number;
  n_entries: number;
  playlist_id: string;
  playlist_title: string;
  playlist: string;
  playlist_count: number;
  playlist_index: number;
  playlist_autonumber: number;
  playlist_uploader: string;
  playlist_uploader_id: string;
  webpage_url: string;
  webpage_url_basename: string;
  webpage_url_domain: string;
  original_url: string;
}

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
        name: "audioOnly",
        description: "only download audio",
      },
    ],
  },
  exec: async (ctx) => {
    const urlOption = ctx.findOption(
      "url"
    ) as APIApplicationCommandInteractionDataBasicOption;

    ctx.defer();

    try {
      const metadata: VideoInfo = (await ytdlp.getVideoInfo(
        urlOption.value as string
      )) as VideoInfo;

      const vid = await ytdlp.execPromise([
        "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        "-f",
        "best[ext=mp4]",
        "--max-filesize",
        "8M",
      ]);

      await ctx.editDeferred(
        {
          content: metadata.title,
        },
        [
          {
            filename: "video.mp4",
            value: Buffer.from(vid),
          },
        ]
      );
    } catch {
      await ctx.editTextDeferred("Invalid url");
    }
  },
};

export default ytdl;
