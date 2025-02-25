import { NextResponse } from "next/server";
import Query from "@/models/Query";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { user_id } = requestData;
    const result = await Query.deleteMany({ user_id: user_id });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
