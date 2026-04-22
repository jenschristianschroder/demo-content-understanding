// ---------------------------------------------------------------------------
// Invoice extraction service
// TODO: Replace mock with Azure Content Understanding API call
// ---------------------------------------------------------------------------

// import { analyzeContent } from '../azureClient.js';

export async function invoiceService(_file: Express.Multer.File) {
  // TODO: Call analyzeContent('prebuilt-invoice', file.buffer, file.mimetype)
  // and map the response to the InvoiceResult shape.

  // Mock response for demo purposes
  return {
    vendor: 'Contoso Ltd.',
    invoiceNumber: 'INV-2025-04871',
    date: '2025-03-15',
    total: 4250.00,
    currency: 'USD',
    fields: [
      { name: 'BillingAddress', value: '123 Main Street, Redmond, WA 98052', confidence: 0.97 },
      { name: 'ShippingAddress', value: '456 Oak Avenue, Seattle, WA 98101', confidence: 0.95 },
      { name: 'PurchaseOrder', value: 'PO-2025-0042', confidence: 0.99 },
      { name: 'DueDate', value: '2025-04-15', confidence: 0.98 },
      { name: 'PaymentTerms', value: 'Net 30', confidence: 0.96 },
    ],
    lineItems: [
      { description: 'Azure AI Services – Content Understanding (Standard)', quantity: 1, unitPrice: 2500.00, amount: 2500.00 },
      { description: 'Professional Services – Integration Support', quantity: 10, unitPrice: 150.00, amount: 1500.00 },
      { description: 'Documentation & Training Materials', quantity: 1, unitPrice: 250.00, amount: 250.00 },
    ],
    rawJson: {
      _note: 'This is mock data. Wire Azure Content Understanding API to get real results.',
      analyzerName: 'prebuilt-invoice',
      status: 'succeeded',
      content: { vendor: 'Contoso Ltd.', invoiceNumber: 'INV-2025-04871', total: 4250.00 },
    },
  };
}
