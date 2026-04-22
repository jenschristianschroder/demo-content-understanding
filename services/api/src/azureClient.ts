// ---------------------------------------------------------------------------
// Azure Content Understanding client — adapter layer
// ---------------------------------------------------------------------------

import { DefaultAzureCredential } from '@azure/identity';
import { ContentUnderstandingClient } from '@azure/ai-content-understanding';

const ENDPOINT = process.env.AZURE_CONTENT_UNDERSTANDING_ENDPOINT || '';

let _client: ContentUnderstandingClient | null = null;

export function getEndpoint(): string {
  return ENDPOINT;
}

export function getClient(): ContentUnderstandingClient {
  if (!_client) {
    if (!ENDPOINT) {
      throw new Error(
        'AZURE_CONTENT_UNDERSTANDING_ENDPOINT is required. ' +
        'Set this environment variable to your Microsoft Foundry resource endpoint.',
      );
    }
    _client = new ContentUnderstandingClient(ENDPOINT, new DefaultAzureCredential());
  }
  return _client;
}
