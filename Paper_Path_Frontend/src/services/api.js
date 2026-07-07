export const MOCK_PAPERS = [
  { _id: '1', title: 'Attention Is All You Need', difficultyLevel: 'Advanced', abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...', tags: ['AI', 'Transformers'] },
  { _id: '2', title: 'Introduction to Photosynthesis', difficultyLevel: 'Beginner', abstract: 'Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy...', tags: ['Biology', 'Foundations'] },
  { _id: '3', title: 'The Basics of Quantum Mechanics', difficultyLevel: 'Intermediate', abstract: 'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms...', tags: ['Physics', 'Quantum'] },
  { _id: '4', title: 'Understanding Plate Tectonics', difficultyLevel: 'Beginner', abstract: 'Plate tectonics is the scientific theory that Earth\'s lithosphere is comprised of a number of large tectonic plates...', tags: ['Earth Science', 'Geology'] },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';


const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(endpoint, { method = 'GET', body, mockData, delayMs = 800 } = {}) {
  if (USE_MOCK_API) {
    await delay(delayMs);
    return mockData;
  }

  try {
    const token = getStoredToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || 'Request failed');
    }

    return payload.data ?? payload;
  } catch (error) {
    if (endpoint === '/auth/login' || endpoint === '/auth/register') {
      return mockData;
    }

    if (error instanceof Error) {
      throw new Error(error.message || 'Unable to reach the server. Make sure the backend is running.');
    }

    throw new Error('Unable to reach the server. Make sure the backend is running.');
  }
}


export const authService = {
  login: async ({ email, password }) => {
    const result = await request('/auth/login', {
      method: 'POST',
      body: { email, password },
      mockData: {
        _id: 'u1',
        name: 'Demo User',
        email,
        role: 'student',
        token: 'mock-jwt-token',
      },
      delayMs: 600,
    });
    persistToken(result);
    return result;
  },
  register: async ({ name, email, password }) => {
    const result = await request('/auth/register', {
      method: 'POST',
      body: { name, email, password },
      mockData: {
        _id: 'u1',
        name,
        email,
        role: 'student',
        token: 'mock-jwt-token',
      },
      delayMs: 700,
    });
    persistToken(result);
    return result;
  },
};


export const paperService = {
  list: async () => request('/papers', { mockData: MOCK_PAPERS, delayMs: 700 }),
  getById: async (paperId) => {
    const paper = MOCK_PAPERS.find((item) => item._id === paperId);
    return request(`/papers/${paperId}`, { mockData: paper, delayMs: 500 });
  },
};


 export const libraryService = {
  getLibrary: async () =>
    request('/users/library', {
      mockData: {
        savedPapers: [MOCK_PAPERS[1]],
        readHistory: [MOCK_PAPERS[3]],
      },
      delayMs: 700,
    }),
  savePaper: async (paperId) =>
    request(`/users/save/${paperId}`, {
      method: 'POST',
      mockData: { success: true, paperId },
      delayMs: 400,
    }),
  unsavePaper: async (paperId) =>
    request(`/users/save/${paperId}`, {
      method: 'DELETE',
      mockData: { success: true, paperId },
      delayMs: 400,
    }),
  trackPaper: async (paperId) =>
    request(`/users/history/${paperId}`, {
      method: 'POST',
      mockData: { success: true, paperId },
      delayMs: 400,
    }),
};


 export const chatService = {
  askQuestion: async ({ paperId, prompt }) => {
    const normalizedPrompt = prompt.toLowerCase();
    const reply = normalizedPrompt.includes('explain like i\'m in class 10')
      ? 'Okay, imagine you have a giant library of ideas. Instead of reading every book, this system creates a smart index so it can jump straight to the exact page you need.'
      : 'That is a great question. In simple terms, the core idea is built from a few straightforward concepts that become clearer when you connect them to everyday examples.';

    return request(`/papers/${paperId}/ask`, {
      method: 'POST',
      body: { prompt },
      mockData: reply,
      delayMs: 1200,
    });
  },
};
