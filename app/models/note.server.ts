import { prisma } from "~/db.server";
import type { Prisma } from "@prisma/client";

export function getNoteById(id: number) {
  return prisma.note.findUnique({
    where: { id },
    include: {
            tags: true,
        },
    });
}

export function getAllNotes() {
  return prisma.note.findMany({
    where: { trashed: false },
    include: {
            tags: true,
        },
    });
}

export function createNote(
  data: Prisma.NoteCreateInput,
): Promise<Prisma.Note> {
  return prisma.note.create({
    data
  });
}

export type UpdateNoteInput = {
    id: number;
    title?: string;
    content?: string;
};

export function updateNote(
    data: UpdateNoteInput,
    ): Promise<Prisma.Note> {
    return prisma.note.update({
        where: { id: data.id },
        data,
    });
    }

export function deleteNoteById(id: number) {
    return prisma.note.delete({
        where: { id },
    });
    }

  export function moveToTrash(id: number) {
    return prisma.note.update({
        where: { id },
        data: { trashed: true, trashedAt: new Date() },
    });
    }

export function emptyOldTrash() {
    return prisma.note.deleteMany({
        where: { trashed: true, trashedAt: { lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 )} },
    });
    }

export function restoreFromTrash(id: number) {
    return prisma.note.update({
        where: { id },
        data: { trashed: false, trashedAt: null },
    });
    }

  export function getTrash() {
    return prisma.note.findMany({
        where: { trashed: true },
    });
    }





