import { NextRequest, NextResponse } from 'next/server';
import { LinksRepository } from '@/lib/db';
import { ApiResponse } from '@/lib/types';

// GET - Fetch dashboard statistics (public)
export async function GET(request: NextRequest) {
  try {
    const links = await LinksRepository.findAll();
    const stats = {
      totalLinks: links.length,
      internalLinks: links.length,
      externalLinks: links.length,
      activeLinks: links.filter(l => l.isActive).length,
      inactiveLinks: links.filter(l => !l.isActive).length,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch dashboard statistics',
    }, { status: 500 });
  }
}
