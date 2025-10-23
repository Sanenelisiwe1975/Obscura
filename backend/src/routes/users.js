
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');

const userController = {
  async register(req, res) {
    const { email, password, name, role, wallet } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          wallet,
        },
      });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(201).json({ token });
    } catch (error) {
      res.status(400).json({ error: 'User already exists or invalid data' });
    }
  },
  
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  },
  getProfile: (req, res) => res.send('Get user profile'),

};

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', userController.getProfile);

module.exports = router;