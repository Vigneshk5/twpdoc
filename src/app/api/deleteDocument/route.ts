import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const { id } = await request.json();
    const document = await Document.findById(id);

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (document.file_key) {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: document.file_key,
      };

      try {
        await s3.send(new DeleteObjectCommand(deleteParams));
        console.log("S3 file deleted successfully:", document.file_key);
      } catch (s3Error) {
        console.error("S3 Delete Error:", s3Error);
        return NextResponse.json(
          { error: "Failed to delete file from S3" },
          { status: 500 }
        );
      }
    }

    // Delete document from MongoDB
    await Document.deleteOne({ _id: id });

    return NextResponse.json(
      { message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Operation Error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
