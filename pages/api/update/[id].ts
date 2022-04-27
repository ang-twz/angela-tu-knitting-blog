
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// PUT /api/publish/:id
export default async function handle(req, res) {
  const { title, content, imageId } = req.body;

  console.log("this is req.body " + JSON.stringify(req.body))

  const session = await getSession({ req });

  const postId = req.query.id;
  const post = await prisma.post.update({
    where: { id: postId },
    // @ts-ignore
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
      imageId
    },
    // include: {
    //   image: true,
    // }
  });
  res.json(post);
}