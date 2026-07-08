import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const cenitUrl = process.env.CENIT_API_URL;

  if (!cenitUrl) {
    return NextResponse.json(
      { error: "Configuración de Cenit no disponible" },
      { status: 500 },
    );
  }

  const queryString = request.nextUrl.searchParams.toString();
  const targetUrl = `${cenitUrl}/${path.join("/")}${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(targetUrl);

  if (!res.ok) {
    return NextResponse.json(
      { error: `Error ${res.status}` },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
