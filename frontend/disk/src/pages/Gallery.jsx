import React, { useState, useEffect } from 'react';
import galleryData from '../data/gallery.json';

const Gallery = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setVisibleCount(3);
    }
  }, []);

  const items = galleryData.galleryItems || [];
  const displayedItems = items.slice(0, visibleCount);

  return (
    <div className="page-view">
      <div className="page-banner">
        <h1>Galeri Perjalanan Wisatawan</h1>
        <p>Momen kebahagiaan para tamu kami selama menjelajahi destinasi terindah di Pulau Lombok.</p>
      </div>

      <section className="section">
        <div className="gallery-grid">
          {displayedItems.map((item, idx) => (
            <div key={idx} className="gallery-card">
              <div className="gallery-img-wrapper">
                <img src={item.image} alt={item.title} loading="lazy" />
                <span className="gallery-badge">
                  <i className="fa-solid fa-camera"></i> Momen Tamu
                </span>
              </div>
              <div className="gallery-body">
                <h3>{item.title}</h3>
                <p>{item.description || "Dokumentasi perjalanan wisata bersama Dafatih Transport."}</p>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < items.length && (
          <div className="load-more-wrapper" style={{ textAlign: 'center', marginTop: '30px' }}>
            <button className="btn-load-more" onClick={() => setVisibleCount((prev) => prev + (window.innerWidth <= 768 ? 3 : 6))}>
              <i className="fa-solid fa-arrows-rotate"></i> <span>Tampilkan Lebih Banyak</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Gallery;
