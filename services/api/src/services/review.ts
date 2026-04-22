// ---------------------------------------------------------------------------
// Extraction with confidence / human-review service
// TODO: Replace mock with Azure Content Understanding API call
// ---------------------------------------------------------------------------

export async function reviewService(_file: Express.Multer.File) {
  // TODO: Call analyzeContent('prebuilt-review', file.buffer, file.mimetype)

  return {
    documentType: 'Insurance Claim Form',
    fields: [
      { name: 'Claim Number', value: 'CLM-2025-00492', confidence: 0.99, needsReview: false },
      { name: 'Policy Number', value: 'POL-8847-2021', confidence: 0.98, needsReview: false },
      { name: 'Claimant Name', value: 'Alexandra Chen', confidence: 0.97, needsReview: false },
      { name: 'Date of Incident', value: '2025-03-28', confidence: 0.95, needsReview: false },
      { name: 'Incident Type', value: 'Water Damage', confidence: 0.93, needsReview: false },
      { name: 'Damage Description', value: 'Burst pipe in upstairs bathroom caused water damage to ceiling and flooring in ground floor living room', confidence: 0.89, needsReview: false },
      { name: 'Estimated Cost', value: '$8,750.00', confidence: 0.72, needsReview: true },
      { name: 'Contractor Name', value: 'R & J Restorations', confidence: 0.64, needsReview: true },
      { name: 'Contractor License', value: 'WA-RES-2019-4421', confidence: 0.58, needsReview: true },
      { name: 'Previous Claims', value: '1 (2022 - Wind damage, $3,200)', confidence: 0.81, needsReview: false },
      { name: 'Signature Date', value: '2025-04-01', confidence: 0.96, needsReview: false },
      { name: 'Adjuster Notes', value: 'Photos attached. Site visit scheduled for April 5.', confidence: 0.45, needsReview: true },
    ],
    overallConfidence: 0.82,
    rawJson: {
      _note: 'Mock data — wire Azure Content Understanding extraction with confidence.',
      documentType: 'Insurance Claim Form',
      fieldCount: 12,
      fieldsNeedingReview: 4,
      overallConfidence: 0.82,
    },
  };
}
