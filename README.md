# Azure AI Content Understanding — Demo App

A polished Microsoft demo kiosk for **Azure AI Content Understanding**, built as a companion to the [Speech Service demo](https://github.com/jenschristianschroder/demo-speech-service). The same architecture, visual style, and engineering approach — applied to document, image, audio, and video analysis.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Browser (SPA)                                      │
│  React 19 + Vite 6 + React Router 7                │
│  Uploads files → calls /api/content-understanding/* │
└──────────────┬──────────────────────────────────────┘
               │ HTTP (nginx reverse proxy)
               ▼
┌─────────────────────────────────────────────────────┐
│  API Service (Express 4 · Node 20 · TypeScript)     │
│  POST /api/content-understanding/{scenario}         │
│  GET  /health/{startup,live,ready}                  │
│  DefaultAzureCredential → Azure AI Services         │
└──────────────┬──────────────────────────────────────┘
               │ Managed Identity (RBAC)
               ▼
┌─────────────────────────────────────────────────────┐
│  Azure AI Content Understanding                     │
└─────────────────────────────────────────────────────┘
```

- **SPA** never holds Azure keys — all Azure calls go through the backend.
- **Backend** uses `DefaultAzureCredential` for passwordless authentication.
- **nginx** reverse-proxies `/api/*` and `/health/*` to the backend.
- **Docker Compose** runs both services locally.
- **Bicep** deploys to Azure Container Apps.

## Demo Scenarios

| # | Scenario | Endpoint | Description |
|---|----------|----------|-------------|
| 1 | Invoice Extraction | `POST /api/content-understanding/invoice` | Extract structured JSON from invoices |
| 2 | Document Classification & Splitting | `POST /api/content-understanding/classify-split` | Classify and split mixed-document bundles |
| 3 | Image / Chart Summary | `POST /api/content-understanding/image-summary` | Summarise charts, dashboards, or infographics |
| 4 | Audio Call Analysis | `POST /api/content-understanding/audio-analysis` | Transcribe, identify speakers, summarise calls |
| 5 | Video Clip Analysis | `POST /api/content-understanding/video-analysis` | Transcribe, detect chapters, summarise videos |
| 6 | Custom Analyzer | `POST /api/content-understanding/custom-form` | Domain-specific form extraction (service requests) |
| 7 | Document → Markdown | `POST /api/content-understanding/markdown` | Convert documents to Markdown for RAG/search |
| 8 | Extraction with Confidence | `POST /api/content-understanding/review` | Extract fields with confidence scores for review |

## Project Structure

```
content-understanding/
├── src/                          # Frontend SPA
│   ├── App.tsx                   # Router setup
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Global kiosk styles
│   ├── types.ts                  # Scenario definitions & shared types
│   ├── services/
│   │   └── contentApi.ts         # API client
│   └── pages/
│       ├── WelcomeScreen.tsx     # Landing page
│       ├── FeaturesScreen.tsx    # Scenario picker
│       ├── DemoScreen.tsx        # Dynamic demo wrapper
│       └── demos/                # One component per scenario
│           ├── FileInput.tsx     # Shared file input component
│           ├── InvoiceDemo.tsx
│           ├── ClassifySplitDemo.tsx
│           ├── ImageSummaryDemo.tsx
│           ├── AudioAnalysisDemo.tsx
│           ├── VideoAnalysisDemo.tsx
│           ├── CustomFormDemo.tsx
│           ├── MarkdownDemo.tsx
│           └── ReviewDemo.tsx
├── services/api/                 # Backend API
│   └── src/
│       ├── index.ts              # Express server
│       ├── azureClient.ts        # Azure SDK adapter
│       ├── routes/
│       │   ├── content.ts        # Content Understanding endpoints
│       │   └── health.ts         # Health probes
│       └── services/             # One module per scenario
│           ├── invoice.ts
│           ├── classifySplit.ts
│           ├── imageSummary.ts
│           ├── audioAnalysis.ts
│           ├── videoAnalysis.ts
│           ├── customForm.ts
│           ├── markdown.ts
│           └── review.ts
├── public/
│   ├── images/                   # Logo, favicon
│   └── samples/                  # Sample files for demos
├── infra/                        # Bicep IaC
│   ├── main.bicep
│   └── modules/
├── Dockerfile                    # SPA container (nginx)
├── docker-compose.yml
├── nginx.conf
└── package.json
```

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Frontend

```bash
npm install
npm run dev
```

The SPA runs at `http://localhost:3000` and proxies `/api` to `http://localhost:3001`.

### Backend

```bash
cd services/api
npm install
npm run dev
```

The API runs at `http://localhost:3001`.

### Both together with Docker

```bash
docker compose up --build
```

Open `http://localhost:3000`.

## Environment Variables

### Backend (`services/api`)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | API port (default: `3001`) | No |
| `AZURE_CONTENT_UNDERSTANDING_ENDPOINT` | Azure AI Services endpoint URL | For Azure integration |
| `AZURE_CONTENT_UNDERSTANDING_REGION` | Azure region (e.g. `swedencentral`) | For Azure integration |
| `CORS_ORIGIN` | Allowed CORS origin (default: `*`) | No |

### Frontend (optional)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE` | API base URL override (default: empty, uses same origin) |

## How Each Demo Works

### 1. Invoice Extraction
Upload a PDF or image of an invoice. The service extracts vendor name, invoice number, date, line items, and totals into structured JSON. The summary view shows key fields and a line item table; the JSON tab shows the raw API response.

### 2. Document Classification & Splitting
Upload a multi-page PDF containing different document types. The service identifies where each document starts/ends and classifies it (invoice, receipt, contract, etc.). Results show a visual list of detected sections with confidence badges.

### 3. Image / Chart Summary
Upload a screenshot of a chart, dashboard, or infographic. The service generates a natural-language summary and extracts structured insights (chart type, key values, trends). Includes an image preview.

### 4. Audio Call Analysis
Upload a WAV, MP3, or M4A recording. The service transcribes the audio, identifies speakers (diarisation), and generates a call summary. Three tabs: summary, speaker-segmented transcript, and raw JSON.

### 5. Video Clip Analysis
Upload an MP4 or MOV video. The service generates a transcript, detects logical chapters with timestamps, and produces an overall summary. Three tabs: summary with transcript, chapter list, and raw JSON.

### 6. Custom Analyzer
A domain-specific scenario — a field service company's paper-based service request forms. The custom analyzer extracts fields like customer name, service type, priority, and location. Demonstrates how to build custom extractors for industry forms.

### 7. Document → Markdown
Upload a PDF, DOCX, or PPTX. The service converts it to clean Markdown suitable for RAG pipelines and search indexing. Three tabs: rendered Markdown preview, raw Markdown source, and API JSON.

### 8. Extraction with Confidence
Upload an insurance claim form (or similar). The service extracts all fields with per-field confidence scores. Fields below threshold are flagged for human review with visual indicators. Designed for human-in-the-loop workflows.

## Azure Deployment

Deploy using Bicep:

```bash
az deployment group create \
  --resource-group <rg-name> \
  --template-file infra/main.bicep \
  --parameters aiServicesResourceId=<resource-id> imageTag=<tag>
```

The infrastructure deploys:
- Azure Container Registry (Basic)
- Container Apps Environment with Log Analytics
- User-Assigned Managed Identity with Cognitive Services User + AcrPull roles
- Container App for API (internal ingress)
- Container App for SPA (external ingress)

## TODO — Azure Integration

The app currently returns **realistic mock data** for all 8 scenarios so it's immediately demoable.

To wire up real Azure Content Understanding:

1. Set `AZURE_CONTENT_UNDERSTANDING_ENDPOINT` and `AZURE_CONTENT_UNDERSTANDING_REGION`
2. Implement `analyzeContent()` in `services/api/src/azureClient.ts`
3. Update each service module in `services/api/src/services/` to call the Azure API instead of returning mock data
4. Each service file has `TODO` comments marking exactly where to add the integration

## Sample Files

Place real sample files in `public/samples/` (see [samples README](public/samples/README.md) for the full list). The current placeholder files won't produce meaningful results — they exist so the project structure is complete.

## License

MIT
