import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pedidosUrl = process.env.PEDIDOS_API_URL;
  const apiKey = process.env.PEDIDOS_API_KEY;

  if (!pedidosUrl || !apiKey) {
    return NextResponse.json(
      { error: "Configuración de pedidos no disponible" },
      { status: 500 },
    );
  }

  const targetUrl = `${pedidosUrl}/api/orders/${path.join("/")}`;

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
