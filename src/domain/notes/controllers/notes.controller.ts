import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { NotesService } from '../services/notes.service';
import { TemplateHelper } from 'src/common/helpers/template.helper';
import { v4 as uuidv4 } from 'uuid';

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
    description: 'HTML page with daily note rendered with selected language',
    content: {
      'text/html': {
        schema: {
          type: 'string',
          example: '<!DOCTYPE html>...',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal server error - Could be due to Groq API failure or template loading error',
  })
  async getNote(
    @Query('lang') lang: string = 'en',
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const language = lang === 'es' ? 'es' : 'en';

    let deviceId = req.cookies['device-id'];
    if (!deviceId) {
      deviceId = uuidv4();
      res.cookie('device-id', deviceId, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      });
    }

    const note = await this.notesService.getNote(deviceId, language);
    const template = TemplateHelper.loadTemplate('note');
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    const formattedDate = new Date().toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const i18n = {
      en: {
        pageTitle: 'Daily Note',
        headerTitle: '✨ Daily Note',
        footerText: 'Generated for your device',
      },
      es: {
        pageTitle: 'Nota del Día',
        headerTitle: '✨ Nota del Día',
        footerText: 'Generado para tu dispositivo',
      },
    };

    const localized = i18n[language];

    const html = TemplateHelper.render(template, {
      LANG: language,
      PAGE_TITLE: localized.pageTitle,
      HEADER_TITLE: localized.headerTitle,
      DATE: formattedDate,
      NOTE: note,
      FOOTER_TEXT: localized.footerText,
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }
}
