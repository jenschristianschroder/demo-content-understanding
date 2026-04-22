// ---------------------------------------------------------------------------
// Document-to-Markdown conversion service
// ---------------------------------------------------------------------------

import { getClient } from '../azureClient.js';
import type { DocumentContent } from '@azure/ai-content-understanding';

export async function markdownService(file: Express.Multer.File) {
  const client = getClient();
  const poller = client.analyzeBinary('prebuilt-documentSearch', file.buffer, file.mimetype);
  const result = await poller.pollUntilDone();

  const content = result.contents?.[0] as DocumentContent | undefined;

  const markdown = content?.markdown ?? '';
  const pageCount = content?.kind === 'document'
    ? (content.endPageNumber ?? 0) - (content.startPageNumber ?? 1) + 1
    : 0;

  return {
    markdown,
    pageCount,
    rawJson: result as unknown as Record<string, unknown>,
  };
}
