import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Tag } from "@prisma/client";
import { getAllTags, queryTagsByName } from "~/models/tag.server";
import { z } from "zod";

export async function loader({ request, params }: LoaderArgs) {
  const { query } = params;
  const _query = z.string().parse(query);
  const tags = await queryTagsByName(_query);
  return json(tags);
}
