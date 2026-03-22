// ==========================================
// 🌙 THEME TOGGLE LOGIC
// ==========================================
const themeBtn = document.getElementById('theme-toggle');
const htmlTag = document.documentElement;

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const newTheme = htmlTag.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlTag.setAttribute('data-theme', newTheme);
        themeBtn.querySelector('.icon').innerText = newTheme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('theme', newTheme);
    });
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    htmlTag.setAttribute('data-theme', savedTheme);
    if (themeBtn) themeBtn.querySelector('.icon').innerText = savedTheme === 'dark' ? '🌙' : '☀️';
}

// ==========================================
// 🔗 ACTIVE LINK HIGHLIGHTING
// ==========================================
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    if (currentPath.includes(link.getAttribute('href')) && link.getAttribute('href') !== "index.html") {
        link.classList.add('active');
    }
});

// ==========================================
// 🃏 CARD GENERATOR
// ==========================================
function createCard(post) {
    const card = document.createElement('a');
    card.href = post.link;
    card.className = 'card';
    card.innerHTML = `
        <div class="card-tags">
            <span class="platform-tag">${post.tag}</span>
            <span class="category-tag">${post.category}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
    `;
    return card;
}

// ==========================================
// 🏠 HOMEPAGE LOGIC (Latest 3)
// ==========================================
const latestGrid = document.getElementById('latest-grid');
if (latestGrid && typeof writeups !== 'undefined') {
    latestGrid.innerHTML = '';
    writeups.slice(0, 3).forEach(post => latestGrid.appendChild(createCard(post)));
}

// ==========================================
// 🔍 WRITEUPS GALLERY & SEARCH LOGIC
// ==========================================
const allWriteupsGrid = document.getElementById('all-writeups-grid');
const platformFilter = document.getElementById('platform-filter');
const ctfFilter = document.getElementById('ctf-filter');
const searchInput = document.getElementById('search-input'); // New Search Bar ID
const resetBtn = document.getElementById('reset-btn');

if (allWriteupsGrid && typeof writeups !== 'undefined') {
    function renderWriteups(data) {
        allWriteupsGrid.innerHTML = '';
        if (data.length === 0) {
            allWriteupsGrid.innerHTML = '<div class="empty-state"><p>[!] No writeups found matching your query.</p></div>';
            return;
        }
        data.forEach(post => allWriteupsGrid.appendChild(createCard(post)));
    }

    renderWriteups(writeups);

    function applyFilters() {
        const platformVal = platformFilter ? platformFilter.value : 'all';
        const ctfVal = ctfFilter ? ctfFilter.value : 'all';
        const searchVal = searchInput ? searchInput.value.toLowerCase() : '';

        let filtered = writeups.filter(post => {
            // Match Platform/Tag
            const matchesPlatform = platformVal === 'all' || post.tag === platformVal;
            // Match CTF Tag
            const matchesCTF = ctfVal === 'all' || post.tag === ctfVal;
            // Match Search Query (Title or Excerpt)
            const matchesSearch = post.title.toLowerCase().includes(searchVal) || 
                                 post.excerpt.toLowerCase().includes(searchVal);

            return matchesPlatform && matchesCTF && matchesSearch;
        });

        renderWriteups(filtered);
    }

    // Event Listeners
    if (platformFilter) platformFilter.addEventListener('change', () => {
        if(ctfFilter) ctfFilter.value = 'all'; // Mutual exclusivity
        applyFilters();
    });

    if (ctfFilter) ctfFilter.addEventListener('change', () => {
        if(platformFilter) platformFilter.value = 'all'; // Mutual exclusivity
        applyFilters();
    });

    if (searchInput) searchInput.addEventListener('input', applyFilters);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (platformFilter) platformFilter.value = 'all';
            if (ctfFilter) ctfFilter.value = 'all';
            if (searchInput) searchInput.value = '';
            renderWriteups(writeups);
        });
    }
}

// ==========================================
// 📋 COPY TO CLIPBOARD LOGIC
// ==========================================
function addCopyButtons() {
    const markdownBody = document.querySelector('.markdown-body');
    if (!markdownBody) return;

    const codeBlocks = markdownBody.querySelectorAll('pre');

    codeBlocks.forEach((codeBlock) => {
        if (codeBlock.querySelector('.copy-code-button')) return;

        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.innerText = 'Copy';

        button.addEventListener('click', () => {
            // Get text from the <code> tag inside <pre>
            const code = codeBlock.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                button.innerText = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.innerText = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            });
        });

        codeBlock.appendChild(button);
    });
}

// Keep this for pages that might have static code blocks
document.addEventListener('DOMContentLoaded', addCopyButtons);

function isReloadNavigation() {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) return navigationEntry.type === 'reload';

    return performance.navigation && performance.navigation.type === 1;
}

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    if (!isReloadNavigation()) return;

    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
    });
});
