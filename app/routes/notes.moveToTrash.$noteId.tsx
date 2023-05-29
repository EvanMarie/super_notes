import { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { moveToTrash } from "~/models/note.server";

export async function action({ params }: ActionArgs) {
  await moveToTrash(Number(params.noteId));
  return { status: 204 };
}
