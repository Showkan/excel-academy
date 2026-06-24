// ==========================================
// AUTH.JS - Autentifikatsiya (Login/Register)
// ==========================================

window.Auth = {
  currentUser: null,
  authStateCallbacks: [],

  /**
   * Auth ni ishga tushirish
   */
  async init() {
    // Firebase auth state ni kuzatish
    FB.onAuthChange((user) => {
      this.currentUser = user;
      console.log('👤 Auth state:', user ? user.email : 'Guest');
      
      // Barcha callback'larni chaqirish
      this.authStateCallbacks.forEach(cb => cb(user));
    });
  },

  /**
   * Auth state callback qo'shish
   */
  onAuthChange(callback) {
    this.authStateCallbacks.push(callback);
    // Darhol chaqirish (joriy holat bilan)
    callback(this.currentUser);
  },

  /**
   * Foydalanuvchi kirganmi?
   */
  isLoggedIn() {
    return this.currentUser !== null;
  },

  /**
   * Foydalanuvchi roli
   */
  getRole() {
    return this.currentUser?.role || 'guest';
  },

  /**
   * Admin ekanligini tekshirish
   */
  isAdmin() {
    const role = this.getRole();
    return role === 'admin' || role === 'super_admin';
  },

  /**
   * Super admin ekanligini tekshirish
   */
  isSuperAdmin() {
    return this.getRole() === 'super_admin';
  },

  // ==================== LOGIN PAGE ====================

  renderLogin(container) {
    container.innerHTML = `
      <div class="auth-page">
        <div class="auth-card fade-in">
          
          <!-- Logo -->
          <div class="auth-logo">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <rect width="56" height="56" rx="12" fill="#217346"/>
              <text x="28" y="38" text-anchor="middle" font-size="28" font-weight="700" fill="white" font-family="Segoe UI">X</text>
            </svg>
          </div>

          <h1 class="auth-title" data-i18n="auth_login_title">${I18n.t('auth_login_title')}</h1>
          <p class="auth-subtitle" data-i18n="auth_login_subtitle">${I18n.t('auth_login_subtitle')}</p>

          <form id="login-form" onsubmit="Auth.handleLogin(event)">
            
            <div class="form-group">
              <label class="form-label" data-i18n="auth_email">${I18n.t('auth_email')}</label>
              <input 
                type="email" 
                id="login-email" 
                class="form-input" 
                placeholder="${I18n.t('auth_email_placeholder')}"
                required
                autocomplete="email"
              >
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="auth_password">${I18n.t('auth_password')}</label>
              <input 
                type="password" 
                id="login-password" 
                class="form-input" 
                placeholder="${I18n.t('auth_password_placeholder')}"
                required
                autocomplete="current-password"
                minlength="6"
              >
            </div>

            <div class="auth-forgot">
              <a href="#" onclick="Auth.showResetModal(); return false;" data-i18n="auth_forgot">${I18n.t('auth_forgot')}</a>
            </div>

            <button type="submit" class="btn btn-green btn-block btn-lg" id="login-btn">
              <i class="fas fa-sign-in-alt"></i>
              <span data-i18n="auth_login_btn">${I18n.t('auth_login_btn')}</span>
            </button>

            <div class="form-error" id="login-error" style="display:none;"></div>

          </form>

          <div class="auth-footer">
            <span data-i18n="auth_no_account">${I18n.t('auth_no_account')}</span>
            <a href="#register" data-page="register" data-i18n="auth_register_link">${I18n.t('auth_register_link')}</a>
          </div>

        </div>
      </div>
    `;
  },

  // ==================== REGISTER PAGE ====================

  renderRegister(container) {
    container.innerHTML = `
      <div class="auth-page">
        <div class="auth-card fade-in">

          <div class="auth-logo">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <rect width="56" height="56" rx="12" fill="#217346"/>
              <text x="28" y="38" text-anchor="middle" font-size="28" font-weight="700" fill="white" font-family="Segoe UI">X</text>
            </svg>
          </div>

          <h1 class="auth-title" data-i18n="auth_register_title">${I18n.t('auth_register_title')}</h1>
          <p class="auth-subtitle" data-i18n="auth_register_subtitle">${I18n.t('auth_register_subtitle')}</p>

          <form id="register-form" onsubmit="Auth.handleRegister(event)">
            
            <div class="form-group">
              <label class="form-label" data-i18n="auth_name">${I18n.t('auth_name')}</label>
              <input 
                type="text" 
                id="register-name" 
                class="form-input" 
                placeholder="${I18n.t('auth_name_placeholder')}"
                required
                autocomplete="name"
                minlength="2"
              >
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="auth_email">${I18n.t('auth_email')}</label>
              <input 
                type="email" 
                id="register-email" 
                class="form-input" 
                placeholder="${I18n.t('auth_email_placeholder')}"
                required
                autocomplete="email"
              >
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="auth_password">${I18n.t('auth_password')}</label>
              <input 
                type="password" 
                id="register-password" 
                class="form-input" 
                placeholder="${I18n.t('auth_password_placeholder')}"
                required
                autocomplete="new-password"
                minlength="6"
              >
              <div class="form-hint">Kamida 6 belgi, raqam va harf</div>
            </div>

            <div class="form-group">
              <label class="form-checkbox-wrap">
                <input type="checkbox" class="form-checkbox" id="register-terms" required>
                <span>
                  <span data-i18n="auth_terms">${I18n.t('auth_terms')}</span>
                  <a href="#" data-i18n="auth_terms_link">${I18n.t('auth_terms_link')}</a>
                  <span data-i18n="auth_terms_accept">${I18n.t('auth_terms_accept')}</span>
                </span>
              </label>
            </div>

            <button type="submit" class="btn btn-green btn-block btn-lg" id="register-btn">
              <i class="fas fa-user-plus"></i>
              <span data-i18n="auth_register_btn">${I18n.t('auth_register_btn')}</span>
            </button>

            <div class="form-error" id="register-error" style="display:none;"></div>

          </form>

          <div class="auth-footer">
            <span data-i18n="auth_have_account">${I18n.t('auth_have_account')}</span>
            <a href="#login" data-page="login" data-i18n="auth_login_link">${I18n.t('auth_login_link')}</a>
          </div>

        </div>
      </div>
    `;
  },

  // ==================== HANDLERS ====================

  /**
   * Login formani jo'natish
   */
  async handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');
    const errorEl = document.getElementById('login-error');

    // Validatsiya
    if (!this._validateEmail(email)) {
      this._showFormError(errorEl, 'Email noto\'g\'ri formatda');
      return;
    }

    if (password.length < 6) {
      this._showFormError(errorEl, 'Parol kamida 6 belgi bo\'lishi kerak');
      return;
    }

    // Loading holat
    this._setBtnLoading(btn, true, 'Kirilmoqda...');
    errorEl.style.display = 'none';

    try {
      const result = await FB.login(email, password);

      if (result.success) {
        App.showToast(I18n.t('auth_login_success'), 'success');
        
        // Offline rejimda - manual update
        if (FB.offlineMode) {
          this.currentUser = result.user;
          this.authStateCallbacks.forEach(cb => cb(result.user));
        }
        
        // Dashboard ga yo'naltirish
        setTimeout(() => {
          Router.navigate('dashboard');
        }, 500);
      } else {
        this._showFormError(errorEl, result.error);
      }
    } catch (error) {
      this._showFormError(errorEl, 'Xatolik: ' + error.message);
    } finally {
      this._setBtnLoading(btn, false, `<i class="fas fa-sign-in-alt"></i> ${I18n.t('auth_login_btn')}`);
    }
  },

  /**
   * Register formani jo'natish
   */
  async handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const terms = document.getElementById('register-terms').checked;
    const btn = document.getElementById('register-btn');
    const errorEl = document.getElementById('register-error');

    // Validatsiya
    if (name.length < 2) {
      this._showFormError(errorEl, 'Ism kamida 2 belgi bo\'lishi kerak');
      return;
    }

    if (!this._validateEmail(email)) {
      this._showFormError(errorEl, 'Email noto\'g\'ri formatda');
      return;
    }

    if (password.length < 6) {
      this._showFormError(errorEl, 'Parol kamida 6 belgi bo\'lishi kerak');
      return;
    }

    if (!terms) {
      this._showFormError(errorEl, 'Foydalanish shartlariga rozilik bering');
      return;
    }

    this._setBtnLoading(btn, true, 'Ro\'yxatdan o\'tilmoqda...');
    errorEl.style.display = 'none';

    try {
      const result = await FB.register(email, password, name);

      if (result.success) {
        App.showToast(I18n.t('auth_register_success'), 'success');
        
        // Offline rejimda - manual update
        if (FB.offlineMode) {
          this.currentUser = result.user;
          this.authStateCallbacks.forEach(cb => cb(result.user));
        }

        // Dashboard ga yo'naltirish
        setTimeout(() => {
          Router.navigate('dashboard');
        }, 500);
      } else {
        this._showFormError(errorEl, result.error);
      }
    } catch (error) {
      this._showFormError(errorEl, 'Xatolik: ' + error.message);
    } finally {
      this._setBtnLoading(btn, false, `<i class="fas fa-user-plus"></i> ${I18n.t('auth_register_btn')}`);
    }
  },

  /**
   * Chiqish
   */
  async logout() {
    try {
      const result = await FB.logout();
      if (result.success) {
        App.showToast(I18n.t('auth_logout_success'), 'info');
        
        // Offline rejimda - manual update
        if (FB.offlineMode) {
          this.currentUser = null;
          this.authStateCallbacks.forEach(cb => cb(null));
        }

        setTimeout(() => {
          Router.navigate('home');
        }, 300);
      }
    } catch (error) {
      App.showToast('Chiqishda xatolik: ' + error.message, 'error');
    }
  },

  /**
   * Parolni tiklash modal
   */
  showResetModal() {
    const modal = `
      <div class="modal-overlay show" id="reset-modal" onclick="if(event.target===this) Auth.closeResetModal()">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fas fa-key"></i> Parolni tiklash
            </h3>
            <button class="modal-close" onclick="Auth.closeResetModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="margin-bottom: 16px; color: var(--text-secondary);">
              Email manzilingizni kiriting. Sizga parolni tiklash uchun havola yuboramiz.
            </p>
            <form id="reset-form" onsubmit="Auth.handleReset(event)">
              <div class="form-group">
                <label class="form-label">Email</label>
                <input 
                  type="email" 
                  id="reset-email" 
                  class="form-input" 
                  placeholder="email@example.com"
                  required
                >
              </div>
              <div class="form-error" id="reset-error" style="display:none;"></div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="Auth.closeResetModal()">
              ${I18n.t('common_cancel')}
            </button>
            <button class="btn btn-green" id="reset-btn" onclick="Auth.handleReset(event)">
              <i class="fas fa-paper-plane"></i>
              Yuborish
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
  },

  closeResetModal() {
    const modal = document.getElementById('reset-modal');
    if (modal) modal.remove();
  },

  async handleReset(event) {
    if (event) event.preventDefault();

    const email = document.getElementById('reset-email').value.trim();
    const btn = document.getElementById('reset-btn');
    const errorEl = document.getElementById('reset-error');

    if (!this._validateEmail(email)) {
      this._showFormError(errorEl, 'Email noto\'g\'ri formatda');
      return;
    }

    this._setBtnLoading(btn, true, 'Yuborilmoqda...');
    errorEl.style.display = 'none';

    try {
      const result = await FB.resetPassword(email);

      if (result.success) {
        App.showToast(I18n.t('auth_reset_sent'), 'success');
        this.closeResetModal();
      } else {
        this._showFormError(errorEl, result.error);
      }
    } catch (error) {
      this._showFormError(errorEl, 'Xatolik: ' + error.message);
    } finally {
      this._setBtnLoading(btn, false, '<i class="fas fa-paper-plane"></i> Yuborish');
    }
  },

  // ==================== HELPERS ====================

  /**
   * Email validatsiya
   */
  _validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Form xatosini ko'rsatish
   */
  _showFormError(el, message) {
    if (!el) return;
    el.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    el.style.display = 'flex';
  },

  /**
   * Tugmani loading holatiga o'tkazish
   */
  _setBtnLoading(btn, loading, text) {
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    } else {
      btn.disabled = false;
      btn.innerHTML = text;
    }
  },

  /**
   * Foydalanuvchi avatarini olish (ism bosh harflari)
   */
  getInitials(user) {
    if (!user) return 'U';
    const name = user.displayName || user.email || 'User';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },

  /**
   * Foydalanuvchi nomini olish
   */
  getDisplayName(user) {
    if (!user) return 'Guest';
    return user.displayName || user.email?.split('@')[0] || 'User';
  },

  /**
   * Rol nomini olish (tarjima bilan)
   */
  getRoleName(role) {
    const names = {
      'super_admin': 'Super Admin',
      'admin': 'Admin',
      'student': 'Student',
      'guest': 'Guest'
    };
    return names[role] || 'User';
  },

  // ==================== PROFILE PAGE ====================

  renderProfile(container) {
    if (!this.isLoggedIn()) {
      Router.navigate('login');
      return;
    }

    const user = this.currentUser;

    container.innerHTML = `
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <h1><i class="fas fa-user-cog"></i> ${I18n.t('profile_title')}</h1>
              <p>${user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="padding: 32px 0;">
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px;" class="profile-layout">
          
          <!-- Sidebar -->
          <div class="card">
            <div class="card-body" style="text-align: center; padding: 32px;">
              <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--excel-green); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 700; margin: 0 auto 16px;">
                ${this.getInitials(user)}
              </div>
              <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">
                ${this.getDisplayName(user)}
              </h3>
              <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
                ${user.email}
              </p>
              <span class="badge badge-green">
                ${this.getRoleName(user.role)}
              </span>
            </div>
          </div>

          <!-- Main -->
          <div class="card">
            <div class="card-header">
              <h3><i class="fas fa-id-card"></i> ${I18n.t('profile_personal')}</h3>
            </div>
            <div class="card-body">
              <form id="profile-form" onsubmit="Auth.handleProfileUpdate(event)">
                
                <div class="form-group">
                  <label class="form-label">${I18n.t('auth_name')}</label>
                  <input 
                    type="text" 
                    id="profile-name" 
                    class="form-input" 
                    value="${user.displayName || ''}"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">${I18n.t('auth_email')}</label>
                  <input 
                    type="email" 
                    id="profile-email" 
                    class="form-input" 
                    value="${user.email}"
                    disabled
                  >
                  <div class="form-hint">Email o'zgartirilmaydi</div>
                </div>

                <button type="submit" class="btn btn-green">
                  <i class="fas fa-save"></i> ${I18n.t('profile_save')}
                </button>

              </form>
            </div>
          </div>

        </div>

        <!-- Security -->
        <div class="card mt-3">
          <div class="card-header">
            <h3><i class="fas fa-shield-alt"></i> ${I18n.t('profile_security')}</h3>
          </div>
          <div class="card-body">
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <button class="btn btn-outline-green" onclick="Auth.showResetModal()">
                <i class="fas fa-key"></i> ${I18n.t('profile_change_password')}
              </button>
              <button class="btn btn-red" onclick="Auth.confirmLogout()">
                <i class="fas fa-sign-out-alt"></i> ${I18n.t('nav_logout')}
              </button>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  /**
   * Profil yangilash
   */
  async handleProfileUpdate(event) {
    event.preventDefault();

    const name = document.getElementById('profile-name').value.trim();
    
    if (name.length < 2) {
      App.showToast('Ism kamida 2 belgi bo\'lishi kerak', 'error');
      return;
    }

    try {
      // User ma'lumotini yangilash
      const result = await FB.createUserDoc(this.currentUser.uid, {
        ...this.currentUser,
        displayName: name
      });

      if (result.success) {
        this.currentUser.displayName = name;
        App.showToast('Profil yangilandi', 'success');
        App.updateUserUI();
      }
    } catch (error) {
      App.showToast('Xatolik: ' + error.message, 'error');
    }
  },

  /**
   * Chiqishni tasdiqlash
   */
  confirmLogout() {
    if (confirm('Rostdan ham chiqmoqchimisiz?')) {
      this.logout();
    }
  }
};

console.log('🔐 Auth modul yuklandi');