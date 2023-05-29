import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import type { Note } from "@prisma/client";
import { getNoteById, updateNote } from "~/models/note.server";

export async function loader({ params }: LoaderArgs) {
  const note = await getNoteById(Number(params.noteId));
  return json(note);
}

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  await updateNote({
    id: Number(params.noteId),
    title: title as string,
    content: content as string,
  });

  return redirect(`/notes/${params.noteId}`);
}

export default function EditNote() {
  const note = useLoaderData<Note>();
  return (
    <div>
      <form method="post">
        <label htmlFor="title">{note ? note.title : ""}</label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={note ? note.title : ""}
        />
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="content"
          defaultValue={note ? note.content : ""}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
