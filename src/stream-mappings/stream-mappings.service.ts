import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { groupBy, sortBy } from 'lodash';
import { CreateStreamMappingDto } from './dto/create-stream-mapping.dto';

// Server-side representation of a stream mapping
export type StreamMapping = {
  id: string;
  artist: string;
  title: string;
  source: 'Youtube';
  stream_id: string;
  author_id: string;
  created_at: Date;
};

export type StreamIdWithScore = {
  stream_id: string;
  score: number;
};

@Injectable()
export class StreamMappingsService {
  private client: SupabaseClient;

  constructor() {
    this.client = new SupabaseClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async findAllByArtistTitleAndSource(
    artist: string,
    title: string,
    source: 'Youtube',
  ): Promise<StreamMapping[]> {
    const { data, error } = await this.client
      .from('stream-mappings')
      .select('*')
      .eq('artist', artist)
      .eq('title', title)
      .eq('source', source);

    if (data) {
      return data as StreamMapping[];
    } else {
      throw error;
    }
  }

  async findTopStream(
    artist: string,
    title: string,
    source: 'Youtube',
  ): Promise<StreamIdWithScore | null> {
    const streamMappings = await this.findAllByArtistTitleAndSource(
      artist,
      title,
      source,
    );

    if (streamMappings.length === 0) {
      return null;
    }

    const groupedStreams = groupBy(streamMappings, 'stream_id');

    const streamIdsWithScores = Object.entries(groupedStreams).map(
      ([stream_id, streamMappings]) => ({
        stream_id,
        score: streamMappings.length,
      }),
    );

    return sortBy(streamIdsWithScores, 'score').reverse()[0];
  }

  async isVerifiedByUser(
    author_id: string,
    artist: string,
    title: string,
    source: 'Youtube',
  ): Promise<boolean> {
    const streamMappings = await this.findAllByArtistTitleAndSource(
      artist,
      title,
      source,
    );

    return streamMappings.some(
      (streamMapping) => streamMapping.author_id === author_id,
    );
  }

  async verifyTrack(
    createStreamMappingDto: CreateStreamMappingDto,
  ): Promise<StreamMapping> {
    const { data, error } = await this.client
      .from('stream-mappings')
      .insert([createStreamMappingDto])
      .single();

    if (data) {
      return data[0] as StreamMapping;
    } else {
      throw error;
    }
  }
}
