import axios from 'axios';

// Use VITE_API_URL from environment variables, or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/ai`
  : 'http://localhost:4000/api/ai';

// Helper function to create an axios instance with the auth token
const getApiClient = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found for AI service request.');
    return axios.create({ baseURL: API_URL });
  }
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// --- THIS IS THE NEW UNIFIED FUNCTION ---
// It calls the new '/command' endpoint for all AI interactions
// If the server responds with 400 (e.g., missing field expected by HELP path),
// automatically falls back to '/ask' with the same text as a question.
const sendAiCommand = async (textInput) => {
  console.log('=== Sending AI Command ===');
  console.log('Text Input:', textInput);
  console.log('API URL:', API_URL);

  const api = getApiClient();
  try {
    const response = await api.post('/command', { textInput });
    console.log('AI Response:', response.data);
    return response.data; // { message, task } or { answer }
  } catch (err) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || '';
    console.warn('AI command error:', status, msg);

    // Fallback for HELP/greetings or schema mismatches
    if (status === 400) {
      try {
        const fallback = await api.post('/ask', { question: textInput });
        console.log('AI Fallback (/ask) Response:', fallback.data);
        return fallback.data;
      } catch (fallbackErr) {
        console.error('AI fallback (/ask) failed:', fallbackErr?.response?.status, fallbackErr?.response?.data);
        throw fallbackErr;
      }
    }

    throw err;
  }
};

// --- We also keep the 'askAI' function for now, but point it to the new command ---
// This ensures our old chat component doesn't break before we update it
const askAI = async (question) => {
  const api = getApiClient();
  const response = await api.post('/ask', { question });
  return response.data;
}


const aiService = {
  sendAiCommand,
  askAI // We still export this for the help assistant
};

export default aiService;









// import axios from 'axios';

// // The base URL for our AI backend routes
// const API_URL = 'https://dash-decisive-assistant-for-scheduling.onrender.com/api/ai';

// // Helper function to create an axios instance with the auth token
// const getApiClient = () => {
//   const token = localStorage.getItem('token'); // Get token from storage
//   if (!token) {
//     console.error('No token found for AI service request.');
//     // In a real app, you might trigger a logout or redirect here
//     return axios.create({ baseURL: API_URL }); // Return basic instance to avoid crash
//   }
//   return axios.create({
//     baseURL: API_URL,
//     headers: {
//       Authorization: `Bearer ${token}`, // Include the token in the header
//     },
//   });
// };

// // --- API Functions ---

// // 1. Function to ask the AI assistant a question
// const askAI = async (question) => {
//   const api = getApiClient();
//   // Make a POST request to the '/ask' endpoint
//   const response = await api.post('/ask', { question });
//   return response.data; // Return the response data (which should contain the 'answer')
// };

// // 2. Function to create a task from natural language text
// const createTaskFromText = async (textInput) => {
//   const api = getApiClient();
//   // Make a POST request to the '/create-task-text' endpoint
//   const response = await api.post('/create-task-text', { textInput });
//   return response.data; // Return the response data (message and the new 'task' object)
// };

// // Bundle functions for export
// const aiService = {
//   askAI,
//   createTaskFromText,
// };

// export default aiService;






