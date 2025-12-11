document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupMobileNav();
  const contentRoot = document.getElementById('content-root');
  if (contentRoot) {
    loadContent();
  }
});

function setupMobileNav() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  // 1. Mobile Menu Button - REVERTED to be in page-header (or handled by original logic if pageHeader exists)
  const pageHeader = document.querySelector('.page-header');

  // Logic to put toggle in pageHeader (restore original behavior)
  if (pageHeader && !pageHeader.querySelector('.mobile-menu-toggle')) {
    const btn = document.createElement('button');
    btn.className = 'mobile-menu-toggle';
    btn.innerHTML = '☰'; // Hamburger
    btn.setAttribute('aria-label', 'Toggle Navigation');
    btn.style.marginRight = '1rem';

    // Insert at start of page header
    pageHeader.insertBefore(btn, pageHeader.firstChild);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
      // Keep main toggle as hamburger, as we have a separate close button now
      btn.innerHTML = sidebar.classList.contains('mobile-open') ? '☰' : '☰';
      // Actually, standard behavior is usually toggle icon too, but user wants specific close button. 
      // Let's keep toggle icon simple or toggle it? User said "x to close the menu manually too in the top of the menu".
      // Implies the toggle button stays separate. Let's toggle it for polish anyway.
      btn.innerHTML = sidebar.classList.contains('mobile-open') ? '✕' : '☰';
    });
  }

  // 2. Add SPECIFIC Close Button INSIDE the menu (nav)
  const nav = sidebar.querySelector('nav');
  if (nav && !nav.querySelector('.mobile-nav-close')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-nav-close';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Close Navigation');

    // Using prepend to put it at top
    nav.insertBefore(closeBtn, nav.firstChild);

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.remove('mobile-open');
      // Sync main toggle if exists
      const toggle = document.querySelector('.mobile-menu-toggle');
      if (toggle) toggle.innerHTML = '☰';
    });
  }

  // Auto-close menu when clicking a link (TOC or Nav)
  sidebar.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      sidebar.classList.remove('mobile-open');
      const toggle = document.querySelector('.mobile-menu-toggle');
      if (toggle) toggle.innerHTML = '☰';
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('mobile-open') &&
      !sidebar.contains(e.target) &&
      !document.querySelector('.mobile-menu-toggle').contains(e.target)) {
      sidebar.classList.remove('mobile-open');
      const toggle = document.querySelector('.mobile-menu-toggle');
      if (toggle) toggle.innerHTML = '☰';
    }
  });
}

// Global function to toggle theme so multiple buttons can use it
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateToggleIcons(next);
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateToggleIcons(saved);

  // Bind existing toggles (e.g. desktop sidebar one)
  const toggles = document.querySelectorAll('.theme-toggle');
  toggles.forEach(btn => {
    // Avoid double binding if we call initTheme multiple times or if button is cloned manually later
    // But for now, just adding a check or assuming clean slate
    btn.onclick = toggleTheme; // Simple overwrite to ensure single handler
  });
}

function updateToggleIcons(theme) {
  const toggles = document.querySelectorAll('.theme-toggle');
  toggles.forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  });
}

async function loadContent() {
  const contentRoot = document.getElementById('content-root');
  const tocRoot = document.getElementById('toc-root');
  const embedded = document.getElementById('markdown-content');

  let text = '';

  if (embedded) {
    text = embedded.textContent;
  } else {
    try {
      const res = await fetch('content.md');
      if (!res.ok) throw new Error('Failed to load content.md');
      text = await res.text();
    } catch (err) {
      if (window.location.protocol === 'file:') {
        contentRoot.innerHTML = `
          <div style="padding: 2rem; background: #fff1f0; border: 1px solid #ffa39e; border-radius: 8px; color: #cf1322;">
            <h3 style="margin-top: 0;">⚠️ Local Preview Restriction</h3>
            <p>Browsers block loading external files (like <code>content.md</code>) directly from the file system for security (CORS).</p>
            <p><strong>To view this documentation locally, you must run a local server:</strong></p>
            <ol style="margin-left: 1.5rem;">
              <li>Open a terminal in the <code>docs/</code> folder.</li>
              <li>Run <code>npx http-server</code> or <code>python -m http.server</code>.</li>
              <li>Open the localhost URL provided (usually <code>http://localhost:8080</code>).</li>
            </ol>
            <p style="margin-bottom: 0;"><em>This will work automatically when hosted on GitHub Pages.</em></p>
          </div>`;
      } else {
        contentRoot.innerHTML = `<div class="error">Error loading documentation: ${err.message}</div>`;
      }
      return;
    }
  }

  const { html, toc } = parseMarkdownWithTOC(text);
  contentRoot.innerHTML = html;
  if (tocRoot) {
    tocRoot.innerHTML = toc;
    setupAccordion();
  }
  setupTOCSpy();
}

