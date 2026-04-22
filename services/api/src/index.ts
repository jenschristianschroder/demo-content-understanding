import express from 'express';
import cors from 'cors';
import { contentRouter } from './routes/content.js';
import { healthRouter } from './routes/health.js';

const PORT = parseInt(process.env.PORT || '3001', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app = express();

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '100kb' }));

app.use('/api/content-understanding', contentRouter);
app.use('/health', healthRouter);

app.listen(PORT, () => {
  console.log(`Content Understanding API listening on port ${PORT}`);
});
