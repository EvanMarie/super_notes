import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import type { Note } from "@prisma/client";
import { getAllNotes, getTrash } from "~/models/note.server";

export async function loader({ request }: LoaderArgs) {
  const notes = await getTrash();
  return json(notes);
}

export default function Notes() {
  const notes = useLoaderData<Note[]>();
  const navigate = useNavigate();

  const handleDelete = async (noteId: number) => {
    await fetch(`/notes/delete/${noteId}`, { method: "POST" });
    navigate("/trash");
  };

  const handleRemoveFromTrash = async (noteId: number) => {
    await fetch(`/notes/removeFromTrash/${noteId}`, { method: "POST" });
    navigate("/trash");
  };

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <li>
          <Link to="/notes">All Notes</Link>
        </li>
        {notes &&
          notes.map((note) => (
            <li key={note.id}>
              <Link to={`/notes/${note.id}`}>{note.title}</Link>
              <Link to={`/notes/removeFromTrash/${note.id}`}>
                <button onClick={() => handleRemoveFromTrash(note.id)}>
                  Restore It!
                </button>
              </Link>
              <button onClick={() => handleDelete(note.id)}>
                Forever Trash!
              </button>
            </li>
          ))}
      </ul>
      <Outlet />
    </div>
  );
}
