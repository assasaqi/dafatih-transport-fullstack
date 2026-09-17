import React, { useState, useEffect } from 'react';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Ambil data artikel dari backend Express + Prisma SQLite
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setVisibleCount(3);
    }

    fetch('http://localhost:5000/api/blogs')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data artikel dari server');
        return res.json();
      })
      .then((data) => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blogs:', err);
        setError('Gagal memuat artikel blog dari server.');
        setLoading(false);
      });
  }, []);

  const displayedArticles = articles.slice(0, visibleCount);

  if (loading) {
    return <div className="page-view" style={{ textAlign: 'center', padding: '80px' }}>Memuat artikel blog...</div>;
  }

  if (error) {
    return <div className="page-view" style={{ textAlign: 'center', padding: '80px', color: 'red' }}>{error}</div>;
  }

  return (
    <div className="page-view">
      <div className="page-banner">
        <h1>Panduan & Tips Wisata Lombok</h1>
        <p>Artikel dan informasi menarik seputar destinasi impian Anda di Pulau Lombok.</p>
      </div>

      <section className="section">
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Belum ada artikel blog yang diterbitkan.
          </div>
        ) : (
          <div className="blog-grid">
            {displayedArticles.map((article) => (
              <div key={article.id} className="blog-card">
                <div className="blog-card-img">
                  <img
                    src={article.image || 'http://localhost:5000/images/bandaralombok.jpg'}
                    alt={article.title}
                    loading="lazy"
                    onError={(e) => { e.target.src = 'http://localhost:5000/images/bandaralombok.jpg'; }}
                  />
                </div>
                <div className="blog-body">
                  <div>
                    <span style={{ fontSize: '11px', background: '#e7f1ff', color: '#007bff', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {article.category}
                    </span>
                    <h3 style={{ margin: '8px 0 6px 0' }}>{article.title}</h3>
                    <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.4' }}>
                      {article.snippet || (article.content && article.content.substring(0, 90) + '...')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Oleh: {article.author || 'Admin'}</span>
                    <span
                      style={{
                        color: '#007bff',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: '#f1f5f9',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <i className="fa-solid fa-book-open"></i> Baca Selengkapnya
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {visibleCount < articles.length && (
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

export default Blog;
