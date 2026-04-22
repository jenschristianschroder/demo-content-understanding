// ---------------------------------------------------------------------------
// Custom form analyzer service (domain-specific: service request form)
// TODO: Replace mock with Azure Content Understanding custom analyzer
// ---------------------------------------------------------------------------

export async function customFormService(_file: Express.Multer.File) {
  // TODO: Call analyzeContent('custom-service-request', file.buffer, file.mimetype)

  return {
    formType: 'Service Request Form',
    fields: [
      { name: 'Customer Name', value: 'Northwind Traders', confidence: 0.98, fieldType: 'string' },
      { name: 'Customer ID', value: 'NWT-2025-0184', confidence: 0.99, fieldType: 'string' },
      { name: 'Service Type', value: 'HVAC Maintenance', confidence: 0.95, fieldType: 'string' },
      { name: 'Priority', value: 'High', confidence: 0.92, fieldType: 'selectionMark' },
      { name: 'Requested Date', value: '2025-04-10', confidence: 0.97, fieldType: 'date' },
      { name: 'Location', value: '789 Industrial Blvd, Suite 200, Portland, OR 97201', confidence: 0.94, fieldType: 'string' },
      { name: 'Contact Phone', value: '(503) 555-0147', confidence: 0.96, fieldType: 'phoneNumber' },
      { name: 'Contact Email', value: 'facilities@northwindtraders.com', confidence: 0.97, fieldType: 'string' },
      { name: 'Description', value: 'Annual HVAC system inspection and filter replacement for 3rd floor office space. Previous service date: Oct 2024.', confidence: 0.91, fieldType: 'string' },
      { name: 'Authorised By', value: 'Maria Rodriguez', confidence: 0.93, fieldType: 'signature' },
    ],
    rawJson: {
      _note: 'Mock data — wire Azure Content Understanding custom analyzer.',
      analyzerName: 'custom-service-request',
      formType: 'Service Request Form',
      fieldCount: 10,
    },
  };
}
