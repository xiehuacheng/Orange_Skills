const { execSync } = require('child_process');

const DEFAULT_QUERIES = [
  'frontend',
  'testing',
  'security',
  'design',
  'devops',
  'react',
  'agent',
  'memory',
  'documentation'
];

// Strip ANSI escape sequences (colors, cursor movement, etc.)
function stripAnsi(text) {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\u001b\[[0-9;]*m/g, '');
}

function parseInstalls(text) {
  const clean = stripAnsi(text).trim();
  const match = clean.match(/([\d.]+)\s*(K|M)?\s*installs?/i);
  if (!match) return null;

  let value = parseFloat(match[1]);
  const unit = match[2] ? match[2].toUpperCase() : '';

  if (unit === 'K') value *= 1000;
  if (unit === 'M') value *= 1000000;

  return Math.round(value);
}

function parseSkillLine(line) {
  // Strip ANSI first, then match owner/repo@skill-name installs
  const clean = stripAnsi(line).trim();

  // Format: owner/repo@skill-name 123.4K installs
  const match = clean.match(/^([\w.-]+\/[\w.-]+)@([\w.-]+)\s+(.+)$/);
  if (!match) return null;

  const fullName = match[1];
  const skillName = match[2];
  const metaText = match[3];

  const installs = parseInstalls(metaText);
  if (!installs) return null;

  const [owner, repoName] = fullName.split('/');

  return {
    id: fullName,
    owner,
    repo: repoName,
    name: skillName,
    full_name: fullName,
    skill_id: `${fullName}@${skillName}`,
    installs,
    source: 'skills.sh',
    source_url: `https://skills.sh/${fullName}/${skillName}`
  };
}

function runSkillsFind(query) {
  try {
    const output = execSync(`npx skills find ${query}`, {
      encoding: 'utf8',
      timeout: 60000,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return stripAnsi(output);
  } catch (err) {
    console.error(`skills.sh search failed for "${query}":`, err.message);
    return '';
  }
}

function parseFindOutput(output) {
  const items = [];
  const lines = output.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.includes('Tip:') || line.includes('Usage:') || line.includes('Install with')) continue;
    if (line.startsWith('└') || line.startsWith('https://')) continue;

    const item = parseSkillLine(line);
    if (item) {
      items.push(item);
      // Skip the URL line if present
      if (lines[i + 1] && lines[i + 1].trim().startsWith('└')) {
        i++;
      }
    }
  }

  return items;
}

async function parseSkillsSh(queries = DEFAULT_QUERIES, delayMs = 500) {
  const allItems = [];
  const seen = new Set();
  
  for (const query of queries) {
    const output = runSkillsFind(query);
    const items = parseFindOutput(output);
    
    for (const item of items) {
      if (seen.has(item.skill_id)) continue;
      seen.add(item.skill_id);
      allItems.push(item);
    }
    
    if (delayMs > 0 && query !== queries[queries.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return allItems.sort((a, b) => b.installs - a.installs);
}

module.exports = { parseSkillsSh, DEFAULT_QUERIES };
