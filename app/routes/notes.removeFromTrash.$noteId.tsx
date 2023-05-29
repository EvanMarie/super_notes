import { ActionArgs } from "@remix-run/node";
import { restoreFromTrash } from "~/models/note.server";

export async function action({ params }: ActionArgs) {
  await restoreFromTrash(Number(params.noteId));
  return { status: 204 };
}
