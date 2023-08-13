import { Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { groupBy, sortBy } from 'lodash';
import NodeCache from 'node-cache';
import { CreateStreamMappingDto } from './dto/create-stream-mapping.dto';
import { DeleteStreamMappingDto } from './dto/delete-stream-maping.dto';

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
  self_verified?: boolean;
};

@Injectable()
export class StreamMappingsService {
  private client: SupabaseClient;
  private cache: NodeCache;

  constructor() {
    this.client = new SupabaseClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_KEY ?? '',
    );

    this.cache = new NodeCache({ stdTTL: 60, checkperiod: 60 });
  }

  private async findAllByArtistTitleAndSource(
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
    } else if (error) {
      throw error;
    } else {
      return [];
    }
  }

  private async findByTrackAndAuthor(
    artist: string,
    title: string,
    source: 'Youtube',
    author_id: string,
  ): Promise<StreamMapping | null> {
    const { data, error } = await this.client
      .from('stream-mappings')
      .select('*')
      .eq('artist', artist)
      .eq('title', title)
      .eq('source', source)
      .eq('author_id', author_id);

    if (data) {
      return data[0] as StreamMapping;
    } else if (error) {
      throw error;
    } else {
      return null;
    }
  }

  async findTopStream(
    artist: string,
    title: string,
    source: 'Youtube',
    author_id?: string,
  ): Promise<StreamIdWithScore | null> {
    const cacheKey = `${artist}:${title}:${source}:`;
    const cachedStream: StreamIdWithScore | undefined =
      this.cache.get(cacheKey);
    if (cachedStream) {
      return cachedStream;
    }

    const streamMappings = await this.findAllByArtistTitleAndSource(
      artist,
      title,
      source,
    );

    if (streamMappings.length === 0) {
      return null;
    }

    const groupedStreams = groupBy(streamMappings, 'stream_id');

    const streamIdsWithScores = Object.entries<StreamMapping[]>(
      groupedStreams,
    ).map(([stream_id, streamMappings]) => ({
      stream_id,
      score: streamMappings.length,
    }));

    const verifiedByCurrentUser = streamMappings.find(
      (streamMapping) => streamMapping.author_id === author_id,
    );

    let topStream: StreamIdWithScore;
    if (verifiedByCurrentUser) {
      topStream = {
        ...(streamIdsWithScores.find(
          (streamIdWithScore) =>
            streamIdWithScore.stream_id === verifiedByCurrentUser.stream_id,
        ) as StreamIdWithScore),
        self_verified: true,
      };
    } else {
      topStream = sortBy(streamIdsWithScores, 'score').reverse()[0];
    }

    this.cache.set(cacheKey, topStream);
    return topStream;
  }

  async verifyTrack(
    createStreamMappingDto: CreateStreamMappingDto,
  ): Promise<void> {
    const existingStreamMapping = await this.findByTrackAndAuthor(
      createStreamMappingDto.artist,
      createStreamMappingDto.title,
      createStreamMappingDto.source,
      createStreamMappingDto.author_id,
    );

    let error;
    if (existingStreamMapping) {
      const result = await this.client
        .from('stream-mappings')
        .update({
          stream_id: createStreamMappingDto.stream_id,
        })
        .eq('id', existingStreamMapping.id);
      error = result.error;
    } else {
      const result = await this.client
        .from('stream-mappings')
        .insert([createStreamMappingDto])
        .single();
      error = result.error;
    }

    if (error) {
      Logger.error('Error verifying track', createStreamMappingDto, error);
      throw error;
    }

    return;
  }

  async unverifyTrack(
    deleteStreamMappingDto: DeleteStreamMappingDto,
  ): Promise<void> {
    const { error } = await this.client
      .from('stream-mappings')
      .delete()
      .eq('artist', deleteStreamMappingDto.artist)
      .eq('title', deleteStreamMappingDto.title)
      .eq('source', deleteStreamMappingDto.source)
      .eq('author_id', deleteStreamMappingDto.author_id);

    if (error) {
      Logger.error('Error unverifying track', deleteStreamMappingDto, error);
      throw error;
    }

    return;
  }
}
