import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Inject,
  Post,
} from '@nestjs/common';
import { CreateStreamMappingDto } from './dto/create-stream-mapping.dto';
import {
  StreamMapping,
  StreamMappingsService,
} from './stream-mappings.service';

type FindTopStreamBody = {
  artist: string;
  title: string;
  source: StreamMapping['source'];
};

type IsVerifiedByUserBody = {
  author_id: string;
  artist: string;
  title: string;
  source: StreamMapping['source'];
};

@Controller('stream-mappings')
export class StreamMappingsController {
  constructor(
    @Inject(StreamMappingsService)
    private streamMappingsService: StreamMappingsService,
  ) {}

  @HttpCode(200)
  @Post('top-stream')
  async findTopStream(@Body() { artist, title, source }: FindTopStreamBody) {
    return this.streamMappingsService.findTopStream(artist, title, source);
  }

  @HttpCode(200)
  @Post('is-verified-by')
  async isVerifiedBy(
    @Body() { author_id, artist, title, source }: IsVerifiedByUserBody,
  ) {
    return this.streamMappingsService.isVerifiedByUser(
      author_id,
      artist,
      title,
      source,
    );
  }

  @HttpCode(201)
  @Post('verify')
  async verifyTrack(@Body() createStreamMappingDto: CreateStreamMappingDto) {
    return this.streamMappingsService.verifyTrack(createStreamMappingDto);
  }

  @HttpCode(200)
  @Delete('unverify')
  async unverifyTrack(@Body() createStreamMappingDto: CreateStreamMappingDto) {
    return this.streamMappingsService.unverifyTrack(createStreamMappingDto);
  }
}
