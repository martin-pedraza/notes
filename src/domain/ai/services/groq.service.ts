import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { Env } from 'src/common/models/env.model';

@Injectable()
export class GroqService {
  private readonly groq: Groq;

  constructor(private readonly configService: ConfigService<Env>) {
    const apiKey = this.configService.get('GROQ_API_KEY', { infer: true });
    this.groq = new Groq({ apiKey });
  }
  
  private getSystemInstruction(): string {
    return `You are a literary quote generator. Generate a single well-known quote from a classic book. The quote should be brief (maximum 30 words), widely recognized, and be advice or a deep reflection.`;
  }
  
  private getUserPrompt(language: string): string {
    const langText = language === 'es' ? 'Spanish' : 'English';
    return `Generate a famous quote from a classic book and return ONLY a JSON object with two fields: { \"note\": string, \"author\": string }. Return them in ${langText}. Example: { \"note\": \"Call me Ishmael\", \"author\": \"Herman Melville\" }.`;
  }

  async generateNote(language: string = 'en'): Promise<{ note: string; author: string }> {
    const systemInstruction = this.getSystemInstruction();
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

    const content = response.choices[0]?.message?.content?.trim() || '';

    try {
      const parsed = JSON.parse(content);
      const note = (parsed.note || parsed.quote || '').toString().trim();
      const author = (parsed.author || parsed.by || 'Unknown').toString().trim();
      return { note, author };
    } catch (err) {
      const match = content.match(/^[\"“]?(.*?)[\"”]?[\s\-–—]+(.+)$/s);
      if (match) {
        const note = match[1].trim();
        const author = match[2].trim();
        return { note, author };
      }

      return { note: content, author: 'Unknown' };
    }
  }
}
