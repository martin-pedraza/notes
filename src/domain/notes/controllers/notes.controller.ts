import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { NotesService } from '../services/notes.service';
import { v4 as uuidv4 } from 'uuid';
import { Note } from 'src/common/models/note.model';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get daily note',
    description:
      'Generates a personalized daily note for your device. Notes are cached per device and language for the entire day. Automatically sets a device-id cookie on first request.',
  })
  @ApiQuery({
    name: 'lang',
    type: 'string',
    enum: ['en', 'es'],
    required: false,
    description: 'Language for the note and page content. Default: en',
    example: 'en',
  })
  @ApiResponse({
    status: 200,
    description: 'JSON object containing the daily note and author',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            note: { type: 'string', example: 'Call me Ishmael' },
            author: { type: 'string', example: 'Herman Melville' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - Could be due to Groq API failure',
  })
  async getNote(
    @Query('lang') lang: string = 'en',
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Note> {
    const language = lang === 'es' ? 'es' : 'en';

    let deviceId = req.cookies['device-id'];
    if (!deviceId) {
      deviceId = uuidv4();
      res.cookie('device-id', deviceId, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
    }

    return this.notesService.getNote(deviceId, language);
  }
}
