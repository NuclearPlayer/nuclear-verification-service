import { IsNotEmpty } from 'class-validator';

export class DeleteStreamMappingDto {
  @IsNotEmpty()
  artist: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  source: string;

  @IsNotEmpty()
  author_id: string;
}
