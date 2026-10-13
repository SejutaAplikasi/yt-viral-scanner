// src/components/ThumbnailAnalyzer.tsx
'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Palette, Download } from 'lucide-react';

export default function ThumbnailAnalyzer() {
  const { videos, updateThumbnailColors } = useStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<Record<string, string[]>>({});

  const videoList = Object.values(videos).slice(0, 30);

  // Ekstrak warna dominan dari thumbnail
  const extractColors = async (videoId: string, thumbnailUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = thumbnailUrl;
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    canvas.width = 50; // Resize kecil untuk performa
    canvas.height = 28;
    ctx.drawImage(img, 0, 0, 50, 28);

    const imageData = ctx.getImageData(0, 0, 50, 28).data;
    const colorMap: Record<string, number> = {};

    // Sample setiap 5 pixel
    for (let i = 0; i < imageData.length; i += 20) {
      const r = Math.round(imageData[i] / 32) * 32;
      const g = Math.round(imageData[i + 1] / 32) * 32;
      const b = Math.round(imageData[i + 2] / 32) * 32;
      const key = `rgb(${r},${g},${b})`;
      colorMap[key] = (colorMap[key] || 0) + 1;
    }

    const sorted = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => {
        const [r, g, b] = color.match(/\d+/g)!.map(Number);
        return rgbToHex(r, g, b);
      });

    updateThumbnailColors(videoId, sorted);
    return sorted;
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

  const analyzeAll = async () => {
    setAnalyzing(true);
    const newResults: Record<string, string[]> = {};
    for (const v of videoList) {
      try {
        const colors = await extractColors(v.videoId, v.thumbnailUrl);
        newResults[v.videoId] = colors;
      } catch (e) {
        // Skip jika CORS error
      }
    }
    setResults(newResults);
    setAnalyzing(false);
  };

  // Kategorisasi style thumbnail
  const categorizeStyle = (colors: string[]) => {
    const darkCount = colors.filter(c => {
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      return (r + g + b) / 3 < 100;
    }).length;
    
    if (darkCount >= 3) return '🌙 Dark/Moody';
    if (colors.some(c => c.includes('4a') || c.includes('5b'))) return '🌿 Nature/Green';
    if (colors.some(c => c.includes('2196') || c.includes('3b82'))) return '🌊 Blue/Calm';
    if (colors.some(c => c.includes('f59e') || c.includes('fbbf'))) return '🌅 Warm/Golden';
    return '🎨 Mixed';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">🎨 Thumbnail Style Analyzer</h3>
          <p className="text-sm text-gray-500">Ekstrak warna dominan & kategorisasi style thumbnail viral</p>
        </div>
        <button
          onClick={analyzeAll}
          disabled={analyzing || videoList.length === 0}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Palette size={16} />
          {analyzing ? 'Analyzing...' : 'Analyze Thumbnails'}
        </button>
      </div>

      {videoList.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm">
          ️ Lakukan scan terlebih dahulu untuk menganalisis thumbnail.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {videoList.map(v => {
          const colors = results[v.videoId] || v.thumbnailColors || [];
          const style = colors.length > 0 ? categorizeStyle(colors) : 'Pending';
          
          return (
            <div key={v.videoId} className="bg-white border rounded-lg p-3 hover:shadow-md transition">
              <img src={v.thumbnailUrl} className="w-full h-24 object-cover rounded mb-2" alt="" />
              <p className="text-xs font-medium line-clamp-2 mb-2">{v.title}</p>
              
              {colors.length > 0 ? (
                <>
                  <div className="flex gap-1 mb-2">
                    {colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded border border-gray-200 cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded text-center font-medium">
                    {style}
                  </div>
                </>
              ) : (
                <div className="text-xs text-gray-400 text-center py-2">
                  Click "Analyze" to extract colors
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}