import { BlogComment, BlogPost, Tag, User } from "@/types/BlogTypes";
import BlogCommentOverview from "./BlogCommentOverview";
import BlogTagOverview from "./BlogTagOverview";
import React, { useEffect } from "react";
import { useState } from "react";
import BlogPostService from "@/service/BlogPostService";
import Link from "next/link";
import UserService from "@/service/UserService";

type Props = {
  posts: Array<BlogPost>;
};

const BlogPostOverview: React.FC<Props> = ({ posts }: Props) => {
  const [text, setText] = useState("");
  const [user, setUser] = useState<User>();
  const [banDays, setBanDays] = useState<number>(1);


  

  const getUser = async() => {
    try {
      if (typeof sessionStorage !== "undefined") {
        const response = await UserService.getUser();
        if(response === undefined) {
          return;
        }
        try {
          const usr = await response.json()
          setUser(usr);
        }catch(error) {
          
        }
  
      }
    }catch(error) {}

  }

  const handleSubmit = async(id: number) => {
    await BlogPostService.addBlogComment(id, text);
  };

  const handleBan = async(userId: number) => {
    await UserService.banUser(userId, banDays);
  }



  useEffect(()=>{getUser()}, [])

  return (
    <>


      {posts &&
        posts.map((post, index) => (
          
          <div className="BlogPostBorder card mb-3" key={index}>
            <div className="card-body">
              

              
              <div className="card-text">
                <BlogTagOverview tags={post.tags as Tag[]} />
              </div>
              
              <p className="card-text mb-1">
                <b>{post.user.name}</b>
              </p>
              <h2 className="card-title">{post.title}</h2>
              <p className="card-text">
                <i>{post.date.toString()}</i>
              </p>
              <p>
              {
                post.image && post.image != 'undefined' && <img width={250} height={250} src={ 'images/'+post.image} />
              }
              </p>
              <p className="card-text">{post.text}</p>

              <div className="card-text">
                <BlogCommentOverview comments={post.comment as BlogComment[]} />

                {user && (user.name === post.user.name || user.admin) &&  (
                  <>
                    <button
                      className="btn btn-danger mr-2"
                      onClick={() => BlogPostService.removePost(post.postID)}
                    >
                      Remove
                    </button>
                    <Link className="btn btn-primary" href={`/EditPost/${post.postID}`}>
                      Edit
                    </Link>
                  </>
                )}
                {user && (user.admin) && (
                  <form onSubmit={(e) => {
                    const userId = post.user.id;
                    handleBan(userId);
                    e.preventDefault();
                  }}>
                    <label htmlFor="days">Days: </label>
                    <select id="number" name="number"
                    onChange={(e) => setBanDays(parseInt(e.target.value))}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <input type="submit" value="Ban user" className="btn btn-danger"/>
                  </form>
                )}

                <form
                  onSubmit={(e) => {
                    const id = post.postID;
                    handleSubmit(id);
                    e.preventDefault();
                  }}
                >
                  <input hidden value={post.postID} name="post" />
                  <input
                    type="text"
                    name="text"
                    placeholder="text"
                    className="form-control mb-2"
                    onChange={(e) => setText(e.target.value)}
                  />
                  <input type="submit" value="Submit" className="btn btn-primary" />
                </form>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default BlogPostOverview;
