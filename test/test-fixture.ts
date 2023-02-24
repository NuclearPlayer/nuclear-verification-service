import { SupabaseUrl } from './supabase-mock';

// Sets up the test environment for all tests
export class TestFixture {
  static beforeAll() {
    process.env.SUPABASE_URL = SupabaseUrl;
    process.env.SUPABASE_KEY = 'test-key';
  }
}
