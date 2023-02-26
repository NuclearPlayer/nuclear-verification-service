import { Controller, Inject } from '@nestjs/common';
import { StreamMappingsService } from './stream-mappings.service';

@Controller('stream-mappings')
export class StreamMappingsController {
  constructor(
    @Inject(StreamMappingsService)
    private streamMappingsService: StreamMappingsService,
  ) {}

  async findAllByArtistTitleAndSource(
    artist: string,
    title: string,
    source: 'Youtube',
  ) {
    return this.streamMappingsService.findAllByArtistTitleAndSource(
      artist,
      title,
      source,
    );
  }

  async findTopStream(artist: string, title: string, source: 'Youtube') {
    return this.streamMappingsService.findTopStream(artist, title, source);
  }
}
