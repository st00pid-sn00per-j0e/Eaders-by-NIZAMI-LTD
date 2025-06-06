
// app/api/image-proxy/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        // You might need to pass through or set specific headers
        // if the origin server requires them (e.g., Referer, User-Agent)
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Important: Set CORS headers for the proxy response itself
    // This allows your frontend (even on a different port during dev) to access the proxied image
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Access-Control-Allow-Origin', '*'); // Or restrict to your frontend's origin
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');


    return new NextResponse(imageBuffer, {
      status: 200,
      headers: headers,
    });

  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Error proxying image', { status: 500 });
  }
}

// Optional: Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*'); // Or restrict
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return new NextResponse(null, { status: 204, headers });
}

