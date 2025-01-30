import express from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import { interactionHandler } from '../middleware/interactionHandler.js';

const router = express.Router();

router.post('/', verifyKeyMiddleware(process.env.PUBLIC_KEY), interactionHandler);

export default router;