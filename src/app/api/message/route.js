import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  readDB();
  const messages = DB.messages.filter((mes) => mes.roomId === roomId);

  if (!messages) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      messages,
    },
    { status: 200 }
  );
};

export const POST = async (request) => {
  const body = await request.json();
  const roomId = body.roomId;
  const messageText = body.messageText;

  readDB();
  const foundRoom = DB.rooms.find((rs) => rs.roomId === roomId);

  if (!foundRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();

  DB.messages.push({
    roomId: roomId,
    messageId: messageId,
    messageText: messageText,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const body = await request.json();
  const messageId = body.messageId;
  const payload = checkToken();
  const role = payload.role;

  if (payload === null || role !== "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();
  const messageIndex = DB.messages.findIndex(
    (mes) => mes.messageId === messageId
  );

  if (messageIndex === -1) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  DB.messages.splice(messageIndex, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
