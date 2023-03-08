import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { StreamMappingBuilder, SupabaseMock } from 'test/supabase-mock';

import { TestFixture } from 'test/test-fixture';
import { StreamMappingsController } from './stream-mappings.controller';
import { StreamMappingsModule } from './stream-mappings.module';
import { StreamMappingsService } from './stream-mappings.service';

describe('Stream mappings - E2E tests', () => {
  let app: INestApplication;

  beforeAll(() => {
    TestFixture.beforeAll();
  });

  beforeEach(async () => {
    app = await createApp();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should validate verification requests', async () => {
    return request(app.getHttpServer())
      .post('/stream-mappings/verify')
      .send({})
      .expect(400, {
        statusCode: 400,
        message: [
          'artist should not be empty',
          'title should not be empty',
          'source must be one of the following values: Youtube',
          'source should not be empty',
          'stream_id should not be empty',
          'author_id should not be empty',
        ],
        error: 'Bad Request',
      });
  });

  it('should verify a track', async () => {
    const timestamp = new Date().toISOString();
    SupabaseMock.streamMappings.post(
      new StreamMappingBuilder().build(),
      'test-id',
      timestamp,
    );

    await request(app.getHttpServer())
      .post('/stream-mappings/verify')
      .send({
        author_id: 'test-author-id',
        artist: 'Test Sabbath',
        title: 'Test Pigs',
        source: 'Youtube',
        stream_id: 'test-stream-id',
      })
      .expect(201);
  });
});

export const createApp = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [ConfigModule.forRoot(), StreamMappingsModule],
    controllers: [StreamMappingsController],
    providers: [StreamMappingsService],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  return app;
};
