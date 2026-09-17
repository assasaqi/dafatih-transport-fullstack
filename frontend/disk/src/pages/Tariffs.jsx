import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Tariffs = () => {
  const navigate = useNavigate();

  // State untuk Data Tarif, Filter, Pencarian, & Paginasi
  const [tariffCategories, setTariffCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil Data Tarif dari Backend Node.js
  useEffect(() => {
    fetch('http://localhost:5000/api/tariffs')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal mengambil data tarif dari server backend');
        }
        return res.json();
      })
      .then((data) => {
        setTariffCategories(data.tariffCategories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tariffs:', err);
        setError('Gagal memuat daftar tarif dari server. Pastikan backend sudah aktif.');
        setLoading(false);
      });
  }, []);

  const handleSelectTariff = (pickupPoint, dropPoint, routePrice) => {
    navigate('/pesan', {
      state: {
        pickup: pickupPoint,
        drop: dropPoint,
        price: routePrice
      }
    });
  };

  // Helper untuk menentukan icon FontAwesome berdasarkan kategori
  const getCategoryIcon = (categoryId) => {
    switch (categoryId.toLowerCase()) {
      case 'airport':
        return 'fa-plane-arrival';
      case 'bangsal':
        return 'fa-ship';
      case 'senggigi':
        return 'fa-anchor';
      case 'kuta':
        return 'fa-umbrella-beach';
      default:
        return 'fa-car';
    }
  };

  // Gabungkan semua rute dari seluruh kategori
  const allRoutes = tariffCategories.flatMap((cat) => {
    return cat.routes.map((r) => ({
      ...r,
      categoryTitle: cat.title,
      categoryId: cat.id,
      pickupPoint: r.pickup || cat.pickup,
      icon: getCategoryIcon(cat.id)
    }));
  });

  // Filter rute berdasarkan kategori dan kata kunci pencarian
  const filteredRoutes = allRoutes.filter((r) => {
    const matchCategory = selectedCategory === 'all' || r.categoryId.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = r.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.pickupPoint.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Logika Paginasi
  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoutes = filteredRoutes.slice(indexOfFirstItem, indexOfLastItem);

  // Batasi nomor halaman yang tampil maksimal 3
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + 2);
  if (endPage - startPage < 2) {
    startPage = Math.max(1, endPage - 2);
  }

  // Reset ke halaman 1 saat kategori atau pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  if (loading) {
    return <div className="tariffs-page-container" style={{ textAlign: 'center', padding: '80px' }}>Memuat daftar tarif transportasi...</div>;
  }

  if (error) {
    return <div className="tariffs-page-container" style={{ textAlign: 'center', padding: '80px', color: 'red' }}>{error}</div>;
  }

  return (
    <div className="tariffs-page-container">
      <style>{`
        .tariffs-page-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: sans-serif;
          min-height: 80vh;
        }
        .tariffs-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 25px;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 20px;
        }
        .tariffs-header h1 {
          margin: 0 0 8px 0;
          font-size: 26px;
          color: #333;
        }
        .tariffs-header p {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 14px;
          max-width: 600px;
        }
        /* Toolbar Sejajar & Bisa Scroll Horizontal di Mobile */
        .filter-toolbar {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          max-width: 100%;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: nowrap;
          margin-top: 10px;
          padding-bottom: 8px;
          width: 100%;
          -webkit-overflow-scrolling: touch;
        }
        .filter-toolbar::-webkit-scrollbar {
          height: 4px;
        }
        .filter-toolbar::-webkit-scrollbar-thumb {
          background: #ced4da;
          border-radius: 4px;
        }
        /* Kotak Pencarian yang Kecil & Sejajar */
        .search-box-small {
          padding: 7px 14px;
          border: 1px solid #ced4da;
          border-radius: 20px;
          font-size: 12px;
          outline: none;
          width: 160px;
          flex-shrink: 0;
          background: #fff;
          transition: border-color 0.2s;
        }
        .search-box-small:focus {
          border-color: var(--primary, #007bff);
        }
        /* Tombol Kategori Filter */
        .filter-btn {
          background: #f1f3f5;
          border: none;
          padding: 7px 14px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
          color: #495057;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .filter-btn.active {
          background: var(--primary, #007bff);
          color: #fff;
        }
        /* Card Grid Layout */
        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .tariff-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .tariff-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }
        .tariff-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .destination-title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        .category-icon {
          color: var(--primary, #007bff);
          font-size: 18px;
          background: #e7f1ff;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .tariff-info {
          font-size: 13px;
          color: #555;
          margin-bottom: 6px;
        }
        .tariff-price {
          font-size: 16px;
          font-weight: bold;
          color: #28a745;
          margin: 12px 0;
        }
        .btn-pesan {
          width: 100%;
          background: var(--primary, #007bff);
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
        }
        .btn-pesan:hover {
          opacity: 0.9;
        }
        /* Navigasi Paginasi Ringkas (Maks 3 Halaman) */
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

        /* Responsif Khusus Mobile: Header Rata Kiri */
        @media (max-width: 768px) {
          .tariffs-page-container {
            padding: 10px;
          }
          .tariffs-header {
            align-items: flex-start;
            text-align: left;
          }
          .tariffs-header p {
            max-width: 100%;
          }
        }
      `}</style>

      {/* Bagian Header */}
      <div className="tariffs-header">
        <h1>Tarif Transportasi & Drop Off</h1>
        <p>Cari atau pilih kategori penjemputan di bawah untuk menemukan rute perjalanan nyaman Anda.</p>

        {/* Toolbar Pencarian & Kategori Sejajar & Scrollable di Mobile */}
        <div className="filter-toolbar">
          <input
            type="text"
            className="search-box-small"
            placeholder="🔍 Cari tujuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <i className="fa-solid fa-list"></i> Semua ({allRoutes.length})
          </button>

          {tariffCategories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <i className={`fa-solid ${cat.icon}`}></i> {cat.title.replace('Tarif dari ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Kartu Tarif */}
      {currentRoutes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Tidak ada rute tarif yang ditemukan.
        </div>
      ) : (
        <div className="cards-container">
          {currentRoutes.map((r, idx) => (
            <div key={idx} className="tariff-card">
              <div>
                <div className="tariff-card-header">
                  <h3 className="destination-title">{r.destination}</h3>
                  <div className="category-icon" title={r.categoryTitle}>
                    <i className={`fa-solid ${r.icon}`}></i>
                  </div>
                </div>
                <div className="tariff-info"><strong>Jemput:</strong> {r.pickupPoint}</div>
                <div className="tariff-price">{r.priceFormatted}</div>
              </div>

              <button
                className="btn-pesan"
                onClick={() => handleSelectTariff(r.pickupPoint, r.destination, r.price)}
              >
                <i className="fa-solid fa-car"></i> Pesan Sekarang
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigasi Paginasi */}
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
    </div>
  );
};

export default Tariffs;
