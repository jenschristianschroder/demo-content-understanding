import express from 'express';
import cors from 'cors';
import { contentRouter } from './routes/content.js';
import { healthRouter } from './routes/health.js';
import { ensureDefaults } from './azureClient.js';
import { ensureClassifierAnalyzer } from './services/classifySplit.js';

const PORT = parseInt(process.env.PORT || '3001', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app = express();

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '100kb' }));

app.use('/api/content-understanding', contentRouter);
app.use('/health', healthRouter);

app.listen(PORT, async () => {
  console.log(`Content Understanding API listening on port ${PORT}`);
  try {
    await ensureDefaults();
  } catch (err) {
    console.error('Startup: failed to configure model defaults.', (err as Error).message);
  }
  // Pre-create the classifier analyzer in the background so it's ready for requests
  ensureClassifierAnalyzer().catch((err) => {
    console.error('Startup: failed to pre-create classifier analyzer.', (err as Error).message);
  });
});
