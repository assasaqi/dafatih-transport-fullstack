import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="main-header">
      {/* Logo Website */}
      <NavLink to="/" className="logo">
        <i className="fa-solid fa-car-side"></i>
        <span>Dafatih Transport</span>
      </NavLink>

      {/* Navigasi Utama (Desktop) */}
      <nav className="desktop-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
          Beranda
        </NavLink>
        <NavLink to="/tarif" className={({ isActive }) => (isActive ? 'active' : '')}>
          Daftar Tarif
        </NavLink>
        <NavLink to="/galeri" className={({ isActive }) => (isActive ? 'active' : '')}>
          Galeri
        </NavLink>
        <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')}>
          Blog
        </NavLink>
      </nav>

      {/* Tombol Aksi Pesan Sekarang */}
      <div className="header-actions">
        <button className="btn-header" onClick={() => navigate('/pesan')}>
          Pesan Sekarang
        </button>
      </div>
    </header>
  );
};

export default Header;
