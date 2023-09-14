import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Thanawat Jaisert",
    studentId: "650610768",
  });
};
