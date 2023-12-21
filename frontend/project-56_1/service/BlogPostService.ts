import { Tag } from "@/types/BlogTypes";


const mapTags = (tags: string[]): Tag[] => {
  let out: Tag[] = [];
  tags.forEach(el => {
    out.push({name: el});
  })
  return out;
}




const getBlogPostById = async(postId: string) => {
  const token = sessionStorage.getItem("token");


  return await fetch(process.env.NEXT_PUBLIC_URL + "/blog/" + postId, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,

    },
  }).catch((e) => console.log(e));
};


const editBlogPost = async(postId: string, title: string, text: string, tag: string[]) => {
  const token = sessionStorage.getItem("token");

  return await fetch(process.env.NEXT_PUBLIC_URL + "/editPost/" + postId, {
    method: "PUT",
    body: JSON.stringify({
      title,
      text,
      tag,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,

    },
  }).catch((e) => console.log(e));
}


const getAllBlogPosts = async() => {
  const token = sessionStorage.getItem("token");

    return await fetch(process.env.NEXT_PUBLIC_URL + "/blog", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,

      },
    }).catch((e) => console.log(e));
}


const getPostWithTag = async(tag: string) => {
  const token = sessionStorage.getItem("token");

  return await fetch(process.env.NEXT_PUBLIC_URL + "/blog/tag/"+tag, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,

    },
  }).catch((e) => console.log(e));
}

const addBlogPost = async (title: String, text: String, tags: string[]) => {
  const token = sessionStorage.getItem("token");
  const mappedTags =  mapTags(tags);
  try {
    const post =  await fetch(process.env.NEXT_PUBLIC_URL + "/addPost", {
      method: "POST",
      body: JSON.stringify({
        title,
        text,
       mappedTags
      }),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return post;

  } catch(error) {
    return undefined;
  }
  
}


const addFile = async(id: number, file: File) => {

  const token = sessionStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "POST",
    headers: headers,
    body: formData,
  };

  return await fetch(`${process.env.NEXT_PUBLIC_URL}/uploadImage/${id}`, requestOptions);
};




const addBlogComment = async(post: number, text: String) => {
  const token = sessionStorage.getItem("token");
    return await fetch(process.env.NEXT_PUBLIC_URL + "/addComment", {
        method: "POST",
        body: JSON.stringify({
          post,
          text,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,

        },
      }).catch((e) => console.log(e));
}

const removePost = async(id: number) => {
  const token = sessionStorage.getItem("token");
    return await fetch(process.env.NEXT_PUBLIC_URL + "/removePost/" + id, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch((e) => console.log(e));
}


const removeComment = async(id: number) => {
  const token = sessionStorage.getItem("token");
  return await fetch(process.env.NEXT_PUBLIC_URL + "/removeComment/" + id, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch((e) => console.log(e));
}




const BlogPostService ={
    getAllBlogPosts,
    addBlogPost,
    
    addBlogComment,
    removePost,
    getBlogPostById,
    editBlogPost,
    getPostWithTag,
    removeComment,
    addFile
}


export default BlogPostService;