import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { StreamMappingsModule } from './stream-mappings/stream-mappings.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    StreamMappingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
