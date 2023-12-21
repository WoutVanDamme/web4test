import BlogPostService from "@/service/BlogPostService";
import UserService from "@/service/UserService";
import { BlogComment, BlogPost, User } from "@/types/BlogTypes";
import { useEffect, useState } from "react";



const Header: React.FC = () => {
  
  const handleSubmit = () => {

    sessionStorage.setItem("token", "");
    window.location.href = "/";
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          handleSubmit();
          e.preventDefault();
        }}
      >
        <input type="submit" value="Logout" className="btn btn-primary" />
      </form>
    </>
  );
};

export default Header;
