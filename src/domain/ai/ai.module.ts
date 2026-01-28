import { Module } from '@nestjs/common';
import { GroqService } from './services/groq.service';

@Module({
  providers: [GroqService],
  exports: [GroqService],
})
export class AiModule {}
