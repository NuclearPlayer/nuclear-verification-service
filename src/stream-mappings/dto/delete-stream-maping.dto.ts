import { IsEnum, IsNotEmpty } from 'class-validator';
import { StreamMapping } from '../stream-mappings.service';

export class DeleteStreamMappingDto {
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
  author_id: string;
}
