import cloudinary from "../Configuration/cloudinary.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mern_app",   // optional folder name in Cloudinary
    });

    // remove file from local storage after upload
    fs.unlinkSync(req.file.path);

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
};
