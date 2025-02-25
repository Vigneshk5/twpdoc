import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Document from "@/models/Document";

//for title of the chat
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { id } = await request.json();
    const documents = await Document.find({ _id: id }, { name: 1 }).sort({
      created_at: -1,
    });

    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
