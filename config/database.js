const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql', // Jenis database yang digunakan
  host: 'localhost', // Host database
  username: 'root', // Nama pengguna database
  password: '123456', // Kata sandi database
  database: 'dbNodeJS', // Nama database
});

module.exports = sequelize;
