import { Module } from '@nestjs/common';
import { StreamMappingsService } from './stream-mappings.service';
import { StreamMappingsController } from './stream-mappings.controller';

@Module({
  providers: [StreamMappingsService],
  exports: [StreamMappingsService],
  controllers: [StreamMappingsController],
})
export class StreamMappingsModule {}
