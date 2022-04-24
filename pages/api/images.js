import prisma from "../../lib/prisma";

export default async function handle(req, res) {
  const imageId = req.query.id;
  const images = await prisma.image.findMany(
    {
      where: { id: imageId },
    }
  )
  res.json(images);
}