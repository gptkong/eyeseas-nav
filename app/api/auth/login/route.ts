import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { adminLoginSchema } from '@/lib/validations';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = adminLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid request data',
        message: validation.error.errors[0]?.message || 'Validation failed',
      }, { status: 400 });
    }

    const { password } = validation.data;

    // Verify password
    const isValid = await AuthService.verifyPassword(password);
    if (!isValid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid credentials',
        message: 'Incorrect password',
      }, { status: 401 });
    }

    // Generate token
    const token = AuthService.generateToken();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { token },
      message: 'Login successful',
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}
