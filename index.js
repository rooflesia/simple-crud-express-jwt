const express = require('express');
const sequelize = require('./config/database'); // Mengimpor konfigurasi database
const userRoutes = require('./routes/user'); // Mengimpor rute CRUD user

const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk mengizinkan JSON
app.use(express.json());

// Middleware untuk mengizinkan data dalam format application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Menggunakan rute CRUD user
app.use('/users', userRoutes);

// Menjalankan koneksi database
async function startApp() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil.');
    await sequelize.sync(); // Menjalankan migrasi jika diperlukan
    console.log('Migrasi database selesai.');
    app.listen(port, () => {
      console.log(`Server berjalan di http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Koneksi database gagal:', error);
  }
}

startApp();