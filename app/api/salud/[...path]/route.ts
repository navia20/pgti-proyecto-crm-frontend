import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const saludUrl = process.env.NEXT_PUBLIC_SALUD_API_URL;
  const apiKey = process.env.SALUD_API_KEY;

  if (!saludUrl || !apiKey) {
    return NextResponse.json(
      { error: "Configuración de salud no disponible" },
      { status: 500 },
    );
  }

  const targetUrl = `${saludUrl}/incidentes-salud/externo/${path.join("/")}`;

  const res = await fetch(targetUrl, {
    headers: { "x-api-key": apiKey },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Error ${res.status}` },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
