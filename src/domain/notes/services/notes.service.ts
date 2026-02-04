import { Injectable } from '@nestjs/common';
import { GroqService } from 'src/domain/ai/services/groq.service';
import { Note } from 'src/common/models/note.model';

@Injectable()
export class NotesService {
  private noteCache = new Map<string, Note>();

  constructor(private readonly groqService: GroqService) {}

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  async getNote(deviceId: string, language: string = 'en'): Promise<Note> {
    const today = this.getTodayDate();
    const cacheKey = `${deviceId}_${today}_${language}`;

    const cached = this.noteCache.get(cacheKey);
    if (cached) {
      console.log(
        `✓ Note found in cache for device ${deviceId} in ${language}`,
      );
      return cached;
    }

    console.log(`◇ Generating new note for device ${deviceId} in ${language}`);
    const generated = await this.groqService.generateNote(language);

    let noteText = generated.note || '';
    if (noteText.length > 155) {
      noteText = noteText.substring(0, 155).trim();
    }

    const noteObj: Note = {
      note: noteText,
      author: generated.author || 'Unknown',
      date: today,
    };

    this.noteCache.set(cacheKey, noteObj);

    return noteObj;
  }
}
