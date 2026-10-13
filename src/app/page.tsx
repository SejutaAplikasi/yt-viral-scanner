// src/app/page.tsx
import Link from 'next/link';
import { Search, Brain, TrendingUp, Palette, Sparkles, Tags, Clock, Rocket, CheckCircle, ArrowRight } from 'lucide-react';

// Data kategori untuk landing page
const categories = [
  { id: 'japan', keyword: 'relaxing japan music', label: '🎌 Relaxing Japan Music', color: 'from-pink-500 to-rose-500' },
  { id: 'sleep', keyword: 'deep sleep music 8 hours', label: ' Sleep Music', color: 'from-indigo-500 to-purple-500' },
  { id: 'study', keyword: 'lofi study music focus', label: '📚 Study/Focus', color: 'from-amber-500 to-orange-500' },
];

// Server Component untuk fetch trending videos
async function getTrendingVideos(keyword: string) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return [];

    const publishedAfter = new Date(Date.now() - 7 * 86400000).toISOString();
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&order=viewCount&maxResults=9&publishedAfter=${publishedAfter}&relevanceLanguage=en&key=${apiKey}`,
      { next: { revalidate: 3600 } } // Cache 1 jam
    );
    const searchData = await searchRes.json();

    if (!searchData.items) return [];

    const videoIds = searchData.items.map((i: any) => i.id.videoId).join(',');
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const videosData = await videosRes.json();

    const statsMap: Record<string, any> = {};
    videosData.items?.forEach((v: any) => {
      statsMap[v.id] = parseInt(v.statistics.viewCount || '0');
    });

    return searchData.items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: statsMap[item.id.videoId] || 0,
    })).sort((a: any, b: any) => b.viewCount - a.viewCount);
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
}

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

function daysAgo(dateStr: string): number {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  return days;
}

export default async function LandingPage() {
  // Fetch data untuk semua kategori secara paralel
  const [japanVideos, sleepVideos, studyVideos] = await Promise.all([
    getTrendingVideos(categories[0].keyword),
    getTrendingVideos(categories[1].keyword),
    getTrendingVideos(categories[2].keyword),
  ]);

  const videosByCategory: Record<string, any[]> = {
    japan: japanVideos,
    sleep: sleepVideos,
    study: studyVideos,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Rocket className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Viral Scanner
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition font-medium">Fitur</a>
              <a href="#trending" className="text-gray-600 hover:text-purple-600 transition font-medium">Trending</a>
              <a href="#how-to" className="text-gray-600 hover:text-purple-600 transition font-medium">Cara Pakai</a>
            </div>
            <Link
              href="/scanner"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition flex items-center gap-2"
            >
              Mulai Scan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-transparent to-pink-100/50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} /> AI-Powered YouTube Trend Detector
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Temukan Video Viral
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Sebelum Trending
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Scan ribuan video YouTube, analisis pattern viral, dan generate konten optimal untuk faceless channel Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scanner"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition flex items-center justify-center gap-2"
            >
              <Search size={20} /> Mulai Scan Sekarang
            </Link>
            <a
              href="#trending"
              className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:border-purple-400 transition flex items-center justify-center gap-2"
            >
              <TrendingUp size={20} /> Lihat Trending
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {[
              { label: 'Videos Scanned', value: '50K+' },
              { label: 'Accuracy Rate', value: '95%' },
              { label: 'Active Users', value: '10K+' },
              { label: 'Real-time Scan', value: '24/7' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-gray-600 text-lg">Semua yang Anda butuhkan untuk mendominasi YouTube</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Search, title: 'Smart Scanner', desc: 'Scan ribuan video dengan filter canggih. Temukan video viral dari channel kecil.', color: 'from-purple-500 to-indigo-500' },
              { icon: Brain, title: 'Pattern Analyzer', desc: 'AI menganalisis pattern judul, tags, dan thumbnail dari video viral.', color: 'from-pink-500 to-rose-500' },
              { icon: TrendingUp, title: 'Rising Detector', desc: 'Deteksi video yang sedang naik daun sebelum viral.', color: 'from-orange-500 to-red-500' },
              { icon: Palette, title: 'Thumbnail Analyzer', desc: 'Ekstrak warna dominan dan style thumbnail viral.', color: 'from-blue-500 to-cyan-500' },
              { icon: Sparkles, title: 'Title Generator', desc: 'Generate judul viral otomatis berdasarkan pattern teratas.', color: 'from-green-500 to-emerald-500' },
              { icon: Tags, title: 'Tag Recommender', desc: 'Rekomendasi tags optimal berdasarkan performa video viral.', color: 'from-amber-500 to-yellow-500' },
            ].map((feature) => (
              <div key={feature.title} className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Videos Section */}
      <section id="trending" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <TrendingUp size={16} /> Live Data dari YouTube
            </div>
            <h2 className="text-4xl font-bold mb-4">🔥 Top Viral Videos (7 Hari Terakhir)</h2>
            <p className="text-gray-600 text-lg">Video trending dengan views tertinggi di berbagai kategori</p>
          </div>

          <div className="space-y-12">
            {categories.map((cat) => {
              const videos = videosByCategory[cat.id] || [];
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {cat.label.split(' ')[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{cat.label}</h3>
                      <p className="text-sm text-gray-500">Keyword: "{cat.keyword}"</p>
                    </div>
                  </div>

                  {videos.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                      <p className="text-yellow-700">⚠️ Belum ada data. Pastikan YOUTUBE_API_KEY sudah diset di Vercel.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-5">
                      {videos.map((video: any, idx: number) => (
                        <a
                          key={video.videoId}
                          href={`https://youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-44 object-cover group-hover:scale-110 transition duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              #{idx + 1}
                            </div>
                            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur text-white px-2 py-1 rounded text-xs font-medium">
                              {formatViews(video.viewCount)} views
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                              {video.title}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="truncate">{video.channelTitle}</span>
                              <span className="flex items-center gap-1">
                                <Clock size={10} /> {daysAgo(video.publishedAt)}d ago
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition"
            >
              <Search size={20} /> Scan Lebih Banyak Kategori <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how-to" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cara Pakai</h2>
            <p className="text-gray-600 text-lg">4 langkah mudah untuk menemukan video viral</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Pilih Keyword', desc: 'Masukkan niche Anda (contoh: "relaxing japan music")', icon: Search },
              { num: '02', title: 'Scan YouTube', desc: 'AI scan ribuan video & hitung Opportunity Score', icon: Rocket },
              { num: '03', title: 'Analisis Pattern', desc: 'Lihat pattern judul, tags, thumbnail viral', icon: Brain },
              { num: '04', title: 'Generate & Publish', desc: 'Buat konten optimal & upload ke YouTube', icon: Sparkles },
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 h-full">
                  <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    {step.num}
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                    <step.icon className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow */}
          <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
            <h3 className="text-2xl font-bold mb-6 text-center">🎯 Workflow Faceless Music Channel</h3>
            <div className="grid md:grid-cols-5 gap-3 items-center">
              {[
                { icon: Search, label: 'Riset Viral', color: 'text-purple-600' },
                { icon: Brain, label: 'Analisis', color: 'text-pink-600' },
                { icon: Sparkles, label: 'Generate', color: 'text-orange-600' },
                { icon: Palette, label: 'Produksi', color: 'text-blue-600' },
                { icon: Rocket, label: 'Upload', color: 'text-green-600' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mb-2">
                    <item.icon className={item.color} size={28} />
                  </div>
                  <p className="text-sm font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Siap Mendominasi YouTube?</h2>
            <p className="text-xl mb-8 text-white/90">
              Bergabung dengan 10,000+ creator yang sudah menggunakan Viral Scanner
            </p>
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition"
            >
              Mulai Gratis Sekarang <ArrowRight size={20} />
            </Link>
            <p className="mt-4 text-sm text-white/70">100% Free • No Credit Card Required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Rocket className="text-white" size={16} />
              </div>
              <span className="font-bold">Viral Scanner</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2026 Viral Scanner. AI-Powered YouTube Trend Detector.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}