import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Filter Kategori & Form Edit
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    category: 'airport',
    pickup: 'Airport Lombok',
    drop: '',
    price: '',
    priceFormatted: '',
    title: '',
    description: '',
    image: 'http://localhost:5000/images/bandaralombok.jpg',
    badge: '',
    icon: 'fa-plane-arrival'
  });

  // Ambil data rute dari backend
  const fetchRoutes = () => {
    fetch('http://localhost:5000/api/routes')
      .then((res) => res.json())
      .then((data) => {
        setRoutes(data.routes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal memuat data admin:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Handle Input Form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Submit (Edit / PUT)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex === null) return;

    const formattedPrice = `Rp ${Number(form.price).toLocaleString('id-ID')}`;
    const routeData = { ...form, price: Number(form.price), priceFormatted: formattedPrice };

    fetch(`http://localhost:5000/api/routes/${editingIndex}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routeData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        fetchRoutes();
        closeForm();
      })
      .catch((err) => console.error('Gagal memperbarui data:', err));
  };

  // Trigger Tombol Edit
  const handleEditClick = (index) => {
    const targetRoute = routes[index];
    setForm({
      category: targetRoute.category || '',
      pickup: targetRoute.pickup || '',
      drop: targetRoute.drop || '',
      price: targetRoute.price || '',
      priceFormatted: targetRoute.priceFormatted || '',
      title: targetRoute.title || '',
      description: targetRoute.description || '',
      image: targetRoute.image || 'http://localhost:5000/images/bandaralombok.jpg',
      badge: targetRoute.badge || '',
      icon: targetRoute.icon || 'fa-plane-arrival'
    });
    setEditingIndex(index);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Delete
  const handleDelete = (index) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus rute ini?')) {
      fetch(`http://localhost:5000/api/routes/${index}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          fetchRoutes();
        })
        .catch((err) => console.error('Gagal menghapus data:', err));
    }
  };

  // Tutup dan Reset Form
  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingIndex(null);
    setForm({
      category: 'airport',
      pickup: 'Airport Lombok',
      drop: '',
      price: '',
      priceFormatted: '',
      title: '',
      description: '',
      image: 'http://localhost:5000/images/bandaralombok.jpg',
      badge: '',
      icon: 'fa-plane-arrival'
    });
  };

  // Filter rute berdasarkan kategori yang dipilih
  const filteredRoutes = selectedCategory === 'all'
    ? routes
    : routes.filter(r => r.category.toLowerCase() === selectedCategory.toLowerCase());

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Memuat panel admin...</div>;

  return (
    <div className="page-view admin-page-wrapper">
      <style>{`
        .admin-page-wrapper {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: sans-serif;
        }
        /* Header Rata Tengah */
        .admin-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 25px;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 20px;
        }
        .admin-title-area h1 {
          margin: 0 0 5px 0;
          font-size: 26px;
        }
        .admin-title-area p {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 14px;
        }
        /* Tombol Kategori Filter di Tengah */
        .category-filters {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          max-width: 100%;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 10px;
        }
        .filter-btn {
          background: #f1f3f5;
          border: none;
          padding: 7px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
          color: #495057;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: #007bff;
          color: #fff;
        }
        .section-title {
          text-align: center;
          margin: 25px 0 15px 0;
        }
        .form-card {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          border: 1px solid #ddd;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .admin-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 15px;
        }
        .admin-form-grid input,
        .admin-form-grid textarea {
          width: 100%;
          padding: 12px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }
        .full-width {
          grid-column: span 2;
        }
        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 15px;
        }
        .route-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .route-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .route-title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        .route-badge {
          background: #e7f1ff;
          color: #007bff;
          padding: 4px 8px;
          font-size: 11px;
          border-radius: 4px;
          font-weight: 600;
        }
        .route-info {
          font-size: 13px;
          color: #555;
          margin-bottom: 6px;
        }
        .route-price {
          font-size: 15px;
          font-weight: bold;
          color: #28a745;
          margin: 10px 0;
        }
        .card-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          border-top: 1px solid #eee;
          padding-top: 12px;
        }
        .btn-edit {
          flex: 1;
          background: #ffc107;
          color: #000;
          border: none;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 13px;
        }
        .btn-delete {
          flex: 1;
          background: #dc3545;
          color: #fff;
          border: none;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 13px;
        }
        @media (max-width: 768px) {
          .admin-form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
          .admin-page-wrapper {
            padding: 10px;
          }
        }
      `}</style>

      {/* Bagian Header: Judul, Deskripsi, dan Tombol Kategori di Tengah (Center) */}
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Panel Admin</h1>
          <p>Kelola dan edit daftar rute transportasi Dafatih Transport.</p>
        </div>

        {/* Tombol Kategori Filter */}
        <div className="category-filters">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Semua ({routes.length})
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'airport' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('airport')}
          >
            Airport
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'bangsal' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('bangsal')}
          >
            Bangsal
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'senggigi' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('senggigi')}
          >
            Senggigi
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'kuta' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('kuta')}
          >
            Kuta
          </button>
        </div>
      </div>

      {/* Form Input Edit (Hanya muncul saat tombol Edit diklik) */}
      {showForm && (
        <div className="form-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Edit Rute #{editingIndex !== null ? editingIndex + 1 : ''}</h3>
            <button onClick={closeForm} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
          </div>

          <form onSubmit={handleSubmit} className="admin-form-grid">
            <input type="text" name="title" placeholder="Judul" value={form.title} onChange={handleChange} required />
            <input type="text" name="category" placeholder="Kategori" value={form.category} onChange={handleChange} required />
            <input type="text" name="pickup" placeholder="Titik Jemput (Pickup)" value={form.pickup} onChange={handleChange} required />
            <input type="text" name="drop" placeholder="Titik Tujuan (Drop)" value={form.drop} onChange={handleChange} required />
            <input type="number" name="price" placeholder="Harga Angka" value={form.price} onChange={handleChange} required />
            <input type="text" name="badge" placeholder="Badge" value={form.badge} onChange={handleChange} required />
            <textarea name="description" placeholder="Deskripsi singkat..." value={form.description} onChange={handleChange} required className="full-width" rows="3" />

            <div className="full-width" style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                Perbarui Rute
              </button>
              <button type="button" onClick={closeForm} style={{ padding: '12px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar Kartu Data Rute Berdasarkan Filter */}
      <h3 className="section-title">Daftar Rute ({filteredRoutes.length})</h3>
      <div className="cards-container">
        {filteredRoutes.map((r, idx) => {
          const originalIndex = routes.findIndex(item => item === r);

          return (
            <div key={originalIndex} className="route-card">
              <div>
                <div className="route-card-header">
                  <h4 className="route-title">{r.title}</h4>
                  <span className="route-badge">{r.category}</span>
                </div>
                <div className="route-info"><strong>Rute:</strong> {r.pickup} → {r.drop}</div>
                <div className="route-info" style={{ color: '#666', fontSize: '12px' }}>{r.description}</div>
                <div className="route-price">{r.priceFormatted}</div>
              </div>

              <div className="card-actions">
                <button onClick={() => handleEditClick(originalIndex)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(originalIndex)} className="btn-delete">
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Admin;
