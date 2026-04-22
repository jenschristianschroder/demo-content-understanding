// ---------------------------------------------------------------------------
// Scenario definitions – single source of truth for every Content Understanding demo
// ---------------------------------------------------------------------------

export type ScenarioId =
  | 'invoice'
  | 'classify-split'
  | 'image-summary'
  | 'audio-analysis'
  | 'video-analysis'
  | 'custom-form'
  | 'markdown'
  | 'review';

export interface ScenarioInfo {
  id: ScenarioId;
  label: string;
  description: string;
  icon: string;            // emoji shorthand for the feature card
  acceptedFormats: string;  // file input accept string
  sampleFile: string;       // path under /samples/
}

export const SCENARIOS: ScenarioInfo[] = [
  {
    id: 'invoice',
    label: 'Invoice Extraction',
    description: 'Extract structured JSON from invoices — line items, totals, vendor details',
    icon: '🧾',
    acceptedFormats: '.pdf,.png,.jpg,.jpeg,.tiff',
    sampleFile: '/samples/invoice-sample.pdf',
  },
  {
    id: 'classify-split',
    label: 'Document Classification & Splitting',
    description: 'Classify and split mixed-document bundles into individual documents',
    icon: '📂',
    acceptedFormats: '.pdf',
    sampleFile: '/samples/mixed-documents.pdf',
  },
  {
    id: 'image-summary',
    label: 'Image / Chart Summary',
    description: 'Summarise a chart, dashboard screenshot, or infographic into structured insights',
    icon: '📊',
    acceptedFormats: '.png,.jpg,.jpeg,.webp',
    sampleFile: '/samples/chart-sample.png',
  },
  {
    id: 'audio-analysis',
    label: 'Audio Call Analysis',
    description: 'Transcribe an audio call, identify speakers, and generate a summary',
    icon: '🎙️',
    acceptedFormats: '.wav,.mp3,.m4a,.ogg',
    sampleFile: '/samples/call-recording.wav',
  },
  {
    id: 'video-analysis',
    label: 'Video Clip Analysis',
    description: 'Transcribe a short video, detect chapters and key moments, summarise content',
    icon: '🎬',
    acceptedFormats: '.mp4,.mov,.webm',
    sampleFile: '/samples/video-clip.mp4',
  },
  {
    id: 'custom-form',
    label: 'Custom Analyzer',
    description: 'Run a domain-specific analyzer on a custom business form (e.g. service request)',
    icon: '🔧',
    acceptedFormats: '.pdf,.png,.jpg,.jpeg',
    sampleFile: '/samples/service-request-form.pdf',
  },
  {
    id: 'markdown',
    label: 'Document → Markdown',
    description: 'Convert a document to clean Markdown for RAG pipelines and search indexing',
    icon: '📝',
    acceptedFormats: '.pdf,.docx,.pptx,.png,.jpg,.jpeg',
    sampleFile: '/samples/article-sample.pdf',
  },
  {
    id: 'review',
    label: 'Extraction with Confidence',
    description: 'Extract fields with confidence scores and grounding for human review',
    icon: '✅',
    acceptedFormats: '.pdf,.png,.jpg,.jpeg',
    sampleFile: '/samples/insurance-claim.pdf',
  },
];

// ---------------------------------------------------------------------------
// Request / Response types shared between frontend and backend
// ---------------------------------------------------------------------------

// Generic wrapper used by every API response
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// --- Invoice ---
export interface InvoiceField {
  name: string;
  value: string;
  confidence: number;
}
export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}
export interface InvoiceResult {
  vendor: string;
  invoiceNumber: string;
  date: string;
  total: number;
  currency: string;
  fields: InvoiceField[];
  lineItems: InvoiceLineItem[];
  rawJson: Record<string, unknown>;
}

// --- Classify / Split ---
export interface DocumentSection {
  index: number;
  classification: string;
  pageRange: [number, number];
}
export interface ClassifySplitResult {
  totalPages: number;
  sections: DocumentSection[];
  rawJson: Record<string, unknown>;
}

// --- Image Summary ---
export interface ImageInsight {
  label: string;
  value: string;
}
export interface ImageSummaryResult {
  summary: string;
  insights: ImageInsight[];
  rawJson: Record<string, unknown>;
}

// --- Audio Analysis ---
export interface SpeakerSegment {
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
}
export interface AudioAnalysisResult {
  transcript: string;
  speakers: SpeakerSegment[];
  summary: string;
  duration: number;
  rawJson: Record<string, unknown>;
}

// --- Video Analysis ---
export interface VideoChapter {
  title: string;
  startTime: number;
  endTime: number;
  summary: string;
}
export interface VideoAnalysisResult {
  transcript: string;
  chapters: VideoChapter[];
  summary: string;
  duration: number;
  rawJson: Record<string, unknown>;
}

// --- Custom Form ---
export interface CustomFormField {
  name: string;
  value: string;
  confidence: number;
  fieldType: string;
}
export interface CustomFormResult {
  formType: string;
  fields: CustomFormField[];
  rawJson: Record<string, unknown>;
}

// --- Markdown ---
export interface MarkdownResult {
  markdown: string;
  pageCount: number;
  rawJson: Record<string, unknown>;
}

// --- Extraction with confidence / review ---
export interface ReviewField {
  name: string;
  value: string;
  confidence: number;
  boundingBox?: number[];
  needsReview: boolean;
}
export interface ReviewResult {
  documentType: string;
  fields: ReviewField[];
  overallConfidence: number;
  rawJson: Record<string, unknown>;
}

// Union of all result types for generic handling
export type ScenarioResult =
  | InvoiceResult
  | ClassifySplitResult
  | ImageSummaryResult
  | AudioAnalysisResult
  | VideoAnalysisResult
  | CustomFormResult
  | MarkdownResult
  | ReviewResult;
