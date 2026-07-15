const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.resolve(__dirname, '..', '.cache');
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCachePath(key) {
  return path.join(CACHE_DIR, `${key}.json`);
}

function isExpired(mtime, ttlMs) {
  return Date.now() - mtime > ttlMs;
}

function get(key, options = {}) {
  const { ttlMs = DEFAULT_TTL_MS, refresh = false } = options;

  if (refresh) return null;

  const cachePath = getCachePath(key);
  if (!fs.existsSync(cachePath)) return null;

  const stats = fs.statSync(cachePath);
  if (isExpired(stats.mtimeMs, ttlMs)) return null;

  try {
    const data = fs.readFileSync(cachePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.warn(`Warning: failed to read cache ${cachePath}: ${err.message}`);
    return null;
  }
}

function set(key, data) {
  ensureCacheDir();
  const cachePath = getCachePath(key);
  fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
}

function clear(key) {
  const cachePath = getCachePath(key);
  if (fs.existsSync(cachePath)) {
    fs.unlinkSync(cachePath);
  }
}

module.exports = {
  get,
  set,
  clear,
  getCachePath,
};
