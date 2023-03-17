import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { CreateStreamMappingDto } from './dto/create-stream-mapping.dto';
import { DeleteStreamMappingDto } from './dto/delete-stream-maping.dto';
import {
  StreamMapping,
  StreamMappingsService,
} from './stream-mappings.service';

type FindTopStreamBody = {
  artist: string;
  title: string;
  source: StreamMapping['source'];
  author_id?: string;
};

@Controller('stream-mappings')
export class StreamMappingsController {
  constructor(
    @Inject(StreamMappingsService)
    private streamMappingsService: StreamMappingsService,
  ) {}

  @HttpCode(200)
  @Post('top-stream')
  async findTopStream(
    @Body() { artist, title, source, author_id }: FindTopStreamBody,
  ) {
    const result = await this.streamMappingsService.findTopStream(
      artist,
      title,
      source,
      author_id,
    );

    if (result) {
      return result;
    }

    throw new HttpException('No streams found', HttpStatus.NOT_FOUND);
  }

  @HttpCode(201)
  @Post('verify')
  async verifyTrack(@Body() createStreamMappingDto: CreateStreamMappingDto) {
    return this.streamMappingsService.verifyTrack(createStreamMappingDto);
  }

  @HttpCode(200)
  @Delete('unverify')
  async unverifyTrack(@Body() deleteStreamMappingDto: DeleteStreamMappingDto) {
    return this.streamMappingsService.unverifyTrack(deleteStreamMappingDto);
  }
}
