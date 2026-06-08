import { auth } from "@/lib/auth"; // Ajuste para o caminho onde você inicializou o betterAuth() no servidor
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return auth.handler(request);
}

export async function POST(request: NextRequest) {
  if (request.nextUrl.pathname.includes("/sign-up/email")) {
    return NextResponse.json(
      { message: "O registro de novas contas está desativado no momento." },
      { status: 403 }
    );
  }

  return auth.handler(request);
}