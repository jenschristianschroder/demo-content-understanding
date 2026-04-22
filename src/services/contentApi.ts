import type {
  ApiResult,
  ScenarioId,
  InvoiceResult,
  ClassifySplitResult,
  ImageSummaryResult,
  AudioAnalysisResult,
  VideoAnalysisResult,
  CustomFormResult,
  MarkdownResult,
  ReviewResult,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function postFile<T>(endpoint: string, file: File): Promise<ApiResult<T>> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/content-understanding/${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    return { success: false, error: body.error || `Request failed: ${res.status}` };
  }

  const data = await res.json();
  return { success: true, data };
}

const ENDPOINT_MAP: Record<ScenarioId, string> = {
  'invoice': 'invoice',
  'classify-split': 'classify-split',
  'image-summary': 'image-summary',
  'audio-analysis': 'audio-analysis',
  'video-analysis': 'video-analysis',
  'custom-form': 'custom-form',
  'markdown': 'markdown',
  'review': 'review',
};

export function analyzeInvoice(file: File) {
  return postFile<InvoiceResult>(ENDPOINT_MAP['invoice'], file);
}

export function classifyAndSplit(file: File) {
  return postFile<ClassifySplitResult>(ENDPOINT_MAP['classify-split'], file);
}

export function summarizeImage(file: File) {
  return postFile<ImageSummaryResult>(ENDPOINT_MAP['image-summary'], file);
}

export function analyzeAudio(file: File) {
  return postFile<AudioAnalysisResult>(ENDPOINT_MAP['audio-analysis'], file);
}

export function analyzeVideo(file: File) {
  return postFile<VideoAnalysisResult>(ENDPOINT_MAP['video-analysis'], file);
}

export function analyzeCustomForm(file: File) {
  return postFile<CustomFormResult>(ENDPOINT_MAP['custom-form'], file);
}

export function convertToMarkdown(file: File) {
  return postFile<MarkdownResult>(ENDPOINT_MAP['markdown'], file);
}

export function extractWithReview(file: File) {
  return postFile<ReviewResult>(ENDPOINT_MAP['review'], file);
}
