import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
      image: {
        select: {id: true, publicId: true, format: true, version: true},
      },
    },
  });
  return {
    props: post,
  };
};

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'DELETE',
  });
  Router.push('/');
}

async function updatePost(id: string): Promise<void> {
  await fetch(`/api/update/${id}`, {
    method: 'PUT',
  });
  Router.push('/');
}


const Post: React.FC<PostProps> = (props) => {

  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);
  const [imageUploaded, setImageUploaded] = useState();
  const [editable, setEditable] = useState(false);

  const handleChange = (event) => {
    setImageUploaded(event.target.files[0]);
  };

  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  // let title = props.title;
  // if (!props.published) {
  //   title = `${title} (Draft)`;
  // }

  const updateData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
  
    try {
      type Image = {
        id: string;
      }
  
      const uploadAndReturnImage = async () => {
        const formData = new FormData();
        formData.append("image", imageUploaded);
  
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
  
        const image: Image = await response.json();
        return image;
      }
  
      const image = imageUploaded
        ? await uploadAndReturnImage()
        : undefined
      
      const body = { title, content, imageId: image?.id };
      await fetch(`/api/update/${props.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      await Router.push('/drafts');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Layout>
      <div>
        <form onSubmit = {updateData}>
        {/* <h2>{props.title} (Draft)</h2>
        <p>By {props?.author?.name || 'Unknown author'}</p>
        <ReactMarkdown children={props.content} /> */}
        <br></br>
        <br></br>
        {!props.published && userHasValidSession && postBelongsToUser && editable && (
          <>
          <input id="edit"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <br></br>
          <p>By {props?.author?.name || 'Unknown author'}</p>
          <br></br>
          {props.image && <img
              src={`https://res.cloudinary.com/${process.env.CLOUD_NAME}/v${props.image.version}/${props.image.publicId}.${props.image.format}`}
              key={props.image.publicId}
            />}
          <br></br>
          <br></br>
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <br></br>
          <br></br>
          <input
            onChange = {handleChange}
            accept=".jpg, .png, .gif, .jpeg"
            type="file"
          />
          <br></br>
          <br></br>
          <button onClick={() => setEditable(false)}>Cancel</button>
          <button type="submit" onClick={() => updatePost(props.id)}>Update</button>
          <button onClick={() => publishPost(props.id)}>Publish</button>
          {/* <input disabled={!content || !title} type="submit" value="Create" /> */}
          {/* <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a> */}
          <button onClick={() => deletePost(props.id)}>Delete</button>
          </>
        )}
        {!props.published && userHasValidSession && postBelongsToUser && !editable && (
          <>
          <h2>{props.title}</h2>
          <p>By {props?.author?.name || 'Unknown author'}</p>
          {props.image && <img
              src={`https://res.cloudinary.com/${process.env.CLOUD_NAME}/v${props.image.version}/${props.image.publicId}.${props.image.format}`}
              key={props.image.publicId}
            />}
          <ReactMarkdown children={props.content} />
          <button onClick={() => setEditable(true)}>Edit</button>
          <button onClick={() => publishPost(props.id)}>Publish</button>
          <button onClick={() => deletePost(props.id)}>Delete</button></>
        )}
        {props.published && userHasValidSession && postBelongsToUser && (
          <>
          <h2>{props.title}</h2>
          <p>By {props?.author?.name || 'Unknown author'}</p>
          {props.image && <img
              src={`https://res.cloudinary.com/${process.env.CLOUD_NAME}/v${props.image.version}/${props.image.publicId}.${props.image.format}`}
              key={props.image.publicId}
            />}
          <ReactMarkdown children={props.content} />
          <button onClick={() => deletePost(props.id)}>Delete</button></>
        )}
        {props.published && !userHasValidSession && !postBelongsToUser && (
          <>
          <h2>{props.title}</h2>
          <p>By {props?.author?.name || 'Unknown author'}</p>
          {props.image && <img
              src={`https://res.cloudinary.com/${process.env.CLOUD_NAME}/v${props.image.version}/${props.image.publicId}.${props.image.format}`}
              key={props.image.publicId}
            />}
          <ReactMarkdown children={props.content} /></>
        )}
        {props.published && userHasValidSession && !postBelongsToUser && (
          <>
          <h2>{props.title}</h2>
          <p>By {props?.author?.name || 'Unknown author'}</p>
          {props.image && <img
              src={`https://res.cloudinary.com/${process.env.CLOUD_NAME}/v${props.image.version}/${props.image.publicId}.${props.image.format}`}
              key={props.image.publicId}
            />}
          <ReactMarkdown children={props.content} /></>
        )}
      </form>
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;