import { NextResponse } from 'next/server';
import { processMessage, getUserContext } from '@/lib/chatbotLogic';
import { getCurrentUser } from '@/lib/session';

export async function POST(request) {
  try {
    const { message, history } = await request.json();
    
    // Validation
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message too long (max 500 characters)' },
        { status: 400 }
      );
    }
    
    // Get user context (optional, works without login)
    let userId = null;
    try {
      const session = await getCurrentUser();
      userId = session?.userId;
    } catch (error) {
      // No session - continue without user context
    }
    
    const userContext = await getUserContext(userId);
    
    // Process message with smart fallbacks
    const result = await processMessage(message, history || [], userContext);
    
    return NextResponse.json({
      response: result.response,
      products: result.products || [],
      action: result.action || null,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chatbot API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        response: 'I\'m having trouble right now. Try browsing our categories!' 
      },
      { status: 500 }
    );
  }
}
