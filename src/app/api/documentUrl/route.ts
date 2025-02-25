import { NextResponse } from "next/server";
import Document from "@/models/Document";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { _id } = requestData;
    const result = await Document.find({ _id: _id }, "file_url");
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