function parseMarkdownWithTOC(md) {
  const lines = md.split(/\r?\n/);
  let html = '';
  const headers = [];

  const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

  const parseInline = (text) => {
    return text
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%; border-radius:8px; margin: 1rem 0;">')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  };

  let inCodeBlock = false;
  let listStack = []; // [{type: 'ul'|'ol', indent: number}]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Calculate indentation
    const indentMatch = line.match(/^(\s*)/);
    const currentIndent = indentMatch ? indentMatch[1].length : 0;
    const trimmed = line.trim();

    // Handle Code Blocks
    if (trimmed.startsWith('```')) {
      // Close any open lists before code block
      while (listStack.length > 0) {
        const info = listStack.pop();
        html += `</${info.type}>`;
      }
      inCodeBlock = !inCodeBlock;
      html += inCodeBlock ? '<pre><code>' : '</code></pre>';
      continue;
    }

    if (inCodeBlock) {
      html += line + '\n';
      continue;
    }

    if (!trimmed) {
      continue;
    }

    // Handle Headings
    if (trimmed.startsWith('#')) {
      while (listStack.length > 0) {
        const info = listStack.pop();
        html += `</${info.type}>`;
      }
      const match = trimmed.match(/^(#+)\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const slug = slugify(text);
        html += `<h${level} id="${slug}">${parseInline(text)}</h${level}>`;

        if (level <= 3) {
          headers.push({ level, text, slug });
        }
        continue;
      }
    }

    // Handle Lists
    const isUl = trimmed.match(/^-\s+/);
    const isOl = trimmed.match(/^\d+\.\s+/);

    if (isUl || isOl) {
      const type = isUl ? 'ul' : 'ol';
      const content = isUl ? trimmed.substring(2) : trimmed.replace(/^\d+\.\s+/, '');

      if (listStack.length === 0) {
        listStack.push({ type, indent: currentIndent });
        html += `<${type}>`;
      } else {
        const top = listStack[listStack.length - 1];

        if (currentIndent > top.indent) {
          // Nested list
          listStack.push({ type, indent: currentIndent });
          html += `<${type}>`;
        } else if (currentIndent < top.indent) {
          // Close lists until we match indent or stack empty
          while (listStack.length > 0 && currentIndent < listStack[listStack.length - 1].indent) {
            const info = listStack.pop();
            html += `</${info.type}>`;
          }

          // Check logical type switch or just continue found level
          if (listStack.length > 0) {
            const newTop = listStack[listStack.length - 1];
            if (newTop.type !== type) {
              // Switching list type at same level
              html += `</${newTop.type}><${type}>`;
              newTop.type = type;
            }
          } else {
            // Closed all, start new
            listStack.push({ type, indent: currentIndent });
            html += `<${type}>`;
          }
        } else {
          // Same indentation level
          if (top.type !== type) {
            html += `</${top.type}><${type}>`;
            top.type = type;
          }
        }
      }
      html += `<li>${parseInline(content)}</li>`;
      continue;
    }

    // Handle Paragraphs - breaks list
    while (listStack.length > 0) {
      const info = listStack.pop();
      html += `</${info.type}>`;
    }
    html += `<p>${parseInline(trimmed)}</p>`;
  }

  // Close remaining lists
  while (listStack.length > 0) {
    const info = listStack.pop();
    html += `</${info.type}>`;
  }

  return { html, toc: generateNestedTOC(headers) };
}

function generateNestedTOC(headers) {
  if (headers.length === 0) return '';

  let html = '<ul class="toc-list">';
  let currentLevel = headers[0].level; // Start with the level of the first header
  // Adjust initial level if it's not 1, but usually we just want to nest relative to start.
  // Actually, to have a clean tree, we should assume we are inside a root container.

  // We'll use a stack to keep track of open lists.
  // But since we want to output a string, we can just manage the tags.

  // To handle "H1 > H2 > H3", we need to ensure that when we see H2, it's inside the LI of the previous H1.
  // This means we shouldn't close the LI of H1 until we see another H1 or end of list.

  // Let's use a recursive approach or a stack of open items.
  // Stack approach:
  // stack = [root_ul]

  // Let's try a simpler logic:
  // Iterate and compare levels.

  let lastLevel = headers[0].level;

  // We need to normalize levels? e.g. if starts with H2, treat as top?
  // Let's just respect the levels.

  // Initial item
  html += `<li class="toc-item level-${lastLevel}">`;
  html += `<div class="toc-header"><a href="#${headers[0].slug}" class="toc-link">${headers[0].text}</a></div>`;

  for (let i = 1; i < headers.length; i++) {
    const h = headers[i];
    const diff = h.level - lastLevel;

    if (diff > 0) {
      // Deeper level (e.g. H1 -> H2)
      // Open a sublist inside the current LI
      // Note: We need to add a toggle button to the PREVIOUS item if it has children.
      // But we've already written the previous item. 
      // We can add the toggle button via JS or CSS, or just assume all have it and hide if empty?
      // Better: add a class to the previous item indicating it has children.
      // Since we are building string, we can't easily go back.

      // Alternative: Build a tree object first, then render.
      // This is much cleaner.
    }
  }

  // Let's switch to Tree Building approach for robustness.
  const root = { children: [] };
  const stack = [{ level: 0, children: root.children }]; // Stack of "current children array" and "level"

  for (const h of headers) {
    const node = { ...h, children: [] };

    // Pop stack until we find the parent level
    while (stack.length > 1 && stack[stack.length - 1].level >= h.level) {
      stack.pop();
    }

    // Add to the current parent's children
    const parent = stack[stack.length - 1];
    parent.children.push(node);

    // Push this node as a potential parent
    stack.push({ level: h.level, children: node.children });
  }

  return renderTree(root.children);
}

function renderTree(nodes) {
  if (!nodes || nodes.length === 0) return '';

  let html = '<ul class="toc-list">';
  for (const node of nodes) {
    const hasChildren = node.children && node.children.length > 0;
    html += `<li class="toc-item">`;
    html += `<div class="toc-entry">`;
    if (hasChildren) {
      html += `<span class="toc-toggle">▶</span>`;
    } else {
      html += `<span class="toc-spacer"></span>`; // Spacer for alignment
    }
    html += `<a href="#${node.slug}" class="toc-link" data-level="${node.level}">${node.text}</a>`;
    html += `</div>`;

    if (hasChildren) {
      html += renderTree(node.children).replace('class="toc-list"', 'class="toc-sublist"');
    }
    html += `</li>`;
  }
  html += '</ul>';
  return html;
}

function setupAccordion() {
  const toggles = document.querySelectorAll('.toc-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSection(toggle);
    });
  });
}

