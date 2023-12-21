import { BlogComment } from "./BlogComment";
import { BlogPost } from "./BlogPost";
import { Penalty } from "./Penalty";

class User {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly blogPost: BlogPost[];
    readonly blogComment: BlogComment[];
    readonly penalty: Penalty[];
    readonly admin: Boolean;

    /*
    constructor(id: number, name: string, email: string, password: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.blogPost = [];
        this.blogComment = [];
        this.penalty = [];
    }
    */

    public constructor(prism: {id: number, name: string, email: string, password: string, admin: Boolean, blogPosts: BlogPost[], comments: BlogComment[], penalties: Penalty[]}) {
        this.id = prism.id;
        this.name = prism.name;
        this.email = prism.email;
        this.password = prism.password;
        this.blogPost = prism.blogPosts;
        this.blogComment = prism.comments;
        this.penalty = prism.penalties;
        this.admin = prism.admin;
    }


}

export {
    User
}