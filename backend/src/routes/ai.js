/**
 * Rotas de IA
 * Endpoints específicos para funcionalidades de IA
 */

import express from 'express';
import * as AIController from '../controllers/AIController.js';

const router = express.Router();

// Análise de ideia
router.post('/analyze-idea', AIController.analyzeIdea);

// Gerar texto de compartilhamento
router.post('/share-text', AIController.generateShareText);

// Gerar epitáfio
router.post('/epitaph', AIController.generateEpitaph);

export default router;
