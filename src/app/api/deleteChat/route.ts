import { NextResponse } from "next/server";
import Query from "@/models/Query";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { _id } = requestData;

    const result = await Query.deleteOne({ _id: _id });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
