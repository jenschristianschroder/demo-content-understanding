// ---------------------------------------------------------------------------
// Video clip analysis service
// ---------------------------------------------------------------------------

import { getClient } from '../azureClient.js';
import type { AudioVisualContent } from '@azure/ai-content-understanding';

export async function videoAnalysisService(file: Express.Multer.File) {
  const client = getClient();
  const poller = client.analyzeBinary('prebuilt-videoSearch', file.buffer, file.mimetype);
  const result = await poller.pollUntilDone();

  // Video may return multiple content segments
  const contents = (result.contents ?? []) as AudioVisualContent[];

  // Build chapters from each segment/content item
  const chapters: { title: string; startTime: number; endTime: number; summary: string }[] = [];
  let transcript = '';
  let overallSummary = '';
  let duration = 0;

  for (const segment of contents) {
    const startSec = (segment.startTimeMs ?? 0) / 1000;
    const endSec = (segment.endTimeMs ?? 0) / 1000;

    // Use the Summary field or markdown as the chapter summary
    const summaryField = segment.fields?.['Summary'];
    const segSummary = summaryField && typeof summaryField.value === 'string'
      ? summaryField.value
      : (segment.markdown ?? '');

    chapters.push({
      title: `Segment ${chapters.length + 1}`,
      startTime: startSec,
      endTime: endSec,
      summary: segSummary,
    });

    // Accumulate transcript from transcript phrases
    if (segment.transcriptPhrases) {
      for (const phrase of segment.transcriptPhrases) {
        transcript += (transcript ? ' ' : '') + (phrase.text ?? '');
      }
    } else if (segment.markdown) {
      transcript += (transcript ? '\n\n' : '') + segment.markdown;
    }

    if (endSec > duration) duration = endSec;
    if (!overallSummary && segSummary) overallSummary = segSummary;
  }

  // If only one segment, use its summary directly
  if (contents.length === 1) {
    overallSummary = chapters[0]?.summary ?? '';
  }

  return {
    transcript,
    chapters,
    summary: overallSummary,
    duration,
    rawJson: result as unknown as Record<string, unknown>,
  };
}
