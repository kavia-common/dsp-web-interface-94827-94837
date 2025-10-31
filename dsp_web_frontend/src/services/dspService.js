import api from './apiClient';

// TODO: Confirm endpoint and response shape for DSP prompt.
// Assumption: POST /dsp/query { prompt } -> { response: string }

export async function sendPrompt(prompt) {
  const { data } = await api.post('/dsp/query', { prompt });
  return data; // expecting { response }
}
