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
      'test artist',
      'test title',
      'Youtube',
    );

    const result = await controller.findAllByArtistTitleAndSource(
      'test artist',
      'test title',
      'Youtube',
    );

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          artist: 'test artist',
          title: 'test title',
          source: 'Youtube',
        }),
        expect.objectContaining({
          artist: 'test artist',
          title: 'test title',
          source: 'Youtube',
          author_id: 'another-autor',
        }),
        expect.objectContaining({
          artist: 'test artist',
          title: 'test title',
          source: 'Youtube',
          author_id: 'yet-another-autor',
        }),
      ]),
    );
  });
});
