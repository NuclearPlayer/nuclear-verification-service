import * as nock from 'nock';

import { StreamMapping } from 'src/stream-mappings/stream-mappings.service';

export const SupabaseUrl = 'http://supabase-url';

export class StreamMappingBuilder {
  #id = 'test-id';
  #artist = 'Test Sabbath';
  #title = 'Test Pigs';
  #source: StreamMapping['source'] = 'Youtube';
  #stream_id = 'test-stream-id';
  #author_id = 'test-author-id';
  #created_at: Date = new Date();

  withArtist(artist: string) {
    this.#artist = artist;
    return this;
  }

  withTitle(title: string) {
    this.#title = title;
    return this;
  }

  withStreamId(stream_id: string) {
    this.#stream_id = stream_id;
    return this;
  }

  withAuthorId(author_id: string) {
    this.#author_id = author_id;
    return this;
  }

  build(): StreamMapping {
    return {
      id: this.#id,
      artist: this.#artist,
      title: this.#title,
      source: this.#source,
      stream_id: this.#stream_id,
      author_id: this.#author_id,
      created_at: this.#created_at,
    };
  }
}

export const SupabaseMock = {
  streamMappings: {
    findAll: (
      streamMappings: StreamMapping[],
      artist: string,
      title: string,
      source: StreamMapping['source'],
    ) =>
      nock(SupabaseUrl)
        .get('/rest/v1/stream-mappings')
        .query({
          select: '*',
          artist: `eq.${artist}`,
          title: `eq.${title}`,
          source: `eq.${source}`,
        })
        .reply(200, streamMappings),
  },
};
