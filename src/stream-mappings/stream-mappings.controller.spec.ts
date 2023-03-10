import { Test, TestingModule } from '@nestjs/testing';

import { StreamMappingBuilder, SupabaseMock } from 'test/supabase-mock';
import { TestFixture } from 'test/test-fixture';
import { StreamMappingsController } from './stream-mappings.controller';
import { StreamMappingsService } from './stream-mappings.service';

describe('StreamMappingsController', () => {
  let controller: StreamMappingsController;

  beforeAll(() => {
    TestFixture.beforeAll();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamMappingsService],
      controllers: [StreamMappingsController],
    }).compile();

    controller = module.get<StreamMappingsController>(StreamMappingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    const result = await controller.findTopStream({
      artist: 'Test Sabbath',
      title: 'Test Pigs',
      source: 'Youtube',
    });

    expect(result).toEqual({
      stream_id: 'test-stream-id',
      score: 3,
    });
  });

  it('for a given user id, source, artist, and title, it should say whether that user has already verified this track', async () => {
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

    const result = await controller.isVerifiedBy({
      author_id: 'another-author-2',
      artist: 'Test Sabbath',
      title: 'Test Pigs',
      source: 'Youtube',
    });

    expect(result).toEqual({ result: true });
  });
});
