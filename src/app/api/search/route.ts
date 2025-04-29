import { NextRequest, NextResponse } from 'next/server';

// Your backend search API URL - change this to your actual deployment
const SEARCH_API_URL = 'http://localhost:8000/api/search';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    const limit = url.searchParams.get('limit') || '10';
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    // Call the backend search API
    const response = await fetch(
      `${SEARCH_API_URL}?query=${encodeURIComponent(query)}&limit=${limit}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to search movies' },
        { status: response.status }
      );
    }
    
    // Return the search results
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}