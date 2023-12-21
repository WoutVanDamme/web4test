import {UserInput} from "../types/BlogTypes";
import BlogPostDB from "../domain/BlogPostDB";
import { User } from "../domain/model/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Penalty } from "../domain/model/Penalty";

//var jwt = require('jsonwebtoken');
//var expressjwt = require("express-jwt");


const authenticate = async (userInput: UserInput) => {
    const user: User = await BlogPostDB.getUserByUsername(userInput.username);
    const isValidPassword = await bcrypt.compare(userInput.password, user.password);
    
    if(!isValidPassword) {
        throw new Error('incorrect password');
    }

    return generateJwtToken(userInput.username);
}

const jwtSecret = process.env.JWT_SECRET;

const generateJwtToken = (username: string): string => {
    const options = {expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'whatt'};

    try{
        return jwt.sign({username}, jwtSecret, options);
    } catch (error){
        console.log(error);
        throw new Error('Error generating JWT token, see server log for details.')
    }
}

const addUser = async (user: User) => {
    if (user.name === '' || user.password === '' || user.email === '') throw Error('Validation error');
    await BlogPostDB.addUser(user);
}

const getUserByUsername = async (username: string) => {
    return BlogPostDB.getUserByUsername(username);
}

const getUserById = async (userId: string) => {
    const numId = Number(userId);
    if(isNaN(numId)) return undefined;
    return BlogPostDB.getUserById(numId);
}

const banUser = async (id: string, prism: {days: number, user: User}) => {


    const numId = Number(id);
    if (isNaN(numId) || !prism.days) throw Error('Validation failed');

    const penalty =  await BlogPostDB.addPenalty({days: prism.days, user: prism.user});

    
    return penalty;
}



const userService = {
    authenticate,
    addUser,
    getUserByUsername,
    getUserById,
    banUser,
};


export default userService;