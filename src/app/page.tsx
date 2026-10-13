// src/app/page.tsx
import Link from 'next/link';
import { Search, Brain, TrendingUp, Palette, Sparkles, Tags, Clock, Rocket, ArrowRight } from 'lucide-react';

// 🎯 DATA MANUAL (Hardcoded) - Zero API Calls, Zero Build Errors!
const trendingVideos = {
  japan: [
    { id: '1', title: 'Relaxing Japanese Music 🎌 Traditional Koto & Shamisen', channel: 'Japan Vibes', views: '125K', days: 3, score: 92, thumb: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg' },
    { id: '2', title: 'Zen Garden Music 🌸 Peaceful Japanese Flute', channel: 'Meditation Sounds', views: '89K', days: 5, score: 88, thumb: 'https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg' },
    { id: '3', title: 'Japanese Tea Ceremony Music 🍵 Calm & Relaxing', channel: 'Asian Relaxation', views: '67K', days: 2, score: 85, thumb: 'https://img.youtube.com/vi/lTRiuFIWV54/mqdefault.jpg' },
  ],
  sleep: [
    { id: '4', title: 'Deep Sleep Music 🌙 8 Hours Delta Waves', channel: 'Sleep Therapy', views: '345K', days: 2, score: 95, thumb: 'https://img.youtube.com/vi/DWcJFNfaw9c/mqdefault.jpg' },
    { id: '5', title: 'Insomnia Relief Music 😴 Fall Asleep Fast', channel: 'Relaxing Music', views: '278K', days: 4, score: 93, thumb: 'https://img.youtube.com/vi/1ZYbU82GVz4/mqdefault.jpg' },
    { id: '6', title: 'Black Screen Sleep Music 🖤 No Ads', channel: 'Dark Sleep', views: '189K', days: 3, score: 91, thumb: 'https://img.youtube.com/vi/UfcAVejslrU/mqdefault.jpg' },
  ],
  study: [
    { id: '7', title: 'Study Music 📚 Focus & Concentration', channel: 'Study Beats', views: '567K', days: 3, score: 98, thumb: 'https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg' },
    { id: '8', title: 'Lofi Hip Hop Study 🎧 Chill Beats', channel: 'Lofi Girl', views: '892K', days: 5, score: 99, thumb: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg' },
    { id: '9', title: 'Classical Music for Study 🎻 Mozart Effect', channel: 'Classical Hub', views: '234K', days: 4, score: 91, thumb: 'https://img.youtube.com/vi/rUxyKA_-grg/mqdefault.jpg' },
  ]
};

const categories = [
  { id: 'japan', label: '🎌 Relaxing Japan Music', color: 'from-pink-500 to-rose-500', keyword: 'relaxing japan music' },
  { id: 'sleep', label: '😴 Sleep Music', color: 'from-indigo-500 to-purple-500', keyword: 'deep sleep music 8 hours' },
  { id: 'study', label: '📚 Study/Focus', color: 'from-amber-500 to-orange-500', keyword: 'lofi study music focus' },
];

export default function LandingPage() {
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

      {/* Trending Videos Section (100% Static Mock Data) */}
      <section id="trending" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <TrendingUp size={16} /> Contoh Data Viral
            </div>
            <h2 className="text-4xl font-bold mb-4">🔥 Top Viral Videos (7 Hari Terakhir)</h2>
            <p className="text-gray-600 text-lg">Contoh video trending dengan views tertinggi di berbagai kategori</p>
          </div>

          <div className="space-y-12">
            {categories.map((cat) => {
              const videos = trendingVideos[cat.id as keyof typeof trendingVideos];
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

                  <div className="grid md:grid-cols-3 gap-5">
                    {videos.map((video, idx) => (
                      <a
                        key={video.id}
                        href={`https://youtube.com/watch?v=${video.thumb.split('/')[4]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={video.thumb}
                            alt={video.title}
                            className="w-full h-44 object-cover group-hover:scale-110 transition duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Score: {video.score}
                          </div>
                          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur text-white px-2 py-1 rounded text-xs font-medium">
                            {video.views} views
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                            {video.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="truncate">{video.channel}</span>
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {video.days}d ago
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
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
            <p className="text-gray-400 text-sm">© 2026 Viral Scanner. AI-Powered YouTube Trend Detector.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}