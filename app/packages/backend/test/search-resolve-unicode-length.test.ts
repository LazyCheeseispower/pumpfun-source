import assert from 'node:assert/strict';
import test from 'node:test';
import { buildApp } from './with-api-key.js';
import { UserStore } from '../src/users-store.js';

test('search resolve applies the declared Unicode-character identifier limit', async t => {
  const app = buildApp([], { userStore: new UserStore([]) });
  t.after(() => app.close());
  const send = (identifier: string) => app.inject(
    `/v1/search/resolve?identifiers=${encodeURIComponent(identifier)}`,
  );

  // The route cannot resolve synthetic non-UUID identifiers locally, but it
  // must reach that unavailable branch rather than rejecting valid lengths.
  for (const identifier of [
    'a'.repeat(128),
    '🚀'.repeat(65),
    '🚀'.repeat(128),
  ]) {
    const response = await send(identifier);
    assert.equal(response.statusCode, 501, `${[...identifier].length} code points`);
    assert.equal(response.json().reason, 'SEARCH_RESOLVE_IDENTIFIER_UNAVAILABLE');
  }

  for (const identifier of ['a'.repeat(129), '🚀'.repeat(129)]) {
    const response = await send(identifier);
    assert.equal(response.statusCode, 400);
    assert.equal(response.json().error, 'INVALID_QUERY');
  }
});
