import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { Env } from 'src/common/models/env.model';

/**
 * Groq Service
 * Handles all AI-powered note generation using Groq's API.
 *
 * Responsibilities:
 * - Initialize and manage Groq client connection
 * - Generate localized prompts for different languages
 * - Call Groq API to generate creative, relevant notes
 * - Return trimmed and processed note content
 */
@Injectable()
export class GroqService {
  private readonly groq: Groq;

  constructor(private readonly configService: ConfigService<Env>) {
    const apiKey = this.configService.get('GROQ_API_KEY', { infer: true });
    this.groq = new Groq({ apiKey });
  }

  /**
   * Get system instruction for Groq based on language
   * Defines the role and behavior of the AI model
   *
   * @param language Language code ('es' or 'en')
   * @returns System instruction string for the selected language
   */
  private getSystemInstruction(language: string): string {
    if (language === 'es') {
      return `Eres un generador de citas literarias. 
        Genera una única cita bien conocida de un libro clásico. 
        Retorna SOLO la cita, nada más. 
        Debe estar en español.
        La cita debe ser breve (máximo 30 palabras) y ampliamente reconocida. 
        La cita debe ser un consejo o reflexión profunda.
        Ejemplos: "Llámame Ismael", "Era el mejor de los tiempos", "Ser o no ser".`;
    }

    return `You are a literary quote generator. 
        Generate a single well-known quote from a classic book. 
        Return ONLY the quote, nothing else. 
        It must be in English.
        The quote should be brief (maximum 30 words) and widely recognized. 
        The quote should be advice or a deep reflection.
        Examples: "Call me Ishmael", "It was the best of times", "To be or not to be".`;
  }

  /**
   * Get user prompt for Groq based on language
   * Requests note generation in the specified language
   *
   * @param language Language code ('es' or 'en')
   * @returns User prompt string for the selected language
   */
  private getUserPrompt(language: string): string {
    return language === 'es'
      ? 'Genera una cita famosa de un libro clásico.'
      : 'Generate a famous quote from a classic book.';
  }

  /**
   * Generate a note using Groq API
   * Calls the Groq API with language-specific prompts and returns the generated note
   *
   * Note limits:
   * - Max tokens: 100 (ensures brief responses)
   * - Max characters: 155 (enforced by Notes Service)
   *
   * @param language Language code ('es' or 'en'). Defaults to 'en'
   * @returns Promise resolving to the generated note string
   *
   * @throws Error if API call fails or response is malformed
   */
  async generateNote(language: string = 'en'): Promise<string> {
    const systemInstruction = this.getSystemInstruction(language);
    const userPrompt = this.getUserPrompt(language);

    const response = await this.groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: systemInstruction,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const generatedQuote = response.choices[0]?.message?.content?.trim() || '';
    return generatedQuote;
  }
}
