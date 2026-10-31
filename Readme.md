# PaperPath: AI-Powered Research Paper Filtering with RAG and Gemini API

## 1. Project Title & Overview

**PaperPath** is an innovative application designed to streamline the research paper discovery and filtering process. Leveraging a modern MERN (MongoDB, Express.js, React, Node.js) stack, it integrates Retrieval-Augmented Generation (RAG) with the Google Gemini API to provide intelligent, context-aware responses to user queries about academic papers. This system enables researchers to efficiently navigate vast repositories of scientific literature, extract key information, and gain insights without manually sifting through numerous documents.

## 2. Tech Stack

PaperPath is built upon a robust and scalable technology stack, designed for performance and flexibility.

*   **Frontend**: React.js, Vite, Tailwind CSS
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (NoSQL Database), Mongoose (ODM)
*   **AI/LLM**: Google Gemini API
*   **RAG Implementation**: LangChain.js, @google/genai (for Gemini interaction)
*   **Core Libraries**: JSON Web Tokens (JWT) for authentication, Multer for file uploads, Nodemailer for email services.

## 3. Dependencies

### Backend Dependencies (`Paper_Path_Backend/package.json`)

*   `@google/genai`: `^2.10.0` - Official Google Gemini API client library for direct interaction with the Gemini large language models.
*   `@langchain/core`: `^1.1.48` - Core components for LangChain.js, providing fundamental abstractions for building LLM applications, including chains, prompts, and agents.
*   `@langchain/google-genai`: `^2.1.31` - LangChain integration for Google Gemini, enabling seamless use of Gemini models within LangChain workflows for RAG.
*   `cors`: `^2.8.6` - Middleware to enable Cross-Origin Resource Sharing (CORS), allowing the frontend to make requests to the backend API.
*   `csv-parser`: `^3.2.1` - A fast CSV parser, likely used for ingesting data (e.g., metadata about papers) from CSV files.
*   `dotenv`: `^17.4.2` - Loads environment variables from a `.env` file into `process.env`, securing sensitive configuration.
*   `express`: `^5.2.1` - Fast, unopinionated, minimalist web framework for Node.js, forming the backbone of the backend API.
*   `fs`: `^0.0.1-security` - Node.js's built-in file system module, used for interacting with the file system, such as reading uploaded papers.
*   `jsonwebtoken`: `^9.0.3` - An implementation of JSON Web Tokens, used for secure authentication and authorization of API requests.
*   `mongodb`: `^7.2.0` - The official MongoDB driver for Node.js, enabling direct interaction with the MongoDB database.
*   `mongoose`: `^9.6.2` - MongoDB object data modeling (ODM) library for Node.js, providing a schema-based solution to model application data.
*   `multer`: `^2.2.0` - Node.js middleware for handling `multipart/form-data`, primarily used for uploading files (e.g., research papers).
*   `nodemailer`: `^9.0.3` - A module for sending emails from Node.js applications, potentially for user registration, password resets, or notifications.
*   `pdf2json`: `^4.0.3` - A PDF parser that converts PDF files into JSON format, likely used for extracting text content from uploaded research papers for indexing and RAG.
*   `nodemon`: `^3.1.14` (Dev Dependency) - A utility that monitors for any changes in your source and automatically restarts your server, enhancing development workflow.

### Frontend Dependencies (`Paper_Path_Frontend/package.json`)

*   `lucide-react`: `^0.263.1` - A collection of beautiful and customizable SVG icons for React applications, used for UI elements.
*   `react`: `^18.2.0` - The core JavaScript library for building user interfaces.
*   `react-dom`: `^18.2.0` - Provides DOM-specific methods that can be used at the top level of a web app to enable efficient management of DOM elements.
*   `autoprefixer`: `^10.4.14` (Dev Dependency) - PostCSS plugin to parse CSS and add vendor prefixes to CSS rules, ensuring cross-browser compatibility.
*   `postcss`: `^8.4.24` (Dev Dependency) - A tool for transforming CSS with JavaScript, used by Tailwind CSS.
*   `tailwindcss`: `^3.3.0` (Dev Dependency) - A utility-first CSS framework for rapidly building custom designs.
*   `vite`: `^4.4.5` (Dev Dependency) - A next-generation frontend tooling that provides an extremely fast development experience.
*   `@vitejs/plugin-react`: `^4.0.3` (Dev Dependency) - A Vite plugin for React projects.
*   `@types/react`: `^18.2.15` (Dev Dependency) - Type definitions for React.
*   `@types/react-dom`: `^18.2.7` (Dev Dependency) - Type definitions for React DOM.

## 4. System Architecture & Design

### Architectural Diagram

