import { Tag } from "./model/Tag";
import { TagPrisma } from "../types/prismatypes";


export const mapToTags = (tagsPrisma: TagPrisma[]): Tag[] => {
    let out: Tag[] = [];
    if (tagsPrisma === null || tagsPrisma === undefined) return undefined;
    tagsPrisma.forEach(el => {
        out.push(new Tag({tagId: el.tagID, name: el.name}))
    })
    return out;
}

