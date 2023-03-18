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

  it('should return 404 if there are no mappings for a given track', async () => {
    SupabaseMock.streamMappings.findAll(
      [],
      'Test artist',
      'Test title',
      'Youtube',
    );

    return request(app.getHttpServer())
      .post('/stream-mappings/top-stream')
      .send({
        artist: 'Test artist',
        title: 'Test title',
        source: 'Youtube',
      })
      .expect(404);
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

  it('should return the top stream and its score for a given artist, title, and source combination', async () => {
    SupabaseMock.streamMappings.findAll(
      [
        new StreamMappingBuilder().build(),
        new StreamMappingBuilder().withAuthorId('another-author').build(),
        new StreamMappingBuilder().withAuthorId('another-author-2').build(),
        new StreamMappingBuilder()
          .withStreamId('another-stream-id')
          .withAuthorId('another-author-3')
          .build(),
      ],
      'Test Sabbath',
      'Test Pigs',
      'Youtube',
    );

    return request(app.getHttpServer())
      .post('/stream-mappings/top-stream')
      .send({
        artist: 'Test Sabbath',
        title: 'Test Pigs',
        source: 'Youtube',
      })
      .expect(200, {
        stream_id: 'test-stream-id',
        score: 3,
      });
  });

  it('should return the stream the user has previously verified even if there are other streams with higher score', async () => {
    SupabaseMock.streamMappings.findAll(
      [
        new StreamMappingBuilder().build(),
        new StreamMappingBuilder().withAuthorId('another-author').build(),
        new StreamMappingBuilder()
          .withStreamId('my-stream-id')
          .withAuthorId('my-author-id')
          .build(),
      ],
      'Test Sabbath',
      'Test Pigs',
      'Youtube',
    );

    return request(app.getHttpServer())
      .post('/stream-mappings/top-stream')
      .send({
        artist: 'Test Sabbath',
        title: 'Test Pigs',
        source: 'Youtube',
        author_id: 'my-author-id',
      })
      .expect(200, {
        stream_id: 'my-stream-id',
        score: 1,
        self_verified: true,
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

  it('should unverify a track', async () => {
    SupabaseMock.streamMappings.delete(new StreamMappingBuilder().build());

    await request(app.getHttpServer())
      .delete('/stream-mappings/unverify')
      .send({
        author_id: 'test-author-id',
        artist: 'Test Sabbath',
        title: 'Test Pigs',
        source: 'Youtube',
      })
      .expect(200);
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
