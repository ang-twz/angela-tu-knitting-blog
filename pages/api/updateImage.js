import { getImage } from "../../lib/formidable";
import { uploadImage } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(req, res) {
  const imageUploaded = await getImage(req);

  const imageData = await uploadImage(imageUploaded.path);

  const result = await prisma.image.update({
    data: {
      publicId: imageData.public_id,
      format: imageData.format,
      version: imageData.version.toString(),
    },
  });
  console.log("this is the result " + result.id);
  res.json(result);
}