import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getAllTags } from "~/models/tag.server";
import type { Tag } from "@prisma/client";
import CreatableReactSelect from "react-select/creatable";

export async function loader({ request }: LoaderArgs) {
  const tags = await getAllTags();
  return json(tags);
}

export type TagSelectEntryProps = {
  value?: string;
  onSelectedTagsChange?: (tags: Tag[]) => void;
};

export function TagSelectEntry({
  value,
  onSelectedTagsChange,
}: TagSelectEntryProps) {
  const fetcher = useFetcher();
  const [newTag, setNewTag] = useState<string | null>(value || "");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data === undefined) {
      fetcher.load("/tags");
    } else if (fetcher.data !== undefined) {
      setTags(fetcher.data);
    }
  }, [fetcher]);

  useEffect(() => {
    console.log("selectedTags", selectedTags);
    onSelectedTagsChange?.(selectedTags);
  }, [selectedTags]);
  // todo add a handleSubmit function that will add a tag to a note.
  return (
    <CreatableReactSelect
      defaultValue={[tags[0]] || newTag}
      // isClearable
      // isSearchable
      name="tag"
      options={tags.map((tag) => {
        return { value: tag.id, label: tag.name };
      })}
      onChange={(newTags) => {
        setSelectedTags(
          newTags.map((tag) => {
            return { id: tag.value, name: tag.label };
          })
        );
      }}
      isMulti
    />
  );
}
