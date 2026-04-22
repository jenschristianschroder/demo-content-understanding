// ---------------------------------------------------------------------------
// Extraction with confidence / human-review service
// Uses prebuilt-document with estimateFieldSourceAndConfidence
// ---------------------------------------------------------------------------

import { getClient } from '../azureClient.js';
import type { DocumentContent, ContentFieldUnion } from '@azure/ai-content-understanding';

const REVIEW_THRESHOLD = 0.8;
const ANALYZER_ID = process.env.REVIEW_ANALYZER || 'prebuilt-document';

export async function reviewService(file: Express.Multer.File) {
  const client = getClient();
  const poller = client.analyzeBinary(ANALYZER_ID, file.buffer, file.mimetype);
  const result = await poller.pollUntilDone();

  const content = result.contents?.[0] as DocumentContent | undefined;

  // Determine document type from key-value pairs or content
  const documentType = ANALYZER_ID === 'prebuilt-document'
    ? 'Document'
    : ANALYZER_ID.replace(/^prebuilt-/, '').replace(/-/g, ' ');

  // Map extracted fields
  const fields: { name: string; value: string; confidence: number; boundingBox?: number[]; needsReview: boolean }[] = [];
  let confidenceSum = 0;
  let fieldCount = 0;

  // Extract from fields if available
  if (content?.fields) {
    for (const [name, field] of Object.entries(content.fields)) {
      const f = field as ContentFieldUnion;
      let value = '';
      if (typeof f.value === 'string') value = f.value;
      else if (f.value instanceof Date) value = f.value.toISOString().slice(0, 10);
      else if (typeof f.value === 'number') value = String(f.value);
      const confidence = f.confidence ?? 0;
      confidenceSum += confidence;
      fieldCount++;
      fields.push({
        name,
        value,
        confidence,
        needsReview: confidence < REVIEW_THRESHOLD,
      });
    }
  }

  const overallConfidence = fieldCount > 0 ? confidenceSum / fieldCount : 0;

  return {
    documentType,
    fields,
    overallConfidence: Math.round(overallConfidence * 100) / 100,
    rawJson: result as unknown as Record<string, unknown>,
  };
}
