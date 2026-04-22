// ---------------------------------------------------------------------------
// Custom form analyzer service
// Uses a custom analyzer or falls back to prebuilt-documentFields
// ---------------------------------------------------------------------------

import { getClient } from '../azureClient.js';
import type { DocumentContent, ContentFieldUnion } from '@azure/ai-content-understanding';

const ANALYZER_ID = process.env.CUSTOM_FORM_ANALYZER || 'prebuilt-documentFields';

export async function customFormService(file: Express.Multer.File) {
  const client = getClient();
  const poller = client.analyzeBinary(ANALYZER_ID, file.buffer, file.mimetype);
  const result = await poller.pollUntilDone();

  const content = result.contents?.[0] as DocumentContent | undefined;

  // Determine form type from analyzer or content
  const formType = ANALYZER_ID === 'prebuilt-documentFields'
    ? 'Document'
    : ANALYZER_ID.replace(/^custom-/, '').replace(/-/g, ' ');

  // Map all fields to the frontend shape
  const fields: { name: string; value: string; confidence: number; fieldType: string }[] = [];
  if (content?.fields) {
    for (const [name, field] of Object.entries(content.fields)) {
      const f = field as ContentFieldUnion;
      let value = '';
      const fieldType = f.type ?? 'string';
      if (typeof f.value === 'string') value = f.value;
      else if (f.value instanceof Date) value = f.value.toISOString().slice(0, 10);
      else if (typeof f.value === 'number') value = String(f.value);
      fields.push({ name, value, confidence: f.confidence ?? 0, fieldType });
    }
  }

  return {
    formType,
    fields,
    rawJson: result as unknown as Record<string, unknown>,
  };
}
