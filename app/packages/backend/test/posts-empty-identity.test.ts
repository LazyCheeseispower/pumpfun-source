import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PostStore,
  SYNTHETIC_POSTS_SEED,
  type RawPost,
} from '../src/posts-store.js';

test('blank post identities are rejected before indexing', () => {
  const seed = structuredClone(SYNTHETIC_POSTS_SEED.slice(0, 1)) as RawPost[];
  seed[0].postId = '';
  assert.throws(
    () => new PostStore(seed),
    /Post identity must be non-empty/,
  );
});