function toggleSection(toggle) {
  const entry = toggle.closest('.toc-entry');
  const parentLi = entry.closest('li');
  const sublist = parentLi.querySelector('.toc-sublist');

  if (sublist) {
    const isExpanded = sublist.classList.contains('expanded');

    // Accordion behavior: Collapse siblings if we are opening
    if (!isExpanded) {
      const grandParent = parentLi.parentElement; // The ul containing this li
      if (grandParent) {
        Array.from(grandParent.children).forEach(li => {
          if (li === parentLi) return; // Skip self
          const siblingSublist = li.querySelector('.toc-sublist');
          const siblingToggle = li.querySelector('.toc-toggle');
          if (siblingSublist && siblingSublist.classList.contains('expanded')) {
            siblingSublist.classList.remove('expanded');
            if (siblingToggle) siblingToggle.classList.remove('expanded');
          }
        });
      }
    }

    sublist.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
  }
}

function setupTOCSpy() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.isIntersecting) {
        document.querySelectorAll('.toc-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.toc-link[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');

          // Auto-expand parents
          let parent = activeLink.closest('.toc-sublist');
          while (parent) {
            parent.classList.add('expanded');
            const parentLi = parent.closest('li');
            const toggle = parentLi.querySelector('.toc-toggle');
            if (toggle) toggle.classList.add('expanded');
            parent = parentLi.closest('ul').closest('li')?.querySelector('.toc-sublist');
          }
        }
      }
    });
  }, { rootMargin: '-100px 0px -66%' });

  document.querySelectorAll('h1, h2, h3').forEach(header => {
    observer.observe(header);
  });
}
