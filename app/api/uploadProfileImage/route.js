// app/api/uploadProfileImage/route.js
import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

// Ensure the upload directory exists
const ensureUploadDirExists = () => {
  const uploadDir = path.join(process.cwd(), "public/images/user");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

ensureUploadDirExists();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "public/images/user");
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const email = req.query.email; // Ensure type string
    const ext = path.extname(file.originalname);
    cb(null, `${email}_profile${ext}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, so `multer` can handle the data
  },
};

const uploadMiddleware = upload.single("image");

export const POST = async (req, res) => {
  return new Promise((resolve) => {
    uploadMiddleware(req, res, function (err) {
      if (err) {
        resolve(
          NextResponse.json(
            { message: "File upload failed", error: err.message },
            { status: 500 }
          )
        );
      } else if (!req.file) {
        resolve(
          NextResponse.json({ message: "No file uploaded" }, { status: 400 })
        );
      } else {
        const email = req.query.email;
        const filePath = `/images/user/${email}_profile${path.extname(
          req.file.originalname
        )}`;

        resolve(
          NextResponse.json(
            { message: "File uploaded successfully", path: filePath },
            { status: 200 }
          )
        );
      }
    });
  });
};
