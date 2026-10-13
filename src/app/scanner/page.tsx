// src/app/scanner/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Search, TrendingUp, Brain, Trash2, History, Loader2, Wrench, ArrowLeft, Lock, Sparkles, Crown } from 'lucide-react';
import PremiumModal from '@/components/PremiumModal';
import ThumbnailAnalyzer from '@/components/ThumbnailAnalyzer';
import TitleGenerator from '@/components/TitleGenerator';
import TagRecommender from '@/components/TagRecommender';
import DurationAnalyzer from '@/components/DurationAnalyzer';

export default function ScannerPage() {
  const { activeTab, setActiveTab, saveScanData, scanHistory, clearAllData, videos, snapshots, isPremium, setPremium, scanCount } = useStore();
  
  const [keyword, setKeyword] = useState('');
  const [minViews, setMinViews] = useState(3000);
  const [maxSubs, setMaxSubs] = useState(1000);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Cek status premium dari cookie saat pertama kali load
  useEffect(() => {
    fetch('/api/license')
      .then(res => res.json())
      .then(data => {
        if (data.isPremium && !isPremium) {
          setPremium(true);
        }
      });
  }, []);

  const handleScan = async () => {
    if (!keyword) return alert('Masukkan keyword!');
    
    // Batasan Free User: Max 3 scan per hari
    if (!isPremium && scanCount >= 3) {
      alert('Batas scan harian untuk user gratis sudah habis (3/3). Upgrade ke Premium untuk unlimited scan!');
      setShowPremiumModal(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        body: JSON.stringify({ keyword, region: 'US', language: 'en', days, minViews, maxSubs })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      saveScanData(data.videos, keyword);
      setActiveTab('scanner');
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const videoList = Object.values(videos).sort((a, b) => b.score - a.score);
  
  const risingData = Object.values(videos).map(v => {
    const vidSnaps = snapshots.filter(s => s.videoId === v.videoId).sort((a,b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());
    if (vidSnaps.length < 2) return null;
    const gained = vidSnaps[0].viewCount - vidSnaps[1].viewCount;
    const hours = (new Date(vidSnaps[0].capturedAt).getTime() - new Date(vidSnaps[1].capturedAt).getTime()) / 3600000;
    return { ...v, gained, hours, velocity: gained / Math.max(1, hours) };
  }).filter(Boolean).sort((a, b) => (b as any).gained - (a as any).gained);

  // Komponen Overlay untuk fitur yang dikunci
  const LockedOverlay = ({ title, desc }: { title: string, desc: string }) => (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center z-10 rounded-xl border border-gray-200">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-full mb-4 shadow-lg">
        <Lock className="text-white" size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 text-center max-w-xs">{desc}</p>
      <button 
        onClick={() => setShowPremiumModal(true)}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition flex items-center gap-2"
      >
        <Crown size={16} /> Unlock Premium
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        onSuccess={() => setPremium(true)} 
      />

      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2 mb-2 text-gray-600 hover:text-purple-600 transition">
            <ArrowLeft size={16} /> <span className="text-sm">Kembali ke Home</span>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center gap-2"> Viral Scanner</h1>
            {isPremium && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                <Crown size={10} /> PRO
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isPremium ? 'Unlimited Access' : `Free Plan (${3 - scanCount} scan left today)`}
          </p>
        </div>

        <div className="p-4 space-y-2 border-b border-gray-200">
          <button onClick={() => setActiveTab('scanner')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'scanner' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
            <Search size={16} /> Top Opportunities
          </button>
          
          {/* Rising Now - PREMIUM ONLY */}
          <button 
            onClick={() => isPremium ? setActiveTab('rising') : setShowPremiumModal(true)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium relative ${activeTab === 'rising' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <TrendingUp size={16} /> Rising Now
            {!isPremium && <Lock size={12} className="ml-auto text-gray-400" />}
          </button>

          <button onClick={() => setActiveTab('analyzer')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'analyzer' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
            <Brain size={16} /> Pattern Analyzer
          </button>
          
          {/* Tools - PREMIUM ONLY */}
          <button 
            onClick={() => isPremium ? setActiveTab('tools') : setShowPremiumModal(true)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium relative ${activeTab === 'tools' ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-100'}`}
          >
            <Wrench size={16} /> Production Tools
            {!isPremium && <Lock size={12} className="ml-auto text-gray-400" />}
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <h3 className="font-semibold text-sm text-gray-700">Scanner Settings</h3>
          <div>
            <label className="text-xs font-medium text-gray-500">Keyword</label>
            <input value={keyword} onChange={e => setKeyword(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. relaxation music" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-500">Min Views</label>
              <input type="number" value={minViews} onChange={e => setMinViews(+e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Max Subs</label>
              <input type="number" value={maxSubs} onChange={e => setMaxSubs(+e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Video Age (Days)</label>
            <select value={days} onChange={e => setDays(+e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
          
          <button onClick={handleScan} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            {loading ? 'Scanning...' : 'Scan YouTube'}
          </button>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-1"><History size={14} /> History</h3>
              <button onClick={clearAllData} className="text-xs text-red-500 hover:underline flex items-center gap-1"><Trash2 size={12} /> Clear</button>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {scanHistory.map(h => (
                <div key={h.id} className="text-xs p-2 bg-gray-50 rounded flex justify-between">
                  <span className="font-medium truncate">{h.keyword}</span>
                  <span className="text-gray-400">{h.count} vids</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 overflow-y-auto p-6 relative">
        {activeTab === 'scanner' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🔥 Top Viral Opportunities</h2>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600">
                  <tr>
                    <th className="p-3">Video</th>
                    <th className="p-3">Channel</th>
                    <th className="p-3 text-right">Views</th>
                    <th className="p-3 text-right">V/Sub</th>
                    <th className="p-3 text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {videoList.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">Belum ada data. Silakan scan terlebih dahulu.</td></tr>
                  ) : videoList.slice(0, 50).map(v => (
                    <tr key={v.videoId} className="border-t hover:bg-gray-50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={v.thumbnailUrl} className="w-20 h-12 object-cover rounded" alt="" />
                        <a href={`https://youtube.com/watch?v=${v.videoId}`} target="_blank" className="font-medium text-blue-600 hover:underline line-clamp-2">{v.title}</a>
                      </td>
                      <td className="p-3 text-gray-600">{v.channelTitle}<br/><span className="text-xs text-gray-400">{v.subscriberCount.toLocaleString()} subs</span></td>
                      <td className="p-3 text-right font-mono">{v.viewCount.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-blue-600">{v.viewsPerSub.toFixed(1)}X</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${v.score >= 80 ? 'bg-red-500' : v.score >= 60 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                          {v.score.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rising' && (
          <div className="relative">
            {!isPremium && <LockedOverlay title="Rising Now is Premium" desc="Lihat video yang sedang melonjak views-nya dalam 24 jam terakhir. Jadilah yang pertama menunggangi gelombang!" />}
            <div className={isPremium ? '' : 'opacity-20 pointer-events-none'}>
              <h2 className="text-2xl font-bold mb-4">🚀 Rising Now (Momentum)</h2>
              {risingData.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
                  <p className="text-yellow-700">Belum ada data momentum. Lakukan scan ulang pada keyword yang sama setelah beberapa jam.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="p-3">Video</th>
                        <th className="p-3 text-center">Views Gained</th>
                        <th className="p-3 text-center">Velocity (V/Hour)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(risingData as any[]).slice(0, 30).map(v => (
                        <tr key={v.videoId} className="border-t">
                          <td className="p-3 font-medium">{v.title}</td>
                          <td className="p-3 text-center text-red-500 font-bold">+{v.gained.toLocaleString()}</td>
                          <td className="p-3 text-center text-green-600 font-bold">{v.velocity.toFixed(1)} / hr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analyzer' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🧠 Pattern Analyzer</h2>
            <PatternAnalyzer videos={videoList.slice(0, 100)} />
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="relative space-y-6">
            {!isPremium && <LockedOverlay title="Production Tools is Premium" desc="Akses Title Generator, Tag Recommender, dan Thumbnail Analyzer untuk membuat konten viral secara instan." />}
            <div className={isPremium ? '' : 'opacity-20 pointer-events-none'}>
              <div>
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">🛠️ Production Tools <Sparkles className="text-yellow-500" size={20} /></h2>
                <p className="text-gray-500 text-sm">Tools untuk produksi konten faceless music channel</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-5"><ThumbnailAnalyzer /></div>
              <div className="bg-white rounded-xl shadow-sm border p-5"><TitleGenerator /></div>
              <div className="bg-white rounded-xl shadow-sm border p-5"><TagRecommender /></div>
              <div className="bg-white rounded-xl shadow-sm border p-5"><DurationAnalyzer /></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PatternAnalyzer({ videos }: { videos: any[] }) {
  const stopWords = ['the', 'and', 'for', 'with', 'to', 'of', 'in', 'a', 'is', 'on', 'at', 'by', 'an', 'as'];
  const titleWords: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};

  videos.forEach(v => {
    v.title.toLowerCase().split(/\W+/).forEach((w: string) => {
      if (w.length > 3 && !stopWords.includes(w)) titleWords[w] = (titleWords[w] || 0) + 1;
    });
    v.tags.forEach((t: string) => {
      const tag = t.toLowerCase().trim();
      if (tag.length > 3) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const topWords = Object.entries(titleWords).sort((a,b) => b[1]-a[1]).slice(0, 15);
  const topTags = Object.entries(tagCounts).sort((a,b) => b[1]-a[1]).slice(0, 15);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h3 className="font-bold mb-3">🔥 Top Words in Titles</h3>
        <ul className="space-y-2">
          {topWords.map(([word, count]) => (
            <li key={word} className="flex justify-between items-center text-sm">
              <span className="font-bold uppercase">{word}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">{count}x</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h3 className="font-bold mb-3">🏷️ Top Viral Tags</h3>
        <ul className="space-y-2">
          {topTags.map(([tag, count]) => (
            <li key={tag} className="flex justify-between items-center text-sm">
              <span className="truncate">#{tag}</span>
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">{count}x</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}