import { BlogPost } from "../model/BlogPost";
import { User } from "../model/User";

class BlogComment {

    readonly commentID: number;
    readonly user: User;
    readonly text: string;
    readonly blogPostId: number;

    constructor(prisma: {commentID: number,user: User, text: string, blogPostId: number}) {
        this.commentID = prisma.commentID;
        this.user = prisma.user;
        this.text = prisma.text;
        this.blogPostId = prisma.blogPostId;
    }
}

export {BlogComment};
