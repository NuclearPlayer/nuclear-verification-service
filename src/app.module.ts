import { Module } from '@nestjs/common';
import { StreamMappingsController } from './stream-mappings/stream-mappings.controller';
import { StreamMappingsModule } from './stream-mappings/stream-mappings.module';
import { StreamMappingsService } from './stream-mappings/stream-mappings.service';

@Module({
  imports: [StreamMappingsModule],
  controllers: [StreamMappingsController],
  providers: [StreamMappingsService],
})
export class AppModule {}
