import BlogPostDB from "../domain/BlogPostDB";
import {BlogPost} from "../domain/model/BlogPost";
import { User } from "../domain/model/User";
import { Tag } from "../domain/model/Tag";
import { BlogComment } from "../domain/model/BlogComment";

const getAllPosts = async (): Promise<BlogPost[]> => {
const posts = await BlogPostDB.getAllPosts();
    return  posts;
}


const getPost = async (id: string): Promise<BlogPost> => {
    const numId = Number(id);
    if(isNaN(numId)) return undefined;
    const post = await BlogPostDB.getPost(numId);
    return post;
}

const getComment = async (id: string): Promise<BlogComment> => {
    const numId = Number(id);
    if (!isNaN(numId)) {

        const comment = await BlogPostDB.getComment(numId);
        return comment;
    }
    return undefined;
}

const getPostWithTag = async (tag: string): Promise<BlogPost[]> => {
    if(!tag) return undefined;

    const posts = await BlogPostDB.getPostWithTag(tag);
    return posts;
}

const addPost = async (blogPost: BlogPost) => {

    if(!blogPost) throw Error("Can not create the post");

    const post =  await BlogPostDB.addPost(blogPost);

    
    return post;
}

const removePost = async (id: string) => {
    const numId = Number(id);
    if (isNaN(numId)) return undefined;
    await BlogPostDB.removePost(numId);

    
}

const removeComment = async (id: string) => {
    const numId = Number(id);
    if (!isNaN(numId)) {
        await BlogPostDB.removeComment(numId);
    }
}

const editPost = async (id: string, prism: {image: string, text: string, title: string, tags: string[]}) => {
    const numId = Number(id);
    if (isNaN(numId) || prism.text === '' || prism.title === '') throw Error('Validation failed');

    return await BlogPostDB.editPost(numId, prism);
}

const addComment = async (user: User, text: string, blogPost: BlogPost) => {
    await BlogPostDB.addComment(user, text, blogPost);
}

const setPostImage = async (id: string, image: string) => {
    const numId = Number(id);
    if (isNaN(numId)) return undefined;
    await BlogPostDB.setPostImage(numId, image);
}

const getPenalties = async (id: number) => {
    if(!id || isNaN(id)) return undefined;
    return await BlogPostDB.getPenalties(id);
}

const removePenalty = async (id: number) => {
    if(!id || isNaN(id)) return undefined;
    return await BlogPostDB.removePenalty(id);
}


export default {
    getAllPosts,
    addPost,
    removePost,
    editPost,
    addComment,
    getPost,
    getPostWithTag,
    removeComment,
    getComment,
    setPostImage,
    getPenalties,
    removePenalty
}