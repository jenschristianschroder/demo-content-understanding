// ---------------------------------------------------------------------------
// Audio call analysis service
// TODO: Replace mock with Azure Content Understanding API call
// ---------------------------------------------------------------------------

export async function audioAnalysisService(_file: Express.Multer.File) {
  // TODO: Call analyzeContent('prebuilt-audio-analysis', file.buffer, file.mimetype)

  return {
    transcript: 'Good morning, thank you for calling Contoso support. My name is Sarah. How can I help you today? Hi Sarah, I placed an order last week and haven\'t received a shipping confirmation. I\'d like to check the status. Sure, I can help with that. Could you please provide your order number? Yes, it\'s CO-2025-7891. Let me pull that up for you. I can see your order was processed and shipped yesterday. You should receive tracking information by email within the next few hours. That\'s great, thank you so much for the quick help! You\'re welcome! Is there anything else I can assist with? No, that\'s all. Have a great day! You too, goodbye!',
    speakers: [
      { speaker: 'Agent (Sarah)', text: 'Good morning, thank you for calling Contoso support. My name is Sarah. How can I help you today?', startTime: 0, endTime: 6 },
      { speaker: 'Customer', text: 'Hi Sarah, I placed an order last week and haven\'t received a shipping confirmation. I\'d like to check the status.', startTime: 7, endTime: 14 },
      { speaker: 'Agent (Sarah)', text: 'Sure, I can help with that. Could you please provide your order number?', startTime: 15, endTime: 19 },
      { speaker: 'Customer', text: 'Yes, it\'s CO-2025-7891.', startTime: 20, endTime: 23 },
      { speaker: 'Agent (Sarah)', text: 'Let me pull that up for you. I can see your order was processed and shipped yesterday. You should receive tracking information by email within the next few hours.', startTime: 24, endTime: 34 },
      { speaker: 'Customer', text: 'That\'s great, thank you so much for the quick help!', startTime: 35, endTime: 39 },
      { speaker: 'Agent (Sarah)', text: 'You\'re welcome! Is there anything else I can assist with?', startTime: 40, endTime: 44 },
      { speaker: 'Customer', text: 'No, that\'s all. Have a great day!', startTime: 45, endTime: 48 },
      { speaker: 'Agent (Sarah)', text: 'You too, goodbye!', startTime: 49, endTime: 51 },
    ],
    summary: 'A customer called to check the shipping status of order CO-2025-7891 placed the previous week. Agent Sarah confirmed the order was shipped the day before and that tracking information would arrive by email shortly. The call was resolved quickly with no escalation needed. Sentiment: positive.',
    duration: 51,
    rawJson: {
      _note: 'Mock data — wire Azure Content Understanding audio analysis.',
      speakerCount: 2,
      sentiment: 'positive',
      topics: ['order status', 'shipping', 'tracking'],
    },
  };
}
