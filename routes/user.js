// routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require('../models/user');

const secretKey = 'rahasiasekali';
const expiresIn = '1h';

// Read all users
router.get('/', async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Create a new user
router.post('/register', async (req, res) => {
    const { name, password, email } = req.body;
    console.log(req.body);
    // Validasi data
    if (!name || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi.' });
    }

    if (!email) {
        return res.status(400).json({ error: 'Email wajib diisi.' });
      }
  
    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      // Tambahkan pengguna baru ke database
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });
  
      res.json({ message: 'Pengguna berhasil terdaftar.', user: newUser });
    } catch (error) {
      res.status(500).json({ error: 'Gagal mendaftarkan pengguna.', message: error.message });
    }
  });

router.post('/login', async (req, res) => {
    const { name, password } = req.body;
  
		console.log(name);
    // Validasi data
    if (!name || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi.' });
    }
  
    try {
      const user = await User.findOne({ where: { name } });
  
      if (!user) {
        return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Kata sandi salah.' });
      }
  
      const token = jwt.sign({ userId: user.id, name: user.name }, secretKey, { expiresIn });
      res.json({ message: 'Login berhasil.', token });
    } catch (error) {
      res.status(500).json({ error: 'Gagal melakukan login.', message: error.message });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  
  try {
    const user = await User.findByPk(userId);
    if (user) {
      user.name = name;
      user.email = email;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  
  try {
    const user = await User.findByPk(userId);
    if (user) {
      await user.destroy();
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
