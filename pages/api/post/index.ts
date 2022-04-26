import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, content, imageId } = req.body;

  console.log("this is req.body " + JSON.stringify(req.body))

  const promiseOfASession = getSession({ req })
  const session = await getSession({ req });

  const result = await prisma.post.create({
    // @ts-ignore
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
      image: { connect: {id: imageId}}
    },
    include: {
      image: true,
    }
  });
  
  console.log(JSON.stringify(result));
  res.json(result);
}