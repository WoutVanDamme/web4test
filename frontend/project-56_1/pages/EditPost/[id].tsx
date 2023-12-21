import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BlogPostService from "@/service/BlogPostService";
import { BlogPost } from "@/types/BlogTypes";

const EditPostPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<BlogPost>();
  const [error, setError] = useState<string>();
  const [text, setText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const getPost = async () => {
    setError("");

    try {
      const oega = await BlogPostService.getBlogPostById(id as string);
      const response = oega as Response;

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized Error");
        } else {
          setError(response.statusText);
        }
      } else {
        const postjson = await response.json();
        setPost(postjson);
        setTitle(postjson.title);
        setText(postjson.text);
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  const editPost = async () => {
    if (post) {
      const response = await BlogPostService.editBlogPost(
        id as string,
        title,
        text,
        selectedTags
      );
      if (response instanceof Response && response.status !== 500) {
        router.push("/Blog/");
      } else {
        setError("Failed to edit post");
      }
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value;
    if (e.target.checked) {
      setSelectedTags((prevSelectedTags) => [...prevSelectedTags, tag]);
    } else {
      setSelectedTags((prevSelectedTags) =>
        prevSelectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const commonTags = ["Meme", "Pet", "Scenery", "Other"];
  return (
    <>
      {post && (
        <div className="container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editPost();
            }}
            className="mt-4"
          >
            <div className="mb-3">
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="text"
                className="form-control"
                placeholder="Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Add Tags:</label>
              {commonTags.map((tag) => (
                <div key={tag} className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    id={tag}
                    value={tag}
                    checked={selectedTags.includes(tag)}
                    className="form-check-input"
                    onChange={handleTagChange}
                  />
                  <label htmlFor={tag} className="form-check-label">
                    {tag}
                  </label>
                </div>
              ))}
            </div>
            {error && <div className="text-danger">{error}</div>}
            <button type="submit" className="btn btn-primary">
              Edit Post
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditPostPage;
