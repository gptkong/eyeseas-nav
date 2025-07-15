import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';
import { ApiResponse } from '@/lib/types';

// GET - Fetch dashboard statistics (public)
export async function GET(request: NextRequest) {
  try {
    const stats = await DatabaseService.getDashboardStats();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch dashboard statistics',
    }, { status: 500 });
  }
}
