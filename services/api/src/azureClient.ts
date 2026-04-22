// ---------------------------------------------------------------------------
// Azure Content Understanding client — adapter layer
// ---------------------------------------------------------------------------

import { DefaultAzureCredential } from '@azure/identity';
import { ContentUnderstandingClient } from '@azure/ai-content-understanding';

const ENDPOINT = process.env.AZURE_CONTENT_UNDERSTANDING_ENDPOINT || '';

let _client: ContentUnderstandingClient | null = null;
let _defaultsConfigured = false;

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

/**
 * Ensure default model deployments are configured on the Foundry resource.
 * This is required before creating custom analyzers or using prebuilt analyzers.
 * Only runs once per process lifetime.
 */
export async function ensureDefaults(): Promise<void> {
  if (_defaultsConfigured) return;

  const client = getClient();
  const deployments: Record<string, string> = {
    'gpt-5.2': process.env.COMPLETION_MODEL_DEPLOYMENT || 'gpt-5.2',
    'text-embedding-3-large': process.env.EMBEDDING_MODEL_DEPLOYMENT || 'text-embedding-3-large',
  };

  try {
    console.log('Configuring default model deployments:', deployments);
    await client.updateDefaults({ modelDeployments: deployments });
    console.log('Default model deployments configured successfully.');
    _defaultsConfigured = true;
  } catch (err) {
    console.warn('Failed to configure default model deployments (may already be set):', (err as Error).message);
    // Don't throw — defaults may already be configured, or the models might be auto-deployed
    _defaultsConfigured = true;
  }
}
