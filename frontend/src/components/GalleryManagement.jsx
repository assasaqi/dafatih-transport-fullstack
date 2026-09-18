import React, { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';
import Pagination from './Pagination';
import './Admin.css';

const GalleryManagement = ({ handleFileUpload }) => {
    // ==========================================
    // STATE DATA, FORM, MODAL, SEARCH & PAGINATION
    // ==========================================
    const [gallery, setGallery] = useState([]);
    const [galleryLoading, setGalleryLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // State untuk kontrol Dropdown Detail tiap Card
    const [expandedCardIds, setExpandedCardIds] = useState({});

    // State Search & Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // State Confirm Modal
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        targetId: null
    });

    const initialFormState = {
        title: '',
        category: 'armada',
        image: '',
        description: ''
    };

    const [formState, setFormState] = useState(initialFormState);

    // Toggle Buka/Tutup Dropdown Detail Card
    const toggleCardDetail = (id) => {
        setExpandedCardIds((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Reset ke halaman 1 saat pencarian/filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    // ==========================================
    // FETCH DATA GALERI DARI API
    // ==========================================
    const fetchGallery = () => {
        setGalleryLoading(true);
        fetch('http://localhost:5000/api/gallery')
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || `Gagal memuat data (Status ${res.status})`);
                }
                return res.json();
            })
            .then((data) => {
                setGallery(Array.isArray(data) ? data : data.gallery || []);
                setGalleryLoading(false);
            })
            .catch((err) => {
                console.error('Gagal memuat galeri:', err.message);
                setGalleryLoading(false);
            });
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    // ==========================================
    // HANDLER FORM (SUBMIT, EDIT, CLOSE)
    // ==========================================
    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormState(initialFormState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            title: formState.title ? formState.title.trim() : '',
            category: formState.category || 'armada',
            image: formState.image || '',
            description: formState.description ? formState.description.trim() : ''
        };

        const isEdit = editingId !== null;
        const url = isEdit
            ? `http://localhost:5000/api/gallery/${editingId}`
            : 'http://localhost:5000/api/gallery';
        const method = isEdit ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.error || 'Gagal menyimpan item galeri');
                return data;
            })
            .then((data) => {
                alert(data.message || 'Berhasil menyimpan item galeri!');
                fetchGallery();
                closeForm();
            })
            .catch((err) => alert(`Gagal menyimpan: ${err.message}`));
    };

    const handleEdit = (item) => {
        setFormState({
            title: item.title || '',
            category: item.category || 'armada',
            image: item.image || item.imageUrl || '',
            description: item.description || ''
        });
        setEditingId(item.id || item._id);
        setShowForm(true);
    };

    // ==========================================
    // HANDLER HAPUS DENGAN CONFIRM MODAL
    // ==========================================
    const openDeleteModal = (id) => {
        setDeleteModal({
            isOpen: true,
            targetId: id
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            targetId: null
        });
    };

    const handleConfirmDelete = () => {
        const id = deleteModal.targetId;
        if (!id) return;

        fetch(`http://localhost:5000/api/gallery/${id}`, { method: 'DELETE' })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.error || 'Gagal menghapus galeri');
                return data;
            })
            .then((data) => {
                alert(data.message || 'Item galeri berhasil dihapus!');
                fetchGallery();
            })
            .catch((err) => alert(`Error: ${err.message}`))
            .finally(() => {
                closeDeleteModal();
            });
    };

    // ==========================================
    // LOGIKA FILTER PENCARIAN & PAGINATION
    // ==========================================
    const filteredGallery = gallery.filter((item) => {
        const matchesCategory = selectedCategory === 'all' ||
            (item.category || '').toLowerCase() === selectedCategory.toLowerCase();

        const q = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.description && item.description.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filteredGallery.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredGallery.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            {/* Header Konten & Tombol Tambah */}
            <div className="content-header">
                <h2>Kelola Galeri Dokumentasi</h2>
                <button
                    className="btn-add-primary"
                    onClick={() => { closeForm(); setShowForm(true); }}
                >
                    + Tambah Foto Galeri
                </button>
            </div>

            {/* MODAL FORM TAMBAH / EDIT GALERI */}
            {showForm && (
                <div className="modal-backdrop" onClick={closeForm}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingId !== null ? `Edit Galeri #${editingId}` : 'Tambah Foto Baru'}</h3>
                            <button className="btn-close-modal" onClick={closeForm}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="admin-form-grid">
                            <input
                                type="text"
                                placeholder="Judul Foto / Dokumentasi"
                                value={formState.title}
                                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                                required
                                className="full-width"
                            />

                            <select
                                value={formState.category}
                                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                                required
                                className="full-width"
                            >
                                <option value="armada">Armada / Kendaraan</option>
                                <option value="destinasi">Destinasi Wisata</option>
                                <option value="testimoni">Testimoni Pelanggan</option>
                                <option value="kegiatan">Kegiatan & Trip</option>
                            </select>

                            <textarea
                                placeholder="Deskripsi Keterangan Foto..."
                                value={formState.description}
                                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                                className="full-width"
                                rows="3"
                            />

                            <div className="full-width">
                                <label className="form-label">Upload Gambar Galeri:</label>
                                <div className="image-upload-box">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="file-input"
                                        onChange={(e) => handleFileUpload && handleFileUpload(e, setFormState)}
                                    />
                                </div>
                                {formState.image && (
                                    <div className="image-preview-container">
                                        <img src={formState.image} alt="Preview Galeri" className="image-preview" />
                                        <span className="upload-success-badge">✓ Gambar terpilih</span>
                                    </div>
                                )}
                            </div>

                            <div className="full-width form-actions">
                                <button
                                    type="submit"
                                    className={editingId !== null ? "btn-submit-update" : "btn-submit-save"}
                                >
                                    {editingId !== null ? 'Perbarui Foto' : 'Simpan Foto'}
                                </button>
                                <button type="button" onClick={closeForm} className="btn-cancel">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TOOLBAR FILTER CATEGORY & SEARCH BAR */}
            <div className="toolbar-container">
                <div className="filter-toolbar" style={{ marginBottom: 0 }}>
                    {['all', 'armada', 'destinasi', 'testimoni', 'kegiatan'].map((cat) => (
                        <button
                            key={cat}
                            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="search-input-box">
                    <input
                        type="text"
                        placeholder="Cari foto galeri..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* LIST KARTU DATA GALERI DENGAN DROPDOWN DETAIL */}
            {galleryLoading ? (
                <p className="empty-text">Memuat foto galeri...</p>
            ) : (
                <div className="cards-container">
                    {currentItems.length === 0 ? (
                        <p className="empty-text">Data galeri tidak ditemukan.</p>
                    ) : (
                        currentItems.map((item) => {
                            const itemKey = item.id || item._id;
                            const isExpanded = !!expandedCardIds[itemKey];

                            return (
                                <div key={itemKey} className={`item-card-wrapper ${isExpanded ? 'is-open' : ''}`}>
                                    {/* BARIS UTAMA (HORIZONTAL SLIM) */}
                                    <div className="item-card">
                                        {/* 1. THUMBNAIL GAMBAR */}
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="card-thumbnail"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        )}

                                        {/* 2. INFORMASI RINGKAS SEJAJAR */}
                                        <div className="card-main-info">
                                            <span className="card-category-badge">{item.category}</span>
                                            <h4 className="card-title">{item.title}</h4>
                                        </div>

                                        {/* 3. TOMBOL AKSI & DROPDOWN */}
                                        <div className="card-actions">
                                            <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
                                            <button onClick={() => openDeleteModal(itemKey)} className="btn-delete">Hapus</button>
                                            <button
                                                onClick={() => toggleCardDetail(itemKey)}
                                                className={`btn-dropdown-toggle ${isExpanded ? 'active' : ''}`}
                                            >
                                                {isExpanded ? 'Detail' : 'Detail'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* PANEL DROPDOWN DETAIL KETIKA DIBUKA */}
                                    {isExpanded && (
                                        <div className="card-detail-dropdown">
                                            <div className="detail-row">
                                                {/* <div className="detail-item">
                                                    <strong>ID Galeri:</strong>
                                                    <span>#{itemKey}</span>
                                                </div> */}
                                                <div className="detail-item">
                                                    <strong>Kategori:</strong>
                                                    <span>{item.category || '-'}</span>
                                                </div>
                                            </div>

                                            <div className="full-width-detail">
                                                <strong>Deskripsi Foto:</strong>
                                                <p>{item.description || 'Tidak ada deskripsi tambahan.'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* KOMPONEN PAGINATION */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />

            {/* MODAL KONFIRMASI HAPUS KUSTOM */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Hapus Galeri"
                message="Apakah Anda yakin ingin menghapus foto galeri ini?"
                onConfirm={handleConfirmDelete}
                onCancel={closeDeleteModal}
            />
        </div>
    );
};

export default GalleryManagement;
