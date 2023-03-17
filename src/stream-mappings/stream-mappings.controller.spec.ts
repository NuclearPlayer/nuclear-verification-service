import { Test, TestingModule } from '@nestjs/testing';

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
});