```mermaid
graph TD
    User[Web Browser React Frontend] -->|HTTP Requests| NGINX(NGINX Proxy / Load Balancer)
    NGINX -->|API Calls (e.g., /api/auth, /api/papers, /api/ai)| Backend(Express.js / Node.js Backend)

    subgraph Backend Services
        Backend --|Authenticates Users| AuthController[Auth Controller]
        Backend --|Manages Papers & Reviews| PaperController[Paper & Review Controller]
        Backend --|Handles AI Interactions| AIController[AI Controller]
        Backend --|User Management| UserController[User Controller]
    end

    Backend -->|Stores/Retrieves User Data, Papers, Reviews| MongoDB[(MongoDB Database)]
    Backend --|Uploads Files (PDFs)| Multer(Multer Middleware)
    Multer --> LocalStorage[Local File Storage (./uploads)]
    Backend -->|Parses PDFs for Text Extraction| PDFParser[pdf2json]
    PDFParser --> TextData[Extracted Text Data]

    TextData -->|Generates Embeddings (LangChain)| EmbeddingService[LangChain Embedding Service]
    EmbeddingService --> VectorStore[(Vector Database - likely in-memory/file-based or MongoDB Atlas Vector Search)]
    AIController -->|Retrieves Context (Similarity Search)| VectorStore
    AIController -->|Sends Prompt + Context| GeminiAPI(Google Gemini API)
    GeminiAPI -->|Returns LLM Response| AIController
    AIController -->|Sends AI Response| Backend
    Backend -->|Responds with Data/AI Output| User
```

### System Components

*   **React Frontend**: The user interface, built with React, responsible for user interaction, displaying research papers, search results, and AI-generated responses. It communicates with the Express.js backend via RESTful API calls.
*   **Express.js / Node.js Backend**: The core application logic, handling API requests, user authentication, database interactions, file uploads, and orchestrating the RAG process.
    *   **Controllers**: Handle incoming requests, interact with services and models, and send responses (e.g., `authController.js`, `aiController.js`, `searchController.js`, `userController.js`).
    *   **Models**: Define the schema for data stored in MongoDB using Mongoose (e.g., `paper.js`, `review.js`, `user.js`, `userProgress.js`).
    *   **Routes**: Define the API endpoints and map them to corresponding controller functions (e.g., `authRouters.js`, `aiRoutes.js`, `paperRoutes.js`, `userRoutes.js`).
    *   **Services**: Encapsulate business logic and external integrations, such as `geminiServices.js` for interacting with the Gemini API and RAG pipeline components.
    *   **Middleware**: Intercept requests for tasks like authentication (`authMiddleware.js`).
    *   **Configuration**: Manages database connections, environment variables, and mailer settings (`db.js`, `env.js`, `mailer.js`).
*   **MongoDB Database**: A NoSQL database used to store application data such as user profiles, research paper metadata, and reviews.
*   **Vector Database**: Essential for RAG, this database stores vector embeddings of the research paper content. While a dedicated vector database is ideal, it could be implemented using in-memory vector stores (e.g., `Chroma`, `Faiss` in LangChain) or MongoDB Atlas's Vector Search capabilities depending on scale.
*   **Google Gemini API**: The Large Language Model (LLM) that powers the conversational AI, generating responses based on retrieved context from the research papers.
*   **Local File Storage**: Stores the uploaded PDF research paper files before their content is processed and indexed.

## 5. Data Flow & RAG Implementation

The RAG implementation in PaperPath follows a multi-step data lifecycle designed for efficient and context-rich AI interactions.

### Step-by-Step Data Lifecycle

1.  **Ingestion**:
    *   Users upload research papers (PDFs) via the frontend.
    *   The `multer` middleware on the backend (`server.js`, `routes/paperRoutes.js`) handles the file upload, saving the PDF to `./uploads`.
    *   The `pdf2json` library (`services/paperService.js` or similar utility called by `paperController.js`) extracts raw text content from the uploaded PDF.
2.  **Embedding Generation**:
    *   The extracted text is then segmented into smaller, manageable chunks suitable for embedding.
    *   `LangChain.js` components, specifically within `services/geminiServices.js` or `aiController.js`, use the Google Gemini embedding model (via `@langchain/google-genai` and `@google/genai`) to convert these text chunks into numerical vector embeddings. These embeddings capture the semantic meaning of the text.
3.  **Vector Storage**:
    *   These generated vector embeddings are stored in a Vector Database. The current setup implies either an in-memory vector store or potentially leveraging MongoDB Atlas's Vector Search features if configured.
    *   Each vector is associated with metadata pointing back to the original research paper and its chunk.
4.  **Querying**:
    *   When a user submits a query related to research papers, the `aiController.js` receives this natural language query.
    *   The user's query is also converted into a vector embedding using the same Gemini embedding model.
