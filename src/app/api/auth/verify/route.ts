import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      );
    }

    // Dynamically import to avoid build-time initialization issues
    const { adminAuth } = await import('@/lib/firebaseAdmin');

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Get user data
    const user = await adminAuth.getUser(decodedToken.uid);

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
