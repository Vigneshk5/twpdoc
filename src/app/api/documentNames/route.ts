import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Document from "@/models/Document";

export async function GET() {
  try {
    // Ensure fresh database connection
    await dbConnect();

    const documents = await Document.find(
      {},
      { name: 1, file_url: 1, created_at: 1, _id: 1 }
    ).sort({
      created_at: -1,
    });

    // Add cache control headers to prevent caching
    const response = NextResponse.json(documents);
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
