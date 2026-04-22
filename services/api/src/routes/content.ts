import { Router, Request, Response } from 'express';
import multer from 'multer';
import { invoiceService } from '../services/invoice.js';
import { classifySplitService } from '../services/classifySplit.js';
import { imageSummaryService } from '../services/imageSummary.js';
import { audioAnalysisService } from '../services/audioAnalysis.js';
import { videoAnalysisService } from '../services/videoAnalysis.js';
import { customFormService } from '../services/customForm.js';
import { markdownService } from '../services/markdown.js';
import { reviewService } from '../services/review.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

const router = Router();

function handleError(res: Response, err: unknown) {
  console.error('API error:', err);
  let message = 'Internal server error';
  let status = 500;
  if (err instanceof Error) {
    message = err.message;
    // Surface Azure SDK RestError details
    const restErr = err as any;
    if (restErr.statusCode) status = restErr.statusCode;
    if (restErr.details) {
      console.error('Azure error details:', JSON.stringify(restErr.details, null, 2));
    }
    if (restErr.response?.bodyAsText) {
      console.error('Azure response body:', restErr.response.bodyAsText);
    }
    if (restErr.code) {
      message = `${restErr.code}: ${message}`;
    }
  }
  res.status(status).json({ error: message });
}

function requireFile(req: Request, res: Response): Express.Multer.File | null {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return null;
  }
  return req.file;
}

router.post('/invoice', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = requireFile(req, res);
    if (!file) return;
    const result = await invoiceService(file);
    res.json(result);
  } catch (err) { handleError(res, err); }
});

router.post('/classify-split', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = requireFile(req, res);
    if (!file) return;
    const result = await classifySplitService(file);
    res.json(result);
  } catch (err) { handleError(res, err); }
});

router.post('/image-summary', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = requireFile(req, res);
    if (!file) return;
    const result = await imageSummaryService(file);
    res.json(result);
  } catch (err) { handleError(res, err); }
});

router.post('/audio-analysis', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = requireFile(req, res);
    if (!file) return;
    const result = await audioAnalysisService(file);
    res.json(result);
  } catch (err) { handleError(res, err); }
});

router.post('/video-analysis', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = requireFile(req, res);
    if (!file) return;
    const result = await videoAnalysisService(file);
    res.json(result);
  } catch (err) { handleError(res, err); }
});

router.post('/custom-form', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = requireFile(req, res);
    if (!file) return;
    const result = await customFormService(file);
    res.json(result);
  } catch (err) { handleError(res, err); }
});

router.post('/markdown', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = requireFile(req, res);
    if (!file) return;
    const result = await markdownService(file);
    res.json(result);
  } catch (err) { handleError(res, err); }
});

router.post('/review', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = requireFile(req, res);
    if (!file) return;
    const result = await reviewService(file);
    res.json(result);
  } catch (err) { handleError(res, err); }
});

export { router as contentRouter };
