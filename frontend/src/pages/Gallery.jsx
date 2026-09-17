import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGallery } from '../context/GalleryContext';

const Gallery = () => {
  // 1. Mengambil state caching dari GalleryContext
  const galleryContext = useGallery();
  const visibleCount = galleryContext?.visibleCount ?? null;
  const setVisibleCount = galleryContext?.setVisibleCount || (() => {});

  // 2. State untuk integrasi API Backend
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observerTarget = useRef(null);
  const getInitialLimit = () => (window.innerWidth <= 768 ? 3 : 6);

  // 3. Fetch Data dari Database Backend Express
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/gallery')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal mengambil data dari server backend');
        }
        return res.json();
      })
      .then((data) => {
        // Validasi jika data terbungkus dalam properti data (misal: data.data)
        const fetchedData = Array.isArray(data) ? data : (data?.data || []);
        setGalleryItems(fetchedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching gallery:', err);
        setError('Gagal mengambil data dari server backend. Pastikan server aktif.');
        setLoading(false);
      });
  }, []);

  // 4. Inisialisasi Paginasi Terpusat
  useEffect(() => {
    if (visibleCount === null) {
      setVisibleCount(getInitialLimit());
    }
  }, [visibleCount, setVisibleCount]);

  const currentLimit = visibleCount ?? getInitialLimit();
  const displayedItems = galleryItems.slice(0, currentLimit);
  const hasMore = currentLimit < galleryItems.length;

  const loadMoreWithDelay = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit());
      setIsLoadingMore(false);
    }, 800);
  }, [hasMore, isLoadingMore, setVisibleCount]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMoreWithDelay();
        }
      },
      { root: null, rootMargin: '100px', threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [loadMoreWithDelay, hasMore, isLoadingMore]);

  // Tampilan saat data sedang di-load dari Database
  if (loading) {
    return (
      <div className="page-view" style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
        <p>Memuat galeri dari database...</p>
      </div>
    );
  }

  // Tampilan saat terjadi eror koneksi/backend
  if (error) {
    return (
      <div className="page-view" style={{ textAlign: 'center', padding: '80px 20px', color: '#ef4444' }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-view">
      <style>{`
        .page-banner-compact {
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          padding: 18px 5% 14px;
          text-align: center;
        }

        .page-banner-compact h1 {
          font-size: clamp(1.1rem, 2vw + 0.4rem, 1.35rem);
          font-weight: 800;
          margin-bottom: 2px;
        }

        .page-banner-compact p {
          color: #f1f5f9;
          font-size: clamp(0.75rem, 0.8vw + 0.3rem, 0.82rem);
          max-width: 550px;
          margin: 0 auto;
          opacity: 0.9;
        }

        .section {
          padding: 20px 5%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        .gallery-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
        }

        .gallery-img-wrapper {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .gallery-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .gallery-body {
          padding: 14px 16px;
        }

        .gallery-body h3 {
          font-size: 0.98rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .gallery-body p {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0;
        }

        .pagination-status-wrapper {
          text-align: center;
          margin-top: 24px;
        }

        .btn-load-more {
          padding: 8px 20px;
          border-radius: 30px;
          border: 1px solid #0284c7;
          background-color: transparent;
          color: #0284c7;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
        }
      `}</style>

      <div className="page-banner-compact">
        <h1>Galeri Perjalanan Wisatawan</h1>
        <p>Momen kebahagiaan para tamu kami selama menjelajahi destinasi terindah di Pulau Lombok.</p>
      </div>

      <section className="section">
        {displayedItems.length > 0 ? (
          <div className="gallery-grid">
            {displayedItems.map((item, idx) => (
              <div key={item.id || item._id || idx} className="gallery-card">
                <div className="gallery-img-wrapper">
                  {/* Penanganan fleksibel untuk properti image/imageUrl/url */}
                  <img
                    src={item.image || item.imageUrl || item.url || '/fotos/1.png'}
                    alt={item.title || 'Galeri Foto'}
                    loading="lazy"
                  />
                  <span className="gallery-badge">
                    <i className="fa-solid fa-camera"></i> Momen Tamu
                  </span>
                </div>
                <div className="gallery-body">
                  <h3>{item.title || 'Dokumentasi Wisata'}</h3>
                  <p>{item.description || 'Dokumentasi perjalanan wisata bersama Dafatih Transport.'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Belum ada foto galeri di dalam database.
          </div>
        )}

        <div ref={observerTarget} style={{ height: '1px' }} />

        {hasMore && (
          <div className="pagination-status-wrapper">
            {isLoadingMore ? (
              <span style={{ color: '#0284c7', fontSize: '0.8rem' }}>Memuat foto galeri...</span>
            ) : (
              <button className="btn-load-more" onClick={loadMoreWithDelay}>
                Tampilkan Lebih Banyak
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Gallery;
