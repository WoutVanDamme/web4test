import express, {NextFunction, Request, Response, Router} from 'express'
import { BlogPost } from '../domain/model/BlogPost';
import BlogPostService from '../service/BlogPostService';

import {User} from "../domain/model/User"
import { UserPrisma } from "../types/prismatypes";
import { BlogComment } from '../domain/model/BlogComment';

import {UserInput} from "../types/BlogTypes";
import userService from "../service/UserService";

import bcrypt from 'bcrypt';
import { InputType } from 'zlib';
import { Tag } from '../domain/model/Tag';
import { Penalty } from '../domain/model/Penalty';
import { RouteUtils } from './routeUtils';





const postRouter = express.Router();

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
 * /blog:
 *   get:
 *     summary: Retrieve all blog posts
 *     description: Retrieve all blog posts
 *     tags:
 *      - Blog
 *     responses:
 *       200:
 *         description: Successful retrieval of blog posts
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BlogPost'
 *       500:
 *         description: Penalty applied to the user
 *         schema:
 *           type: object
 *           properties:
 *             penalty:
 *               type: boolean
 *     security:
 *       - bearerAuth: []
 */
postRouter.get('/blog', async (req: Request & { auth: UserInput}, res: Response) => {

    try {
      const username = req.auth.username;
      const usr: User = await userService.getUserByUsername(username);
      const pen = await RouteUtils.menagePenalties(usr);
      if(pen !== undefined) {
        res.status(500).json({'penalty' : pen.description});
        return;
      }
      const a = await BlogPostService.getAllPosts();
      
      res.status(200).json(a);
    }catch(error) {
      console.log(error);
    }


  
});

/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Retrieve a blog post by ID
 *     description: Retrieve a blog post by ID
 *     tags:
 *      - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the blog post to retrieve
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Successful retrieval of the blog post
 *         schema:
 *           $ref: '#/components/schemas/BlogPost'
 *     security:
 *       - bearerAuth: []
 */
postRouter.get('/blog/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const a = await BlogPostService.getPost(id);
    res.status(200).json(a);
  }catch(error) {
    console.log(error);
    res.sendStatus(401);
  }


});




/**
 * @swagger
 * /addPost:
 *   post:
 *     summary: Add a blog post
 *     description: Add a blog post
 *     tags:
 *      - Post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *               text:
 *                 type: string
 *               title:
 *                 type: string
 *             required:
 *               - image
 *               - text
 *               - title
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 out:
 *                   $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Please provide all required fields'
 *       500:
 *         description: Error creating blog post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
postRouter.post('/addPost', async (req: Request & { auth: UserInput}, res: Response) => {

  const data = req.body;
  const username = req.auth.username;

  const usr: User = await userService.getUserByUsername(username);

  const pen = await RouteUtils.menagePenalties(usr);
  if(pen !== undefined) {
    res.status(500).json({'penalty' : pen.description});
    return;
  }

  
  try {

    const post = await new BlogPost({postID: undefined, user: usr, image: String(data.image), text: String(data.text), title: String(data.title), tags: data.mappedTags, date: undefined, comment: []});
    const out = await BlogPostService.addPost(post);
    res.status(201).json({out});
    //res.status(200).json(post);
  }catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating post' });
  }
    
});

/**
 * @swagger
 * /editPost/{id}:
 *   put:
 *     summary: Edit a blog post
 *     description: Edit a blog post
 *     tags:
 *      - Post
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the blog post to edit
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         description: Updated blog post details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - image
 *             - text
 *             - title
 *           properties:
 *             image:
 *               type: string
 *             text:
 *               type: string
 *             title:
 *               type: string
 *     responses:
 *       200:
 *         description: Blog post successfully edited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     security:
 *       - bearerAuth: []
 */
postRouter.put('/editPost/:id', async (req: Request & { auth: UserInput}, res: Response) => {
    const { id } = req.params;


      const data = req.body;

      // auth
      try {
        const username = req.auth.username;
        const usr: User = await userService.getUserByUsername(username);

        const pen = await RouteUtils.menagePenalties(usr);
        if(pen !== undefined) {
          res.status(500).json({'penalty' : pen.description});
          return;
        }


        const blogpost: BlogPost = await BlogPostService.getPost(id);
        if(username !== blogpost.user.name && !usr.admin) {
          res.status(401).json({'auth': false})
        }
        else {
      
          const prism = { image: String(data.image), text: String(data.text), title: String(data.title), tags: data.tag};
          const post = await BlogPostService.editPost(id,prism);
          res.status(200).json(post);
          
        }
      }catch(error) {
        console.error(error);
        res.sendStatus(500);
        
      }


    

    //res.status(200).json(post);
});

