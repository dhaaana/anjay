import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/link${req.nextUrl.pathname}`);
  const data = await res.json();
  if (data.destination === 'back home') {
    return NextResponse.redirect(req.nextUrl.origin);
  }
  return NextResponse.redirect(data.destination);
}
export const config = {
  matcher: '/:path',
};
