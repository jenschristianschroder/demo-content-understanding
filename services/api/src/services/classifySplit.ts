// ---------------------------------------------------------------------------
// Document classification & splitting service
// TODO: Replace mock with Azure Content Understanding API call
// ---------------------------------------------------------------------------

export async function classifySplitService(_file: Express.Multer.File) {
  // TODO: Call analyzeContent('prebuilt-classifier', file.buffer, file.mimetype)

  return {
    totalPages: 12,
    sections: [
      { index: 0, classification: 'Invoice', confidence: 0.97, pageRange: [1, 3] as [number, number] },
      { index: 1, classification: 'Purchase Order', confidence: 0.94, pageRange: [4, 5] as [number, number] },
      { index: 2, classification: 'Receipt', confidence: 0.91, pageRange: [6, 7] as [number, number] },
      { index: 3, classification: 'Contract', confidence: 0.88, pageRange: [8, 10] as [number, number] },
      { index: 4, classification: 'Letter', confidence: 0.85, pageRange: [11, 12] as [number, number] },
    ],
    rawJson: {
      _note: 'Mock data — wire Azure Content Understanding classifier.',
      totalPages: 12,
      documents: [
        { docType: 'Invoice', pages: '1-3', confidence: 0.97 },
        { docType: 'Purchase Order', pages: '4-5', confidence: 0.94 },
        { docType: 'Receipt', pages: '6-7', confidence: 0.91 },
        { docType: 'Contract', pages: '8-10', confidence: 0.88 },
        { docType: 'Letter', pages: '11-12', confidence: 0.85 },
      ],
    },
  };
}
