import express, {NextFunction, Request, Response, Router} from 'express'
import { UserInput } from '../types/BlogTypes';
import { BlogPost } from '../domain/model/BlogPost';
import BlogPostService from '../service/BlogPostService';

import {User} from "../domain/model/User"
import { UserPrisma } from "../types/prismatypes";
import { BlogComment } from '../domain/model/BlogComment';

import userService from "../service/UserService";

import bcrypt from 'bcrypt';
import { InputType } from 'zlib';
import { Tag } from '../domain/model/Tag';
import { Penalty } from '../domain/model/Penalty';
import { RouteUtils } from './routeUtils';

const commentRouter = express.Router();



/**
 * @swagger
 * components:
 *   schemas:
 *     BlogPost:
 *       type: object
 *       properties:
 *         postID:
 *           type: integer
 *         user:
 *           $ref: '#/components/schemas/User'
 *         image:
 *           type: string
 *         text:
 *           type: string
 *         title:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *         date:
 *           type: string
 *           format: date-time
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BlogComment'
 *         userId:
 *           type: integer
 * 
 *     BlogComment:
 *       type: object
 *       properties:
 *         commentID:
 *           type: integer
 *         userId:
 *           type: integer
 *         user:
 *           $ref: '#/components/schemas/User'
 *         text:
 *           type: string
 *         postID:
 *           type: integer
 *         BlogPost:
 *           $ref: '#/components/schemas/BlogPost'
 * 
 *     Tag:
 *       type: object
 *       properties:
 *         tagID:
 *           type: integer
 *         name:
 *           type: string
 *         blogPosts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BlogPost'
 * 
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         BlogPost:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BlogPost'
 *         BlogComment:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BlogComment'
 *         Penalty:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Penalty'
 *         admin:
 *           type: boolean
 * 
 *     Penalty:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         description:
 *           type: string
 *         days:
 *           type: integer
 *         user:
 *           $ref: '#/components/schemas/User'
 *         userId:
 *           type: integer
 *         startDate:
 *           type: string
 *           format: date-time
 */



/**
 * @swagger
 * /addComment:
 *   post:
 *     summary: Add a comment to a blog post
 *     tags:
 *       - Comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post:
 *                 type: integer
 *                 description: ID of the blog post to add the comment to
 *               text:
 *                 type: string
 *                 description: The comment text
 *             required:
 *               - post
 *               - text
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *     security:
 *       - bearerAuth: []
 */
commentRouter.post('/addComment', async (req: Request & {auth : UserInput}, res: Response) => {
    const a = req.body;

    console.log(a);
    
    const username = req.auth.username;

    try {
      const usr: User = await userService.getUserByUsername(username);

    
      const pen = await RouteUtils.menagePenalties(usr);
      if(pen !== undefined) {
        res.status(500).json({'penalty' : pen.description});
        return;
      }
      
    
      const blogPost: BlogPost = await BlogPostService.getPost(a.post);

      //const blogComment = new BlogComment({commentID: undefined,user: usr, text: a.text, blogPost});
      const post = await BlogPostService.addComment(usr, a.text, blogPost);
      res.status(200).json(post);
    } catch(error) {
      console.log(error);
      res.status(400).json({'error': true})
    }





    
});




/**
 * @swagger
 * /removeComment/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       401:
 *         description: Unauthorized. User does not have permission to delete the comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: boolean
 *                   description: Indicates if the user is authorized.
 *     security:
 *       - bearerAuth: []
 */
commentRouter.delete('/removeComment/:id', async (req: Request & {auth : UserInput}, res: Response) => {


    const id = req.params.id;
    //const numberId = Number(id);
  
    // auth
    try {
      const username = req.auth.username;
      const usr: User = await userService.getUserByUsername(username);
  
      const pen = await RouteUtils.menagePenalties(usr);
      if(pen !== undefined) {
        res.status(500).json({'penalty' : pen.description});
        return;
      }
  
  
      const blogComment: BlogComment = await BlogPostService.getComment(id);
      if(username !== blogComment.user.name && !usr.admin) {
        res.status(401).json({'auth': false})
      }
      else {
  
  
        const post = await BlogPostService.removeComment(id);

        res.status(200).json(post);
        
      }
    }catch(error) {console.error(error);}
  
  });









module.exports = commentRouter;
