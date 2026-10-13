// src/components/DurationAnalyzer.tsx
'use client';

import { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { Clock, TrendingUp } from 'lucide-react';

export default function DurationAnalyzer() {
  const { videos } = useStore();

  const analysis = useMemo(() => {
    const videoList = Object.values(videos).filter(v => v.durationSeconds > 0);
    if (videoList.length === 0) return null;

    // Group by duration range
    const ranges = [
      { label: '< 30 min', min: 0, max: 1800 },
      { label: '30-60 min', min: 1800, max: 3600 },
      { label: '1-2 hours', min: 3600, max: 7200 },
      { label: '2-4 hours', min: 7200, max: 14400 },
      { label: '4-8 hours', min: 14400, max: 28800 },
      { label: '8+ hours', min: 28800, max: Infinity },
    ];

    const distribution = ranges.map(r => {
      const vids = videoList.filter(v => v.durationSeconds >= r.min && v.durationSeconds < r.max);
      const avgScore = vids.length > 0 
        ? vids.reduce((sum, v) => sum + v.score, 0) / vids.length 
        : 0;
      const avgViews = vids.length > 0
        ? vids.reduce((sum, v) => sum + v.viewCount, 0) / vids.length
        : 0;
      return {
        ...r,
        count: vids.length,
        avgScore: Math.round(avgScore),
        avgViews: Math.round(avgViews),
      };
    });

    // Rekomendasi durasi ideal
    const bestRange = distribution.reduce((best, curr) => 
      curr.avgScore > best.avgScore ? curr : best
    );

    const avgDuration = videoList.reduce((sum, v) => sum + v.durationSeconds, 0) / videoList.length;
    const medianDuration = [...videoList].sort((a, b) => a.durationSeconds - b.durationSeconds)
      [Math.floor(videoList.length / 2)].durationSeconds;

    return { distribution, bestRange, avgDuration, medianDuration, total: videoList.length };
  }, [videos]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  if (!analysis) {
    return (
      <div className="bg-yellow-50 border p-4 rounded-lg text-sm">
        ⚠️ Belum ada data durasi. Lakukan scan terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold">⏱️ Duration Analyzer</h3>
        <p className="text-sm text-gray-500">Analisis durasi optimal berdasarkan {analysis.total} video viral</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Rata-rata Durasi</p>
          <p className="text-2xl font-bold text-blue-600">{formatDuration(analysis.avgDuration)}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Median Durasi</p>
          <p className="text-2xl font-bold text-purple-600">{formatDuration(analysis.medianDuration)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg p-4">
          <p className="text-xs opacity-90 mb-1">⭐ Durasi Ideal</p>
          <p className="text-2xl font-bold">{analysis.bestRange.label}</p>
          <p className="text-xs opacity-90 mt-1">Avg Score: {analysis.bestRange.avgScore}</p>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <TrendingUp size={16} /> Distribusi Durasi vs Skor
        </h4>
        <div className="space-y-3">
          {analysis.distribution.map(d => {
            const maxCount = Math.max(...analysis.distribution.map(x => x.count));
            const percentage = (d.count / maxCount) * 100;
            const isBest = d.label === analysis.bestRange.label;
            
            return (
              <div key={d.label} className={`p-3 rounded-lg ${isBest ? 'bg-green-50 border-2 border-green-400' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-semibold ${isBest ? 'text-green-700' : 'text-gray-700'}`}>
                    {d.label} {isBest && '⭐'}
                  </span>
                  <div className="flex gap-3 text-xs">
                    <span className="text-gray-600">{d.count} videos</span>
                    <span className="text-blue-600 font-bold">Score: {d.avgScore}</span>
                    <span className="text-gray-500">Avg {Math.round(d.avgViews).toLocaleString()} views</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${isBest ? 'bg-green-500' : 'bg-blue-400'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rekomendasi */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
          <Clock size={16} /> Rekomendasi untuk Niche Music
        </h4>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>✅ <strong>Durasi optimal:</strong> {analysis.bestRange.label} (skor tertinggi: {analysis.bestRange.avgScore})</li>
          <li>✅ <strong>Target durasi:</strong> {formatDuration(analysis.medianDuration)} (median dari data viral)</li>
          <li>✅ <strong>Format upload:</strong> Buat versi {analysis.bestRange.label} untuk long-form + versi 1 jam untuk short-form</li>
          <li>💡 <strong>Tip:</strong> Video 8+ jam cocok untuk "sleep music", 1-2 jam untuk "study/focus"</li>
        </ul>
      </div>
    </div>
  );
}