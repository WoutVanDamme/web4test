import {BlogPost} from "../domain/model/BlogPost";
import { BlogPostPrisma, TagPrisma, UserPrisma, BlogCommentPrisma } from "../types/prismatypes";
import {mapToTags} from "../domain/tag.mapper"
import { mapToComments } from "./comment.mapper";
import { mapToUser } from "./user.mapper";
import { User } from "./model/User";
import { Tag } from "./model/Tag";
import { BlogComment } from "./model/BlogComment";

// export const mapToPost = ({
//     postID,
//     user,
//     image,
//     text,
//     title,
//     tags,
//     date,
//     comment,
// }: BlogPostPrisma & {tags: TagPrisma[]} & {comment: BlogCommentPrisma[]} & {user: UserPrisma}): BlogPost =>
//     new BlogPost({postID, user: mapToUser(user), image, text, title, tags: mapToTags(tags), date, comment: mapToComments(comment)});

export const mapToPost = (post: BlogPostPrisma & {tags: TagPrisma[]} & {comment: BlogCommentPrisma[]} & {user: UserPrisma & {comments: []} & {penalties: []} & {blogPosts: []}}): BlogPost => {
    return new BlogPost({postID: post.postID, user: mapToUser(post.user), image: post.image, text: post.text, title: post.title, tags: mapToTags(post.tags), date: post.date, comment: mapToComments(post.comment)});
}


export const mapToPosts = (posts) => {
    // make domain model object
    let out: BlogPost[] = [];
    if (!posts) return out;
    posts.forEach(el => {
        //{postID: number, user: User, image:ImageBitmap, text: string, title: string, tag: Tag[], date: Date, comment: BlogComment[]}
        //out.push(new BlogPost(el.postID, mapUser(el.user), mapImage(el.image), el.text, el.title, mapTags(el.tags),el.date, mapComments(el.comments)))
        out.push(new BlogPost({postID: el.postID, user: mapToUser(el.user), image: el.image, text: el.text, title: el.title, tags: mapToTags(el.tags), date: el.date, comment: mapToComments(el.comments)}))
    });
return out;
}



