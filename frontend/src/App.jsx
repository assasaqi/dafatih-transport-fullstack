import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import MobileBottomNav from './components/common/MobileBottomNav';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import Tariffs from './pages/Tariffs';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Admin from './pages/Admin';

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Navbar Navigasi Atas */}
      <Navbar />

      {/* Rute Utama Halaman */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tarif" element={<Tariffs />} />
          <Route path="/pesan" element={<Booking />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {/* Footer disembunyikan khusus di halaman pemesanan (/pesan) */}
      {location.pathname !== '/pesan' && <Footer />}

      {/* Navigasi Bawah Khusus HP */}
      <MobileBottomNav />
    </div>
  );
}

export default App;
