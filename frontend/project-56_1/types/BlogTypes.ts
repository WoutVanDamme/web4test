export interface BlogPost {
    postID: number;
    user: User;
    text: string;
    title: string;
    tags: Tag[];
    date: Date;
    comment: BlogComment[];
    image: string;
}

export interface Tag {
    name: string;
}

export interface  BlogComment {
    commentID: number;
    text: string;
    user: User;
    postID: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    admin: Boolean;
}


export interface User {
    username: string;
    password: string;
}

export interface UserWithEmail {
    username: string;
    email: string;
    password: string;
    admin: Boolean;
}

export interface Penalty {
    description: string,
    days: number,
    user: User,
}