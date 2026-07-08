import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const ucnpayUrl = process.env.UCNPAY_API_URL || "https://proyectogestionti.onrender.com/api/ucnpay";

  const queryString = request.nextUrl.searchParams.toString();
  const targetUrl = `${ucnpayUrl}/${path.join("/")}${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(targetUrl, {
    headers: {
      "x-private-key": process.env.UCNPAY_PRIVATE_KEY,
    },
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
