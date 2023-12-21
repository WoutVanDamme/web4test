import { TagPrisma, BlogCommentPrisma, UserPrisma, BlogPostPrisma } from "../types/prismatypes";
import { BlogComment } from "../domain/model/BlogComment";
import { mapToPost } from "./blogPost.mapper";
import { mapToUser } from "./user.mapper";

export const mapToComment = ({commentID, user, text, postID}: BlogCommentPrisma & {user: UserPrisma & {comments: []} & {penalties: []} & {blogPosts: []}} & {blogPost: BlogPostPrisma & {tags: TagPrisma[]} & {comment: BlogCommentPrisma[]} & {user: UserPrisma}}): BlogComment => {

    return new BlogComment({commentID, user: mapToUser(user), text, blogPostId: postID});
} 

export const mapToComments = (commentsPrisma: BlogCommentPrisma[]): BlogComment[] => {
    if (commentsPrisma && commentsPrisma.length > 0) {
        return commentsPrisma.map(mapToComment);
    }
    return [];
}
    

    