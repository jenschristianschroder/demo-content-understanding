// ---------------------------------------------------------------------------
// Image / chart summary service
// TODO: Replace mock with Azure Content Understanding API call
// ---------------------------------------------------------------------------

export async function imageSummaryService(_file: Express.Multer.File) {
  // TODO: Call analyzeContent('prebuilt-image-summary', file.buffer, file.mimetype)

  return {
    summary: 'This bar chart shows quarterly revenue for FY2025. Q1 generated $2.4M, Q2 rose to $3.1M (+29%), Q3 peaked at $3.8M, and Q4 projections indicate $4.2M. The overall trend shows consistent quarter-over-quarter growth averaging 21%.',
    insights: [
      { label: 'Chart Type', value: 'Bar Chart' },
      { label: 'Time Period', value: 'FY2025 Q1–Q4' },
      { label: 'Peak Value', value: '$3.8M (Q3)' },
      { label: 'Growth Trend', value: '+21% avg QoQ' },
      { label: 'Data Series', value: 'Revenue' },
      { label: 'Currency', value: 'USD' },
    ],
    rawJson: {
      _note: 'Mock data — wire Azure Content Understanding image analysis.',
      chartType: 'bar',
      dataPoints: [
        { quarter: 'Q1', value: 2400000 },
        { quarter: 'Q2', value: 3100000 },
        { quarter: 'Q3', value: 3800000 },
        { quarter: 'Q4', value: 4200000 },
      ],
    },
  };
}
