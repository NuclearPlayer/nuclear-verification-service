import { IsEnum, IsNotEmpty } from 'class-validator';
import { StreamMapping } from '../stream-mappings.service';

export class CreateStreamMappingDto {
  @IsNotEmpty()
  artist: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsEnum({
    Youtube: 'Youtube',
  })
  source: StreamMapping['source'];

  @IsNotEmpty()
  stream_id: string;

  @IsNotEmpty()
  author_id: string;
}
