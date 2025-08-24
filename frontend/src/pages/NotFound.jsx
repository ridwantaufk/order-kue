// pages/404.jsx
import { useState } from 'react';
import GLBViewer from '../components/GLBViewer/GLBViewer';

export default function NotFound() {
  const [showModel, setShowModel] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-white text-white text-center px-4 space-y-8 relative">
      {/* 3D Model Display */}
      {showModel && (
        <div className="w-64 h-64 mb-4 relative z-10">
          <GLBViewer
            path="/assets/3D/red-velvet-brownies.glb"
            autoRotate={true}
          />
        </div>
      )}

      {/* 404 Title */}
      <h1 className="text-7xl font-bold z-10">404</h1>

      {/* Description */}
      <p className="text-xl z-10">Halaman yang kamu cari tidak ditemukan 😅</p>
      <p className="text-lg opacity-90 z-10">
        Sepertinya kamu tersesat di dunia digital kami
      </p>

      {/* Back Button */}
      <button
        onClick={() => (window.location.href = '/')}
        className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-100 transition-all z-10"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}
