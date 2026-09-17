import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container">
      <style>{`
        .footer-container {
          background-color: #1e293b;
          color: #f8fafc;
          padding: 50px 20px 25px 20px;
          font-family: sans-serif;
          margin-top: 50px;
        }
        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 30px;
          padding-bottom: 20px;
        }
        .footer-col h4 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 15px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-col p {
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.5;
          margin: 0 0 12px 0;
        }
        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-col ul li {
          margin-bottom: 8px;
        }
        .footer-col ul li a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }
        .footer-col ul li a:hover {
          color: #38bdf8;
        }
        /* Sosmed Icons */
        .footer-socials {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        .footer-socials a {
          background: #334155;
          color: #f8fafc;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: background 0.2s;
          text-decoration: none;
        }
        .footer-socials a:hover {
          background: var(--primary, #0284c7);
        }
        /* Copyright */
        .copyright {
          text-align: center;
          color: #64748b;
          font-size: 12px;
          padding-top: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Responsif Khusus Mobile: Teks Rata Kiri */
        @media (max-width: 768px) {
          .footer-container {
            padding: 40px 15px 20px 15px;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 25px;
          }
          .footer-col {
            text-align: left;
          }
          .footer-socials {
            justify-content: flex-start;
          }
        }
      `}</style>

      <div className="footer-grid">
        {/* Kolom 1: Profil Brand & Sosmed */}
        <div className="footer-col">
          <h4>
            <i className="fa-solid fa-car-side" style={{ color: 'var(--accent, #f59e0b)' }}></i>
            Dafatih Transport
          </h4>
          <p>
            Penyedia jasa transportasi dan antar-jemput terpercaya di Pulau Lombok. Nyaman, aman, dan tepat waktu.
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <i className="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>

        {/* Kolom 2: Navigasi */}
        <div className="footer-col">
          <h4>Navigasi Utama</h4>
          <ul>
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/tarif">Daftar Tarif</Link></li>
          </ul>
        </div>

        {/* Kolom 3: Metode Pembayaran */}
        <div className="footer-col">
          <h4>Metode Pembayaran</h4>
          <p>
            <i className="fa-solid fa-wallet" style={{ color: 'var(--accent, #f59e0b)', marginRight: '6px' }}></i>
            Pembayaran fleksibel via Cash (Tunai) langsung ke driver atau Transfer Bank.
          </p>
        </div>

        {/* Kolom 4: Kontak & Lokasi */}
        <div className="footer-col">
          <h4>Kontak & Lokasi</h4>
          <p>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent, #f59e0b)', marginRight: '6px' }}></i>
            Pulau Lombok, Nusa Tenggara Barat
          </p>
          <ul>
            <li>
              <a href="https://wa.me/6287757004214" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-brands fa-whatsapp" style={{ color: '#25d366', fontSize: '15px' }}></i> +62 877-5700-4214
              </a>
            </li>
            <li>
              <a href="https://wa.me/6287862358975" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-brands fa-whatsapp" style={{ color: '#25d366', fontSize: '15px' }}></i> +62 878-6235-8975
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="copyright">
        &copy; {new Date().getFullYear()} Dafatih Transport. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
