import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
  image: {
    id: string;
    publicId: string;
    format: string;
    version: string;
  } | null;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      {post.image && <img
        src={`https://res.cloudinary.com/${process.env.CLOUD_NAME}/v${post.image.version}/${post.image.publicId}.${post.image.format}`}
        key={post.image.publicId}
      />}
      <br></br>
      <small>By {authorName}</small>
      {/* <ReactMarkdown children={post.content} /> */}
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
