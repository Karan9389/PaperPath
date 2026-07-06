[ Step A: Next.js Admin ] ──► Uploads PDF file via Form Data
                                      │
                                      ▼
  [ Step B: Express Server ] ──► Multer intercepts Buffer ──► pdf-parse extracts string
                                                                      │
                                                                      ▼
                                                       Recursive Chunking (1000 chars)
                                                                      │
                                                                      ▼
  [ Step C: Gemini API ]     ──► text-embedding-004 ◄─────────────────┘
                                      │
                                      ▼
                                 768-Dimension Vector Array
                                      │
                                      ▼
  [ Step D: MongoDB Atlas ]  ──► Saved directly into 'papers' collection
                                      │
                                      ▼
  [ Step E: Vector Search ]  ──► $vectorSearch Index handles semantic lookups for Chatbot