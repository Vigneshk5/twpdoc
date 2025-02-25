import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Document from "@/models/Document";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  await dbConnect();
  const formData = await request.formData();
  const rawName = formData.get("name") as string;
  const user_id = formData.get("user_id") as string;
  const content = formData.get("content") as string;
  const file = formData.get("file") as File;
  const name = rawName.replace(/\s+/g, "-");
  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload file to S3
  const fileKey = `uploads/${Date.now()}-${name}`;
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileKey,
    Body: buffer,
    ContentType: file.type,
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    // Save document with file URL
    const newDocument = new Document({
      content,
      name,
      user_id,
      file_url: fileUrl,
      file_key: fileKey,
    });

    await newDocument.save();

    return NextResponse.json(
      { message: "Document uploaded successfully", fileUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
