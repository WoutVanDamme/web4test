import { BlogCommentPrisma, BlogPostPrisma, UserPrisma, PenaltyPrisma } from "../types/prismatypes";
import { mapToPosts } from "./blogPost.mapper";
import { mapToComments } from "./comment.mapper";
import { mapToPenalties } from "./penalty.mapper";
import { Penalty } from "./model/Penalty";
import { User } from "./model/User";

export const mapToUser = (user: UserPrisma & {comments: BlogCommentPrisma[]} & {penalties: PenaltyPrisma[]} & {blogPosts: BlogPostPrisma[]}): User =>{
    if(user === undefined || user === null) return undefined;
    return new User({id: user.id, name: user.name, email: user.email, password: user.password, admin: user.admin, blogPosts: mapToPosts(user.blogPosts), comments: mapToComments(user.comments), penalties: mapToPenalties(user.penalties)});
}
    

export const mapToUsers = (usersPrisma: (UserPrisma)[]): User[] =>
    usersPrisma.map(mapToUser);