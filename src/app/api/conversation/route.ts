import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";
import dbConnect from "@/lib/db";
import Document from "@/models/Document";
import Query from "@/models/Query";
import { docSelectionPrompt, chatResponsePrompt, greetingPatterns } from "./config";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { query, user_id } = await request.json();

    // Check if the query is a greeting
    if (greetingPatterns.test(query.trim())) {
      const greetingResponse = "Hello! How can I assist you today?";
      await Query.insertMany({
        document_id: "GREETING",
        query: query,
        answer: greetingResponse,
        user_id: user_id,
        file_url: "NO",
      });
      return NextResponse.json({ docId: "GREETING" }, { status: 200 });
    }

    const mistral = new Mistral({
      apiKey: process.env["MISTRAL_API_KEY"],
    });

    const delay = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    let po: string;

    const PreviousConversations = async (user_id: any) => {
      const lastQ = await Query.find({ user_id: user_id }).sort({
        created_at: 1,
      });

      if (lastQ[0]) {
        let last = lastQ.length - 1;
        po = `{
          time:${lastQ[last].created_at},
          {
          "role": "user",
          "content":${lastQ[last].query},
            },{
            "role": "assistant",
            "content":${lastQ[last].answer}},
            }/n`;
      }
      if (!lastQ || lastQ.length === 0) return "";
      return lastQ
        .map(
          (q, index) =>
            `{
              time:${q.created_at},
              {
              "role": "user",
              "content":${q.query},
                },{
                "role": "assistant",
                "content":${q.answer}},
                }/n`
        )
        .join(",");
    };

    let docId: string;
    let pq = (await PreviousConversations(user_id)) || "";
    const documentNames = await Document.find({}, "name _id");
    const documents = documentNames.map((doc) => doc.name).join(",");

    const userSelectionMessage: Message = {
      role: "user",
      content: `Documents: ${documents}
      Question: "${query}"
      Previous context: ${po}`,
    };

    const selectionMessages: Message[] = [docSelectionPrompt, userSelectionMessage];

    const documentSelection = await mistral.chat.complete({
      model: "mistral-medium",
      messages: selectionMessages,
      temperature: 0,
    });

    const docAnswer = documentSelection.choices[0].message.content;
    // console.log(docAnswer);
    if (documentNames) {
      for (let doc of documentNames) {
        let name = doc.name.replace(/\s*-\s*/g, "-").trim();
        name = name
          .replace(/[\/\\^$*+?.()|[\]{}]/g, "\\$&")
          .replace(/-/g, "\\s*-\\s*")
          .toUpperCase();

        const regex = new RegExp(`^${name}$`);
        const cleanedAnswer = `${docAnswer}`?.trim().toUpperCase();
        if (regex.test(cleanedAnswer)) {
          docId = doc._id;
          break;
        }
      }
    }

    if (!docId) {
      const res = await Query.insertMany({
        document_id: "NO",
        query: query,
        answer:
          "I'm sorry, I'm not finding any documents directly related to that question.",
        user_id: user_id,
        file_url: "NO",
      });
      return NextResponse.json({ docId: docId }, { status: 200 });
    }
    const doc = await Document.find({ _id: docId }, { content: 1 }).sort({
      created_at: -1,
    });

    const chatResponseMessage: Message = {
      role: "user",
      content: `Documents: ${documents}
      Question: "${query}"
      Previous context: ${po}`,
    };

    const chatMessages: Message[] = [chatResponsePrompt, chatResponseMessage];

    // mistral ai rate limit
    await delay(2000);

    const chatResponse = await mistral.chat.complete({
      model: "mistral-medium",
      messages: chatMessages,
      temperature: 0.3,
    });

    let answer = chatResponse.choices[0].message.content;

    const res = await Query.insertMany({
      document_id: docId,
      query: query,
      answer: answer,
      user_id: user_id,
      file_url: doc[0].file_url,
    });

    return NextResponse.json({ docId: docId }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ({<>(){})})
