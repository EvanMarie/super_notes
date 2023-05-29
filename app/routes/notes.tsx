import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import type { Note } from "@prisma/client";
import { getAllNotes } from "~/models/note.server";

export async function loader({ request }: LoaderArgs) {
  const notes = await getAllNotes();
  return json(notes);
}

export default function Notes() {
  const notes = useLoaderData<Note[]>();
  const navigate = useNavigate();

  const handleMoveToTrash = async (noteId: number) => {
    await fetch(`/notes/moveToTrash/${noteId}`, { method: "POST" });
    navigate("/notes");
  };

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>
          <Link to="/notes/new">New Note</Link>
        </li>
        <li>
          <Link to="/trash">Trashed Notes</Link>
        </li>
        {notes &&
          notes.map((note) => (
            <li key={note.id}>
              <Link to={`/notes/${note.id}`}>{note.title}</Link>
              <Link to={`/notes/edit/${note.id}`}>
                <button>Edit It!</button>
              </Link>
              <button onClick={() => handleMoveToTrash(note.id)}>
                Trash It!
              </button>
            </li>
          ))}
      </ul>
      <Outlet />
    </div>
  );
}
