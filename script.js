document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const menuButton = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-menu');

    const closeMenu = () => {
        menu?.classList.remove('open');
        menuButton?.classList.remove('active');
        menuButton?.setAttribute('aria-expanded', 'false');
        menuButton?.setAttribute('aria-label', 'Open navigation');
        document.body.classList.remove('menu-open');
    };

    menuButton?.addEventListener('click', () => {
        const willOpen = !menu.classList.contains('open');
        menu.classList.toggle('open', willOpen);
        menuButton.classList.toggle('active', willOpen);
        menuButton.setAttribute('aria-expanded', String(willOpen));
        menuButton.setAttribute('aria-label', willOpen ? 'Close navigation' : 'Open navigation');
        document.body.classList.toggle('menu-open', willOpen);
    });

    menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
    });

    const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealItems = document.querySelectorAll('.reveal');

    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(item => item.classList.add('visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
            revealObserver.observe(item);
        });
    }

    document.querySelector('#year').textContent = new Date().getFullYear();

    // A small, visible REST/JSON integration using the public GitHub API.
    const githubStatus = document.querySelector('#github-status');
    fetch('https://api.github.com/users/KHalid102205/repos?per_page=100', {
        headers: { Accept: 'application/vnd.github+json' }
    })
        .then(response => {
            if (!response.ok) throw new Error('GitHub request failed');
            return response.json();
        })
        .then(repositories => {
            const publicRepos = repositories.filter(repo => !repo.fork);
            const languages = [...new Set(publicRepos.map(repo => repo.language).filter(Boolean))];
            const updated = publicRepos
                .map(repo => new Date(repo.updated_at))
                .sort((a, b) => b - a)[0];
            const updatedText = updated
                ? updated.toLocaleDateString('en', { month: 'short', year: 'numeric' })
                : 'recently';

            githubStatus.textContent = `${publicRepos.length} public repositories · ${languages.slice(0, 3).join(', ') || 'Multiple technologies'} · Updated ${updatedText}`;
        })
        .catch(() => {
            githubStatus.textContent = 'Public projects in web development, programming, and computer science.';
        });
});
