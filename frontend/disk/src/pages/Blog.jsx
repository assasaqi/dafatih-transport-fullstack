import React, { useState, useEffect } from 'react';
import blogData from '../data/blog.json';

const Blog = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setVisibleCount(3);
    }
  }, []);

  const articles = blogData.articles || [];
  const displayedArticles = articles.slice(0, visibleCount);

  return (
    <div className="page-view">
      <div className="page-banner">
        <h1>Panduan & Tips Wisata Lombok</h1>
        <p>Artikel dan informasi menarik seputar destinasi impian Anda di Pulau Lombok.</p>
      </div>

      <section className="section">
        <div className="blog-grid">
          {displayedArticles.map((article, idx) => (
            <div key={idx} className="blog-card">
              <div className="blog-card-img">
                <img src={article.image} alt={article.title} loading="lazy" />
              </div>
              <div className="blog-body">
                <div>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '12px' }}>
                  <span
                    style={{
                      color: '#64748b',
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
                    <i className="fa-solid fa-clock"></i> Segera Hadir
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

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
