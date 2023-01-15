import type { RESTGetAPIUserResult } from "discord-api-types/v10";

async function getUser(id: string): Promise<RESTGetAPIUserResult | undefined> {
  const response = await fetch(`https://discord.com/api/v10/users/${id}`);
  return response.ok
    ? ((await response.json()) as RESTGetAPIUserResult)
    : undefined;
}

// eslint-disable-next-line import/prefer-default-export
export { getUser };
