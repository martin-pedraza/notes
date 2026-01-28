import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IntroService } from '../services/intro.service';

@ApiTags('Intro')
@Controller()
export class IntroController {
  constructor(private readonly introService: IntroService) {}

  @Get()
  @ApiOperation({
    summary: 'Get API Documentation',
    description:
      'Returns the API documentation rendered as HTML. This is the home page of the API.',
  })
  @ApiResponse({
    status: 200,
    description: 'HTML page with formatted API documentation',
  })
  getIntro(): string {
    return this.introService.getIntro();
  }
}
