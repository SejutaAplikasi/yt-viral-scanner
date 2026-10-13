// src/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VideoData {
  videoId: string;
  channelId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  channelTitle: string;
  subscriberCount: number;
  tags: string[];
  viewsPerDay: number;
  viewsPerSub: number;
  score: number;
  durationSeconds: number; // ⬅️ BARU
  thumbnailColors?: string[]; // ⬅️ BARU (hex colors)
}

export interface Snapshot {
  videoId: string;
  viewCount: number;
  capturedAt: string;
}

interface AppState {
  videos: Record<string, VideoData>;
  snapshots: Snapshot[];
  scanHistory: { id: string; keyword: string; date: string; count: number }[];
  activeTab: 'scanner' | 'rising' | 'analyzer' | 'tools'; // ⬅️ Tambah 'tools'
  
  setActiveTab: (tab: any) => void;
  saveScanData: (videos: VideoData[], keyword: string) => void;
  updateThumbnailColors: (videoId: string, colors: string[]) => void;
  clearAllData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      videos: {},
      snapshots: [],
      scanHistory: [],
      activeTab: 'scanner',

      setActiveTab: (tab) => set({ activeTab: tab }),

      saveScanData: (videos, keyword) => {
        const newSnapshots: Snapshot[] = [];
        const updatedVideos = { ...get().videos };
        
        videos.forEach(v => {
          updatedVideos[v.videoId] = v;
          newSnapshots.push({
            videoId: v.videoId,
            viewCount: v.viewCount,
            capturedAt: new Date().toISOString()
          });
        });

        const allSnapshots = [...get().snapshots, ...newSnapshots].slice(-2000);
        const history = {
          id: Date.now().toString(),
          keyword,
          date: new Date().toISOString(),
          count: videos.length
        };

        set({
          videos: updatedVideos,
          snapshots: allSnapshots,
          scanHistory: [history, ...get().scanHistory].slice(0, 20)
        });
      },

      updateThumbnailColors: (videoId, colors) => {
        const videos = { ...get().videos };
        if (videos[videoId]) {
          videos[videoId].thumbnailColors = colors;
          set({ videos });
        }
      },

      clearAllData: () => set({ videos: {}, snapshots: [], scanHistory: [] }),
    }),
    { name: 'yt-scanner-storage' }
  )
);