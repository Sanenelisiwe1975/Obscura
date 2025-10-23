
const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('../middleware/auth');

const tenderController = {
  async createTender(req, res) {
    const { title, description, category, deadline, budget } = req.body;
    try {
      const tender = await prisma.tender.create({
        data: {
          title,
          description,
          category,
          deadline: new Date(deadline),
          budget,
          creatorId: req.user.id,
        },
      });
      res.status(201).json(tender);
    } catch (error) {
      res.status(400).json({ error: 'Invalid data' });
    }
  },
  
  async getAllTenders(req, res) {
    try {
      const tenders = await prisma.tender.findMany({
        include: { creator: true },
      });
      res.json(tenders);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  },

  async getTenderById(req, res) {
    const { id } = req.params;
    try {
      const tender = await prisma.tender.findUnique({
        where: { id },
        include: { creator: true, bids: { include: { applicant: true } } },
      });
      if (!tender) {
        return res.status(404).json({ error: 'Tender not found' });
      }
      res.json(tender);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  },

  
  async updateTender(req, res) {
    const { id } = req.params;
    const { title, description, category, deadline, budget, status } = req.body;
    try {
      const tender = await prisma.tender.findUnique({ where: { id } });

      if (!tender || tender.creatorId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const updatedTender = await prisma.tender.update({
        where: { id },
        data: {
          title,
          description,
          category,
          deadline: deadline ? new Date(deadline) : undefined,
          budget,
          status,
        },
      });
      res.json(updatedTender);
    } catch (error) {
      res.status(400).json({ error: 'Invalid data' });
    }
  },

  async deleteTender(req, res) {
    const { id } = req.params;
    try {
      const tender = await prisma.tender.findUnique({ where: { id } });

      if (!tender || tender.creatorId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await prisma.tender.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  },

};

router.post('/', auth, tenderController.createTender);
router.get('/', tenderController.getAllTenders);
router.get('/:id', tenderController.getTenderById);
router.put('/:id', auth, tenderController.updateTender);
router.delete('/:id', auth, tenderController.deleteTender);

module.exports = router;