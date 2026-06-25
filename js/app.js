// ==========================================
// APP.JS - Asosiy ilova
// ==========================================

window.App = {
  currentUser: null,
  initialized: false,

  /**
   * Ilovani ishga tushirish
   */
  async init() {
    console.log('🚀 Excel Academy ishga tushmoqda...');

    try {
      // 1. Firebase
      await FB.init();

      // 2. I18n (til)
      I18n.init();

      // 3. Auth
      await Auth.init();

      // 4. Auth state callback
      Auth.onAuthChange((user) => {
        this.currentUser = user;
        this.updateUserUI();
      });

      // 5. Router
      Router.init();
     // 6. XP System
if (typeof XPSystem !== 'undefined') {
  XPSystem.init();
}
      // 6. Event listeners
      this.setupEventListeners();

      // 7. Theme
      this.loadTheme();

      // 8. Loaderni yashirish
      setTimeout(() => this.hideLoader(), 500);

      this.initialized = true;
      console.log('✅ Ilova tayyor!');
    } catch (error) {
      console.error('❌ Ishga tushirish xatosi:', error);
      this.hideLoader();
      this.showToast('Ishga tushirishda xatolik: ' + error.message, 'error');
    }
  },
  addXP(amount) {
    if (!Auth.isLoggedIn()) return;
    const user = Auth.currentUser;
    user.xp = (user.xp || 0) + amount;
    
    const levels = [
      { xp: 0, rank: 'Shogird' },
      { xp: 100, rank: 'O\'rganuvchi' },
      { xp: 300, rank: 'Biluvchi' },
      { xp: 600, rank: 'Formula Ustasi' },
      { xp: 1000, rank: 'Dashboard Ustasi' },
      { xp: 2000, rank: 'Excel Qirolligi Chempioni' }
    ];

    let currentLevel = 0;
    for (let i = 0; i < levels.length; i++) {
      if (user.xp >= levels[i].xp) currentLevel = i;
    }
    user.level = currentLevel + 1;
    user.rank = levels[currentLevel].rank;

    FB.createUserDoc(user.uid, { xp: user.xp, level: user.level, rank: user.rank });
  },

  /**
   * Event listenerlar
   */
  setupEventListeners() {
    // [data-page] linklar
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-page]');
      if (link) {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        Router.navigate(page);
        this.closeMobileMenu();
      }
    });

    // Burger menu
    const burger = document.getElementById('burger');
    const nav = document.getElementById('header-nav');
    if (burger && nav) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('show');
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Lang toggle
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        I18n.toggle();
      });
    }

    // User dropdown
    const userBtn = document.getElementById('user-btn');
    const userDropdown = document.getElementById('user-dropdown');
    if (userBtn && userDropdown) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userBtn.classList.toggle('active');
        userDropdown.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
          userBtn.classList.remove('active');
          userDropdown.classList.remove('show');
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.confirmLogout();
      });
    }

    // Scroll - header shadow
    window.addEventListener('scroll', () => {
      const header = document.getElementById('header');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 10);
      }
    });
  },

  /**
   * Mobile menu yopish
   */
  closeMobileMenu() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('header-nav');
    if (burger) burger.classList.remove('active');
    if (nav) nav.classList.remove('show');
  },

  /**
   * User UI yangilash
   */
  updateUserUI() {
    const user = this.currentUser;
    const authEl = document.getElementById('header-auth');
    const userEl = document.getElementById('header-user');
    const adminLink = document.getElementById('nav-admin-link');

    if (user) {
      // Auth yashirish, user ko'rsatish
      if (authEl) authEl.style.display = 'none';
      if (userEl) userEl.style.display = 'block';

      // User ma'lumotlari
      const avatar = document.getElementById('user-avatar');
      const displayName = document.getElementById('user-display-name');
      const ddAvatar = document.getElementById('dd-avatar');
      const ddName = document.getElementById('dd-name');
      const ddEmail = document.getElementById('dd-email');
      const ddRole = document.getElementById('dd-role');

      const initials = Auth.getInitials(user);
      const name = Auth.getDisplayName(user);
      const role = Auth.getRoleName(user.role);

      if (avatar) avatar.textContent = initials;
      if (displayName) displayName.textContent = name;
      if (ddAvatar) ddAvatar.textContent = initials;
      if (ddName) ddName.textContent = name;
      if (ddEmail) ddEmail.textContent = user.email;
      if (ddRole) ddRole.textContent = role;

      // Admin link
      if (adminLink && Auth.isAdmin()) {
        adminLink.style.display = 'flex';
      }
    } else {
      // Auth ko'rsatish, user yashirish
      if (authEl) authEl.style.display = 'flex';
      if (userEl) userEl.style.display = 'none';
      if (adminLink) adminLink.style.display = 'none';
    }
  },

  /**
   * Tema o'zgartirish
   */
  toggleTheme() {
    const current = document.body.getAttribute('data-theme') || 'light';
    const newTheme = current === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
  },

  /**
   * Saqlangan temani yuklash
   */
  loadTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', saved);
    document.documentElement.setAttribute('data-theme', saved);
    
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = saved === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
  },

  /**
   * Loaderni yashirish
   */
  hideLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.classList.add('hide');
      setTimeout(() => loader.style.display = 'none', 500);
    }
  },

  /**
   * Loaderni ko'rsatish
   */
  showLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.style.display = 'flex';
      loader.classList.remove('hide');
    }
  },

  /**
   * Toast xabar
   */
  showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-times-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info}"></i>
      <div class="toast-message">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    container.appendChild(toast);

    // Avtomatik o'chirish
    setTimeout(() => {
      toast.style.animation = 'toastIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ==================== DOMContentLoaded ====================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

console.log('⚡ App modul yuklandi');
