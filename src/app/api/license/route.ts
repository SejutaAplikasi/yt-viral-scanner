// src/app/api/license/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const validCodes = process.env.VALID_LICENSE_CODES?.split(',').map(c => c.trim()) || [];

    if (validCodes.includes(code)) {
      const cookieStore = await cookies();
      cookieStore.set('premium_access', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // Berlaku 30 hari
        path: '/',
        sameSite: 'lax',
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Kode lisensi tidak valid atau sudah kadaluarsa.' }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan sistem.' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const isPremium = cookieStore.get('premium_access')?.value === 'true';
  return NextResponse.json({ isPremium });
}