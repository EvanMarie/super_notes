import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Note } from "@prisma/client";
import { getNoteById } from "~/models/note.server";

export async function loader({ params }: LoaderArgs) {
  const note = await getNoteById(Number(params.noteId));
  return json(note);
}

export default function DisplayNote() {
  const note = useLoaderData<Note>();
  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
    </div>
  );
}
