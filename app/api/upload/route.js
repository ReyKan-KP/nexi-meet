import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';

// Disable the default body parser
export const runtime = 'edge';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const filename = `${Date.now()}-${file.name}`;
  
  // Define the path where the file will be saved
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, filename);

  try {
    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write the file to the server
    await fs.writeFile(filePath, buffer);

    // Generate the URL for the uploaded file
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}
