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

  it('should return all stream mappings for a given artist, title, and source combination', async () => {
    SupabaseMock.streamMappings.findAll(
      [
        new StreamMappingBuilder().build(),
        new StreamMappingBuilder().withAuthorId('another-autor').build(),
        new StreamMappingBuilder().withAuthorId('yet-another-autor').build(),
      ],
      'Test Sabbath',
      'Test Pigs',
      'Youtube',
    );

    const result = await controller.findAllByArtistTitleAndSource(
      'Test Sabbath',
      'Test Pigs',
      'Youtube',
    );

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          artist: 'Test Sabbath',
          title: 'Test Pigs',
          source: 'Youtube',
        }),
        expect.objectContaining({
          artist: 'Test Sabbath',
          title: 'Test Pigs',
          source: 'Youtube',
          author_id: 'another-autor',
        }),
        expect.objectContaining({
          artist: 'Test Sabbath',
          title: 'Test Pigs',
          source: 'Youtube',
          author_id: 'yet-another-autor',
        }),
      ]),
    );
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

    const result = await controller.findTopStream(
      'Test Sabbath',
      'Test Pigs',
      'Youtube',
    );

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

    const result = await controller.isVerifiedByUser(
      'another-author-2',
      'Test Sabbath',
      'Test Pigs',
      'Youtube',
    );

    expect(result).toEqual(true);
  });

  it('should verify a track for a given user id, source, artist, and title', async () => {
    const timestamp = new Date().toISOString();
    SupabaseMock.streamMappings.post(
      new StreamMappingBuilder().build(),
      'test-id',
      timestamp,
    );

    const result = await controller.verifyTrack({
      author_id: 'test-author-id',
      artist: 'Test Sabbath',
      title: 'Test Pigs',
      source: 'Youtube',
      stream_id: 'test-stream-id',
    });

    expect(result).toEqual({
      id: 'test-id',
      artist: 'Test Sabbath',
      title: 'Test Pigs',
      source: 'Youtube',
      stream_id: 'test-stream-id',
      author_id: 'test-author-id',
      created_at: timestamp,
    });
  });
});