/**
 * @swagger
 * /ban/{userId}:
 *   post:
 *     summary: Ban a user
 *     description: Ban a user
 *     tags:
 *      - User
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: ID of the user to ban
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         description: Reason for banning
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             days:
 *               type: number
 *     responses:
 *       200:
 *         description: Successful ban operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 days:
 *                   type: number
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     security:
 *       - bearerAuth: []
 */
postRouter.post('/ban/:userId', async (req: Request & {auth: UserInput}, res: Response) => {
  const {userId} = req.params;


    const data = req.body;

    //auth
    try {
      const username = req.auth.username;
      const usr: User = await userService.getUserByUsername(username);
      const bannedusr: User = await userService.getUserById(userId);
      if (!usr.admin){
        res.status(401).json({'auth': false})
      }
      else {

        const prism = {days: Number(data.days), user: bannedusr};

        const banneduser = await userService.banUser(userId, prism);


        res.status(200).json(banneduser);
      }
    } catch(error) {
      console.error(error);
      res.sendStatus(500);
    }
  
})

/**
 * @swagger
 * /removePost/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post to delete
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       401:
 *         description: Unauthorized. User does not have permission to delete the blog post.
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
postRouter.delete('/removePost/:id', async (req: Request & {auth : UserInput}, res: Response) => {
    console.log(req.params.id);
    const id = req.params.id;


    // auth
    try {
      const username = req.auth.username;
      const usr: User = await userService.getUserByUsername(username);
      const pen = await RouteUtils.menagePenalties(usr);
      if(pen !== undefined) {
        res.status(500).json({'penalty' : pen.description});
        return;
      }


      const blogpost: BlogPost = await BlogPostService.getPost(id);
      if(username !== blogpost.user.name && !usr.admin) {
        res.status(401).json({'auth': false})
      }
      else {
          const post = await BlogPostService.removePost(id);
          res.status(200).json(post);
        
      }
    }catch(error) {console.error(error);}



});




/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user information
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. User does not have permission to access the user information.
 */
postRouter.get('/user', async (req: Request  & {auth : UserInput}, res: Response) => {
  const username = req.auth.username;
  try {
    const usr: User = await userService.getUserByUsername(username);
    res.status(200).json(usr);
  }catch(error) {res.status(401);}
  
  
});

postRouter.get('/', async (req: Request & { auth: UserInput}, res: Response) => {
    const loggedInUser = req.auth.username;
    console.log('Logged in user: ', loggedInUser);

    res.status(200);
})

/**
 * @swagger
 * /blog/tag/{tag}:
 *   get:
 *     summary: Get blog posts by tag
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag to filter the blog posts by
 *     responses:
 *       200:
 *         description: Blog posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlogPost'
 *     security:
 *       - bearerAuth: []
 */
postRouter.get('/blog/tag/:tag', async (req: Request & { auth: UserInput}, res: Response) => {

  try {
    const tag = req.params.tag;

    const a = await BlogPostService.getPostWithTag(tag);
    
  
    res.status(200).json(a);
  }catch(error) {
    console.log(error);
    res.status(500).json({'success': false});

  }
  

})



const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: '../frontend/project-56_1/public/images/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    req.savedFileName = uniqueSuffix + extension;
    cb(null, uniqueSuffix + extension);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.png', '.gif'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

/**
 * @swagger
 * /uploadImage/{id}:
 *   post:
 *     summary: Upload an image for a blog post
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post to upload the image for
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the upload was successful.
 *       401:
 *         description: Unauthorized. User does not have permission to upload the image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: boolean
 *                   description: Indicates if the user is authorized.
 *       500:
 *         description: Server error. Failed to upload the image.
 *     security:
 *       - bearerAuth: []
 */
postRouter.post('/uploadImage/:id', upload.single('file'), async (req: Request & { auth: UserInput}, res: Response) => {
  const r = req as any;
  if (!r.file) {
    console.log('No file');
    res.sendStatus(500);
    return;
  } else {

    //console.log('Saved file name:', r.savedFileName);
    const { id } = req.params;
  
      // auth
      try {
        const username = req.auth.username;
        const usr: User = await userService.getUserByUsername(username);
        const blogpost: BlogPost = await BlogPostService.getPost(id);
        if(username !== blogpost.user.name && !usr.admin) {
          res.status(401).json({'auth': false})
        }else {
          if(r.savedFileName) {
            const resp = await BlogPostService.setPostImage(id, r.savedFileName);
          }
        }
        res.status(200).json({'success': true});
        
      }catch(error) {
        console.error(error);
        res.status(500).json({'success': false});
      }
  
     
  }

});




module.exports = postRouter;