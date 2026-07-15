const fs = require('fs');
const path = require('path');
const { fetchRepos } = require('./repos');
const { getSingle } = require('./api');

const TEMPLATE_PATH = path.resolve(__dirname, '..', 'assets', 'profile-default.md');

function renderFeaturedRepos(repos, options = {}) {
  const { limit = 6, sort = 'stars' } = options;

  const featured = repos
    .filter(r => !r.fork && !r.private)
    .sort((a, b) => {
      if (sort === 'recent') {
        return new Date(b.pushed_at) - new Date(a.pushed_at);
      }
      return b.stargazers_count - a.stargazers_count;
    })
    .slice(0, limit);

  if (featured.length === 0) return 'No public repositories available.';

  return featured
    .map(r => {
      const stars = `⭐ ${r.stargazers_count}`;
      const lang = r.language ? `| ${r.language}` : '';
      const desc = r.description || 'No description';
      return `- **[${r.name}](${r.html_url})** ${stars} ${lang}\n  ${desc}`;
    })
    .join('\n\n');
}

function renderContacts(profile, options = {}) {
  const badges = [];
  const extraEmail = options.email;

  if (extraEmail || profile.email) {
    const email = extraEmail || profile.email;
    badges.push(`[![Email](https://img.shields.io/badge/Email-${encodeURIComponent(email)}-D14836?style=flat&logo=gmail&logoColor=white)](mailto:${email})`);
  }

  if (profile.blog) {
    const blogLabel = profile.blog.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    badges.push(`[![Blog](https://img.shields.io/badge/Blog-${encodeURIComponent(blogLabel)}-00A98F?style=flat&logo=blogger&logoColor=white)](${profile.blog})`);
  }

  if (profile.twitter_username) {
    badges.push(`[![Twitter](https://img.shields.io/badge/Twitter-${profile.twitter_username}-1DA1F2?style=flat&logo=twitter&logoColor=white)](https://twitter.com/${profile.twitter_username})`);
  }

  badges.push(`[![GitHub](https://img.shields.io/badge/GitHub-${profile.login}-181717?style=flat&logo=github&logoColor=white)](https://github.com/${profile.login})`);

  if (badges.length === 0) return '';
  return badges.join('\n');
}

async function generateProfile(user, currentUser, options = {}) {
  const {
    refresh = false,
    email = null,
    featuredSort = 'stars',
    theme = 'tokyonight',
  } = options;

  const [repos, profile] = await Promise.all([
    fetchRepos(user, currentUser, refresh),
    getSingle(`users/${user}`),
  ]);

  const profileRepoName = user;
  const publicRepos = repos.filter(
    r => !r.private && r.owner.login === user && r.name !== profileRepoName
  );

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  return template
    .replace(/\{\{username\}\}/g, user)
    .replace(/\{\{name\}\}/g, profile.name || user)
    .replace(/\{\{theme\}\}/g, theme)
    .replace('{{contacts}}', renderContacts(profile, { email }))
    .replace('{{featuredRepos}}', renderFeaturedRepos(publicRepos, { sort: featuredSort }));
}

module.exports = {
  generateProfile,
  renderFeaturedRepos,
  renderContacts,
};
