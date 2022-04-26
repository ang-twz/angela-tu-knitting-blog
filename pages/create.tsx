import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useSession } from 'next-auth/react';

const Draft: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUploaded, setImageUploaded] = useState();

  const handleChange = (event) => {
    setImageUploaded(event.target.files[0]);
  };

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // if (!imageUploaded) {
    //   return;
    // }

    try {
      type Image = {
        id: string;
        publicId: string;
        // ...some other fields that we're too lazy to type out right now
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
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      await Router.push('/drafts');
    } catch (error) {
      console.error(error);
    }
  }
  

    // const handleChange = (event) => {
    //   setImageUploaded(event.target.files[0]);
    // };

  //   const submitImage = async (e) => {
  //     e.preventDefault();

  //     if (!imageUploaded) {
  //       return;
  //     }

  //   try {
  //     const formData = new FormData();
  //     formData.append("image", imageUploaded);

  //     const response = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const images = await response.json();
  //     setImageId(images.id)

  //     // Router.push("/");
  //   } catch (error) {
  //     console.error(error);
  //   }
  
  // };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <input
            onChange = {handleChange}
            accept=".jpg, .png, .gif, .jpeg"
            type="file"
          />
          <input disabled={!content || !title} type="submit" value="Create" />
          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
      {/* <div className="page">
        <form onSubmit={submitImage}>
          <h1>Upload Image</h1>

          <input
            onChange={handleChange}
            accept=".jpg, .png, .gif, .jpeg"
            type="file"
          ></input>

          <input type="submit" value="Upload" />
        </form>
      </div> */}
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        input[type='text'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }
        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }
        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Draft;