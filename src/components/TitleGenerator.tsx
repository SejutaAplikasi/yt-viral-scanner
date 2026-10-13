// src/components/TitleGenerator.tsx
'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';

export default function TitleGenerator() {
  const { videos } = useStore();
  const [niche, setNiche] = useState('relaxation music');
  const [generated, setGenerated] = useState<string[]>([]);

  // Analisis pola dari data viral
  const patterns = useMemo(() => {
    const videoList = Object.values(videos).sort((a, b) => b.score - a.score).slice(0, 100);
    
    const stopWords = ['the', 'and', 'for', 'with', 'to', 'of', 'in', 'a', 'is', 'on', 'at', 'by', 'an', 'as'];
    const titleWords: Record<string, number> = {};
    const durations: number[] = [];
    
    videoList.forEach(v => {
      v.title.toLowerCase().split(/[\s\-\|•·]+/).forEach(w => {
        const clean = w.replace(/[^a-z0-9]/g, '');
        if (clean.length > 3 && !stopWords.includes(clean)) {
          titleWords[clean] = (titleWords[clean] || 0) + 1;
        }
      });
      if (v.durationSeconds > 0) durations.push(v.durationSeconds);
    });

    const topWords = Object.entries(titleWords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word.toUpperCase());

    const avgDuration = durations.length > 0 
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) 
      : 3600;

    return { topWords, avgDuration };
  }, [videos]);

  // Template judul viral untuk niche music
  const templates = [
    '{EMOTION} {NICHE} • {BENEFIT} • {DURATION} • {FREQUENCY}',
    '{DURATION} {NICHE} for {BENEFIT} | {EMOTION} {FREQUENCY}',
    '{EMOTION} {NICHE} - {BENEFIT} & {FREQUENCY} Healing Music ({DURATION})',
    'Deep {NICHE} • {FREQUENCY} • {BENEFIT} • {DURATION} Non-Stop',
    '{BENEFIT} {NICHE} 🎵 {FREQUENCY} • {EMOTION} Vibes • {DURATION}',
    'INSTANT {BENEFIT} | {EMOTION} {NICHE} {FREQUENCY} • {DURATION} Loop',
  ];

  const emotionWords = ['DEEP', 'CALM', 'PEACEFUL', 'SERENE', 'GENTLE', 'SOOTHING', 'TRANQUIL'];
  const benefitWords = ['SLEEP', 'RELIEF', 'HEALING', 'STRESS RELIEF', 'INSOMNIA', 'ANXIETY', 'MEDITATION'];
  const frequencyWords = ['432Hz', '528Hz', '639Hz', '852Hz', '963Hz', 'SOLFEGGIO', 'BINAURAL'];
  const durationFormats = ['1 Hour', '3 Hours', '8 Hours', '10 Hours', '12 Hours'];

  const generateTitles = () => {
    const newTitles: string[] = [];
    const nicheUpper = niche.toUpperCase();
    
    for (let i = 0; i < 8; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const emotion = emotionWords[Math.floor(Math.random() * emotionWords.length)];
      const benefit = benefitWords[Math.floor(Math.random() * benefitWords.length)];
      const frequency = frequencyWords[Math.floor(Math.random() * frequencyWords.length)];
      const duration = durationFormats[Math.floor(Math.random() * durationFormats.length)];
      
      const title = template
        .replace('{EMOTION}', emotion)
        .replace('{NICHE}', nicheUpper)
        .replace('{BENEFIT}', benefit)
        .replace('{FREQUENCY}', frequency)
        .replace('{DURATION}', duration);
      
      newTitles.push(title);
    }
    setGenerated(newTitles);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold">✍️ Viral Title Generator</h3>
        <p className="text-sm text-gray-500">Generate judul berdasarkan pola 100 video viral teratas</p>
      </div>

      {/* Top Words dari data */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">🔥 Top Viral Words (dari data Anda):</h4>
        <div className="flex flex-wrap gap-2">
          {patterns.topWords.slice(0, 15).map(word => (
            <span key={word} className="px-2 py-1 bg-white border border-purple-300 rounded text-xs font-bold text-purple-700">
              {word}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          📊 Rata-rata durasi video viral: <strong>{Math.floor(patterns.avgDuration / 3600)} jam {Math.floor((patterns.avgDuration % 3600) / 60)} menit</strong>
        </p>
      </div>

      {/* Input & Generate */}
      <div className="flex gap-2">
        <input
          value={niche}
          onChange={e => setNiche(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
          placeholder="Niche (e.g. relaxation music)"
        />
        <button
          onClick={generateTitles}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
        >
          <Sparkles size={16} /> Generate Titles
        </button>
      </div>

      {/* Results */}
      {generated.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">🎯 Generated Titles:</h4>
          {generated.map((title, i) => (
            <div key={i} className="flex items-center gap-2 bg-white border rounded-lg p-3 hover:border-purple-300 transition">
              <span className="text-xs font-bold text-gray-400 w-6">#{i + 1}</span>
              <span className="flex-1 text-sm font-medium">{title}</span>
              <button
                onClick={() => copyToClipboard(title)}
                className="p-1.5 hover:bg-gray-100 rounded"
                title="Copy"
              >
                <Copy size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={generateTitles}
            className="text-sm text-purple-600 hover:underline flex items-center gap-1 mt-2"
          >
            <RefreshCw size={12} /> Generate more variations
          </button>
        </div>
      )}
    </div>
  );
}