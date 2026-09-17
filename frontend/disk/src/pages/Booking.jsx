import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import countriesData from '../data/countries.json';
import ModalSummary from '../components/common/ModalSummary';

const Booking = () => {
  const location = useLocation();
  const PHONE_NUMBER = "6287757004214";

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    custName: '',
    countryCode: '62',
    custWa: '',
    pickupDate: todayStr,
    pickupTime: '08:00',
    pickupLoc: '',
    dropLoc: '',
    price: 0
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        pickupLoc: location.state.pickup || '',
        dropLoc: location.state.drop || '',
        price: location.state.price || 0
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = (field) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let waNumber = formData.custWa.trim();
    if (waNumber.startsWith('0')) {
      waNumber = waNumber.substring(1);
    }

    if (!formData.price || !formData.pickupLoc) {
      alert('Silakan pilih rute perjalanan terlebih dahulu dari Daftar Tarif!');
      return;
    }

    setFormData((prev) => ({ ...prev, custWa: waNumber }));
    setShowModal(true);
  };

  const handleConfirmWhatsApp = () => {
    const message = `Halo Dafatih Transport, saya ingin memesan layanan antar-jemput dengan detail berikut:%0A%0A*Nama:* ${formData.custName}%0A*No. WA:* +${formData.countryCode}${formData.custWa}%0A*Tanggal:* ${formData.pickupDate}%0A*Waktu:* ${formData.pickupTime} WITA%0A*Penjemputan:* ${formData.pickupLoc}%0A*Tujuan:* ${formData.dropLoc}%0A*Estimasi Tarif:* Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}%0A%0AMohon konfirmasinya, terima kasih.`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="page-view booking-page-wrapper">
      <style>{`
        .booking-page-wrapper {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          font-family: sans-serif;
        }
        .booking-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 25px;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 20px;
        }
        .booking-header h1 {
          margin: 0 0 8px 0;
          font-size: 26px;
          color: #333;
        }
        .booking-header p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        /* Kartu Form Pemesanan */
        .booking-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
        }
        .booking-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          font-size: 13px;
          color: #495057;
          margin-bottom: 6px;
        }
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 11px 14px;
          box-sizing: border-box;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--primary, #007bff);
        }

        /* Tombol Clear Input */
        .input-clear-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .clear-input-btn {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          font-size: 18px;
          color: #adb5bd;
          cursor: pointer;
        }
        .clear-input-btn:hover {
          color: #495057;
        }

        /* Baris Tanggal & Waktu */
        .form-row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        /* Kotak Estimasi Tarif */
        .price-display-box {
          background: #f8f9fa;
          border: 1px dashed #cbd5e1;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
        }
        .price-summary-info span {
          font-size: 13px;
          color: #495057;
        }
        .price-summary-info strong {
          font-size: 18px;
          display: block;
          margin-top: 4px;
          color: #28a745;
        }

        /* Tombol Konfirmasi WhatsApp */
        .btn-submit-wa {
          width: 100%;
          background: #25d366;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
        }
        .btn-submit-wa:hover {
          background: #20ba5a;
        }

        /* Responsif Khusus Mobile */
        @media (max-width: 768px) {
          .booking-page-wrapper {
            padding: 10px;
          }
          .booking-header {
            align-items: flex-start;
            text-align: left;
          }
          .form-row-2col {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          .booking-card {
            padding: 15px;
          }
        }
      `}</style>

      {/* Bagian Header Rata Tengah di Desktop, Rata Kiri di Mobile */}
      <div className="booking-header">
        <h1>Formulir Pemesanan Transportasi</h1>
        <p>Lengkapi formulir di bawah ini untuk reservasi cepat via WhatsApp.</p>
      </div>

      <section className="section booking-section">
        <div className="booking-card">
          <form onSubmit={handleSubmit}>
            <div className="booking-grid">

              {/* Nama Lengkap */}
              <div className="form-group">
                <label>Nama Lengkap Pemesan *</label>
                <div className="input-clear-wrapper">
                  <input
                    type="text"
                    name="custName"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.custName}
                    onChange={handleChange}
                  />
                  {formData.custName && (
                    <button type="button" className="clear-input-btn" onClick={() => handleClear('custName')}>&times;</button>
                  )}
                </div>
              </div>

              {/* Nomor WhatsApp */}
              <div className="form-group">
                <label>Nomor WhatsApp *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select name="countryCode" value={formData.countryCode} onChange={handleChange} style={{ width: '110px', flexShrink: 0 }}>
                    {countriesData.countries?.map((c, i) => (
                      <option key={i} value={c.code}>{c.flag} +{c.code}</option>
                    ))}
                  </select>
                  <div className="input-clear-wrapper" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      name="custWa"
                      required
                      placeholder="8123456789"
                      value={formData.custWa}
                      onChange={handleChange}
                    />
                    {formData.custWa && (
                      <button type="button" className="clear-input-btn" onClick={() => handleClear('custWa')}>&times;</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tanggal & Waktu (Sejajar) */}
              <div className="form-row-2col">
                <div className="form-group">
                  <label>Tanggal Jemput *</label>
                  <input
                    type="date"
                    name="pickupDate"
                    min={todayStr}
                    required
                    value={formData.pickupDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Waktu (WITA) *</label>
                  <input
                    type="time"
                    name="pickupTime"
                    required
                    value={formData.pickupTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Lokasi Penjemputan */}
              <div className="form-group">
                <label>Lokasi Penjemputan (From) *</label>
                <input
                  type="text"
                  name="pickupLoc"
                  required
                  readOnly
                  placeholder="Pilih dari Daftar Tarif"
                  value={formData.pickupLoc}
                  style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed', color: '#495057' }}
                />
              </div>

              {/* Lokasi Tujuan */}
              <div className="form-group">
                <label>Lokasi Tujuan (To) *</label>
                <input
                  type="text"
                  name="dropLoc"
                  required
                  readOnly
                  placeholder="Pilih dari Daftar Tarif"
                  value={formData.dropLoc}
                  style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed', color: '#495057' }}
                />
              </div>
            </div>

            {/* Kotak Estimasi Tarif */}
            <div className="price-display-box">
              <div className="price-summary-info">
                <span>Estimasi Tarif Sesuai Rute:</span>
                <strong>
                  {formData.price > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}` : 'Belum Dipilih'}
                </strong>
              </div>
              <small style={{ color: '#6c757d', fontSize: '11px', display: 'block', marginTop: '6px' }}>
                *Tarif otomatis terisi saat memilih rute (Maks 4 Pax & Bagasi).
              </small>
            </div>

            <button type="submit" className="btn-submit-wa">
              <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i> Konfirmasi Pemesanan
            </button>
          </form>
        </div>
      </section>

      {showModal && (
        <ModalSummary
          formData={formData}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmWhatsApp}
        />
      )}
    </div>
  );
};

export default Booking;
