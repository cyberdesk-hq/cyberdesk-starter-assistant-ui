import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * Deploy a virtual desktop for playground/demo purposes
 * This endpoint keeps the API key secure on the server side
 */
export async function POST(request: Request) {
  try {
    // In a real app, you'd store this securely in environment variables
    const API_KEY = process.env.CYBERDESK_API_KEY;
    
    if (!API_KEY) {
      console.error('Missing API key');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Get the timeout from the request body
    const { timeoutMs } = await request.json();
    
    const response = await fetch('https://api.cyberdesk.io/v1/desktop', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY
      },
      body: JSON.stringify({ timeoutMs })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to deploy desktop:', errorText);
      return NextResponse.json(
        { error: 'Failed to deploy desktop' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Return both the streamUrl and id to the client
    return NextResponse.json({ 
      streamUrl: data.streamUrl || data.stream_url,
      id: data.id
    });
  } catch (error) {
    console.error('Error deploying desktop:', error);
    return NextResponse.json(
      { error: 'Failed to deploy desktop' },
      { status: 500 }
    );
  }
}

/**
 * Stop a virtual desktop
 * This endpoint keeps the API key secure on the server side
 */
export async function PATCH(request: Request) {
  try {
    // In a real app, you'd store this securely in environment variables
    const API_KEY = process.env.CYBERDESK_API_KEY;
    
    if (!API_KEY) {
      console.error('Missing API key');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get the desktop ID from the request body
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Desktop ID is required' },
        { status: 400 }
      );
    }
    
    const baseUrl = 'https://api.cyberdesk.io/v1';
    
    const response = await fetch(`${baseUrl}/desktop/${id}/stop`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to stop desktop:', errorText);
      return NextResponse.json(
        { error: 'Failed to stop desktop' },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error stopping desktop:', error);
    return NextResponse.json(
      { error: 'Failed to stop desktop' },
      { status: 500 }
    );
  }
}
