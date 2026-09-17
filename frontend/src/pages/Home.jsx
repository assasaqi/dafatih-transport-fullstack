import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // State untuk Data Rute dari Backend
  const [allRoutes, setAllRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk Slideshow Hero Background
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { image: '/images/bandaralombok.jpg' },
    { image: '/images/sembalun.jpg' }
  ];

  // State untuk Filter Kategori Rute dan Paginasi
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Jumlah data per halaman di Beranda

  // 1. Ambil Data Rute dari Backend Node.js
  useEffect(() => {
    fetch('http://localhost:5000/api/routes')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal mengambil data dari server backend');
        }
        return res.json();
      })
      .then((data) => {
        setAllRoutes(data.routes || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching routes:', err);
        setError('Gagal mengambil data dari server backend. Pastikan server aktif.');
        setLoading(false);
      });
  }, []);

  // 2. Efek Slideshow Hero Otomatis (Berganti Setiap 5 Detik)
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // 3. Filter Data Rute Berdasarkan Kategori yang Dipilih
  const filteredRoutes = filter === 'all'
    ? allRoutes
    : allRoutes.filter((r) => r.category === filter);

  // Logika Paginasi
  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoutes = filteredRoutes.slice(indexOfFirstItem, indexOfLastItem);

  // Batasi nomor halaman yang tampil maksimal 3 (Cth: 1, 2, 3)
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + 2);
  if (endPage - startPage < 2) {
    startPage = Math.max(1, endPage - 2);
  }

  // Reset ke halaman 1 saat filter kategori berubah
  const handleFilterChange = (catId) => {
    setFilter(catId);
    setCurrentPage(1);
  };

  // Handler Pilih Rute -> Navigasi ke Halaman Form Pemesanan (/pesan)
  const handleSelectRoute = (route) => {
    navigate('/pesan', {
      state: {
        pickup: route.pickup,
        drop: route.drop,
        price: route.price
      }
    });
  };

    // Tampilan saat data sedang di-load dari Database
  if (loading) {
    return <div className="page-view" style={{ textAlign: 'center', padding: '80px 20px' }}>Memuat data rute perjalanan...</div>;
  }

    // Tampilan saat terjadi eror koneksi/backend
  if (error) {
    return <div className="page-view" style={{ textAlign: 'center', padding: '80px 20px' , color: 'red' }}>{error}</div>;
  }

  return (
    <div className="page-view home-page-wrapper">
      <style>{`
        /* Mode Desktop: Hero Rata Tengah & Luas */
        .hero-content-wrapper {
          text-align: center !important;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Toolbar Kategori Scrollable di Mobile */
        .category-toolbar {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          max-width: 100%;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin: 20px 0;
          padding-bottom: 8px;
          -webkit-overflow-scrolling: touch;
        }
        .category-toolbar::-webkit-scrollbar {
          height: 4px;
        }
        .category-toolbar::-webkit-scrollbar-thumb {
          background: #ced4da;
          border-radius: 4px;
        }

        /* Navigasi Paginasi Ringkas */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin-top: 30px;
          flex-wrap: wrap;
          padding: 0 10px;
        }
        .page-btn {
          background: #f1f3f5;
          border: 1px solid #ced4da;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          color: #333;
          min-width: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .page-btn.active {
          background: var(--primary, #007bff);
          color: #fff;
          border-color: var(--primary, #007bff);
        }
        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Responsif Khusus Mobile */
        @media (max-width: 768px) {
          /* Perkecil Banner Hero agar tidak memenuhi layar */
          .hero {
            min-height: 140px !important;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            margin: 10px 10px 0 10px;
          }
          .hero-content-wrapper {
            text-align: center !important;
            padding: 15px 12px !important;
          }
          .hero-content-wrapper h1 {
            font-size: 1.05rem !important;
            line-height: 1.25 !important;
            margin-bottom: 4px !important;
          }
          .hero-content-wrapper p {
            font-size: 0.75rem !important;
            line-height: 1.2 !important;
            margin: 0 !important;
          }

          /* Perbaikan Ukuran Sub-Section Title di Mobile */
          .sub-section-title {
            text-align: left !important;
            padding: 0 10px;
            margin-bottom: 10px !important;
          }
          .sub-section-title h2 {
            font-size: 1.1rem !important;
            line-height: 1.3 !important;
            margin-bottom: 4px !important;
          }
          .sub-section-title h2 i {
            font-size: 1rem !important;
          }
          .sub-section-title p {
            text-align: left !important;
            font-size: 0.75rem !important;
            line-height: 1.3 !important;
            color: #666;
          }

          .category-toolbar {
            justify-content: flex-start;
            flex-wrap: nowrap;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '380px' }}>
        <div className="hero-bg-slideshow" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${slide.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 1s ease-in-out'
              }}
            />
          ))}
        </div>

        {/* Overlay tipis agar teks selalu terbaca jelas */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1.5 }} />

        <div className="hero-content-wrapper" style={{ position: 'relative', zIndex: 2, color: '#fff' }}>
          <h1>Layanan Antar-Jemput & Transportasi Lombok Terbaik</h1>
          <p>Spesialis antar-jemput bandara, pelabuhan, dan transfer antar destinasi di Pulau Lombok.</p>
        </div>
      </section>

      {/* Filter Rute & Grid Card */}
      <section className="section">
        <div className="sub-section-title" style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2>
            <i className="fa-solid fa-route" style={{ color: 'var(--primary, #007bff)' }}></i> Pilihan Rute Berdasarkan Penjemputan
          </h2>
          <p>Klik tombol kategori di bawah untuk menyaring rute penjemputan yang Anda inginkan.</p>
        </div>

        {/* Tombol Kategori Beranda dengan Desain Toolbar Terpadu */}
        <div className="category-toolbar">
          {[
            { id: 'all', label: 'Semua Rute', icon: 'fa-th-large' },
            { id: 'airport', label: 'Dari Airport', icon: 'fa-plane-arrival' },
            { id: 'bangsal', label: 'Pelabuhan Bangsal', icon: 'fa-ship' },
            { id: 'senggigi', label: 'Senggigi', icon: 'fa-anchor' },
            { id: 'kuta', label: 'Kuta Area', icon: 'fa-umbrella-beach' }
          ].map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
              onClick={() => handleFilterChange(cat.id)}
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              <i className={`fa-solid ${cat.icon}`}></i> <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="tour-cards-grid">
          {currentRoutes.map((route, idx) => (
            <div key={idx} className="tour-card">
              <div className="tour-card-img">
                <img src={route.image} alt={route.drop} loading="lazy" />
                <span className="tour-price-tag">{route.priceFormatted}</span>
              </div>
              <div className="tour-card-body">
                <span className="tour-route-badge">
                  <i className={`fa-solid ${route.icon || 'fa-route'}`}></i> {route.badge}
                </span>
                <h4>{route.title}</h4>
                <p>{route.description}</p>
                <ul className="tour-features">
                  <li><i className="fa-solid fa-check"></i> Max 4 Penumpang + Bagasi</li>
                  <li><i className="fa-solid fa-check"></i> Driver Berpengalaman</li>
                               </ul>
                <button
                  className="btn-select-tariff btn-submit"
                  onClick={() => handleSelectRoute(route)}
                  style={{ marginTop: '15px', width: '100%', borderRadius: 'var(--radius-sm)', padding: '10px' }}
                >
                  <i className="fa-solid fa-car"></i> <span>Pesan Rute Ini</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigasi Paginasi (Maksimal 3 Halaman + Next) */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i).map((number) => (
              <button
                key={number}
                className={`page-btn ${currentPage === number ? 'active' : ''}`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
