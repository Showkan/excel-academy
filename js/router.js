// ==========================================
// ROUTER.JS - SPA Router
// ==========================================

window.Router = {
  currentRoute: null,
  currentParams: [],

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
    console.log('%c🧭 Router ishga tushdi', 'color: #06b6d4; font-weight: bold;');
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const parts = hash.split('/').filter(p => p);
    const route = parts[0] || 'home';
    const params = parts.slice(1);

    this.currentRoute = route;
    this.currentParams = params;

    console.log(`📍 Route: ${route}`, params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render(route, params);
    this.updateActiveNav(route);
  },

  navigate(path) {
    window.location.hash = path;
  },

  refresh() {
    this.handleRoute();
  },

  updateActiveNav(route) {
    document.querySelectorAll('.header-nav-link').forEach(link => {
      const page = link.dataset.page;
      if (page === route || (route === 'home' && !page)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  render(route, params) {
    const container = document.getElementById('main-content');
    if (!container) {
      console.error('main-content topilmadi');
      return;
    }

    // Protected routes
    const protectedRoutes = ['dashboard', 'profile', 'certificates', 'admin', 'exam'];
    if (protectedRoutes.includes(route) && !Auth.isLoggedIn()) {
      App.showToast('Iltimos, avval tizimga kiring', 'warning');
      this.navigate('login');
      return;
    }

    if (route === 'admin' && !Auth.isAdmin()) {
      App.showToast('Sizda admin huquqi yo\'q', 'error');
      this.navigate('home');
      return;
    }

    try {
      switch (route) {
        case 'home':
        case '':
          this.renderHome(container);
          break;

        case 'courses':
          Courses.renderList(container);
          break;

        case 'course':
          if (params[0]) Courses.renderDetail(container, params[0]);
          else this.navigate('courses');
          break;

        case 'lesson':
          if (params[0] && params[1]) Lessons.render(container, params[0], params[1]);
          else this.navigate('courses');
          break;

        case 'quiz':
          if (params[0] && params[1]) Quiz.render(container, params[0], params[1]);
          else this.navigate('courses');
          break;

        case 'login':
          Auth.renderLogin(container);
          break;

        case 'register':
          Auth.renderRegister(container);
          break;

        case 'profile':
          Auth.renderProfile(container);
          break;

        case 'dashboard':
          Dashboard.render(container);
          break;

        case 'certificates':
          Certificate.renderList(container);
          break;

        case 'sandbox':
          if (typeof Sandbox !== 'undefined') {
            Sandbox.render(container);
          } else {
            this.renderComingSoon(container, 'Sandbox');
          }
          break;

        case 'exam':
          if (typeof Exam !== 'undefined' && params[0]) {
            Exam.render(container, params[0]);
          } else {
            this.renderComingSoon(container, 'Imtihon');
          }
          break;

        case 'admin':
          Admin.render(container);
          break;

        case 'about':
          this.renderAbout(container);
          break;

        default:
          this.render404(container);
      }
    } catch (error) {
      console.error('Render xatosi:', error);
      this.renderError(container, error);
    }
  },

  // ==================== HOME PAGE ====================

  renderHome(container) {
    container.innerHTML = `
      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-grid">
            
            <div class="hero-content">
              <div class="hero-badge">
                <i class="fas fa-bolt"></i>
                <span>${I18n.t('hero_badge')}</span>
              </div>
              
              <h1 class="hero-title">
                ${I18n.t('hero_title_1')} 
                <span class="highlight">${I18n.t('hero_title_highlight')}</span>
                ${I18n.t('hero_title_2')}
              </h1>
              
              <p class="hero-desc">${I18n.t('hero_desc')}</p>
              
              <div class="hero-actions">
                <button class="btn btn-green btn-lg" data-page="${Auth.isLoggedIn() ? 'dashboard' : 'register'}">
                  <i class="fas fa-rocket"></i> ${I18n.t('hero_btn_start')}
                </button>
                <button class="btn btn-outline-green btn-lg" data-page="courses">
                  <i class="fas fa-book"></i> ${I18n.t('hero_btn_courses')}
                </button>
              </div>

              <div class="hero-stats">
                <div class="hero-stat">
                  <span class="hero-stat-num">20+</span>
                  <span class="hero-stat-label">${I18n.t('hero_stat_lessons')}</span>
                </div>
                <div class="hero-stat">
                  <span class="hero-stat-num">2</span>
                  <span class="hero-stat-label">${I18n.t('hero_stat_courses')}</span>
                </div>
                <div class="hero-stat">
                  <span class="hero-stat-num">1K+</span>
                  <span class="hero-stat-label">${I18n.t('hero_stat_students')}</span>
                </div>
                <div class="hero-stat">
                  <span class="hero-stat-num">500+</span>
                  <span class="hero-stat-label">${I18n.t('hero_stat_certs')}</span>
                </div>
              </div>
            </div>

            <div class="hero-visual">
              <div class="excel-preview">
                <div class="excel-preview-bar">
                  <span></span><span></span><span></span>
                </div>
                <div class="excel-fbar">
                  <div class="excel-fbar-name">B2</div>
                  <div class="excel-fbar-fx">fx</div>
                  <input type="text" class="excel-fbar-input" value="=SUM(B3:B10)" readonly>
                </div>
                <div class="excel-grid">
                  <table class="excel-table">
                    <thead>
                      <tr>
                        <th class="excel-corner"></th>
                        <th class="excel-col">A</th>
                        <th class="excel-col">B</th>
                        <th class="excel-col">C</th>
                        <th class="excel-col">D</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="excel-row">1</td>
                        <td><div class="excel-cell" style="font-weight:700;background:var(--excel-green-pale);">Mahsulot</div></td>
                        <td><div class="excel-cell" style="font-weight:700;background:var(--excel-green-pale);">Narxi</div></td>
                        <td><div class="excel-cell" style="font-weight:700;background:var(--excel-green-pale);">Soni</div></td>
                        <td><div class="excel-cell" style="font-weight:700;background:var(--excel-green-pale);">Jami</div></td>
                      </tr>
                      <tr>
                        <td class="excel-row">2</td>
                        <td><div class="excel-cell">Total:</div></td>
                        <td><div class="excel-cell active has-formula">15,420</div></td>
                        <td><div class="excel-cell">142</div></td>
                        <td><div class="excel-cell has-formula">2,189,640</div></td>
                      </tr>
                      <tr>
                        <td class="excel-row">3</td>
                        <td><div class="excel-cell">Olma</div></td>
                        <td><div class="excel-cell">5,200</div></td>
                        <td><div class="excel-cell">35</div></td>
                        <td><div class="excel-cell has-formula">182,000</div></td>
                      </tr>
                      <tr>
                        <td class="excel-row">4</td>
                        <td><div class="excel-cell">Banan</div></td>
                        <td><div class="excel-cell">3,800</div></td>
                        <td><div class="excel-cell">48</div></td>
                        <td><div class="excel-cell has-formula">182,400</div></td>
                      </tr>
                      <tr>
                        <td class="excel-row">5</td>
                        <td><div class="excel-cell">Apelsin</div></td>
                        <td><div class="excel-cell">6,420</div></td>
                        <td><div class="excel-cell">59</div></td>
                        <td><div class="excel-cell has-formula">378,780</div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <div class="section-badge">
              <i class="fas fa-star"></i> Imkoniyatlar
            </div>
            <h2 class="section-title">${I18n.t('features_title')}</h2>
            <p class="section-subtitle">${I18n.t('features_subtitle')}</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
            ${[
              { icon: 'fa-chalkboard-teacher', color: 'foundation', title: 'Interaktiv darslar', desc: 'Real Excel simulyatorida amaliy mashg\'ulotlar' },
              { icon: 'fa-layer-group', color: 'pro', title: 'Bosqichma-bosqich', desc: 'Oson dan murakkabga, tartibli' },
              { icon: 'fa-question-circle', color: 'dashboard', title: 'Quiz va testlar', desc: 'Bilim sinovi har darsdan keyin' },
              { icon: 'fa-certificate', color: 'bonus', title: 'Sertifikat', desc: 'Kursni tugatib PDF sertifikat oling' },
              { icon: 'fa-trophy', color: 'foundation', title: 'XP va Level', desc: 'Ball to\'plang, daraja oshiring' },
              { icon: 'fa-flask', color: 'pro', title: 'Sandbox', desc: 'Erkin mashq maydoni' }
            ].map(f => `
              <div class="card" style="padding: 24px; text-align: center; cursor: pointer;">
                <div style="width: 64px; height: 64px; margin: 0 auto 16px; border-radius: var(--radius-md); background: var(--color-${f.color}); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                  <i class="fas ${f.icon}"></i>
                </div>
                <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">${f.title}</h3>
                <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">${f.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Courses -->
      <section class="section" style="background: var(--bg-surface);">
        <div class="container">
          <div class="section-header">
            <div class="section-badge">
              <i class="fas fa-graduation-cap"></i> Kurslar
            </div>
            <h2 class="section-title">${I18n.t('courses_title')}</h2>
            <p class="section-subtitle">${I18n.t('courses_subtitle')}</p>
          </div>

          <div class="courses-grid" id="home-courses">
            <div class="empty-state" style="grid-column: 1/-1;">
              <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: var(--excel-green);"></i>
            </div>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <button class="btn btn-green btn-lg" data-page="courses">
              <i class="fas fa-arrow-right"></i> ${I18n.t('common_view_all')}
            </button>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="section">
        <div class="container">
          <div style="background: linear-gradient(135deg, var(--excel-green) 0%, var(--excel-green-light) 100%); border-radius: var(--radius-lg); padding: 60px 40px; text-align: center; color: #fff;">
            <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 12px;">
              Bugundan boshlab Excel'ni o'rganing!
            </h2>
            <p style="font-size: 16px; opacity: 0.9; margin-bottom: 24px; max-width: 600px; margin-left: auto; margin-right: auto;">
              Bepul Foundation kursi bilan boshlang.
            </p>
            <button class="btn btn-lg" style="background: #fff; color: var(--excel-green);" data-page="${Auth.isLoggedIn() ? 'courses' : 'register'}">
              <i class="fas fa-rocket"></i>
              ${Auth.isLoggedIn() ? 'Kurslarga o\'tish' : 'Bepul boshlash'}
            </button>
          </div>
        </div>
      </section>
    `;

    this._loadHomeCourses();
  },

  async _loadHomeCourses() {
    const el = document.getElementById('home-courses');
    if (!el) return;
    const courses = await Courses.loadAllCourses();
    el.innerHTML = courses.map(course => Courses._renderCourseCard(course)).join('');
  },

  // ==================== ABOUT ====================

  renderAbout(container) {
    container.innerHTML = `
      <div class="page-header">
        <div class="container">
          <h1><i class="fas fa-info-circle"></i> Biz haqimizda</h1>
        </div>
      </div>
      <div class="container" style="padding: 40px 0;">
        <div class="card">
          <div class="card-body" style="padding: 40px; max-width: 800px; margin: 0 auto;">
            <h2>📊 Excel Academy</h2>
            <p style="color: var(--text-secondary); line-height: 1.8; margin-top: 16px;">
              Excel Academy — O'zbekistondagi eng yirik Excel o'quv platformasi.
            </p>
            <h3 style="margin-top: 24px;">✨ Imkoniyatlar</h3>
            <ul style="color: var(--text-secondary); line-height: 2; padding-left: 24px;">
              <li>20+ interaktiv dars</li>
              <li>Real Excel simulyator</li>
              <li>Mashqlar va mini-o'yinlar</li>
              <li>XP va Level tizimi</li>
              <li>Sandbox - erkin mashq</li>
              <li>AI yordamchi</li>
              <li>PDF sertifikatlar</li>
              <li>3 til (UZ/RU/EN)</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  },

  // ==================== COMING SOON ====================

  renderComingSoon(container, pageName) {
    container.innerHTML = `
      <div class="container" style="padding: 80px 24px;">
        <div class="card" style="max-width: 500px; margin: 0 auto; text-align: center;">
          <div class="card-body" style="padding: 48px;">
            <div style="width: 100px; height: 100px; margin: 0 auto 24px; background: var(--excel-green-pale); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 42px; color: var(--excel-green);">
              <i class="fas fa-tools"></i>
            </div>
            <h2>${pageName}</h2>
            <p style="color: var(--text-secondary); margin: 16px 0 24px;">
              Tez orada tayyor bo'ladi! 🚀
            </p>
            <button class="btn btn-green" data-page="home">
              <i class="fas fa-arrow-left"></i> Bosh sahifa
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // ==================== 404 ====================

  render404(container) {
    container.innerHTML = `
      <div class="container" style="padding: 100px 24px; text-align: center;">
        <div style="font-size: 120px; font-weight: 900; color: var(--excel-green); line-height: 1;">404</div>
        <h2 style="margin: 16px 0;">${I18n.t('not_found_title')}</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">${I18n.t('not_found_desc')}</p>
        <button class="btn btn-green btn-lg" data-page="home">
          <i class="fas fa-home"></i> ${I18n.t('not_found_home')}
        </button>
      </div>
    `;
  },

  renderError(container, error) {
    container.innerHTML = `
      <div class="container" style="padding: 80px 24px; text-align: center;">
        <h2>Xatolik yuz berdi</h2>
        <p style="color: var(--text-secondary);">${error.message}</p>
        <button class="btn btn-green" data-page="home">Bosh sahifa</button>
      </div>
    `;
  }
};

console.log('%c🧭 Router yuklandi', 'color: #06b6d4; font-weight: bold;');
