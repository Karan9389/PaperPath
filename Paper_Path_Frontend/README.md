# PaperPath Frontend Setup

## Project Overview
PaperPath is a React-based frontend for a research paper learning platform. It provides:
- **Login View**: User authentication
- **Dashboard View**: Browse and filter research papers by difficulty level
- **Reader View**: Read papers with an integrated AI tutor chat

## Quick Start

### Prerequisites
- Node.js 16+ and npm installed
- VS Code with the Copilot extension

### Installation & Development
1. Open terminal in the project root
2. Run: `npm install`
3. Run: `npm run dev`
4. Open http://localhost:3000 in your browser

### Build for Production
Run: `npm run build`
Output will be in the `dist/` folder

## Project Structure
```
Paper_Path_Frontend/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind CSS imports
├── public/                  # Static assets
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration

## Technologies
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **lucide-react**: Icon library

## Features
- Mock API adapter for development (simulates delays)
- Authentication with login/logout
- Paper browsing and filtering
- Save/unsave papers
- Reading history tracking
- AI tutor chat with the paper open

## Backend Integration
Replace mock API calls in `src/App.jsx` with actual endpoints:
- Login: `POST /api/auth/login`
- Fetch papers: `GET /api/papers?difficulty=Beginner`
- Get library: `GET /api/users/library`
- Save paper: `POST /api/users/save/{paperId}`
- History: `POST /api/users/history/{paperId}`
- Chat: `POST /api/papers/{paperId}/ask`

## Notes
- All styling uses Tailwind CSS classes
- Icons from lucide-react
- Responsive design (mobile, tablet, desktop)
- Dark mode support can be added via Tailwind configuration
