import { prisma } from "~/db.server";
import type { Prisma, Tag } from "@prisma/client";
import { find } from "isbot";

export function getTagById(id: number) {
  return prisma.tag.findUnique({
    where: { id },
  });
}

export function getAllTags() {
  return prisma.tag.findMany(
    /*Do not return tags where all notes have a trashed value of true*/
    { where : { notes : { some : { trashed : false } } } }
  );
}

export function createTag(
  data: Prisma.TagCreateInput,
): Promise<Tag> {
  data.name = data.name.toLowerCase();
  return prisma.tag.create({
    data 
  });
}

export function updateTag(
  data : Partial<Tag> & Pick<Tag, "id">,
): Promise<Tag> {
  return prisma.tag.update({
    where: { id : data.id },
    data,
  });
}

export function deleteTagById(id: number) {
  return prisma.tag.delete({
    where: { id },
  });
}

export function deleteTagByName(name: string) {
  return prisma.tag.delete({
    where: { name },
  });
}

export function getTagByName(name: string) {
  return prisma.tag.findUnique({
    where: { name },
  });
}

export function queryTagsByName(name: string) {
  return prisma.tag.findMany({
    where: { name : { contains : name } },
  });
}

export function getTagsByNoteId(noteId: number) {
  return prisma.tag.findMany({
    where: { notes: { some: { id: noteId } } },
  });
}

export function renameTag(oldName: string, newName: string) {
  return prisma.tag.update({
    where: { name: oldName },
    data: { name: newName },
  });
}

export function getTagCount(name : string) {
  return prisma.tag.count({
    where: { name },
  });
}

