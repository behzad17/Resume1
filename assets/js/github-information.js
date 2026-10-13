(() => {
  'use strict';
  const input = document.getElementById('gh-username');
  const userContainer = document.getElementById('gh-user-data');
  const repoContainer = document.getElementById('gh-repo-data');
  let timer, controller, generation = 0;
  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function link(text, url, className) {
    const node = element('a', className, text);
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' && parsed.hostname === 'github.com') node.href = parsed.href;
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
    return node;
  }
  async function getJSON(url, signal) {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      const error = new Error(response.status === 404 ? 'No GitHub user found.' : response.status === 403 || response.status === 429 ? 'GitHub request limit reached. Please try again later.' : 'GitHub is unavailable. Please try again.');
      throw error;
    }
    return response.json();
  }
  async function search() {
    const current = ++generation;
    if (controller) controller.abort();
    controller = new AbortController();
    const username = input.value.trim();
    repoContainer.replaceChildren();
    if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)) {
      userContainer.textContent = username ? 'Enter a valid GitHub username.' : 'Please enter a GitHub username.';
      return;
    }
    userContainer.textContent = 'Loading GitHub projects…';
    const signal = controller.signal;
    const base = 'https://api.github.com/users/' + encodeURIComponent(username);
    try {
      const [user, firstPage] = await Promise.all([getJSON(base, signal), getJSON(base + '/repos?per_page=100&sort=updated&page=1', signal)]);
      let repos = firstPage;
      let page = 2;
      let batch = firstPage;
      while (batch.length === 100) {
        batch = await getJSON(base + '/repos?per_page=100&sort=updated&page=' + page++, signal);
        repos = repos.concat(batch);
      }
      if (current !== generation) return;
      const card = element('div', 'gh-user-card');
      const header = element('div', 'gh-user-header');
      const avatarLink = link('', user.html_url, 'gh-avatar');
      const avatar = element('img', '', user.login);
      const avatarURL = new URL(user.avatar_url);
      if (avatarURL.protocol === 'https:' && avatarURL.hostname === 'avatars.githubusercontent.com') avatar.src = avatarURL.href;
      avatar.alt = user.login + ' profile picture';
      avatar.width = avatar.height = 80;
      avatarLink.append(avatar);
      const meta = element('div', 'gh-user-meta');
      const heading = element('h2', '', user.name || user.login);
      const handle = element('span', 'small-name');
      handle.append(link('@' + user.login, user.html_url, ''));
      heading.append(handle); meta.append(heading); header.append(avatarLink, meta); card.append(header);
      const stats = element('div', 'gh-user-stats');
      for (const [label, value] of [['Followers', user.followers], ['Following', user.following], ['Repositories', user.public_repos]]) {
        const stat = element('span', 'gh-stat'); stat.append(element('strong', '', value), document.createTextNode(label)); stats.append(stat);
      }
      card.append(stats); userContainer.replaceChildren(card);
      const list = element('div', 'repo-list'); list.append(element('h4', 'repo-list-heading', 'Repositories'));
      if (!repos.length) list.append(element('p', 'repo-empty', 'No public repositories found.'));
      else {
        const items = element('ul', '');
        for (const repo of repos) { const item = element('li', 'gh-repo-item'); item.append(link(repo.name, repo.html_url, 'gh-repo-link')); items.append(item); }
        list.append(items);
      }
      repoContainer.replaceChildren(list);
    } catch (error) {
      if (error.name !== 'AbortError' && current === generation) userContainer.textContent = error.message || 'Unable to load GitHub projects.';
    }
  }
  input.addEventListener('input', () => {
    clearTimeout(timer); ++generation;
    if (controller) controller.abort();
    timer = setTimeout(search, 400);
  });
  search();
})();
