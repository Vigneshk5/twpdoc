import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Document from "@/models/Document";

//for ai to select
export async function GET() {
  try {
    await dbConnect();
    const documents = await Document.find(
      {},
      { name: 1, file_url: 1, created_at: 1, _id: 1 }
    ).sort({
      created_at: -1,
    });
    console.log(documents);
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
