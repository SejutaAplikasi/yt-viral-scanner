// src/app/api/scan/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { keyword, region, language, days, minViews, maxSubs } = await req.json();
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) return NextResponse.json({ error: 'API Key missing' }, { status: 500 });

  try {
    const publishedAfter = new Date(Date.now() - days * 86400000).toISOString();
    
    // 1. Search Videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&videoDuration=long&order=viewCount&maxResults=50&publishedAfter=${publishedAfter}&regionCode=${region}&relevanceLanguage=${language}&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (!searchData.items) return NextResponse.json({ error: 'No videos found' }, { status: 404 });

    const videoIds = searchData.items.map((i: any) => i.id.videoId).join(',');
    const channelIds = [...new Set(searchData.items.map((i: any) => i.snippet.channelId))].join(',');

    // 2. Get Video Details
    const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`);
    const videosData = await videosRes.json();

    // 3. Get Channel Details
    const channelsRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${apiKey}`);
    const channelsData = await channelsRes.json();
    
    const channelMap: Record<string, any> = {};
    channelsData.items?.forEach((c: any) => {
      channelMap[c.id] = { title: c.snippet.title, subs: parseInt(c.statistics.subscriberCount || '0') };
    });

    // 4. Process & Calculate Score
    const processedVideos = videosData.items
      .map((v: any) => {
        const ch = channelMap[v.snippet.channelId];
        if (!ch || ch.subs > maxSubs) return null;
        
        const views = parseInt(v.statistics.viewCount || '0');
        if (views < minViews) return null;

        const ageDays = Math.max(1, (Date.now() - new Date(v.snippet.publishedAt).getTime()) / 86400000);
        const viewsPerDay = views / ageDays;
        const viewsPerSub = ch.subs > 0 ? views / ch.subs : views;

        // Rumus Skor (Sama seperti PHP)
        const scoreViewsDay = Math.min(100, (viewsPerDay / 500) * 100);
        const scoreViewsSub = Math.min(100, (viewsPerSub / 50) * 100);
        const scoreRecency = Math.max(10, 100 - (ageDays * 3));
        const score = (scoreViewsSub * 0.5) + (scoreViewsDay * 0.35) + (scoreRecency * 0.15);

        return {
          videoId: v.id,
          channelId: v.snippet.channelId,
          title: v.snippet.title,
          thumbnailUrl: v.snippet.thumbnails?.high?.url || '',
          publishedAt: v.snippet.publishedAt,
          viewCount: views,
          channelTitle: ch.title,
          subscriberCount: ch.subs,
          tags: v.snippet.tags || [],
          viewsPerDay,
          viewsPerSub,
          score
        };
      })
      .filter(Boolean);

    return NextResponse.json({ videos: processedVideos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}