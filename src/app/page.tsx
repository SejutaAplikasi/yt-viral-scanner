// src/app/page.tsx
import Link from 'next/link';
import { Search, Brain, TrendingUp, Palette, Sparkles, Tags, Clock, Rocket, ArrowRight, Lock, CheckCircle } from 'lucide-react';

const trendingVideos = {
  japan: [
    { id: '1', title: 'Relaxing Japanese Music 🎌 Traditional Koto & Shamisen', channel: 'Japan Vibes', views: '125K', days: 3, score: 92, thumb: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg' },
    { id: '2', title: 'Zen Garden Music 🌸 Peaceful Japanese Flute', channel: 'Meditation Sounds', views: '89K', days: 5, score: 88, thumb: 'https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg' },
    { id: '3', title: 'Japanese Tea Ceremony Music 🍵 Calm & Relaxing', channel: 'Asian Relaxation', views: '67K', days: 2, score: 85, thumb: 'https://img.youtube.com/vi/lTRiuFIWV54/mqdefault.jpg' },
  ],
  sleep: [
    { id: '4', title: 'Deep Sleep Music 🌙 8 Hours Delta Waves', channel: 'Sleep Therapy', views: '345K', days: 2, score: 95, thumb: 'https://img.youtube.com/vi/DWcJFNfaw9c/mqdefault.jpg' },
    { id: '5', title: 'Insomnia Relief Music 😴 Fall Asleep Fast', channel: 'Relaxing Music', views: '278K', days: 4, score: 93, thumb: 'https://img.youtube.com/vi/1ZYbU82GVz4/mqdefault.jpg' },
    { id: '6', title: 'Black Screen Sleep Music  No Ads', channel: 'Dark Sleep', views: '189K', days: 3, score: 91, thumb: 'https://img.youtube.com/vi/UfcAVejslrU/mqdefault.jpg' },
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
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Viral Scanner</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition font-medium">Fitur</a>
              <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition font-medium">Harga</a>
            </div>
            <Link href="/scanner" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition flex items-center gap-2">
              Mulai Scan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - GIMMICK 1: The 1% Gap Finder */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-transparent to-pink-100/50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-red-200">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            JANGAN BERSAING DENGAN CHANNEL BESAR!
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-gray-900">
            Berhenti Menebak. <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Mulai Meniru Yang Viral.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Algoritma YouTube berat sebelah. Tapi ada <strong>"celah tersembunyi"</strong>: Video dari channel kecil (&lt;1.000 subs) yang tiba-tiba meledak dapat 100K+ views. 
            Kami menemukan topik yang terbukti viral yang dibuat oleh channel seukuran Anda. <strong className="text-purple-700">Jika mereka bisa, Anda pasti bisa.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scanner" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition flex items-center justify-center gap-2">
              <Search size={20} /> Temukan Celah Viral Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Features - GIMMICK 3: Copy-Paste Blueprint */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Bukan Sekadar Data, Tapi <span className="text-purple-600">Resep Rahasia</span></h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Kami tidak hanya memberi Anda video trending. Kami memberi Anda formula untuk menirunya.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Search, title: 'The 1% Gap Finder', desc: 'Filter otomatis hanya menampilkan video viral dari channel kecil. Abaikan MrBeast, fokus pada celah yang bisa Anda kuasai.', color: 'from-purple-500 to-indigo-500' },
              { icon: Brain, title: 'Copy-Paste Blueprint', desc: 'Ekstrak kata kunci judul, stack tags SEO, dan palet warna thumbnail dari 100 video teratas. Tinggal salin dan tempel.', color: 'from-pink-500 to-rose-500' },
              { icon: TrendingUp, title: 'Momentum Sniper', desc: 'Deteksi video yang views-nya melonjak drastis dalam 24 jam terakhir. Jadilah yang pertama menunggangi gelombang sebelum pesaing tahu.', color: 'from-orange-500 to-red-500' },
              { icon: Palette, title: 'Thumbnail Decoder', desc: 'AI menganalisis warna dominan thumbnail viral. Buat thumbnail dengan psikologi warna yang sama persis.', color: 'from-blue-500 to-cyan-500' },
              { icon: Sparkles, title: 'Viral Title Generator', desc: 'Generate 10 variasi judul dalam 1 detik berdasarkan pola psikologis yang terbukti memicu klik.', color: 'from-green-500 to-emerald-500' },
              { icon: Tags, title: 'SEO Tag Stack', desc: 'Dapatkan urutan tags optimal yang dipakai oleh video dengan skor viral tertinggi di niche Anda.', color: 'from-amber-500 to-yellow-500' },
            ].map((feature) => (
              <div key={feature.title} className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - GIMMICK MONETIZATION */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-slate-900 to-purple-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Investasi Kecil, Hasil Viral</h2>
            <p className="text-purple-200 text-lg">Satu video viral bisa menutup biaya langganan seumur hidup.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-2">Starter (Gratis)</h3>
              <p className="text-purple-200 mb-6">Untuk mencoba-coba</p>
              <div className="text-4xl font-bold mb-6">Rp 0</div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> 3x Scan per hari</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Top Opportunities Basic</li>
                <li className="flex items-center gap-2 text-gray-500"><Lock size={16} /> Rising Now (Momentum)</li>
                <li className="flex items-center gap-2 text-gray-500"><Lock size={16} /> Title & Tag Generator</li>
                <li className="flex items-center gap-2 text-gray-500"><Lock size={16} /> Thumbnail Decoder</li>
              </ul>
              <Link href="/scanner" className="block w-full text-center bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition">
                Coba Gratis
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 border-2 border-white/20 relative transform md:scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-black">
                PALING LARIS
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium Access</h3>
              <p className="text-purple-100 mb-6">Untuk serius cuan dari YouTube</p>
              <div className="text-4xl font-bold mb-2">Rp 99.000 <span className="text-lg font-normal text-purple-200">/ lifetime</span></div>
              <p className="text-xs text-purple-200 mb-6">Bayar sekali, pakai selamanya</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-white" /> <strong>Unlimited</strong> Scan Harian</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-white" /> <strong>Rising Now</strong> (Deteksi 24 Jam)</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-white" /> <strong>Viral Title Generator</strong></li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-white" /> <strong>SEO Tag Recommender</strong></li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-white" /> <strong>Thumbnail Color Decoder</strong></li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-white" /> Prioritas Support</li>
              </ul>
              <a href="https://lynk.id/username-anda" target="_blank" className="block w-full text-center bg-white text-purple-600 py-3 rounded-lg font-bold hover:scale-105 transition shadow-lg">
                Beli Kode di Lynk.id
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Rocket className="text-white" size={16} />
            </div>
            <span className="font-bold">Viral Scanner</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 Viral Scanner. Stop guessing, start copying what works.</p>
        </div>
      </footer>
    </div>
  );
}