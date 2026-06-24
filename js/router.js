// ==========================================
// ROUTER.JS - Sahifa almashinish tizimi
// ==========================================

window.Router = {
  currentRoute: '',
  currentParams: {},

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  navigate(path) {
    window.location.hash = path;
  },

  refresh() {
    this.handleRoute();
  },

  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const parts = hash.split('/');
    const route = parts[0];
    const params = parts.slice(1);

    this.currentRoute = route;
    this.currentParams = params;

    const container = document.getElementById('main-content');
    if (!container) return;

    window.scrollTo(0, 0);

    // Auth tekshiruv kerak bo'lgan sahifalar
    const protectedRoutes = ['dashboard', 'profile', 'certificates', 'admin', 'sandbox'];
    if (protectedRoutes.includes(route) && !Auth.isLoggedIn()) {
      App.showToast('Iltimos, avval tizimga kiring', 'warning');
      this.navigate('login');
      return;
    }

    switch (route) {
      case 'home':
        import('./home.js').then(() => Home.render(container)).catch(() => this._render404(container));
        break;
      case 'courses':
        Courses.renderList(container);
        break;
      case 'course':
        if (params[0]) Courses.renderDetail(container, params[0]);
        else this._render404(container);
        break;
      case 'lesson':
        if (params[0] && params[1]) Lessons.render(container, params[0], params[1]);
        else this._render404(container);
        break;
      case 'quiz':
        if (params[0] && params[1]) Quiz.render(container, params[0], params[1]);
        else this._render404(container);
        break;
      case 'dashboard':
        Dashboard.render(container);
        break;
      case 'certificates':
        Certificate.renderList(container);
        break;
      case 'profile':
        Auth.renderProfile(container);
        break;
      case 'sandbox':
        Sandbox.render(container); // YANGI ROUTE
        break;
      case 'admin':
        Admin.render(container);
        break;
      case 'login':
        if (Auth.isLoggedIn()) { this.navigate('dashboard'); return; }
        Auth.renderLogin(container);
        break;
      case 'register':
        if (Auth.isLoggedIn()) { this.navigate('dashboard'); return; }
        Auth.renderRegister(container);
        break;
      case 'home':
      default:
        if (typeof Home !== 'undefined') Home.render(container);
        else container.innerHTML = '<div class="container" style="padding:60px;text-align:center;"><h1>Excel Academy</h1><p>Bosh sahifa yuklanmoqda...</p></div>';
        break;
    }

    this.updateNavActive(route);
  },

  updateNavActive(route) {
    document.querySelectorAll('.header-nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === route);
    });
  },

  _render404(container) {
    container.innerHTML = `
      <div class="container" style="padding: 80px 0; text-align: center;">
        <div style="font-size: 80px; color: var(--text-muted); margin-bottom: 16px;">
          <i class="fas fa-map-signs"></i>
        </div>
        <h2>${I18n.t('not_found_title')}</h2>
        <p style="color: var(--text-muted); margin-bottom: 24px;">${I18n.t('not_found_desc')}</p>
        <button class="btn btn-green" onclick="Router.navigate('home')">
          <i class="fas fa-home"></i> ${I18n.t('not_found_home')}
        </button>
      </div>
    `;
  }
};

console.log('🛣️ Router modul yuklandi');