import { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { deleteNoteById } from "~/models/note.server";

export async function action({ params }: ActionArgs) {
  await deleteNoteById(Number(params.noteId));
  return { status: 204 };
}
