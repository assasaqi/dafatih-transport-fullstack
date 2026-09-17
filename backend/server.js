import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares
app.use(cors());

// Limit diperbesar ke 50mb untuk mendukung Upload Gambar (Base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Folder Statis untuk Gambar
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// =========================================================
// 🌐 API ENDPOINTS: RUTE & TARIF TRANSPORTASI
// =========================================================

// GET: Ambil Semua Data Rute
app.get('/api/routes', async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Gagal mengambil data rute dari database' });
  }
});

// POST: Tambah Rute Baru
app.post('/api/routes', async (req, res) => {
  try {
    const newRoute = await prisma.route.create({
      data: req.body,
    });
    res.status(201).json({ message: 'Rute berhasil ditambahkan!', route: newRoute });
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ error: 'Gagal menambah data rute' });
  }
});

// PUT: Edit/Update Rute Berdasarkan ID
app.put('/api/routes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRoute = await prisma.route.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json({ message: 'Rute berhasil diperbarui!', route: updatedRoute });
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ error: 'Gagal memperbarui data rute' });
  }
});

// DELETE: Hapus Rute Berdasarkan ID
app.delete('/api/routes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.route.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Rute berhasil dihapus!' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Gagal menghapus data rute' });
  }
});


// =========================================================
// 🖼️ API ENDPOINTS: GALERI DOKUMENTASI
// =========================================================

// GET: Ambil Semua Foto Galeri
app.get('/api/gallery', async (req, res) => {
  try {
    const photos = await prisma.gallery.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(photos);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Gagal mengambil data galeri' });
  }
});

// POST: Tambah Foto Galeri Baru
app.post('/api/gallery', async (req, res) => {
  try {
    const newPhoto = await prisma.gallery.create({
      data: {
        title: req.body.title,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        description: req.body.description || '',
      },
    });
    res.status(201).json({ message: 'Foto galeri berhasil disimpan!', photo: newPhoto });
  } catch (error) {
    console.error('Error create gallery:', error);
    res.status(500).json({ error: 'Gagal menyimpan foto ke database' });
  }
});

// PUT: Edit Foto Galeri Berdasarkan ID
app.put('/api/gallery/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPhoto = await prisma.gallery.update({
      where: { id: parseInt(id) },
      data: {
        title: req.body.title,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        description: req.body.description || '',
      },
    });
    res.json({ message: 'Foto galeri berhasil diperbarui!', photo: updatedPhoto });
  } catch (error) {
    console.error('Error update gallery:', error);
    res.status(500).json({ error: 'Gagal memperbarui foto di database' });
  }
});

// DELETE: Hapus Foto Galeri Berdasarkan ID
app.delete('/api/gallery/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.gallery.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Foto galeri berhasil dihapus!' });
  } catch (error) {
    console.error('Error delete gallery:', error);
    res.status(500).json({ error: 'Gagal menghapus foto dari database' });
  }
});


// =========================================================
// 🚀 MENJALANKAN SERVER
// =========================================================
app.listen(PORT, () => {
  console.log(`Backend Server Dafatih Transport aktif di http://localhost:${PORT}`);
});

// =========================================================
// 📝 API ENDPOINTS: BLOG / ARTIKEL
// =========================================================

// GET: Ambil Semua Artikel Blog
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data blog' });
  }
});

// GET: Ambil Semua Artikel Blog
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data blog' });
  }
});

// POST: Tambah Artikel Blog Baru
app.post('/api/blogs', async (req, res) => {
  try {
    const newBlog = await prisma.blog.create({
      data: {
        title: req.body.title,
        category: req.body.category,
        image: req.body.image,
        content: req.body.content,
        snippet: req.body.snippet || req.body.content.substring(0, 100) + '...',
        author: req.body.author || 'Admin Dafatih'
      },
    });
    res.status(201).json({ message: 'Artikel blog berhasil diterbitkan!', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Gagal menyimpan artikel blog' });
  }
});

// PUT: Edit Artikel Blog
app.put('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBlog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: {
        title: req.body.title,
        category: req.body.category,
        image: req.body.image,
        content: req.body.content,
        snippet: req.body.snippet || req.body.content.substring(0, 100) + '...',
        author: req.body.author || 'Admin Dafatih'
      },
    });
    res.json({ message: 'Artikel blog berhasil diperbarui!', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Gagal memperbarui artikel blog' });
  }
});

// DELETE: Hapus Artikel Blog
app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.blog.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Artikel blog berhasil dihapus!' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Gagal menghapus artikel blog' });
  }
});
