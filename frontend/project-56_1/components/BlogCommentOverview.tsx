import BlogPostService from "@/service/BlogPostService";
import UserService from "@/service/UserService";
import { BlogComment, BlogPost, User } from "@/types/BlogTypes";
import { useEffect, useState } from "react";

type Props = {
  comments: Array<BlogComment>;
};

const BlogCommentOverview: React.FC<Props> = ({ comments }: Props) => {
  const handleSubmit = async (id: number) => {
    const result = await BlogPostService.removeComment(id);
  };


  const [user, setUser] = useState<User>();

  
  const username = sessionStorage.getItem("username");

  const getUser = async() => {
    if (typeof sessionStorage !== "undefined") {
      const response = await UserService.getUser();
      if (response === undefined) {
        return;
      }
      try {
        const usr = await response.json()
        setUser(usr);
      }catch(error) {
        
      }

    }
  }

  
  useEffect(()=>{getUser()}, [])


  return (
    <>
      <div className="CommentBorder card mb-3">
        {comments && (
          <div className="card-body">
            {comments.map((comment, index) => (
              <div className="row align-items-center" key={index}>
                <div className="col">
                  <p className="card-text comment-text">
                    <b>{comment.user.name}: </b>
                    <i>{comment.text}</i>
                  </p>
                </div>
                {
                  comment && (comment.user.name == username || (user && user.admin)) &&

                  <div className="col-auto">
                  <form
                    onSubmit={(e) => {
                      handleSubmit(comment.commentID);
                      e.preventDefault();
                    }}
                  >
                    <input
                      type="submit"
                      value="X"
                      className="btn btn-danger"
                    />
                  </form>
                  </div>
                }

              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogCommentOverview;
