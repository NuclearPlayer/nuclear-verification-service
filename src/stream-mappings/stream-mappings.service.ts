import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

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
}
