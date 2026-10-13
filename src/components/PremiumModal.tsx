// src/components/PremiumModal.tsx
'use client';

import { useState } from 'react';
import { X, Lock, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PremiumModal({ isOpen, onClose, onSuccess }: PremiumModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    
    try {
      const res = await fetch('/api/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus('success');
        setMessage('Aktivasi berhasil! Semua fitur premium terbuka.');
        setTimeout(() => {
          onSuccess();
          onClose();
          setCode('');
          setStatus('idle');
        }, 1500);
      } else {
        setStatus('error');
        setMessage(data.message || 'Kode tidak valid.');
      }
    } catch {
      setStatus('error');
      setMessage('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>
        
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold">Unlock Premium Access</h2>
          <p className="text-purple-100 text-sm mt-1">Buka kunci semua fitur Viral Scanner</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Masukkan Kode Lisensi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="CONTOH: VIRAL-2024-PRO"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-mono uppercase tracking-wider"
                required
              />
            </div>
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
              <CheckCircle size={16} /> {message}
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              <AlertCircle size={16} /> {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !code}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {loading ? 'Memverifikasi...' : 'Aktifkan Sekarang'}
          </button>

          <p className="text-xs text-center text-gray-500">
            Belum punya kode? <a href="https://lynk.id/username-anda" target="_blank" className="text-purple-600 font-bold hover:underline">Beli di Lynk.id (Rp 99rb)</a>
          </p>
        </form>
      </div>
    </div>
  );
}