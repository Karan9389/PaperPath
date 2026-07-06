#  PaperPath MVP Implementation Roadmap

## 📦 Phase 1: Document Processing & RAG Ingestion [Current]
- [ ] Install `multer` for raw file stream parsing
- [ ] Create `POST /api/papers/upload` route handler
- [ ] Connect file buffers to `processPdfAndGenerateEmbeddings` in `geminiServices.js`
- [ ] Verify text chunk arrays and 768-dimension vectors are saving to Atlas via Postman

## 🔍 Phase 2: Atlas Vector Index Configuration
- [ ] Set up JSON mapping rules for Atlas Vector Search on the `papers` collection
- [ ] Complete local vector similarity test execution inside MongoDB dashboard

## 🤖 Phase 3: Level-Aware Chatbot Core
- [ ] Create `POST /api/papers/:id/chat` route handler
- [ ] Implement `$vectorSearch` pipeline query using Mongoose aggregate framework
- [ ] Format prompt structures targeting matching `targetLevel` constraints
- [ ] Implement real-time explanation token streaming using Server-Sent Events (SSE)

## 🏆 Phase 4: Gamification & Progress
- [ ] Create `POST /api/papers/:id/progress` (Status: discovered, reading, completed)
- [ ] Create `POST /api/papers/:id/reviews` (Community-driven difficulty scoring calculations)
- [ ] Create `GET /api/users/profile` (Aggregate user learning matrices)