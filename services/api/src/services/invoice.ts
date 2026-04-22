// ---------------------------------------------------------------------------
// Invoice extraction service
// ---------------------------------------------------------------------------

import { getClient } from '../azureClient.js';
import type { DocumentContent, ContentFieldUnion } from '@azure/ai-content-understanding';

function fieldValue(field: ContentFieldUnion | undefined): string {
  if (!field) return '';
  if (field.value == null) return '';
  if (typeof field.value === 'string') return field.value;
  if (field.value instanceof Date) return field.value.toISOString().slice(0, 10);
  if (typeof field.value === 'number') return String(field.value);
  return '';
}

function fieldNumber(field: ContentFieldUnion | undefined): number {
  if (!field) return 0;
  if (typeof field.value === 'number') return field.value;
  return 0;
}

function fieldConfidence(field: ContentFieldUnion | undefined): number {
  return field?.confidence ?? 0;
}

export async function invoiceService(file: Express.Multer.File) {
  const client = getClient();
  const poller = client.analyzeBinary('prebuilt-invoice', file.buffer, file.mimetype);
  const result = await poller.pollUntilDone();

  const content = result.contents?.[0] as DocumentContent | undefined;
  const f = content?.fields ?? {};

  // Extract top-level invoice fields
  const vendor = fieldValue(f['VendorName']);
  const invoiceNumber = fieldValue(f['InvoiceId']);
  const date = fieldValue(f['InvoiceDate']);

  // InvoiceTotal is an ObjectField with Amount and CurrencyCode sub-fields
  const totalField = f['InvoiceTotal'];
  let total = 0;
  let currency = 'USD';
  if (totalField && totalField.type === 'object' && totalField.value && typeof totalField.value === 'object') {
    const obj = totalField.value as Record<string, ContentFieldUnion>;
    total = fieldNumber(obj['Amount']);
    currency = fieldValue(obj['CurrencyCode']) || 'USD';
  }

  // Build the extra fields list from known invoice properties
  const fieldNames = ['BillingAddress', 'ShippingAddress', 'PurchaseOrder', 'DueDate',
    'PaymentTerms', 'CustomerName', 'VendorAddress', 'CustomerAddress'] as const;
  const fields = fieldNames
    .filter(name => f[name])
    .map(name => ({ name, value: fieldValue(f[name]), confidence: fieldConfidence(f[name]) }));

  // Extract line items
  const lineItemsField = f['LineItems'];
  const lineItems: { description: string; quantity: number; unitPrice: number; amount: number }[] = [];
  if (lineItemsField && lineItemsField.type === 'array' && Array.isArray(lineItemsField.value)) {
    for (const item of lineItemsField.value) {
      if (item && item.type === 'object' && item.value && typeof item.value === 'object') {
        const obj = item.value as Record<string, ContentFieldUnion>;
        const unitPriceField = obj['UnitPrice'];
        const totalAmountField = obj['TotalAmount'];
        let unitPrice = 0;
        let amount = 0;
        if (unitPriceField?.type === 'object' && unitPriceField.value && typeof unitPriceField.value === 'object') {
          unitPrice = fieldNumber((unitPriceField.value as Record<string, ContentFieldUnion>)['Amount']);
        } else {
          unitPrice = fieldNumber(unitPriceField);
        }
        if (totalAmountField?.type === 'object' && totalAmountField.value && typeof totalAmountField.value === 'object') {
          amount = fieldNumber((totalAmountField.value as Record<string, ContentFieldUnion>)['Amount']);
        } else {
          amount = fieldNumber(totalAmountField);
        }
        lineItems.push({
          description: fieldValue(obj['Description']),
          quantity: fieldNumber(obj['Quantity']),
          unitPrice,
          amount,
        });
      }
    }
  }

  return {
    vendor,
    invoiceNumber,
    date,
    total,
    currency,
    fields,
    lineItems,
    rawJson: result as unknown as Record<string, unknown>,
  };
}
