// Import the necessary libraries
import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Initialize the Generative AI client
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await genAI.models.generateContent({
  model: 'gemini-2.0-flash',
  contents: `What is the sum of the first 50 prime numbers?
    
    Generate and run code for the calculation, and make sure you get all 50.`,
  config: {
    tools: [
      {
        codeExecution: {},
      },
    ],
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function displayCodeExecutionResult(
  response,
  codeFilename = 'output.py'
) {
  const parts = response.candidates[0].content.parts;

  for (const part of parts) {
    if (part.text) {
      console.log('Markdown:\n', part.text);
    }

    if (part.executableCode) {
      const code = part.executableCode.code;
      const codeHtml = `<pre style="background-color: #BBBBEE;">${code}</pre>`;
      console.log('Code Block:\n', codeHtml);

      // Save code to file
      const fullPath = join(__dirname, codeFilename);
      writeFileSync(fullPath, code);
      console.log(`Code saved to ${fullPath}`);
    }

    if (part.codeExecutionResult) {
      console.log('Execution Output:\n', part.codeExecutionResult.output);
    }

    console.log('---');
  }
}

displayCodeExecutionResult(response);
