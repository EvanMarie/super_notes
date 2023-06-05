import { ActionArgs, redirect } from "@remix-run/node";
import { useActionData, useFetcher, useSubmit } from "@remix-run/react";
import type { Note, Tag } from "@prisma/client";
import { createNote } from "~/models/note.server";
import { TagSelectEntry } from "./tags";
import { prisma } from "~/db.server";
import { useEffect, useState } from "react";

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData());
  const { title, content, tag: tags } = data;

  const tagsArray = tags ? (tags as string).split(",") : [];
  const tag = tagsArray[0] || "";
  const note = await createNote({
    title: title as string,
    content: content as string,
  });
  let tagRecord: Tag | null = null;
  if (tag !== "") {
    tagRecord = await prisma.tag.findUnique({
      where: {
        name: tag as string,
      },
    });
    if (!tagRecord) {
      tagRecord = await prisma.tag.create({
        data: {
          name: tag as string,
        },
      });
      await prisma.note.update({
        where: {
          id: note.id,
        },
        data: {
          tags: {
            connect: {
              id: tagRecord.id,
            },
          },
        },
      });
    }
  }

  return redirect("/notes/" + note.id);
}

export default function NewNote() {
  const data = useActionData<Note>();
  const fetcher = useFetcher();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tagString, setTagString] = useState<string>("");
  const submit = useSubmit();

  useEffect(() => {
    setTagString(selectedTags.map((tag) => tag.name).join(","));
    console.log("tagString", tagString);
  }, [selectedTags]);

  const handleClick = () => {
    console.log("TagString", tagString);
    fetcher.submit(
      { title: title, content: content, tag: tagString },
      { method: "post", action: "/notes/new" }
    );
  };

  return (
    <div>
      <form method="post">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="content"
          onChange={(e) => setContent(e.target.value)}
        />
        <TagSelectEntry onSelectedTagsChange={setSelectedTags} />
        <button onClick={handleClick}>Create</button>
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
