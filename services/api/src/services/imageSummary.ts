// ---------------------------------------------------------------------------
// Image / chart summary service
// ---------------------------------------------------------------------------

import { getClient } from '../azureClient.js';
import type { DocumentContent, ContentFieldUnion } from '@azure/ai-content-understanding';

export async function imageSummaryService(file: Express.Multer.File) {
  const client = getClient();
  const poller = client.analyzeBinary('prebuilt-imageSearch', file.buffer, file.mimetype);
  const result = await poller.pollUntilDone();

  const content = result.contents?.[0];
  const summaryField = content?.fields?.['Summary'];
  const summary = summaryField && typeof summaryField.value === 'string'
    ? summaryField.value
    : (content?.markdown ?? '');

  // Build insights from any extracted fields
  const insights: { label: string; value: string }[] = [];
  if (content?.fields) {
    for (const [key, field] of Object.entries(content.fields)) {
      if (key === 'Summary') continue;
      const f = field as ContentFieldUnion;
      let value = '';
      if (typeof f.value === 'string') value = f.value;
      else if (typeof f.value === 'number') value = String(f.value);
      if (value) insights.push({ label: key, value });
    }
  }

  // If no structured fields, add the mime type as context
  if (insights.length === 0 && content) {
    insights.push({ label: 'Content Type', value: (content as DocumentContent).mimeType ?? file.mimetype });
  }

  return {
    summary,
    insights,
    rawJson: result as unknown as Record<string, unknown>,
  };
}
