import { ActionArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import type { Note } from "@prisma/client";
import { createNote } from "~/models/note.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const note = await createNote({
    title: title as string,
    content: content as string,
  });
  return redirect("/notes/" + note.id);
}

export default function NewNote() {
  const data = useActionData<Note>();
  return (
    <div>
      <form method="post">
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" autoFocus />
        <label htmlFor="content">Content</label>
        <textarea name="content" id="content" />
        <button type="submit">Create</button>
      </form>
      {data && (
        <div>
          <h2>{data.title}</h2>
          <p>{data.content}</p>
        </div>
      )}
    </div>
  );
}
