import test from 'node:test';
import assert from 'node:assert/strict';

const originalMongoDbUrl = process.env.MONGO_DB_URL;
const originalMongoDbUri = process.env.MONGODB_URI;

process.env.MONGO_DB_URL = '';
delete process.env.MONGODB_URI;

test('connectDB should not crash when MongoDB is not configured', async () => {
  const { default: connectDB } = await import('../src/config/db.js');
  const result = await connectDB();

  assert.ok(result, 'connectDB should return a result object');
  assert.equal(result.connected, false, 'connectDB should degrade gracefully when no DB config is provided');
});

process.env.MONGO_DB_URL = originalMongoDbUrl;
if (originalMongoDbUri === undefined) {
  delete process.env.MONGODB_URI;
} else {
  process.env.MONGODB_URI = originalMongoDbUri;
}
