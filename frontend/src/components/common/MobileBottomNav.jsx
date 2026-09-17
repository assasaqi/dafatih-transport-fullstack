import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileBottomNav = () => {
  return (
    <div className="mobile-bottom-nav">
      <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-house"></i>
        <span>Beranda</span>
      </NavLink>
      <NavLink to="/tarif" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-table-list"></i>
        <span>Tarif</span>
      </NavLink>
      <NavLink to="/pesan" className={({ isActive }) => `mobile-nav-item mobile-nav-book ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-circle-plus"></i>
        <span>Pesan</span>
      </NavLink>
      <NavLink to="/galeri" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-images"></i>
        <span>Galeri</span>
      </NavLink>
      <NavLink to="/blog" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-blog"></i>
        <span>Blog</span>
      </NavLink>
    </div>
  );
};

export default MobileBottomNav;