5.  **Context Retrieval (Similarity Search)**:
    *   The embedded user query is then used to perform a similarity search against the Vector Database.
    *   The search identifies and retrieves the top-k (most similar) vector embeddings, which correspond to relevant text chunks from the ingested research papers. This process is orchestrated by `LangChain.js` within `services/geminiServices.js`.
    *   These retrieved text chunks serve as the "context" for the LLM.
6.  **Gemini API LLM Generation**:
    *   The `aiController.js` constructs a comprehensive prompt that includes the original user query and the retrieved context from the Vector Database.
    *   This augmented prompt is sent to the Google Gemini API (`services/geminiServices.js`).
    *   Gemini processes the prompt, using the provided context to generate a highly relevant and informed response.
7.  **Response**:
    *   The AI-generated response from Gemini is sent back through the backend to the frontend, where it is displayed to the user.

### Explicit RAG Implementation Details

*   **Embedding Generation**:
    *   Files: `Paper_Path_Backend/src/services/geminiServices.js`, possibly `Paper_Path_Backend/src/controllers/aiController.js` (for orchestration).
    *   Libraries: `@google/genai`, `@langchain/google-genai`, `@langchain/core`.
    *   Process: Text chunks are passed to LangChain's embedding models, which interface with the Gemini API to produce vectors.
*   **Vector Storage**:
    *   The exact vector database is not explicitly defined but would be initialized within `Paper_Path_Backend/src/services/geminiServices.js` (e.g., `MemoryVectorStore` or a connection to a persistent vector store). MongoDB could be used for metadata.
*   **Similarity Search**:
    *   Files: `Paper_Path_Backend/src/services/geminiServices.js`, `Paper_Path_Backend/src/controllers/aiController.js`.
    *   Libraries: `@langchain/core`.
    *   Process: User query embeddings are compared against stored document embeddings to find the most relevant chunks.
*   **Prompt Construction**:
    *   Files: `Paper_Path_Backend/src/controllers/aiController.js` (main logic), `Paper_Path_Backend/src/services/geminiServices.js` (helper for LLM calls).
    *   Process: The `aiController.js` is responsible for taking the user's query and the retrieved document chunks and formatting them into a clear, concise prompt for the Gemini LLM.

## 6. Key Features

*   **AI-Powered Research Paper Q&A**: Ask natural language questions about uploaded papers and receive concise, context-aware answers generated by the Gemini API.
*   **Retrieval-Augmented Generation (RAG)**: Ensures AI responses are grounded in the actual content of your research papers, reducing hallucinations and improving factual accuracy.
*   **User Authentication & Authorization**: Secure user login, registration, and protected routes using JWT.
*   **Research Paper Management**: Upload, store, and manage a collection of research papers.
*   **User Progress Tracking**: (Potentially) Track user interactions or reading progress on papers.
*   **Search Functionality**: Efficiently search through your uploaded papers.
*   **Intuitive User Interface**: A modern and responsive frontend built with React and Tailwind CSS.

## 7. Getting Started & Installation

Follow these steps to set up and run PaperPath locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   MongoDB (local instance or cloud service like MongoDB Atlas)
*   Google Gemini API Key

### 1. Clone the Repository

```bash
git clone https://github.com/Karan9389/PaperPath.git
cd PaperPath
```

### 2. Backend Setup

Navigate to the backend directory, install dependencies, and configure environment variables.

```bash
cd Paper_Path_Backend
npm install
```

Create a `.env` file in the `Paper_Path_Backend/` directory and add the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_strong_secret_key_for_jwt
GEMINI_API_KEY=your_google_gemini_api_key
EMAIL_USER=your_email@example.com # For Nodemailer, if used
EMAIL_PASS=your_email_password # For Nodemailer, if used
```

*   Replace `your_mongodb_connection_string` with your MongoDB URI (e.g., `mongodb://localhost:27017/paperpath` or your MongoDB Atlas connection string).
*   Replace `a_strong_secret_key_for_jwt` with a complex, random string.
*   Replace `your_google_gemini_api_key` with your actual Google Gemini API key.
*   Configure `EMAIL_USER` and `EMAIL_PASS` if email functionalities are needed (e.g., for user verification or password reset).

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies.

```bash
cd ../Paper_Path_Frontend
npm install
```

The frontend may also require environment variables, especially for API endpoint configuration. If there's a `.env` file for the frontend, it would typically contain:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

#### Run Backend

In the `Paper_Path_Backend/` directory:

```bash
npm run dev
```

The backend server will start, typically on `http://localhost:5000`.

#### Run Frontend

In the `Paper_Path_Frontend/` directory:

```bash
npm run dev
```

The frontend development server will start, typically on `http://localhost:5173` (or another port as configured by Vite). Open your browser to this address to access the application.
