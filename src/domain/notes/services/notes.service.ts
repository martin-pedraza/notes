import { Injectable } from '@nestjs/common';
import { GroqService } from 'src/domain/ai/services/groq.service';
import { Note } from 'src/common/models/note.model';

/**
 * Notes Service
 * Manages note generation with intelligent in-memory caching.
 *
 * Responsibilities:
 * - Generate new notes via Groq API
 * - Cache notes per device and language for the entire day
 * - Return cached notes without calling Groq when possible
 * - Ensure notes don't exceed 155 characters
 * - Log cache hits and misses for debugging
 *
 * Cache Strategy:
 * - Key format: `{deviceId}_{today}_{language}`
 * - Notes are cached for the calendar day (UTC)
 * - New day = new cache entry + new note generation
 * - Multiple devices/languages maintain separate cache entries
 */
@Injectable()
export class NotesService {
  private noteCache = new Map<string, Note>();

  constructor(private readonly groqService: GroqService) {}

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  async getNote(deviceId: string, language: string = 'en'): Promise<string> {
    const today = this.getTodayDate();
    const cacheKey = `${deviceId}_${today}_${language}`;

    const cached = this.noteCache.get(cacheKey);
    if (cached) {
      console.log(
        `✓ Note found in cache for device ${deviceId} in ${language}`,
      );
      return cached.note;
    }

    console.log(`◇ Generating new note for device ${deviceId} in ${language}`);
    let newNote = await this.groqService.generateNote(language);

    if (newNote.length > 155) {
      newNote = newNote.substring(0, 155).trim();
    }

    this.noteCache.set(cacheKey, {
      note: newNote,
      date: today,
    });

    return newNote;
  }
}
