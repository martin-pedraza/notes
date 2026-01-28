import { Module } from '@nestjs/common';
import { IntroController } from './controllers/intro.controller';
import { IntroService } from './services/intro.service';

@Module({
  controllers: [IntroController],
  providers: [IntroService],
  exports: [IntroService],
})
export class IntroModule {}
