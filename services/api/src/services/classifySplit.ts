// ---------------------------------------------------------------------------
// Document classification & splitting service
// Uses Azure Content Understanding SDK with a classifier analyzer
// ---------------------------------------------------------------------------

import { getClient, ensureDefaults } from '../azureClient.js';
import type { DocumentContent } from '@azure/ai-content-understanding';

const DEFAULT_ANALYZER_ID = 'demo_document_classifier';

const DEFAULT_CATEGORIES: Record<string, { description: string }> = {
  Invoice: {
    description:
      'Billing documents issued by sellers or service providers to request ' +
      'payment for goods or services, detailing items, prices, taxes, totals, ' +
      'and payment terms.',
  },
  Receipt: {
    description:
      'Proof-of-purchase documents from retail or dining establishments ' +
      'showing items bought, prices, taxes, and totals.',
  },
  Contract: {
    description:
      'Legal agreements between parties defining terms, obligations, ' +
      'rights, and conditions of a business relationship.',
  },
  Letter: {
    description:
      'Written correspondence between individuals or organisations, ' +
      'including cover letters, formal notices, and general business letters.',
  },
  Purchase_Order: {
    description:
      'Documents issued by buyers to sellers authorising a purchase, ' +
      'specifying items, quantities, prices, and delivery terms.',
  },
  Insurance_Claim: {
    description:
      'Documents related to insurance claims, including claim forms, ' +
      'supporting documentation, and adjuster reports.',
  },
  Report: {
    description:
      'Analytical or summary documents presenting findings, data, ' +
      'or status updates on a topic or project.',
  },
};

let _analyzerReady = false;

async function ensureClassifierAnalyzer(): Promise<string> {
  const analyzerId = process.env.CLASSIFY_SPLIT_ANALYZER || DEFAULT_ANALYZER_ID;

  // If user specified a custom analyzer, assume it exists
  if (process.env.CLASSIFY_SPLIT_ANALYZER) {
    return analyzerId;
  }

  // For the default analyzer, create it if not already done
  if (_analyzerReady) {
    return analyzerId;
  }

  const client = getClient();

  // Check if the analyzer already exists
  try {
    await client.getAnalyzer(analyzerId);
    _analyzerReady = true;
    return analyzerId;
  } catch {
    // Analyzer doesn't exist, create it
  }

  console.log(`Creating classifier analyzer '${analyzerId}'...`);

  // Ensure model deployment defaults are configured first
  await ensureDefaults();

  const analyzerDef = {
    baseAnalyzerId: 'prebuilt-document',
    description: 'Demo classifier for document categorisation and splitting',
    config: {
      returnDetails: true,
      enableSegment: true,
      contentCategories: DEFAULT_CATEGORIES,
    },
    models: { completion: process.env.CLASSIFIER_MODEL_DEPLOYMENT || 'gpt-4.1' },
  };

  try {
    console.log('Analyzer definition:', JSON.stringify(analyzerDef, null, 2));
    const poller = client.createAnalyzer(analyzerId, analyzerDef as any);
    await poller.pollUntilDone();
    _analyzerReady = true;
    console.log(`Classifier analyzer '${analyzerId}' created.`);
  } catch (err: any) {
    const detail = err?.response?.bodyAsText || err?.details || '';
    console.error('Failed to create classifier analyzer:', err.message, detail);
    throw err;
  }

  return analyzerId;
}

export async function classifySplitService(file: Express.Multer.File) {
  const client = getClient();
  const analyzerId = await ensureClassifierAnalyzer();

  // Analyze the uploaded document
  const poller = client.analyzeBinary(analyzerId, file.buffer, file.mimetype);
  const result = await poller.pollUntilDone();

  // Map the response to the expected frontend shape
  const content = result.contents?.[0] as DocumentContent | undefined;

  let totalPages = 0;
  if (content?.kind === 'document') {
    totalPages = (content.endPageNumber ?? 0) - (content.startPageNumber ?? 1) + 1;
  }

  const sections = (content as any)?.segments?.map((seg: any, i: number) => ({
    index: i,
    classification: (seg.category ?? 'Unknown').replace(/_/g, ' '),
    confidence: seg.confidence ?? 0.0,
    pageRange: [seg.startPageNumber ?? 0, seg.endPageNumber ?? 0] as [number, number],
  })) ?? [];

  return {
    totalPages,
    sections,
    rawJson: result as unknown as Record<string, unknown>,
  };
}
