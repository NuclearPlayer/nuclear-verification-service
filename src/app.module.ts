import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { StreamMappingsController } from './stream-mappings/stream-mappings.controller';
import { StreamMappingsModule } from './stream-mappings/stream-mappings.module';
import { StreamMappingsService } from './stream-mappings/stream-mappings.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    StreamMappingsModule,
  ],
  controllers: [StreamMappingsController],
  providers: [StreamMappingsService],
})
export class AppModule {}
