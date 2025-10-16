import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Mock API response for offline sync
    return NextResponse.json({
      success: true,
      message: 'Data synced successfully (mock)',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        message: 'Mock sync failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  return POST(request)
}

export async function DELETE(request: Request) {
  return POST(request)
}
