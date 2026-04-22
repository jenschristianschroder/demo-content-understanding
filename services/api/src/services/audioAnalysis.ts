// ---------------------------------------------------------------------------
// Audio call analysis service
// ---------------------------------------------------------------------------

import { getClient } from '../azureClient.js';
import type { AudioVisualContent } from '@azure/ai-content-understanding';

export async function audioAnalysisService(file: Express.Multer.File) {
  const client = getClient();
  const poller = client.analyzeBinary('prebuilt-audioSearch', file.buffer, file.mimetype);
  const result = await poller.pollUntilDone();

  const content = result.contents?.[0] as AudioVisualContent | undefined;

  // Build full transcript and speaker segments from transcript phrases
  const speakers: { speaker: string; text: string; startTime: number; endTime: number }[] = [];
  let transcript = '';

  if (content?.kind === 'audioVisual' && content.transcriptPhrases) {
    for (const phrase of content.transcriptPhrases) {
      const text = phrase.text ?? '';
      transcript += (transcript ? ' ' : '') + text;
      speakers.push({
        speaker: phrase.speaker ?? 'Unknown',
        text,
        startTime: phrase.startTimeMs != null ? phrase.startTimeMs / 1000 : 0,
        endTime: phrase.endTimeMs != null ? phrase.endTimeMs / 1000 : 0,
      });
    }
  } else {
    transcript = content?.markdown ?? '';
  }

  // Extract summary from fields if available
  const summaryField = content?.fields?.['Summary'];
  const summary = summaryField && typeof summaryField.value === 'string'
    ? summaryField.value
    : '';

  // Compute duration from the last phrase or content timing
  let duration = 0;
  if (content?.kind === 'audioVisual') {
    duration = (content.endTimeMs ?? 0) / 1000;
  }
  if (!duration && speakers.length > 0) {
    duration = speakers[speakers.length - 1].endTime;
  }

  return {
    transcript,
    speakers,
    summary,
    duration,
    rawJson: result as unknown as Record<string, unknown>,
  };
}
