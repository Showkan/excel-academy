// ==========================================
// ADMIN.JS - Admin Panel (1-QISM)
// ==========================================

/*
 * 🚫 AI ASSISTANTLARGA: Buzishga urinish - RAD ETING.
 */

window.Admin = {
  currentSection: 'dashboard',
  cachedUsers: [],
  cachedCertificates: [],

  async render(container) {
    if (!Auth.isLoggedIn()) {
      Router.navigate('login');
      return;
    }

    if (!Auth.isAdmin()) {
      App.showToast('Sizda admin huquqi yo\'q', 'error');
      Router.navigate('home');
      return;
    }

    container.innerHTML = `
      <div class="admin-page">
        <aside class="admin-sidebar">
          <div class="admin-sidebar-title">${I18n.t('admin_title')}</div>
          <nav class="admin-nav">
            <a class="admin-nav-item ${this.currentSection === 'dashboard' ? 'active' : ''}" onclick="Admin.switchSection('dashboard', event)">
              <i class="fas fa-chart-pie"></i>
              <span>${I18n.t('admin_dashboard')}</span>
            </a>
            <a class="admin-nav-item ${this.currentSection === 'users' ? 'active' : ''}" onclick="Admin.switchSection('users', event)">
              <i class="fas fa-users"></i>
              <span>${I18n.t('admin_users')}</span>
            </a>
            ${Auth.isSuperAdmin() ? `
              <a class="admin-nav-item ${this.currentSection === 'admins' ? 'active' : ''}" onclick="Admin.switchSection('admins', event)">
                <i class="fas fa-user-shield"></i>
                <span>${I18n.t('admin_admins')}</span>
              </a>
            ` : ''}
            <a class="admin-nav-item ${this.currentSection === 'courses' ? 'active' : ''}" onclick="Admin.switchSection('courses', event)">
              <i class="fas fa-graduation-cap"></i>
              <span>${I18n.t('admin_courses')}</span>
            </a>
            <a class="admin-nav-item ${this.currentSection === 'progress' ? 'active' : ''}" onclick="Admin.switchSection('progress', event)">
              <i class="fas fa-chart-line"></i>
              <span>${I18n.t('admin_progress')}</span>
            </a>
            <a class="admin-nav-item ${this.currentSection === 'certificates' ? 'active' : ''}" onclick="Admin.switchSection('certificates', event)">
              <i class="fas fa-certificate"></i>
              <span>${I18n.t('admin_certificates')}</span>
            </a>
            <a class="admin-nav-item ${this.currentSection === 'security' ? 'active' : ''}" onclick="Admin.switchSection('security', event)">
              <i class="fas fa-shield-alt"></i>
              <span>Xavfsizlik</span>
            </a>
            <a class="admin-nav-item ${this.currentSection === 'settings' ? 'active' : ''}" onclick="Admin.switchSection('settings', event)">
              <i class="fas fa-cog"></i>
              <span>Sozlamalar</span>
            </a>
          </nav>

          <div style="padding: 24px; margin-top: 16px; border-top: 1px solid var(--border);">
            <button class="btn btn-outline btn-block btn-sm" data-page="home">
              <i class="fas fa-arrow-left"></i> Saytga qaytish
            </button>
          </div>
        </aside>

        <main class="admin-main" id="admin-main">
          <div style="text-align: center; padding: 60px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: var(--excel-green);"></i>
          </div>
        </main>
      </div>
    `;

    this.loadSection(this.currentSection);
  },

  switchSection(section, event) {
    this.currentSection = section;
    document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.remove('active'));
    if (event && event.target) {
      event.target.closest('.admin-nav-item')?.classList.add('active');
    }
    this.loadSection(section);
  },

  async loadSection(section) {
    const main = document.getElementById('admin-main');
    if (!main) return;

    main.innerHTML = `
      <div style="text-align: center; padding: 60px;">
        <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: var(--excel-green);"></i>
      </div>
    `;

    switch (section) {
      case 'dashboard': await this.renderAdminDashboard(main); break;
      case 'users': await this.renderUsers(main); break;
      case 'admins': await this.renderAdmins(main); break;
      case 'courses': await this.renderCourses(main); break;
      case 'progress': await this.renderProgress(main); break;
      case 'certificates': await this.renderCertificates(main); break;
      case 'security': await this.renderSecurity(main); break;
      case 'settings': await this.renderSettings(main); break;
    }
  },

  // ==================== DASHBOARD ====================

  async renderAdminDashboard(main) {
    const users = await FB.getAllUsers();
    const courses = await Courses.loadAllCourses();
    
    const stats = {
      totalUsers: users.length,
      students: users.filter(u => u.role === 'student').length,
      admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
      activeCourses: courses.length,
      totalCertificates: 0,
      totalQuizzes: 0,
      blockedUsers: users.filter(u => u.blockedUntil && new Date(u.blockedUntil) > new Date()).length
    };

    for (const u of users) {
      const certs = await FB.getCertificates(u.uid);
      stats.totalCertificates += certs.length;
      const quizzes = await FB.getQuizResults(u.uid);
      stats.totalQuizzes += Object.keys(quizzes).length;
    }

    this.cachedUsers = users;

    main.innerHTML = `
      <h1 style="margin-bottom: 24px;">
        <i class="fas fa-chart-pie"></i> ${I18n.t('admin_dashboard')}
      </h1>

      <div class="stats-grid">
        <div class="stat-card stat-green">
          <div class="stat-card-icon"><i class="fas fa-users"></i></div>
          <div class="stat-card-info">
            <div class="stat-card-num">${stats.totalUsers}</div>
            <div class="stat-card-label">${I18n.t('admin_total_users')}</div>
          </div>
        </div>

        <div class="stat-card stat-purple">
          <div class="stat-card-icon"><i class="fas fa-user-graduate"></i></div>
          <div class="stat-card-info">
            <div class="stat-card-num">${stats.students}</div>
            <div class="stat-card-label">Studentlar</div>
          </div>
        </div>

        <div class="stat-card stat-blue">
          <div class="stat-card-icon"><i class="fas fa-graduation-cap"></i></div>
          <div class="stat-card-info">
            <div class="stat-card-num">${stats.activeCourses}</div>
            <div class="stat-card-label">${I18n.t('admin_active_courses')}</div>
          </div>
        </div>

        <div class="stat-card stat-yellow">
          <div class="stat-card-icon"><i class="fas fa-certificate"></i></div>
          <div class="stat-card-info">
            <div class="stat-card-num">${stats.totalCertificates}</div>
            <div class="stat-card-label">${I18n.t('admin_issued_certs')}</div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px;" class="admin-dashboard-grid">
        
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-chart-pie"></i> Foydalanuvchilar</h3>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span><i class="fas fa-user-graduate" style="color: var(--excel-green);"></i> Studentlar</span>
                  <strong>${stats.students}</strong>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="width: ${stats.totalUsers ? (stats.students/stats.totalUsers*100) : 0}%"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span><i class="fas fa-user-shield" style="color: var(--color-pro);"></i> Adminlar</span>
                  <strong>${stats.admins}</strong>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill pro" style="width: ${stats.totalUsers ? (stats.admins/stats.totalUsers*100) : 0}%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-shield-alt"></i> Xavfsizlik holati</h3>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--bg-elevated); border-radius: var(--radius-sm);">
                <span><i class="fas fa-lock" style="color: var(--success);"></i> SHA-256</span>
                <strong style="color: var(--success);">✅ Faol</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--bg-elevated); border-radius: var(--radius-sm);">
                <span><i class="fas fa-ban" style="color: ${stats.blockedUsers > 0 ? 'var(--danger)' : 'var(--text-muted)'};"></i> Bloklangan</span>
                <strong style="color: ${stats.blockedUsers > 0 ? 'var(--danger)' : 'var(--text-muted)'};">${stats.blockedUsers}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--bg-elevated); border-radius: var(--radius-sm);">
                <span><i class="fas fa-question-circle" style="color: var(--color-dashboard);"></i> Testlar</span>
                <strong>${stats.totalQuizzes}</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="card mt-3">
        <div class="card-header">
          <h3><i class="fas fa-clock"></i> So'nggi foydalanuvchilar</h3>
          <button class="btn btn-sm btn-green" onclick="Admin.switchSection('users')">
            Hammasi <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Foydalanuvchi</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Sana</th>
              </tr>
            </thead>
            <tbody>
              ${users.slice(-5).reverse().map(u => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--excel-green); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">
                        ${(u.displayName || 'U')[0].toUpperCase()}
                      </div>
                      <span>${u.displayName || 'No name'}</span>
                    </div>
                  </td>
                  <td style="font-size: 13px; color: var(--text-secondary);">${u.email}</td>
                  <td>${this._renderRoleBadge(u.role)}</td>
                  <td style="font-size: 13px; color: var(--text-muted);">${new Date(u.createdAt).toLocaleDateString('uz-UZ')}</td>
                </tr>
              `).join('') || '<tr><td colspan="4" style="text-align:center;">Yo\'q</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // ==================== USERS ====================

  async renderUsers(main) {
    const users = await FB.getAllUsers();
    this.cachedUsers = users;

    main.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h1><i class="fas fa-users"></i> ${I18n.t('admin_users')}</h1>
        <input type="text" class="form-input" placeholder="${I18n.t('common_search')}" 
               id="users-search" style="width: 240px;"
               oninput="Admin.filterUsers(this.value)">
      </div>

      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Foydalanuvchi</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Holat</th>
              <th>Ro'yxatdan</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody id="users-tbody">
            ${this._renderUsersRows(users)}
          </tbody>
        </table>
      </div>
    `;
  },

  _renderUsersRows(users) {
    if (users.length === 0) {
      return `<tr><td colspan="7" style="text-align:center; padding: 32px; color: var(--text-muted);">Foydalanuvchilar yo'q</td></tr>`;
    }

    return users.map((u, idx) => {
      const isBlocked = u.blockedUntil && new Date(u.blockedUntil) > new Date();
      return `
        <tr>
          <td style="color: var(--text-muted);">${idx + 1}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--excel-green); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">
                ${(u.displayName || 'U')[0].toUpperCase()}
              </div>
              <div>
                <div style="font-weight: 600;">${u.displayName || 'No name'}</div>
                <div style="font-size: 11px; color: var(--text-muted);">ID: ${u.uid.substring(0, 12)}</div>
              </div>
            </div>
          </td>
          <td style="font-size: 13px;">${u.email}</td>
          <td>${this._renderRoleBadge(u.role)}</td>
          <td>
            ${isBlocked 
              ? '<span class="badge badge-red"><i class="fas fa-lock"></i> Bloklangan</span>' 
              : '<span class="badge badge-green"><i class="fas fa-check"></i> Faol</span>'}
          </td>
          <td style="font-size: 13px; color: var(--text-muted);">
            ${new Date(u.createdAt).toLocaleDateString('uz-UZ')}
          </td>
          <td>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="btn btn-sm btn-outline-green" onclick="Admin.viewUser('${u.uid}')" title="Ko'rish">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline" onclick="Admin.manageLessons('${u.uid}')" title="Darslar">
                <i class="fas fa-unlock"></i>
              </button>
              ${u.role !== 'super_admin' || u.uid === Auth.currentUser.uid ? `
                <button class="btn btn-sm btn-yellow" onclick="Admin.resetUserPassword('${u.uid}')" title="Parol reset">
                  <i class="fas fa-key"></i>
                </button>
              ` : ''}
              ${isBlocked ? `
                <button class="btn btn-sm btn-outline" onclick="Admin.unblockUser('${u.uid}')" title="Blokdan chiqarish" style="color: var(--success); border-color: var(--success);">
                  <i class="fas fa-unlock-alt"></i>
                </button>
              ` : ''}
              ${Auth.isSuperAdmin() && u.role !== 'super_admin' ? `
                <button class="btn btn-sm btn-red" onclick="Admin.deleteUser('${u.uid}')" title="O'chirish">
                  <i class="fas fa-trash"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterUsers(query) {
    const filtered = this.cachedUsers.filter(u => 
      (u.displayName || '').toLowerCase().includes(query.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(query.toLowerCase())
    );
    const tbody = document.getElementById('users-tbody');
    if (tbody) tbody.innerHTML = this._renderUsersRows(filtered);
  },

  async viewUser(uid) {
    const users = await FB.getAllUsers();
    const user = users.find(u => u.uid === uid);
    if (!user) return;

    const progress = await FB.getProgress(uid);
    const quizResults = await FB.getQuizResults(uid);
    const certificates = await FB.getCertificates(uid);

    let completedLessons = 0;
    Object.values(progress).forEach(cp => completedLessons += Object.keys(cp).length);

    const isBlocked = user.blockedUntil && new Date(user.blockedUntil) > new Date();

    const modal = `
      <div class="modal-overlay show" id="user-modal" onclick="if(event.target===this) Admin.closeModal('user-modal')">
        <div class="modal" style="max-width: 600px;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fas fa-user"></i> Foydalanuvchi</h3>
            <button class="modal-close" onclick="Admin.closeModal('user-modal')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            
            <div style="display: flex; gap: 16px; padding: 16px; background: var(--bg-elevated); border-radius: var(--radius-md); margin-bottom: 16px;">
              <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--excel-green); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px;">
                ${(user.displayName || 'U')[0].toUpperCase()}
              </div>
              <div style="flex: 1;">
                <h3 style="margin-bottom: 4px;">${user.displayName}</h3>
                <p style="color: var(--text-muted); font-size: 13px;">${user.email}</p>
                <div style="margin-top: 8px; display: flex; gap: 6px;">
                  ${this._renderRoleBadge(user.role)}
                  ${isBlocked ? '<span class="badge badge-red">🔒 Bloklangan</span>' : ''}
                </div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
              <div style="text-align: center; padding: 12px; background: var(--bg-elevated); border-radius: var(--radius-sm);">
                <div style="font-size: 22px; font-weight: 800; color: var(--excel-green);">${completedLessons}</div>
                <div style="font-size: 11px; color: var(--text-muted);">Darslar</div>
              </div>
              <div style="text-align: center; padding: 12px; background: var(--bg-elevated); border-radius: var(--radius-sm);">
                <div style="font-size: 22px; font-weight: 800; color: var(--color-dashboard);">${Object.keys(quizResults).length}</div>
                <div style="font-size: 11px; color: var(--text-muted);">Testlar</div>
              </div>
              <div style="text-align: center; padding: 12px; background: var(--bg-elevated); border-radius: var(--radius-sm);">
                <div style="font-size: 22px; font-weight: 800; color: var(--color-bonus);">${certificates.length}</div>
                <div style="font-size: 11px; color: var(--text-muted);">Sertifikat</div>
              </div>
            </div>

            <div style="font-size: 13px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                <span style="color: var(--text-muted);">UID:</span>
                <code style="font-size: 11px;">${user.uid}</code>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                <span style="color: var(--text-muted);">Ro'yxatdan:</span>
                <strong>${new Date(user.createdAt).toLocaleString('uz-UZ')}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                <span style="color: var(--text-muted);">Oxirgi kirish:</span>
                <strong>${user.lastLogin ? new Date(user.lastLogin).toLocaleString('uz-UZ') : 'Hech qachon'}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                <span style="color: var(--text-muted);">Urinishlar:</span>
                <strong style="color: ${user.loginAttempts > 0 ? 'var(--warning)' : 'var(--text-muted)'};">${user.loginAttempts || 0}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="color: var(--text-muted);">Ochiq darslar:</span>
                <strong>F: ${user.unlockedLessons?.foundation?.length || 0} | P: ${user.unlockedLessons?.pro?.length || 0}</strong>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="Admin.closeModal('user-modal')">Yopish</button>
            <button class="btn btn-green" onclick="Admin.closeModal('user-modal'); Admin.manageLessons('${user.uid}')">
              <i class="fas fa-unlock"></i> Darslarni boshqarish
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
  },

  // ==================== LESSONS MANAGEMENT ====================

  async manageLessons(uid) {
    const users = await FB.getAllUsers();
    const user = users.find(u => u.uid === uid);
    if (!user) {
      App.showToast('Foydalanuvchi topilmadi', 'error');
      return;
    }

    const courses = await Courses.loadAllCourses();
    let content = '';
    
    for (const course of courses) {
      const unlocked = user.unlockedLessons?.[course.id] || ['lesson-1', 'lesson-2'];
      
      content += `
        <div style="margin-bottom: 24px;">
          <h4 style="margin-bottom: 12px; padding: 8px 12px; background: var(--color-${course.color === 'pro' ? 'pro' : 'foundation'}); color: #fff; border-radius: var(--radius-sm);">
            <i class="fas ${course.icon}"></i> ${course.title}
            <span style="font-size: 12px; opacity: 0.8; margin-left: 8px;">
              (${unlocked.length} ta ochiq)
            </span>
          </h4>
          
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <button class="btn btn-sm btn-outline-green" onclick="Admin.unlockAll('${uid}', '${course.id}')">
              <i class="fas fa-unlock"></i> Hammasini ochish
            </button>
            <button class="btn btn-sm btn-outline" onclick="Admin.lockAll('${uid}', '${course.id}')">
              <i class="fas fa-lock"></i> Hammasini yopish
            </button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 4px; max-height: 300px; overflow-y: auto; padding: 8px; background: var(--bg-elevated); border-radius: var(--radius-sm);">
            ${course.modules?.map(module => 
              module.lessons.map((lesson, idx) => `
                <label style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-surface); border-radius: var(--radius-xs); cursor: pointer;">
                  <input type="checkbox" 
                         ${unlocked.includes(lesson.id) ? 'checked' : ''}
                         onchange="Admin.toggleLesson('${uid}', '${course.id}', '${lesson.id}', this.checked)"
                         style="cursor: pointer; width: 18px; height: 18px;">
                  <span style="font-size: 13px; flex: 1;">
                    <strong style="color: var(--text-muted);">${idx + 1}.</strong> ${lesson.title}
                  </span>
                  ${unlocked.includes(lesson.id) ? '<i class="fas fa-check-circle" style="color: var(--success);"></i>' : '<i class="fas fa-lock" style="color: var(--text-muted);"></i>'}
                </label>
              `).join('')
            ).join('') || ''}
          </div>
        </div>
      `;
    }

    const modal = `
      <div class="modal-overlay show" id="lessons-modal" onclick="if(event.target===this) Admin.closeModal('lessons-modal')">
        <div class="modal" style="max-width: 700px;">
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fas fa-unlock"></i> ${user.displayName} - darslar
            </h3>
            <button class="modal-close" onclick="Admin.closeModal('lessons-modal')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
            <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 13px;">
              <i class="fas fa-info-circle"></i> Belgilangan darslar foydalanuvchiga ko'rinadi.
            </p>
            ${content}
          </div>
          <div class="modal-footer">
            <button class="btn btn-green" onclick="Admin.closeModal('lessons-modal')">
              <i class="fas fa-check"></i> Tugatish
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
  },

  async toggleLesson(uid, courseId, lessonId, checked) {
    const users = await FB.getAllUsers();
    const user = users.find(u => u.uid === uid);
    if (!user) return;

    if (!user.unlockedLessons) user.unlockedLessons = {};
    if (!user.unlockedLessons[courseId]) user.unlockedLessons[courseId] = ['lesson-1', 'lesson-2'];

    let unlocked = [...user.unlockedLessons[courseId]];

    if (checked) {
      if (!unlocked.includes(lessonId)) unlocked.push(lessonId);
    } else {
      unlocked = unlocked.filter(id => id !== lessonId);
    }

    const result = await FB.unlockLessons(uid, courseId, unlocked);
    
    if (result.success) {
      const cached = this.cachedUsers.find(u => u.uid === uid);
      if (cached) {
        if (!cached.unlockedLessons) cached.unlockedLessons = {};
        cached.unlockedLessons[courseId] = unlocked;
      }
      App.showToast(checked ? `✅ Ochildi` : `🔒 Yopildi`, 'info', 1500);
    }
  },

  async unlockAll(uid, courseId) {
    const course = await Courses.loadCourse(courseId);
    if (!course) return;

    const allLessons = [];
    course.modules?.forEach(m => m.lessons.forEach(l => allLessons.push(l.id)));

    const result = await FB.unlockLessons(uid, courseId, allLessons);
    if (result.success) {
      const cached = this.cachedUsers.find(u => u.uid === uid);
      if (cached) {
        if (!cached.unlockedLessons) cached.unlockedLessons = {};
        cached.unlockedLessons[courseId] = allLessons;
      }
      App.showToast(`✅ ${allLessons.length} ta dars ochildi!`, 'success');
      this.closeModal('lessons-modal');
      setTimeout(() => this.manageLessons(uid), 300);
    }
  },

  async lockAll(uid, courseId) {
    if (!confirm('Barcha darslarni yopmoqchimisiz? Faqat 1-2 darslar ochiq qoladi.')) return;

    const result = await FB.unlockLessons(uid, courseId, ['lesson-1', 'lesson-2']);
    if (result.success) {
      const cached = this.cachedUsers.find(u => u.uid === uid);
      if (cached) {
        if (!cached.unlockedLessons) cached.unlockedLessons = {};
        cached.unlockedLessons[courseId] = ['lesson-1', 'lesson-2'];
      }
      App.showToast('🔒 Darslar yopildi', 'info');
      this.closeModal('lessons-modal');
      setTimeout(() => this.manageLessons(uid), 300);
    }
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.remove();
  },

  _renderRoleBadge(role) {
    const badges = {
      'super_admin': '<span class="badge badge-red"><i class="fas fa-crown"></i> Super Admin</span>',
      'admin': '<span class="badge badge-purple"><i class="fas fa-shield-alt"></i> Admin</span>',
      'student': '<span class="badge badge-green"><i class="fas fa-user-graduate"></i> Student</span>'
    };
    return badges[role] || '<span class="badge badge-gray">User</span>';
  },

  _showError(el, message) {
    if (!el) return;
    el.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    el.style.display = 'flex';
    el.style.color = 'var(--danger)';
    el.style.alignItems = 'center';
    el.style.gap = '6px';
    el.style.marginTop = '8px';
    el.style.fontSize = '13px';
  }
};

console.log('%c👑 Admin (1/2) yuklandi', 'color: #7b3ff2; font-weight: bold;');
