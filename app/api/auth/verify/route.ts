import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const session = AuthService.getSessionFromHeaders(request.headers);
    
    if (!session || !AuthService.isSessionValid(session)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired session',
      }, { status: 401 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { 
        isAuthenticated: true,
        expiresAt: session.expiresAt 
      },
      message: 'Session is valid',
    });

  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}
