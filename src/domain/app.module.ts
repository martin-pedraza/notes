import { Module } from '@nestjs/common';
import { IntroModule } from './intro/intro.module';
import { AiModule } from './ai/ai.module';
import { NotesModule } from './notes/notes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    IntroModule,
    AiModule,
    NotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
