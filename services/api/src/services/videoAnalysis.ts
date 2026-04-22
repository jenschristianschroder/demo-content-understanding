// ---------------------------------------------------------------------------
// Video clip analysis service
// TODO: Replace mock with Azure Content Understanding API call
// ---------------------------------------------------------------------------

export async function videoAnalysisService(_file: Express.Multer.File) {
  // TODO: Call analyzeContent('prebuilt-video-analysis', file.buffer, file.mimetype)

  return {
    transcript: 'Welcome to this overview of Azure AI Content Understanding. In this demo, we\'ll show you how a single service can process documents, images, audio, and video. First, let\'s look at document extraction. Here we upload an invoice and the service returns structured JSON with vendor details, line items, and totals. Next, we\'ll demonstrate classification. When you have a bundle of mixed documents, Content Understanding can split them and classify each section. Now let\'s move on to audio. The service transcribes calls, identifies speakers, and generates summaries. Finally, video analysis. The service creates chapters, key moments, and a full transcript. That\'s Azure AI Content Understanding — one service for all your content.',
    chapters: [
      { title: 'Introduction', startTime: 0, endTime: 15, summary: 'Overview of Azure AI Content Understanding capabilities and what the demo will cover.' },
      { title: 'Document Extraction', startTime: 16, endTime: 45, summary: 'Demonstrates invoice upload and structured JSON extraction including vendor details, line items, and totals.' },
      { title: 'Document Classification', startTime: 46, endTime: 75, summary: 'Shows how mixed document bundles are split and classified into individual document types.' },
      { title: 'Audio Analysis', startTime: 76, endTime: 105, summary: 'Demonstrates call transcription, speaker identification, and automated summary generation.' },
      { title: 'Video Analysis & Wrap-up', startTime: 106, endTime: 130, summary: 'Shows video chapter detection and transcript generation. Concludes with a summary of the unified service.' },
    ],
    summary: 'A 2-minute overview demo of Azure AI Content Understanding covering four key capabilities: document extraction (invoices to JSON), document classification and splitting, audio call analysis with speaker diarisation, and video analysis with chapter detection. The demo emphasises the unified single-service approach.',
    duration: 130,
    rawJson: {
      _note: 'Mock data — wire Azure Content Understanding video analysis.',
      chapterCount: 5,
      keyMoments: ['Invoice extraction', 'Classification demo', 'Speaker identification', 'Chapter detection'],
    },
  };
}
