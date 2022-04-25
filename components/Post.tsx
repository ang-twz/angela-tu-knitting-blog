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

// export const getServerSideProps = async () => {
//   const res = await fetch(`${process.env.SERVER_PATH}/api/images?id=vd1rvkiah1ckhdijmdqh`);
//   console.log("getting images")
//   console.log(res);
//   const images = await res.json();
//   return {
//     props: { images },
//   };
// };

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown children={post.content} />
            {post.image && <img
              src={`https://res.cloudinary.com/${process.env.CLOUD_NAME}/v${post.image.version}/${post.image.publicId}.${post.image.format}`}
              key={post.image.publicId}
            />}
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
