import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Query from "@/models/Query";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { user_id, date, limit = 10 } = await request.json();

    let queryFilter: any = { user_id };

    if (date) {
      queryFilter.created_at = { $lt: new Date(date) };
    }
    const queries = await Query.find(queryFilter).sort({ created_at: -1 }).limit(limit);

    return NextResponse.json(queries.reverse());
  } catch (error) {
    console.error("Error fetching queries:", error);
    return NextResponse.json({ error: "Failed to fetch queries" }, { status: 500 });
  }
}
