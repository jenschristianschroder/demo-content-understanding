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
  if (_defaultsConfigured) {
    console.log('ensureDefaults: already configured, skipping.');
    return;
  }

  const client = getClient();

  // First, check what's already configured
  try {
    const current = await client.getDefaults();
    console.log('ensureDefaults: current defaults:', JSON.stringify(current));
  } catch (e: any) {
    console.log('ensureDefaults: getDefaults failed:', e.message);
  }

  // Map Content Understanding's expected model names to your actual Foundry deployments.
  // Keys = model names CU expects; Values = your deployment names.
  const completionDeployment = process.env.COMPLETION_MODEL_DEPLOYMENT || 'gpt-5.2-519039';
  const embeddingDeployment = process.env.EMBEDDING_MODEL_DEPLOYMENT || 'text-embedding-3-large-550800';
  const deployments: Record<string, string> = {
    'gpt-4.1': completionDeployment,
    'gpt-4.1-mini': completionDeployment,
    'text-embedding-3-large': embeddingDeployment,
  };

  console.log('ensureDefaults: configuring model deployments:', JSON.stringify(deployments));

  try {
    const result = await client.updateDefaults({
      modelDeployments: { additionalProperties: deployments },
    });
    console.log('ensureDefaults: configured successfully. Result:', JSON.stringify(result));
    _defaultsConfigured = true;
  } catch (err: any) {
    // Try to get as much detail as possible from the error
    console.error('ensureDefaults: FAILED to configure model deployments.');
    console.error('  Error:', err.message);
    console.error('  Code:', err.code);
    console.error('  Status:', err.statusCode);
    // Try multiple ways to get the response body
    const body = err?.response?.bodyAsText
      || err?.response?.body
      || err?.details
      || '';
    if (body) {
      console.error('  Response body:', typeof body === 'string' ? body : JSON.stringify(body));
    }
    // Log all enumerable error properties for debugging
    console.error('  Full error keys:', Object.keys(err));
    // Do NOT set _defaultsConfigured so it retries next time
    throw new Error(`Failed to configure model defaults: ${err.message}`);
  }
}
