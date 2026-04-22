// ---------------------------------------------------------------------------
// Document-to-Markdown conversion service
// TODO: Replace mock with Azure Content Understanding API call
// ---------------------------------------------------------------------------

export async function markdownService(_file: Express.Multer.File) {
  // TODO: Call analyzeContent('prebuilt-markdown', file.buffer, file.mimetype)

  return {
    markdown: `# Quarterly Business Review — Q1 2025

## Executive Summary

Contoso achieved **$12.4M in revenue** for Q1 2025, representing a **15% increase** over Q1 2024. Key growth drivers included the expansion of AI-powered services and increased enterprise adoption.

## Key Metrics

- **Revenue**: $12.4M (+15% YoY)
- **New Customers**: 142 (+22% QoQ)
- **Customer Retention**: 94.7%
- **NPS Score**: 72 (up from 68)

## Product Highlights

### Azure AI Content Understanding
- Launched public preview in February 2025
- 500+ active preview customers
- Processes 2M+ documents per day

### Platform Updates
- New multi-modal analysis capabilities
- Improved classification accuracy to 97.3%
- Added support for 15 additional languages

## Financial Summary

| Category | Q1 2025 | Q1 2024 | Change |
|----------|---------|---------|--------|
| Revenue | $12.4M | $10.8M | +15% |
| Operating Costs | $8.1M | $7.6M | +7% |
| Net Income | $4.3M | $3.2M | +34% |

## Next Quarter Outlook

Focus areas for Q2 2025:
- GA release of Content Understanding
- Expansion into healthcare vertical
- Launch of partner certification programme

*Report prepared by: Contoso Finance Team — April 2025*`,
    pageCount: 3,
    rawJson: {
      _note: 'Mock data — wire Azure Content Understanding document-to-markdown.',
      pageCount: 3,
      characterCount: 1247,
      tables: 1,
      headings: 6,
    },
  };
}
