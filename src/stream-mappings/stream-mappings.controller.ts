import { Controller, Inject } from '@nestjs/common';
import { CreateStreamMappingDto } from './dto/create-stream-mapping.dto';
import {
  StreamMapping,
  StreamMappingsService,
} from './stream-mappings.service';

@Controller('stream-mappings')
export class StreamMappingsController {
  constructor(
    @Inject(StreamMappingsService)
    private streamMappingsService: StreamMappingsService,
  ) {}

  async findAllByArtistTitleAndSource(
    artist: string,
    title: string,
    source: StreamMapping['source'],
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

  async isVerifiedByUser(
    author_id: string,
    artist: string,
    title: string,
    source: StreamMapping['source'],
  ) {
    return this.streamMappingsService.isVerifiedByUser(
      author_id,
      artist,
      title,
      source,
    );
  }

  async verifyTrack(createStreamMappingDto: CreateStreamMappingDto) {
    return this.streamMappingsService.verifyTrack(createStreamMappingDto);
  }
}
