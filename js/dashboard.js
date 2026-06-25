// ==========================================
// DASHBOARD.JS - Shaxsiy kabinet
// ==========================================

window.Dashboard = {

  async render(container) {
    if (!Auth.isLoggedIn()) {
      App.showToast('Iltimos, avval tizimga kiring', 'warning');
      Router.navigate('login');
      return;
    }

    container.innerHTML = `
      <div class="container" style="padding: 60px 0; text-align: center;">
        <div class="empty-state-icon"><i class="fas fa-spinner fa-spin"></i></div>
        <p>${I18n.t('common_loading')}</p>
      </div>
    `;

    const user = Auth.currentUser;

    const [courses, progress, quizResults, certificates] = await Promise.all([
      Courses.loadAllCourses(),
      FB.getProgress(user.uid),
      FB.getQuizResults(user.uid),
      FB.getCertificates(user.uid)
    ]);

    const stats = this._calculateStats(courses, progress, quizResults, certificates);
    const recentActivity = this._getRecentActivity(progress, quizResults, certificates);
    const xpStats = typeof XPSystem !== 'undefined' ? XPSystem.getStats() : null;

    container.innerHTML = `
      <div class="container" style="padding-top: 32px;">
        
        <!-- Welcome Banner -->
        <div class="dashboard-welcome">
          <div class="dashboard-welcome-content">
            <h1>${this._getGreeting()}, ${Auth.getDisplayName(user)}! 👋</h1>
            <p>${I18n.t('dash_welcome_back')}! Bugun nimani o'rganamiz?</p>
          </div>
          <div class="dashboard-welcome-icon">
            <i class="fas fa-chart-line"></i>
          </div>
        </div>

        ${xpStats ? `
          <!-- XP Card -->
          <div class="card mb-3" style="background: linear-gradient(135deg, rgba(247,181,0,0.1) 0%, rgba(247,181,0,0.05) 100%); border: 1px solid var(--color-bonus);">
            <div class="card-body">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="font-size: 48px;">${xpStats.levelInfo.badge}</div>
                  <div>
                    <h3 style="margin-bottom: 4px;">Level ${xpStats.level} — ${xpStats.levelInfo.title}</h3>
                    <p style="color: var(--text-secondary); font-size: 14px;">
                      Jami: <strong>${xpStats.totalXP} XP</strong> | Bugun: <strong>+${xpStats.todayXP} XP</strong>
                    </p>
                  </div>
                </div>
                <button class="btn btn-sm btn-outline-green" onclick="XPSystem.showHistory()">
                  <i class="fas fa-history"></i> Tarix
                </button>
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">
                <span>${xpStats.totalXP} XP</span>
                ${xpStats.nextLevel ? `<span>${xpStats.nextLevel.xp} XP gacha</span>` : '<span>MAX LEVEL</span>'}
              </div>
              <div class="progress-bar" style="height: 10px;">
                <div class="progress-bar-fill" style="width: ${xpStats.progress}%; background: ${xpStats.levelInfo.color};"></div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card stat-green">
            <div class="stat-card-icon"><i class="fas fa-chart-pie"></i></div>
            <div class="stat-card-info">
              <div class="stat-card-num">${stats.overallProgress}%</div>
              <div class="stat-card-label">${I18n.t('dash_progress')}</div>
            </div>
          </div>

          <div class="stat-card stat-purple">
            <div class="stat-card-icon"><i class="fas fa-book-open"></i></div>
            <div class="stat-card-info">
              <div class="stat-card-num">${stats.completedLessons}/${stats.totalLessons}</div>
              <div class="stat-card-label">${I18n.t('dash_completed_lessons')}</div>
            </div>
          </div>

          <div class="stat-card stat-blue">
            <div class="stat-card-icon"><i class="fas fa-trophy"></i></div>
            <div class="stat-card-info">
              <div class="stat-card-num">${stats.quizAvg}%</div>
              <div class="stat-card-label">${I18n.t('dash_quiz_avg')}</div>
            </div>
          </div>

          <div class="stat-card stat-yellow">
            <div class="stat-card-icon"><i class="fas fa-certificate"></i></div>
            <div class="stat-card-info">
              <div class="stat-card-num">${stats.certificatesCount}</div>
              <div class="stat-card-label">${I18n.t('dash_certificates')}</div>
            </div>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="dashboard-grid">
          
          <!-- Left -->
          <div>
            <div class="card mb-3">
              <div class="card-header">
                <h3><i class="fas fa-graduation-cap"></i> ${I18n.t('dash_my_courses')}</h3>
                <button class="btn btn-sm btn-outline-green" data-page="courses">
                  <i class="fas fa-arrow-right"></i> ${I18n.t('common_view_all')}
                </button>
              </div>
              <div class="card-body">
                <div class="progress-list">
                  ${courses.map(course => this._renderCourseProgress(course, progress)).join('')}
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3><i class="fas fa-chart-bar"></i> Test natijalari</h3>
              </div>
              <div class="card-body">
                ${this._renderQuizStats(quizResults, courses)}
              </div>
            </div>
          </div>

          <!-- Right -->
          <div>
            
            <div class="card mb-3">
              <div class="card-header">
                <h3><i class="fas fa-history"></i> ${I18n.t('dash_recent_activity')}</h3>
              </div>
              <div class="card-body" style="padding: 16px;">
                ${recentActivity.length > 0 ? `
                  <div class="activity-list">
                    ${recentActivity.map(a => this._renderActivityItem(a)).join('')}
                  </div>
                ` : `
                  <div style="text-align: center; padding: 24px; color: var(--text-muted);">
                    <i class="fas fa-clock" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i>
                    <p>${I18n.t('dash_no_activity')}</p>
                  </div>
                `}
              </div>
            </div>

            <div class="card mb-3">
              <div class="card-header">
                <h3><i class="fas fa-bolt"></i> Tezkor amallar</h3>
              </div>
              <div class="card-body" style="padding: 16px;">
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <button class="btn btn-green btn-block" data-page="courses">
                    <i class="fas fa-play"></i> ${I18n.t('dash_continue_learning')}
                  </button>
                  <button class="btn btn-purple btn-block" data-page="sandbox">
                    <i class="fas fa-flask"></i> Sandbox
                  </button>
                  <button class="btn btn-outline-green btn-block" data-page="certificates">
                    <i class="fas fa-certificate"></i> ${I18n.t('nav_certificates')}
                  </button>
                  <button class="btn btn-outline btn-block" data-page="profile">
                    <i class="fas fa-user-cog"></i> ${I18n.t('nav_profile')}
                  </button>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3><i class="fas fa-medal"></i> Yutuqlar</h3>
              </div>
              <div class="card-body" style="padding: 16px;">
                ${this._renderAchievements(stats, xpStats)}
              </div>
            </div>

          </div>

        </div>

        <!-- Weekly Activity -->
        <div class="card mt-3">
          <div class="card-header">
            <h3><i class="fas fa-calendar-week"></i> Haftalik faollik</h3>
          </div>
          <div class="card-body">
            ${this._renderWeeklyChart(recentActivity)}
          </div>
        </div>

      </div>
    `;
  },

  _getGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) return 'Tunni xayrli';
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  },

  _calculateStats(courses, progress, quizResults, certificates) {
    let totalLessons = 0;
    let completedLessons = 0;

    courses.forEach(course => {
      const courseLessons = course.modules?.reduce((sum, m) => sum + m.lessons.length, 0) || 0;
      totalLessons += courseLessons;
      
      const courseProgress = progress[course.id] || {};
      completedLessons += Object.keys(courseProgress).length;
    });

    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const quizScores = Object.values(quizResults).map(r => r.percentage || 0);
    const quizAvg = quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : 0;

    return {
      totalLessons, completedLessons, overallProgress,
      quizAvg, quizCount: quizScores.length,
      certificatesCount: certificates.length
    };
  },

  _renderCourseProgress(course, allProgress) {
    const courseProgress = allProgress[course.id] || {};
    const completed = Object.keys(courseProgress).length;
    const total = course.modules?.reduce((sum, m) => sum + m.lessons.length, 0) || 0;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return `
      <div class="progress-item" onclick="Router.navigate('course/${course.id}')">
        <div class="progress-item-icon ${course.color}">
          <i class="fas ${course.icon || 'fa-book'}"></i>
        </div>
        <div class="progress-item-content">
          <div class="progress-item-title">${course.title}</div>
          <div class="progress-item-info">
            <span>${completed}/${total} ${I18n.t('course_lessons')}</span>
            <strong style="color: var(--excel-green);">${percent}%</strong>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill ${course.color === 'pro' ? 'pro' : ''}" style="width: ${percent}%"></div>
          </div>
        </div>
      </div>
    `;
  },

  _renderQuizStats(quizResults, courses) {
    const results = Object.values(quizResults);
    
    if (results.length === 0) {
      return `
        <div style="text-align: center; padding: 24px; color: var(--text-muted);">
          <i class="fas fa-question-circle" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i>
          <p>Hali test topshirmadingiz</p>
          <button class="btn btn-sm btn-green mt-2" data-page="courses">Kurslarni ko'rish</button>
        </div>
      `;
    }

    const passed = results.filter(r => r.passed).length;
    const failed = results.length - passed;
    const avgScore = Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);
    const avgTime = Math.round(results.reduce((s, r) => s + (r.timeSpent || 0), 0) / results.length);

    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px;">
        <div style="text-align: center; padding: 16px; background: var(--bg-elevated); border-radius: var(--radius-md);">
          <div style="font-size: 24px; font-weight: 800; color: var(--success);">${passed}</div>
          <div style="font-size: 12px; color: var(--text-muted);">O'tilgan</div>
        </div>
        <div style="text-align: center; padding: 16px; background: var(--bg-elevated); border-radius: var(--radius-md);">
          <div style="font-size: 24px; font-weight: 800; color: var(--danger);">${failed}</div>
          <div style="font-size: 12px; color: var(--text-muted);">O'tilmagan</div>
        </div>
        <div style="text-align: center; padding: 16px; background: var(--bg-elevated); border-radius: var(--radius-md);">
          <div style="font-size: 24px; font-weight: 800; color: var(--excel-green);">${avgScore}%</div>
          <div style="font-size: 12px; color: var(--text-muted);">O'rtacha</div>
        </div>
        <div style="text-align: center; padding: 16px; background: var(--bg-elevated); border-radius: var(--radius-md);">
          <div style="font-size: 24px; font-weight: 800; color: var(--color-dashboard);">${Math.floor(avgTime / 60)}m</div>
          <div style="font-size: 12px; color: var(--text-muted);">Vaqt</div>
        </div>
      </div>

      <h4 style="margin-top: 20px; margin-bottom: 12px; font-size: 14px;">So'nggi testlar:</h4>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${results.slice(-5).reverse().map(r => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--bg-elevated); border-radius: var(--radius-sm); font-size: 13px;">
            <span>
              <i class="fas fa-${r.passed ? 'check' : 'times'}" style="color: var(--${r.passed ? 'success' : 'danger'}); margin-right: 8px;"></i>
              ${r.courseId} / ${r.lessonId}
            </span>
            <strong style="color: var(--${r.passed ? 'success' : 'danger'});">${r.percentage}%</strong>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderActivityItem(activity) {
    const icons = {
      lesson: { icon: 'fa-book', color: '' },
      quiz: { icon: 'fa-question-circle', color: 'icon-purple' },
      certificate: { icon: 'fa-certificate', color: 'icon-yellow' }
    };
    const config = icons[activity.type] || icons.lesson;

    return `
      <div class="activity-item">
        <div class="activity-icon ${config.color}">
          <i class="fas ${config.icon}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-text">${activity.text}</div>
          <div class="activity-time">${activity.time}</div>
        </div>
      </div>
    `;
  },

  _getRecentActivity(progress, quizResults, certificates) {
    const activities = [];

    Object.entries(progress).forEach(([courseId, lessons]) => {
      Object.entries(lessons).forEach(([lessonId, data]) => {
        activities.push({
          type: 'lesson',
          text: `Dars tugatildi: <strong>${lessonId}</strong>`,
          timestamp: new Date(data.completedAt).getTime(),
          time: this._timeAgo(data.completedAt),
          courseId
        });
      });
    });

    Object.values(quizResults).forEach(r => {
      activities.push({
        type: 'quiz',
        text: `Test ${r.passed ? 'o\'tildi' : 'topshirildi'}: <strong>${r.percentage}%</strong>`,
        timestamp: new Date(r.completedAt).getTime(),
        time: this._timeAgo(r.completedAt),
        courseId: r.courseId
      });
    });

    certificates.forEach(c => {
      activities.push({
        type: 'certificate',
        text: `Sertifikat olindi: <strong>${c.courseTitle}</strong>`,
        timestamp: new Date(c.issuedAt).getTime(),
        time: this._timeAgo(c.issuedAt),
        courseId: c.courseId
      });
    });

    activities.sort((a, b) => b.timestamp - a.timestamp);
    return activities.slice(0, 10);
  },

  _timeAgo(dateStr) {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = now - then;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Hozir';
    if (minutes < 60) return `${minutes} daqiqa oldin`;
    if (hours < 24) return `${hours} soat oldin`;
    if (days < 7) return `${days} kun oldin`;
    return new Date(dateStr).toLocaleDateString('uz-UZ');
  },

  _renderAchievements(stats, xpStats) {
    const totalXP = xpStats?.totalXP || 0;
    
    const achievements = [
      { icon: '🎓', title: 'Birinchi qadam', desc: '1 dars', unlocked: stats.completedLessons >= 1 },
      { icon: '📚', title: '5 dars', desc: '5 ta dars', unlocked: stats.completedLessons >= 5 },
      { icon: '🎯', title: 'Test', desc: '1 test', unlocked: stats.quizCount >= 1 },
      { icon: '🏆', title: 'Sertifikat', desc: '1 sertifikat', unlocked: stats.certificatesCount >= 1 },
      { icon: '⭐', title: '500 XP', desc: '500 XP', unlocked: totalXP >= 500 },
      { icon: '👑', title: 'Master', desc: 'Level 10', unlocked: (xpStats?.level || 1) >= 10 }
    ];

    return `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
        ${achievements.map(a => `
          <div title="${a.title}: ${a.desc}" style="
            text-align: center; padding: 12px 8px;
            background: ${a.unlocked ? 'var(--excel-green-pale)' : 'var(--bg-elevated)'};
            border-radius: var(--radius-sm);
            opacity: ${a.unlocked ? '1' : '0.4'};
            border: 2px solid ${a.unlocked ? 'var(--excel-green)' : 'transparent'};
            cursor: pointer;
          ">
            <div style="font-size: 32px; margin-bottom: 4px;">${a.icon}</div>
            <div style="font-size: 11px; font-weight: 600;">${a.title}</div>
          </div>
        `).join('')}
      </div>
      <p style="text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 12px;">
        ${achievements.filter(a => a.unlocked).length} / ${achievements.length} ochildi
      </p>
    `;
  },

  _renderWeeklyChart(activities) {
    const days = ['Yak', 'Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha'];
    const now = new Date();
    const weekData = new Array(7).fill(0);

    activities.forEach(a => {
      const aDate = new Date(a.timestamp);
      const diff = Math.floor((now - aDate) / (1000 * 60 * 60 * 24));
      if (diff < 7) {
        weekData[aDate.getDay()]++;
      }
    });

    const maxVal = Math.max(...weekData, 1);

    return `
      <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 8px; height: 200px; padding: 16px 0;">
        ${weekData.map((val, idx) => {
          const heightPercent = (val / maxVal) * 100;
          const isToday = idx === now.getDay();
          return `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <div style="font-size: 12px; font-weight: 600; color: var(--${val > 0 ? 'excel-green' : 'text-muted'});">
                ${val}
              </div>
              <div style="
                width: 100%; max-width: 60px;
                background: ${isToday ? 'var(--excel-green)' : (val > 0 ? 'var(--excel-green-light)' : 'var(--bg-elevated)')};
                height: ${heightPercent}%; min-height: 8px;
                border-radius: var(--radius-sm) var(--radius-sm) 0 0;
                transition: var(--t-base);
              "></div>
              <div style="font-size: 12px; font-weight: ${isToday ? '700' : '500'}; color: var(--${isToday ? 'excel-green' : 'text-muted'});">
                ${days[idx]}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <p style="text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 8px;">
        Jami: ${weekData.reduce((a, b) => a + b, 0)} ta faoliyat bu hafta
      </p>
    `;
  }
};

console.log('%c📊 Dashboard yuklandi', 'color: #2b7de9; font-weight: bold;');
