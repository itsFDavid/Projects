// src/app/api/login/route.ts
import { API_URL } from "@src/utils/api_url";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Credenciales inválidas." }, { status: 400 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return NextResponse.json({ error: "Error en el servidor." }, { status: 500 });
  }
}
