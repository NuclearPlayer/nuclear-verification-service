import { StreamMapping } from '../stream-mappings.service';

export type CreateStreamMappingDto = {
  artist: string;
  title: string;
  source: StreamMapping['source'];
  stream_id: string;
  author_id: string;
};
