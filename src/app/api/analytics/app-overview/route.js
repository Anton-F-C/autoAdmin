import 'server-only';

import { NextResponse } from 'next/server';

import { getAppOverview } from 'src/server/analytics/app-overview';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const overview = await getAppOverview();

    return NextResponse.json(overview, {
      status: 200,
    });
  } catch (error) {
    console.error('Failed to load app overview:', error);

    return NextResponse.json(
      {
        error: 'Failed to load app overview',
      },
      {
        status: 500,
      }
    );
  }
}
