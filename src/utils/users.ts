import type { RESTGetAPIUserResult } from "discord-api-types/v10";

async function getUser(id: string): Promise<RESTGetAPIUserResult | undefined> {
  if (
    process.env.DISCORD_TOKEN === undefined ||
    process.env.DISCORD_TOKEN === ""
  ) {
    throw new Error("No discord token provided");
  }
  const response = await fetch(
    `https://discord.com/api/v10/users/${id.trim()}`,
    {
      method: "GET",
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.ok
    ? ((await response.json()) as RESTGetAPIUserResult)
    : undefined;
}

// eslint-disable-next-line import/prefer-default-export
export { getUser };
