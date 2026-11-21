import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import { IncomingForm, Files, Fields } from "formidable";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Promise wrapper for formidable
const parseForm = async (req: NextApiRequest): Promise<[Fields, Files]> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve([fields, files]);
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Parse the form data
    const [, files] = await parseForm(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: "uploads", // Optional: organize uploads in a folder
      resource_type: "auto",
    });

    // Clean up the temporary file
    fs.unlinkSync(file.filepath);

    // Return the Cloudinary URL and public_id
    return res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Failed to upload file" });
  }
}
