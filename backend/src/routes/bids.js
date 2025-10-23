
const express = require('express');
const router = express.Router({ mergeParams: true });
const prisma = require('../db');
const auth = require('../middleware/auth');

const bidController = {
  async createBid(req, res) {
    const { tenderId } = req.params;
    const { amount } = req.body;
    try {
      const bid = await prisma.bid.create({
        data: {
          amount,
          tenderId,
          applicantId: req.user.id,
        },
      });
      res.status(201).json(bid);
    } catch (error) {
      res.status(400).json({ error: 'Invalid data' });
    }
  },
  
  async getAllBidsForTender(req, res) {
    const { tenderId } = req.params;
    try {
      const tender = await prisma.tender.findUnique({ where: { id: tenderId } });

      if (!tender || tender.creatorId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const bids = await prisma.bid.findMany({
        where: { tenderId },
        include: { applicant: true },
      });
      res.json(bids);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  },

  async getBidById(req, res) {
    const { id } = req.params;
    try {
      const bid = await prisma.bid.findUnique({
        where: { id },
        include: { applicant: true },
      });

      if (!bid) {
        return res.status(404).json({ error: 'Bid not found' });
      }

      // Optional: Add logic to restrict access to the bid

      res.json(bid);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  },

  updateBid: (req, res) => res.send(`Update bid with ID ${req.params.id}`),
  deleteBid: (req, res) => res.send(`Delete bid with ID ${req.params.id}`),
};

router.post('/', auth, bidController.createBid);
router.get('/', bidController.getAllBidsForTender);
router.get('/:id', bidController.getBidById);
router.put('/:id', auth, bidController.updateBid);
router.delete('/:id', auth, bidController.deleteBid);

module.exports = router;