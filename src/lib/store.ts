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
  activeTab: 'scanner' | 'rising' | 'analyzer';
  
  setActiveTab: (tab: 'scanner' | 'rising' | 'analyzer') => void;
  saveScanData: (videos: VideoData[], keyword: string) => void;
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

        // Batasi snapshot agar localStorage tidak penuh (simpan max 2000 snapshot terbaru)
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
          scanHistory: [history, ...get().scanHistory].slice(0, 20) // Simpan 20 riwayat terakhir
        });
      },

      clearAllData: () => set({ videos: {}, snapshots: [], scanHistory: [] }),
    }),
    {
      name: 'yt-scanner-storage', // Key di LocalStorage
    }
  )
);