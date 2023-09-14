import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  const rooms = DB.rooms;
  const totalRooms = rooms.length;
  return NextResponse.json({
    ok: true,
    rooms: rooms,
    totalRooms: totalRooms,
  });
};
export const POST = async (request) => {
  const payload = checkToken();
  if (
    payload === null ||
    !(payload.role === "ADMIN" || payload.role === "SUPER_ADMIN")
  ) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  const body = await request.json();
  const addRoom = body.roomName;

  readDB();
  const existRoom = DB.rooms.find((rs) => rs.roomName === addRoom);

  if (existRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${addRoom} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  //call writeDB after modifying Database

  DB.rooms.push({ roomId: roomId, roomName: addRoom });
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${addRoom} has been created`,
  });
};
