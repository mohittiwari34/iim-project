import express from 'express';
import { analyze } from '../controllers/analyzeController.js';

const router = express.Router();

// Define route for analyzing companies
router.post('/analyze', analyze);

export default router;
