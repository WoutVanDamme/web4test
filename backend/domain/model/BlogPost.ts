
import {BlogComment} from './BlogComment';
import {Tag} from './Tag';
import {User} from './User'

class BlogPost {
    readonly postID: number;
    readonly user: User;

    readonly image?: string;
    readonly text: string;
    readonly title: string;
    readonly tags: Tag[];
    readonly date: Date;
    readonly comment: BlogComment[];

    constructor(prism: {postID: number, user: User, image:string, text: string, title: string, tags: Tag[], date: Date, comment: BlogComment[]}) {
        this.postID = prism.postID;
        this.user = prism.user;
        this.image = prism.image;
        this.text = prism.text;
        this.title = prism.title;
        this.tags = prism.tags;
        this.date = prism.date;
        this.comment = prism.comment;
    }
}


export {BlogPost};