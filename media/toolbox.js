const vscode = acquireVsCodeApi();

async function loadSnippets() {
  console.log('LOADED');
  const snippets = window._snippets;
  const list = document.getElementById('snippet-list');

  const grouped = {};
  snippets.forEach((s) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  for (const category in grouped) {
    const header = document.createElement('div');
    header.className = 'category-header';

    const label = document.createElement('span');
    label.textContent = category;

    const chevron = document.createElement('span');
    chevron.className = 'chevron';
    chevron.textContent = '▾';

    header.appendChild(label);
    header.appendChild(chevron);

    const container = document.createElement('div');
    container.className = 'category-content';

    grouped[category].forEach((snippet) => {
      const el = document.createElement('div');
      el.className = 'snippet';
      el.draggable = true;

      const icon = document.createElement('div');
      icon.className = 'snippet-icon';
      icon.textContent = snippet.icon || '📄';

      const label = document.createElement('div');
      label.className = 'snippet-label';
      label.textContent = snippet.label;

      el.appendChild(icon);
      el.appendChild(label);

      el.addEventListener('click', async () => {
        const filePath = snippet.file;
        const response = await fetch(filePath);
        const code = await response.text();
        vscode.postMessage({ type: 'insertSnippet', snippet: code });
      });

      el.addEventListener('dragstart', async (event) => {
        const filePath = snippet.file;
        const response = await fetch(filePath);
        const code = await response.text();
        event.dataTransfer.setData('text/plain', code);
      });

      container.appendChild(el);
    });

    header.addEventListener('click', () => {
      container.classList.toggle('collapsed');
      chevron.textContent = container.classList.contains('collapsed') ? '▸' : '▾';
    });

    list.appendChild(header);
    list.appendChild(container);
  }
}

loadSnippets();

window.addEventListener('drop', (e) => {
  e.preventDefault();
  const snippet = e.dataTransfer.getData('text/plain');
  vscode.postMessage({ type: 'insertSnippet', snippet });
});

window.addEventListener('dragover', (e) => {
  e.preventDefault();
});
