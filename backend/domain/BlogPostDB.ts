const { PrismaClient } = require('@prisma/client')
import {BlogPost} from "../domain/model/BlogPost";
import {User} from "../domain/model/User";
import {Tag} from "../domain/model/Tag";
import {BlogComment} from "../domain/model/BlogComment";
import {mapToPost, mapToPosts} from "../domain/blogPost.mapper";
import {  mapToTags } from "./tag.mapper";
import { mapToUser } from "./user.mapper";
import { mapToPenalties, mapToPenalty } from "./penalty.mapper";
import { Penalty } from "./model/Penalty";
import {DateTime} from 'luxon';
import { mapToComment } from "./comment.mapper";
const database = new PrismaClient()


const getAllPosts = async (): Promise<BlogPost[]> => {
  const posts = await database.BlogPost.findMany({
    include: {
      tags: true,
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  
  return mapToPosts(posts);
};
  
  
const getPostWithTag = async(tag: string) => {
  
  const posts = await database.BlogPost.findMany({
    where: {
      tags: {
        some: {
          name: tag,
        }
        
      }

    },
    include: {
      tags: true,
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  
  return mapToPosts(posts);
}

const getPost = async(id: number): Promise<BlogPost> => {

    const post = await database.BlogPost.findUnique({
        where: {postID: id},
        include: {
          tags: true,
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    return mapToPost(post);
} 

const getComment = async(id: number) => {
  
  const post = await database.BlogComment.findUnique({
    where: {commentID: id},
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
      
  });
  return mapToComment(post);
}

const addPost = async (blogPost: BlogPost) => {



  const post = await database.BlogPost.create({
    data: { 
      image: blogPost.image,
      text: blogPost.text,
      title: blogPost.title,
      date: blogPost.date,
      userId: blogPost.user.id,
      //tags: blogPost.tags,
      tags: {
        connectOrCreate: blogPost.tags.map(tag => ({
          where: { name: tag.name },
          create: { name: tag.name }
        }))
      }
    }
  });

  return mapToPost(post);
};

const addPenalty =async (penalty: {days: number, user: User}) => {
  const currentDate = DateTime.local();
  const rpenalty = await database.Penalty.create({
    data: {
      days: penalty.days,
      userId: penalty.user.id,
      description: "You've been banned",
      startDate: currentDate.toISO(),
    }
  });
  return mapToPenalty(rpenalty);
};

const setPostImage = async (id: number, image: string) => {
  const updatedPost = await database.BlogPost.update({
    where: { postID: id },
    data: { image: image }
  });

  return mapToPost(updatedPost);
};


const removePost = async (id: number) => {
    const comment = await database.BlogComment.deleteMany( {
        where : {
            postID: id,
        },
    })

    const post = await database.BlogPost.delete( {
        where : {
            postID: id,
        },
    })
}

const removeComment = async (id: number) => {

  const comment = await database.BlogComment.delete( {
    where : {
        commentID: id,
    },
})

}

const editPost = async (id: number, blogPost: {image: string, text: string, title: string, tags: string[]}) => {

    
    const post = await database.BlogPost.update( {
        where : {
            postID: id,
            
        },
        data: {
            text: blogPost.text,
            title: blogPost.title,
            tags: {
              connectOrCreate: blogPost.tags.map(tag => ({
                where: { name: tag },
                create: { name: tag }
              }))
            }
        }
    })
    return mapToPost(post);
}

const editUser = async (id: number, user: {name: string, email: string, password: string, blogPosts: BlogPost[], blogComments: BlogComment[], penalties: Penalty[], admin: boolean}) => {

  const post = await database.User.update( {
      where : {
          id: id,
          
      },
      data: {
          name: user.name,
          email: user.email,
          password: user.password,
          BlogPost: {
            connectOrCreate: user.blogPosts.map(post => ({
              where: {postID: post},
              create: {postID: post}
            }))
          },
          BlogComment: {
            connectOrCreate: user.blogComments.map(comment => ({
              where: {commentID: comment},
              create: {commentID: comment}
            }))
          },
          Penalty: {
            connectOrCreate: user.penalties.map(penalty => ({
              where: {id: penalty},
              create: {id: penalty}
            }))
          },
          admin: user.admin,
      }
  })
  return mapToPost(post);
}

const addComment = async (user: User, text: string, blogPost: BlogPost) => {
    const post = await database.BlogComment.create( {
        data: {
            text: text,
            userId: user.id,
            postID: blogPost.postID
        }
    })
}


const createUser = async({
    username,
    password,
}: {
    username: string;
    password: string;
}) : Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                username,
                password,
            },
        });
        return mapToUser(userPrisma);
    } catch(error) {
        console.error(error);
        throw new Error('Database error');
    }
}

const addUser = async(user: User) : Promise<User> => {
        const userPrisma = await database.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                admin: user.admin,
            },
        });
        return mapToUser(userPrisma);

}

const getUserByUsername = async (username: string) => {


  const user = await database.User.findUnique({
    where: {
      name: username,
    },
    include: {
      BlogPost: true,
      BlogComment: true,
      Penalty: true,
    },
  });
  
  return mapToUser(user);
};

const getUserById = async (userId: number) => {


  const user = await database.User.findUnique({
    where: {
      id: userId,
    },
    include: {
      BlogPost: true,
      BlogComment: true,
      Penalty: true,
    },
  });
  

  return mapToUser(user);
};


const getPenalties = async(id: number) => {
  try {
    const penalty = await database.Penalty.findMany({
      where: {
        userId: id,
      },
      include: {
        user: {
          select: {
            id: true,
          }
        }
      },
    });

    return mapToPenalties(penalty); 
  }catch(error) {}

  
  return undefined;
}


const removePenalty = async(id: number) => {
  const penalties = await database.Penalty.delete({
    where: {
      id: id,
    },
  });
  
  return mapToPenalties(penalties);
}

// const mapToUser = (userPrisma) => {
//     const user: User = new User({
//         id: userPrisma.id,
//         name: userPrisma.name,
//         email: userPrisma.email,
//         password: userPrisma.password,
//         admin: userPrisma.admin,

//       });
      
//     return user;
// }

// GEBRUIK blogPost.mapper.ts's mapToPosts
// const mapPosts = (posts) => {
//     // make domain model object
//     let out: BlogPost[] = [];
//     posts.forEach(el => {
//         //{postID: number, user: User, image:ImageBitmap, text: string, title: string, tag: Tag[], date: Date, comment: BlogComment[]}
//         //out.push(new BlogPost(el.postID, mapUser(el.user), mapImage(el.image), el.text, el.title, mapTags(el.tags),el.date, mapComments(el.comments)))
//         out.push(new BlogPost({postID: el.postID, user: mapUser(el.user), image: mapImage(el.image), text: el.text, title: el.title, tag: mapTags(el.tags), date: el.date, comment: mapComments(el.comments)}))
//     });
//     return out;
// }

// GEBRUIK blogPost.mapper.ts's mapToPost
// const mapPost = (post) => {
//     return new BlogPost({postID: post.postID, user: mapUser(post.user), image: mapImage(post.image), text: post.text, title: post.title, tags: mapTags(post.tags), date: post.date, comment: mapComments(post.comments)});
// }








export default {
    getAllPosts,
    addPost,
    addPenalty,
    removePost,
    editPost,
    addComment,
    getPost,
    createUser,
    addUser,
    getUserByUsername,
    getUserById,
    getPostWithTag,
    removeComment,
    getComment,
    setPostImage,
    getPenalties,
    removePenalty,
    editUser,
}

/*

class BlogPostDB {

    posts: BlogPost[];
    users: User[];

    constructor() {
        this.posts.push(new BlogPost(0,0,new ImageBitmap(),"test", "oega", [Tag.Meme], new Date("2019-01-16"), [new BlogComment(0,0,"test")]));
    
    }

    getBlogposts() {
        return this.posts;
    }

    getAllPosts() {
        
    }

    getUser(id: number) {
        this.users.forEach(user => {
            if(user.id == id) return user;
        });
        return undefined;
    }
}
*/