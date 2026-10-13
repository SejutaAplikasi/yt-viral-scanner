// src/components/TagRecommender.tsx
'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { Tag, Copy, Check } from 'lucide-react';

export default function TagRecommender() {
  const { videos } = useStore();
  const [copied, setCopied] = useState(false);

  const tagAnalysis = useMemo(() => {
    const videoList = Object.values(videos).sort((a, b) => b.score - a.score).slice(0, 100);
    const tagCounts: Record<string, number> = {};
    const tagByScore: Record<string, number> = {}; // avg score per tag
    
    videoList.forEach(v => {
      v.tags.forEach(t => {
        const tag = t.toLowerCase().trim();
        if (tag.length > 3) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          tagByScore[tag] = (tagByScore[tag] || 0) + v.score;
        }
      });
    });

    const tags = Object.entries(tagCounts)
      .map(([tag, count]) => ({
        tag,
        count,
        avgScore: Math.round(tagByScore[tag] / count),
        viral: count >= 3 && tagByScore[tag] / count >= 60
      }))
      .sort((a, b) => b.count - a.count);

    return {
      top: tags.slice(0, 20),
      viral: tags.filter(t => t.viral).slice(0, 15),
      total: tags.length
    };
  }, [videos]);

  const copyAllViral = () => {
    const viralTags = tagAnalysis.viral.map(t => t.tag).join(', ');
    navigator.clipboard.writeText(viralTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold">🏷️ Smart Tag Recommender</h3>
        <p className="text-sm text-gray-500">Tags paling optimal berdasarkan {tagAnalysis.total} tags dari video viral</p>
      </div>

      {tagAnalysis.total === 0 && (
        <div className="bg-yellow-50 border p-4 rounded-lg text-sm">
          ️ Belum ada data tags. Lakukan scan terlebih dahulu.
        </div>
      )}

      {/* Viral Tags - High Priority */}
      {tagAnalysis.viral.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-red-700 flex items-center gap-2">
              🔥 Viral Tags (High Performance)
            </h4>
            <button
              onClick={copyAllViral}
              className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 flex items-center gap-1"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagAnalysis.viral.map(t => (
              <span
                key={t.tag}
                className="px-2 py-1 bg-white border border-red-300 rounded text-xs font-medium text-red-700"
              >
                #{t.tag} <span className="text-red-400">({t.avgScore})</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            💡 Tags ini muncul di 3+ video viral dengan skor rata-rata ≥60
          </p>
        </div>
      )}

      {/* Top Tags by Frequency */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-bold mb-3">📊 Top 20 Tags by Frequency</h4>
        <div className="space-y-2">
          {tagAnalysis.top.map((t, i) => (
            <div key={t.tag} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 w-6">#{i + 1}</span>
              <span className="flex-1 text-sm font-medium">#{t.tag}</span>
              <div className="w-32 bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(t.count / tagAnalysis.top[0].count) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-12 text-right">{t.count}x</span>
              <span className={`text-xs px-2 py-0.5 rounded ${t.avgScore >= 70 ? 'bg-green-100 text-green-700' : t.avgScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                {t.avgScore}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}