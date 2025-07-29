import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  vertexai: true,
  project: 'genai-test-467401', // Replace with your Google Cloud project ID
  location: 'us-central1',   // Replace with your region (e.g., us-central1, europe-west4)
});

const model = 'gemini-2.5-flash';

async function generateContent() {
  const req = {
    model: model,
    contents: 'say hi',
  };

  const streamingResp = await ai.models.generateContentStream(req);

  for await (const chunk of streamingResp) {
    if (chunk.text) {
      process.stdout.write(chunk.text);
    } else {
      process.stdout.write(JSON.stringify(chunk) + '\n');
    }
  }
}

generateContent();
