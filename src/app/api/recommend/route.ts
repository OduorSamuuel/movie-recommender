import { NextRequest, NextResponse } from 'next/server';

// Your backend recommendation API URL - change this to your actual deployment
const RECOMMENDATION_API_URL = 'http://localhost:8000/api/recommend';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const title = url.searchParams.get('title');
    const count = url.searchParams.get('count') || '5';
    
    if (!title) {
      return NextResponse.json(
        { error: 'Movie title is required' },
        { status: 400 }
      );
    }
    
    // Call the backend recommendation API
    const response = await fetch(
      `${RECOMMENDATION_API_URL}?title=${encodeURIComponent(title)}&count=${count}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Movie not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to get recommendations' },
        { status: response.status }
      );
    }
    
    // Return the recommendations
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Recommendation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}