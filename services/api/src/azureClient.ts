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

  // Map Content Understanding's expected model names to your actual Foundry deployments.
  // Keys = model names CU expects; Values = your deployment names.
  const completionDeployment = process.env.COMPLETION_MODEL_DEPLOYMENT || 'gpt-5.2';
  const embeddingDeployment = process.env.EMBEDDING_MODEL_DEPLOYMENT || 'text-embedding-3-large';
  const deployments: Record<string, string> = {
    'gpt-4.1': completionDeployment,
    'gpt-4.1-mini': completionDeployment,
    'text-embedding-3-large': embeddingDeployment,
  };

  try {
    console.log('Configuring default model deployments:', deployments);
    await client.updateDefaults({
      modelDeployments: { additionalProperties: deployments },
    });
    console.log('Default model deployments configured successfully.');
    _defaultsConfigured = true;
  } catch (err) {
    console.warn('Failed to configure default model deployments (may already be set):', (err as Error).message);
    // Don't throw — defaults may already be configured, or the models might be auto-deployed
    _defaultsConfigured = true;
  }
}
