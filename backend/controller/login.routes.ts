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

const loginRouter = express.Router();



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
 * /login:
 *   post:
 *     summary: User login
 *     description: User login
 *     tags:
 *      - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Authentication successful'
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'unauth'
 *                 errorMessage:
 *                   type: string
 */
loginRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const userInput: UserInput = req.body.user;
        const token = await userService.authenticate(userInput);
        res.status(200).json({message: 'auth successful', token});
    }catch(error) {
        res.status(401).json({status: 'unauth', errorMessage: error.message});
    }
    // const userInput: UserInput = req.body.user;
    // console.log(req.body);
    // console.log(userInput);
    // const token = await userService.authenticate(userInput);
    // res.status(200).json({message: 'auth successful'});
});




/**
 * @swagger
 * /register:
 *   post:
 *     summary: User registration
 *     description: User registration
 *     tags:
 *      - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               admin:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
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
 *         description: Error registering user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
loginRouter.post('/register', async (req: Request, res: Response) => {


  try {
    const { username, email, password, admin } = req.body; 

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({id: null, name: username, email, password: hashedPassword , admin: admin, blogPosts: [], comments: [], penalties: []});
    await userService.addUser(user);
    return res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error registering user' });
  }
});


module.exports = loginRouter;
