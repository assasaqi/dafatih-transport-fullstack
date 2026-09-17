import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('routes');

  // ==========================================
  // HELPER UPLOAD GAMBAR (BASE64)
  // ==========================================
  const handleFileUpload = (e, setFormState) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({
          ...prev,
          image: reader.result,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ==========================================
  // STATE & FUNGSI RUTE TRANSPORTASI
  // ==========================================
  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [selectedRouteCategory, setSelectedRouteCategory] = useState('all');
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [routeForm, setRouteForm] = useState({
    category: 'airport',
    pickup: 'Airport Lombok',
    drop: '',
    price: '',
    priceFormatted: '',
    title: '',
    description: '',
    image: '',
    badge: '',
    icon: 'fa-plane-arrival'
  });

  const fetchRoutes = () => {
    fetch('http://localhost:5000/api/routes')
      .then((res) => res.json())
      .then((data) => {
        setRoutes(Array.isArray(data) ? data : data.routes || []);
        setRoutesLoading(false);
      })
      .catch((err) => {
        console.error('Gagal memuat rute:', err);
        setRoutesLoading(false);
      });
  };

  const handleRouteSubmit = (e) => {
    e.preventDefault();
    const formattedPrice = `Rp ${Number(routeForm.price).toLocaleString('id-ID')}`;
    const payload = {
      ...routeForm,
      price: Number(routeForm.price),
      priceFormatted: formattedPrice,
      badge: routeForm.badge || `${routeForm.category.toUpperCase()} - ${routeForm.drop}`
    };

    const isEdit = editingRouteId !== null;
    const url = isEdit
      ? `http://localhost:5000/api/routes/${editingRouteId}`
      : 'http://localhost:5000/api/routes';
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal menyimpan data rute');
        return data;
      })
      .then((data) => {
        alert(data.message || 'Berhasil menyimpan rute!');
        fetchRoutes();
        closeRouteForm();
      })
      .catch((err) => alert(err.message));
  };

  const handleEditRoute = (route) => {
    setRouteForm({
      category: route.category || 'airport',
      pickup: route.pickup || '',
      drop: route.drop || '',
      price: route.price || '',
      priceFormatted: route.priceFormatted || '',
      title: route.title || '',
      description: route.description || '',
      image: route.image || '',
      badge: route.badge || '',
      icon: route.icon || 'fa-plane-arrival'
    });
    setEditingRouteId(route.id);
    setShowRouteForm(true);
  };

  const handleDeleteRoute = (id) => {
    if (window.confirm('Yakin ingin menghapus rute ini dari database?')) {
      fetch(`http://localhost:5000/api/routes/${id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || 'Rute berhasil dihapus!');
          fetchRoutes();
        })
        .catch((err) => console.error('Gagal menghapus rute:', err));
    }
  };

  const closeRouteForm = () => {
    setShowRouteForm(false);
    setEditingRouteId(null);
    setRouteForm({
      category: 'airport',
      pickup: 'Airport Lombok',
      drop: '',
      price: '',
      priceFormatted: '',
      title: '',
      description: '',
      image: '',
      badge: '',
      icon: 'fa-plane-arrival'
    });
  };

  // ==========================================
  // STATE & FUNGSI GALERI DOKUMENTASI
  // ==========================================
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Armada',
    imageUrl: '',
    description: ''
  });

  const fetchPhotos = () => {
    fetch('http://localhost:5000/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        setPhotos(Array.isArray(data) ? data : []);
        setPhotosLoading(false);
      })
      .catch((err) => {
        console.error('Gagal memuat galeri:', err);
        setPhotosLoading(false);
      });
  };

  const handleGallerySubmit = (e) => {
    e.preventDefault();

    if (!galleryForm.title || !galleryForm.imageUrl) {
      alert('Judul dan Gambar wajib diisi!');
      return;
    }

    const isEdit = editingPhotoId !== null;
    const url = isEdit
      ? `http://localhost:5000/api/gallery/${editingPhotoId}`
      : 'http://localhost:5000/api/gallery';
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(galleryForm),
    })
      .then(async (res) => {
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Server mengembalikan respon HTML (Status ${res.status}). Pastikan backend aktif.`);
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal menyimpan foto');
        return data;
      })
      .then((data) => {
        alert(data.message || 'Berhasil menyimpan foto galeri!');
        fetchPhotos();
        closeGalleryForm();
      })
      .catch((err) => alert(`Gagal menyimpan: ${err.message}`));
  };

  const handleEditPhoto = (photo) => {
    setGalleryForm({
      title: photo.title || '',
      category: photo.category || 'Armada',
      imageUrl: photo.imageUrl || '',
      description: photo.description || ''
    });
    setEditingPhotoId(photo.id);
    setShowGalleryForm(true);
  };

  const handleDeletePhoto = (id) => {
    if (window.confirm('Yakin ingin menghapus foto dokumentasi ini?')) {
      fetch(`http://localhost:5000/api/gallery/${id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || 'Foto berhasil dihapus!');
          fetchPhotos();
        })
        .catch((err) => console.error('Gagal menghapus foto:', err));
    }
  };

  const closeGalleryForm = () => {
    setShowGalleryForm(false);
    setEditingPhotoId(null);
    setGalleryForm({
      title: '',
      category: 'Armada',
      imageUrl: '',
      description: ''
    });
  };

  // ==========================================
  // STATE & FUNGSI BLOG / ARTIKEL
  // ==========================================
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Tips Travel',
    image: '',
    content: '',
    snippet: '',
    author: 'Admin Dafatih'
  });

  const fetchBlogs = () => {
    fetch('http://localhost:5000/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        setBlogs(Array.isArray(data) ? data : []);
        setBlogsLoading(false);
      })
      .catch((err) => {
        console.error('Gagal memuat blog:', err);
        setBlogsLoading(false);
      });
  };

  const handleBlogSubmit = (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content || !blogForm.image) {
      alert('Judul, Gambar, dan Isi Konten wajib diisi!');
      return;
    }

    const isEdit = editingBlogId !== null;
    const url = isEdit
      ? `http://localhost:5000/api/blogs/${editingBlogId}`
      : 'http://localhost:5000/api/blogs';
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogForm),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal menyimpan artikel blog');
        return data;
      })
      .then((data) => {
        alert(data.message || 'Berhasil menyimpan artikel!');
        fetchBlogs();
        closeBlogForm();
      })
      .catch((err) => alert(`Gagal menyimpan: ${err.message}`));
  };

  const handleEditBlog = (blog) => {
    setBlogForm({
      title: blog.title || '',
      category: blog.category || 'Tips Travel',
      image: blog.image || '',
      content: blog.content || '',
      snippet: blog.snippet || '',
      author: blog.author || 'Admin Dafatih'
    });
    setEditingBlogId(blog.id);
    setShowBlogForm(true);
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm('Yakin ingin menghapus artikel blog ini?')) {
      fetch(`http://localhost:5000/api/blogs/${id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || 'Artikel berhasil dihapus!');
          fetchBlogs();
        })
        .catch((err) => console.error('Gagal menghapus artikel:', err));
    }
  };

  const closeBlogForm = () => {
    setShowBlogForm(false);
    setEditingBlogId(null);
    setBlogForm({
      title: '',
      category: 'Tips Travel',
      image: '',
      content: '',
      snippet: '',
      author: 'Admin Dafatih'
    });
  };

  useEffect(() => {
    fetchRoutes();
    fetchPhotos();
    fetchBlogs();
  }, []);

  const filteredRoutes = selectedRouteCategory === 'all'
    ? routes
    : routes.filter((r) => (r.category || '').toLowerCase() === selectedRouteCategory.toLowerCase());

  return (
    <div className="admin-layout-container">
      <style>{`
        .admin-layout-container {
          display: flex;
          min-height: 85vh;
          font-family: sans-serif;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e0e0e0;
          margin-top: 10px;
        }

        /* Sidebar Navigasi */
        .admin-sidebar {
          width: 240px;
          background: #f8f9fa;
          border-right: 1px solid #eaeaea;
          padding: 20px 15px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .sidebar-brand {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 25px;
          color: #333;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 1px solid #eaeaea;
        }
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sidebar-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border: none;
          background: transparent;
          color: #495057;
          font-size: 13px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .sidebar-btn:hover {
          background: #e9ecef;
          color: #007bff;
        }
        .sidebar-btn.active {
          background: #007bff;
          color: #fff;
        }

        /* Area Konten Utama */
        .admin-main-content {
          flex-grow: 1;
          padding: 25px;
          background: #fff;
          overflow-y: auto;
        }
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 15px;
          gap: 15px;
        }
        .content-header h2 {
          margin: 0;
          font-size: 22px;
          color: #333;
        }

        /* ==========================================
           DESAIN POPUP MODAL (OVERLAY)
           ========================================== */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 15px;
          box-sizing: border-box;
        }
        .modal-card {
          background: #fff;
          width: 100%;
          max-width: 550px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          position: relative;
        }

        .admin-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 15px;
        }
        .admin-form-grid input,
        .admin-form-grid select,
        .admin-form-grid textarea {
          width: 100%;
          padding: 10px 12px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
        }
        .admin-form-grid input:focus,
        .admin-form-grid select:focus,
        .admin-form-grid textarea:focus {
          border-color: #007bff;
        }
        .full-width {
          grid-column: span 2;
        }

        /* Box Upload & Preview Ringkas */
        .image-upload-box {
          border: 1px dashed #007bff;
          padding: 10px;
          border-radius: 6px;
          background: #e7f1ff;
          text-align: center;
        }
        .image-preview-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
        }
        .image-preview {
          width: 80px;
          height: 55px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        /* Kartu Data Thumbnail Kecil */
        .card-thumbnail {
          width: 100%;
          height: 90px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 8px;
        }

        /* Filter Toolbar */
        .filter-toolbar {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 5px;
          -webkit-overflow-scrolling: touch;
        }
        .filter-btn {
          background: #f1f3f5;
          border: none;
          padding: 6px 14px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          color: #495057;
          white-space: nowrap;
        }
        .filter-btn.active {
          background: #007bff;
          color: #fff;
        }

        /* Grid Kartu Data */
        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 15px;
        }
        .item-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 2px 4px rgba(0,0,0,0.03);
        }
        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          border-top: 1px solid #eee;
          padding-top: 8px;
        }
        .btn-edit {
          flex: 1;
          background: #ffc107;
          color: #000;
          border: none;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
        }
        .btn-delete {
          flex: 1;
          background: #dc3545;
          color: #fff;
          border: none;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
        }
        .btn-add-primary {
          background: #28a745;
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          font-size: 13px;
          white-space: nowrap;
        }

        /* RESPONSIF MOBILE */
        @media (max-width: 768px) {
          .admin-layout-container {
            flex-direction: column;
            border-radius: 0;
            border: none;
            margin-top: 0;
          }
          .admin-sidebar {
            width: 100%;
            padding: 12px;
            border-right: none;
            border-bottom: 1px solid #eaeaea;
            box-sizing: border-box;
          }
          .sidebar-brand {
            margin-bottom: 10px;
            padding-bottom: 8px;
            font-size: 16px;
          }
          .sidebar-menu {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }
          .sidebar-btn {
            padding: 8px 12px;
            font-size: 12px;
          }
          .admin-main-content {
            padding: 15px;
          }
          .content-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .content-header h2 {
            font-size: 18px;
          }
          .btn-add-primary {
            width: 100%;
            text-align: center;
            padding: 10px;
          }
          .admin-form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
          .cards-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <i className="fa-solid fa-user-gear" style={{ color: '#007bff' }}></i> Panel Admin
        </div>
        <div className="sidebar-menu">
          <button
            className={`sidebar-btn ${activeTab === 'routes' ? 'active' : ''}`}
            onClick={() => { setActiveTab('routes'); closeRouteForm(); }}
          >
            <i className="fa-solid fa-route"></i> Rute & Tarif
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => { setActiveTab('gallery'); closeGalleryForm(); }}
          >
            <i className="fa-solid fa-images"></i> Galeri Dokumentasi
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => { setActiveTab('blog'); closeBlogForm(); }}
          >
            <i className="fa-solid fa-newspaper"></i> Blog & Artikel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">

        {/* ========================================================= */}
        {/* TAB 1: KELOLA RUTE TRANSPORTASI                            */}
        {/* ========================================================= */}
        {activeTab === 'routes' && (
          <div>
            <div className="content-header">
              <h2>Kelola Rute & Tarif Transportasi</h2>
              <button className="btn-add-primary" onClick={() => { closeRouteForm(); setShowRouteForm(true); }}>
                + Tambah Rute Baru
              </button>
            </div>

            {/* POPUP MODAL FORM RUTE */}
            {showRouteForm && (
              <div className="modal-backdrop" onClick={closeRouteForm}>
                <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{editingRouteId !== null ? `Edit Rute #${editingRouteId}` : 'Tambah Rute Baru'}</h3>
                    <button onClick={closeRouteForm} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
                  </div>

                  <form onSubmit={handleRouteSubmit} className="admin-form-grid">
                    <input type="text" placeholder="Judul Rute" value={routeForm.title} onChange={(e) => setRouteForm({ ...routeForm, title: e.target.value })} required />
                    <select value={routeForm.category} onChange={(e) => setRouteForm({ ...routeForm, category: e.target.value })} required>
                      <option value="airport">airport</option>
                      <option value="bangsal">bangsal</option>
                      <option value="senggigi">senggigi</option>
                      <option value="kuta">kuta</option>
                    </select>
                    <input type="text" placeholder="Titik Jemput (Pickup)" value={routeForm.pickup} onChange={(e) => setRouteForm({ ...routeForm, pickup: e.target.value })} required />
                    <input type="text" placeholder="Titik Tujuan (Drop)" value={routeForm.drop} onChange={(e) => setRouteForm({ ...routeForm, drop: e.target.value })} required />
                    <input type="number" placeholder="Harga (misal: 250000)" value={routeForm.price} onChange={(e) => setRouteForm({ ...routeForm, price: e.target.value })} required />
                    <input type="text" placeholder="Badge (Opsional)" value={routeForm.badge} onChange={(e) => setRouteForm({ ...routeForm, badge: e.target.value })} />

                    <div className="full-width">
                      <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Upload Gambar Rute:</label>
                      <div className="image-upload-box">
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setRouteForm)} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }} />
                      </div>
                      {routeForm.image && (
                        <div className="image-preview-container">
                          <img src={routeForm.image} alt="Preview Rute" className="image-preview" />
                          <span style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>✓ Gambar terpilih</span>
                        </div>
                      )}
                    </div>

                    <textarea placeholder="Deskripsi Rute..." value={routeForm.description} onChange={(e) => setRouteForm({ ...routeForm, description: e.target.value })} required className="full-width" rows="3" />

                    <div className="full-width" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="submit" style={{ flex: 1, padding: '10px', background: editingRouteId !== null ? '#ffc107' : '#28a745', color: editingRouteId !== null ? '#000' : '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {editingRouteId !== null ? 'Perbarui Rute' : 'Simpan Rute'}
                      </button>
                      <button type="button" onClick={closeRouteForm} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Batal</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Filter Toolbar */}
            <div className="filter-toolbar">
              {['all', 'airport', 'bangsal', 'senggigi', 'kuta'].map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${selectedRouteCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedRouteCategory(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* List Cards Rute */}
            {routesLoading ? <p>Memuat rute...</p> : (
              <div className="cards-container">
                {filteredRoutes.map((r) => (
                  <div key={r.id} className="item-card">
                    <div>
                      {r.image && (
                        <img src={r.image} alt={r.title} className="card-thumbnail" onError={(e) => { e.target.style.display = 'none'; }} />
                      )}
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{r.title}</h4>
                      <span style={{ fontSize: '10px', background: '#e7f1ff', color: '#007bff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{r.category}</span>
                      <p style={{ fontSize: '12px', margin: '6px 0 2px 0', color: '#555' }}><strong>Rute:</strong> {r.pickup} → {r.drop}</p>
                      <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#28a745', margin: '4px 0' }}>{r.priceFormatted || `Rp ${r.price}`}</p>
                    </div>
                    <div className="card-actions">
                      <button onClick={() => handleEditRoute(r)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDeleteRoute(r.id)} className="btn-delete">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: KELOLA GALERI DOKUMENTASI                          */}
        {/* ========================================================= */}
        {activeTab === 'gallery' && (
          <div>
            <div className="content-header">
              <h2>Kelola Galeri Dokumentasi</h2>
              <button className="btn-add-primary" onClick={() => { closeGalleryForm(); setShowGalleryForm(true); }}>
                + Tambah Foto Galeri
              </button>
            </div>

            {/* POPUP MODAL FORM GALERI */}
            {showGalleryForm && (
              <div className="modal-backdrop" onClick={closeGalleryForm}>
                <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{editingPhotoId !== null ? `Edit Foto #${editingPhotoId}` : 'Tambah Foto Galeri'}</h3>
                    <button onClick={closeGalleryForm} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
                  </div>

                  <form onSubmit={handleGallerySubmit} className="admin-form-grid">
                    <input
                      type="text"
                      placeholder="Judul/Keterangan Foto"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      required
                    />
                    <select
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      required
                    >
                      <option value="Armada">Armada</option>
                      <option value="Pelanggan">Pelanggan</option>
                      <option value="Destinasi">Destinasi</option>
                    </select>

                    <div className="full-width">
                      <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Upload File Foto:</label>
                      <div className="image-upload-box">
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setGalleryForm)} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }} />
                      </div>
                      {galleryForm.imageUrl && (
                        <div className="image-preview-container">
                          <img src={galleryForm.imageUrl} alt="Preview Galeri" className="image-preview" />
                          <span style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>✓ Gambar terpilih</span>
                        </div>
                      )}
                    </div>

                    <textarea
                      placeholder="Deskripsi tambahan (opsional)..."
                      value={galleryForm.description}
                      onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                      className="full-width"
                      rows="3"
                    />

                    <div className="full-width" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="submit" style={{ flex: 1, padding: '10px', background: editingPhotoId !== null ? '#ffc107' : '#28a745', color: editingPhotoId !== null ? '#000' : '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {editingPhotoId !== null ? 'Perbarui Foto' : 'Simpan Foto'}
                      </button>
                      <button type="button" onClick={closeGalleryForm} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Batal</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* List Cards Galeri */}
            {photosLoading ? <p>Memuat galeri...</p> : (
              <div className="cards-container">
                {photos.length === 0 ? (
                  <p style={{ color: '#666' }}>Belum ada foto galeri tersimpan di database.</p>
                ) : (
                  photos.map((photo) => (
                    <div key={photo.id} className="item-card">
                      <div>
                        {photo.imageUrl && (
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="card-thumbnail"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{photo.title}</h4>
                        <span style={{ fontSize: '10px', background: '#e7f1ff', color: '#007bff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{photo.category}</span>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>{photo.description || 'Tidak ada deskripsi'}</p>
                      </div>
                      <div className="card-actions">
                        <button onClick={() => handleEditPhoto(photo)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDeletePhoto(photo.id)} className="btn-delete">Hapus</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: KELOLA BLOG / ARTIKEL                              */}
        {/* ========================================================= */}
        {activeTab === 'blog' && (
          <div>
            <div className="content-header">
              <h2>Kelola Blog & Artikel</h2>
              <button className="btn-add-primary" onClick={() => { closeBlogForm(); setShowBlogForm(true); }}>
                + Tambah Artikel Baru
              </button>
            </div>

            {/* POPUP MODAL FORM BLOG */}
            {showBlogForm && (
              <div className="modal-backdrop" onClick={closeBlogForm}>
                <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{editingBlogId !== null ? `Edit Artikel #${editingBlogId}` : 'Tambah Artikel Baru'}</h3>
                    <button onClick={closeBlogForm} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
                  </div>

                  <form onSubmit={handleBlogSubmit} className="admin-form-grid">
                    <input
                      type="text"
                      placeholder="Judul Artikel Blog"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      required
                    />
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      required
                    >
                      <option value="Tips Travel">Tips Travel</option>
                      <option value="Destinasi Wisata">Destinasi Wisata</option>
                      <option value="Info Layanan">Info Layanan</option>
                      <option value="Berita Transportasi">Berita Transportasi</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Penulis (Author)"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    />

                    <input
                      type="text"
                      placeholder="Ringkasan Singkat (Snippet)"
                      value={blogForm.snippet}
                      onChange={(e) => setBlogForm({ ...blogForm, snippet: e.target.value })}
                    />

                    <div className="full-width">
                      <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Upload Gambar Sampul:</label>
                      <div className="image-upload-box">
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setBlogForm)} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }} />
                      </div>
                      {blogForm.image && (
                        <div className="image-preview-container">
                          <img src={blogForm.image} alt="Preview Blog" className="image-preview" />
                          <span style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>✓ Gambar terpilih</span>
                        </div>
                      )}
                    </div>

                    <textarea
                      placeholder="Tuliskan isi lengkap artikel blog di sini..."
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      required
                      className="full-width"
                      rows="5"
                    />

                    <div className="full-width" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="submit" style={{ flex: 1, padding: '10px', background: editingBlogId !== null ? '#ffc107' : '#28a745', color: editingBlogId !== null ? '#000' : '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {editingBlogId !== null ? 'Perbarui Artikel' : 'Terbitkan Artikel'}
                      </button>
                      <button type="button" onClick={closeBlogForm} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Batal</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* List Cards Blog */}
            {blogsLoading ? <p>Memuat artikel blog...</p> : (
              <div className="cards-container">
                {blogs.length === 0 ? (
                  <p style={{ color: '#666' }}>Belum ada artikel blog tersimpan di database.</p>
                ) : (
                  blogs.map((blog) => (
                    <div key={blog.id} className="item-card">
                      <div>
                        {blog.image && (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="card-thumbnail"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{blog.title}</h4>
                        <span style={{ fontSize: '10px', background: '#e7f1ff', color: '#007bff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{blog.category}</span>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>{blog.snippet || (blog.content && blog.content.substring(0, 70) + '...')}</p>
                      </div>
                      <div className="card-actions">
                        <button onClick={() => handleEditBlog(blog)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDeleteBlog(blog.id)} className="btn-delete">Hapus</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
