import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();
    
    // Test write
    await redis.set("test_key", "Hello Redis!");
    
    // Test read
    const value = await redis.get("test_key");
    
    await redis.disconnect();
    
    return NextResponse.json({ 
      success: true, 
      message: "Redis connection successful",
      value 
    });
  } catch (error) {
    console.error('Redis connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Redis connection failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
