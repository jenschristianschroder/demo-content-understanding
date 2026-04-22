// ---------------------------------------------------------------------------
// Azure Content Understanding client — adapter layer
//
// TODO: Wire up the Azure AI Content Understanding SDK / REST API.
//       Currently this module exports a placeholder client.
//       When the SDK is available, initialise it here with DefaultAzureCredential
//       and export helper methods for each scenario.
// ---------------------------------------------------------------------------

import { DefaultAzureCredential } from '@azure/identity';

const ENDPOINT = process.env.AZURE_CONTENT_UNDERSTANDING_ENDPOINT || '';
const _REGION = process.env.AZURE_CONTENT_UNDERSTANDING_REGION || '';

let _credential: DefaultAzureCredential | null = null;

export function getCredential(): DefaultAzureCredential {
  if (!_credential) {
    _credential = new DefaultAzureCredential();
  }
  return _credential;
}

export function getEndpoint(): string {
  return ENDPOINT;
}

// TODO: Implement Azure Content Understanding API calls.
// The service modules currently return mock data.
// When the API is finalised, each service module should call this client
// to submit files and poll for results.
export async function analyzeContent(
  _analyzerName: string,
  _fileBuffer: Buffer,
  _mimeType: string,
): Promise<Record<string, unknown>> {
  // Placeholder — replace with actual API call:
  // 1. POST file to Content Understanding endpoint with analyzer name
  // 2. Poll for result
  // 3. Return parsed JSON
  throw new Error(
    'Azure Content Understanding API integration not yet wired. ' +
    'Set AZURE_CONTENT_UNDERSTANDING_ENDPOINT and implement this method.'
  );
}
