import { NextResponse } from 'next/server';
import { LinksRepository } from '@/lib/db';

// POST - Create test data (admin only)
export async function POST() {
  try {
    const testLinks = [
      {
        title: 'Internal Dashboard',
        internalUrl: 'https://internal.company.com/dashboard',
        externalUrl: 'https://dashboard.company.com',
        description: 'Company internal dashboard for monitoring and analytics',
        icon: '📊',
        isActive: true,
      },
      {
        title: 'Documentation Portal',
        internalUrl: 'https://docs.internal.company.com',
        externalUrl: 'https://docs.company.com',
        description: 'Technical documentation and API references',
        icon: '📚',
        isActive: true,
      },
      {
        title: 'Project Management',
        internalUrl: 'https://pm.internal.company.com',
        externalUrl: 'https://projects.company.com',
        description: 'Project tracking and team collaboration tools',
        icon: '📋',
        isActive: true,
      },
      {
        title: 'HR Portal',
        internalUrl: 'https://hr.internal.company.com',
        externalUrl: 'https://hr.company.com',
        description: 'Human resources portal for employee services',
        icon: '👥',
        isActive: true,
      },
      {
        title: 'Development Tools',
        internalUrl: 'https://dev.internal.company.com',
        externalUrl: 'https://tools.company.com',
        description: 'Development environment and CI/CD tools',
        icon: '🛠️',
        isActive: true,
      }
    ];

    const createdLinks = [];
    for (const linkData of testLinks) {
      const link = await LinksRepository.create(linkData);
      createdLinks.push(link);
    }

    return NextResponse.json({
      success: true,
      data: createdLinks,
      message: `Created ${createdLinks.length} test links`,
    });

  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create test data',
    }, { status: 500 });
  }
}

// DELETE - Clear all test data
export async function DELETE() {
  try {
    // This is a simple implementation - in a real app you'd want more sophisticated cleanup
    const links = await LinksRepository.findAll();

    for (const link of links) {
      await LinksRepository.delete(link.id);
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${links.length} links`,
    });

  } catch (error) {
    console.error('Error deleting test data:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete test data',
    }, { status: 500 });
  }
}
