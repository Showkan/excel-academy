// ==========================================
// COURSES.JS - Kurslar va kurs tafsilotlari
// ==========================================

window.Courses = {
  // Yuklangan kurslar (cache)
  loadedCourses: {},

  // Mavjud kurslar ro'yxati
  availableCourses: [
    {
      id: 'foundation',
      file: 'data/foundation.json',
      color: 'foundation',
      icon: 'fa-table',
      level: 'foundation'
    },
    {
      id: 'pro',
      file: 'data/pro.json',
      color: 'pro',
      icon: 'fa-rocket',
      level: 'pro'
    }
  ],

  /**
   * Kurs ma'lumotini yuklash (JSON dan)
   */
  async loadCourse(courseId) {
    // Cache dan
    if (this.loadedCourses[courseId]) {
      return this.loadedCourses[courseId];
    }

    const courseInfo = this.availableCourses.find(c => c.id === courseId);
    if (!courseInfo) {
      console.error('Kurs topilmadi:', courseId);
      return null;
    }

    try {
      const response = await fetch(courseInfo.file);
      if (!response.ok) throw new Error('Fayl yuklanmadi');
      const data = await response.json();
      
      // Cache ga saqlash
      this.loadedCourses[courseId] = { ...data, ...courseInfo };
      return this.loadedCourses[courseId];
    } catch (error) {
      console.error('Kurs yuklashda xato:', error);
      // Fallback ma'lumot
      return this._getFallbackCourse(courseId);
    }
  },

  /**
   * Barcha kurslarni yuklash
   */
  async loadAllCourses() {
    const courses = await Promise.all(
      this.availableCourses.map(c => this.loadCourse(c.id))
    );
    return courses.filter(c => c !== null);
  },

  // ==================== KURSLAR RO'YXATI SAHIFASI ====================

  async renderList(container) {
    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a href="#home" data-page="home"><i class="fas fa-home"></i> ${I18n.t('nav_home')}</a>
            <i class="fas fa-chevron-right"></i>
            <span>${I18n.t('nav_courses')}</span>
          </div>
          <div class="page-header-content">
            <div>
              <h1><i class="fas fa-graduation-cap"></i> ${I18n.t('courses_title')}</h1>
              <p>${I18n.t('courses_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Courses -->
      <div class="container" style="padding: 32px 0;">
        <div id="courses-list" class="courses-grid">
          <div class="empty-state" style="grid-column: 1/-1;">
            <div class="empty-state-icon">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>${I18n.t('common_loading')}</p>
          </div>
        </div>
      </div>
    `;

    // Kurslarni yuklash
    const courses = await this.loadAllCourses();
    const listEl = document.getElementById('courses-list');
    
    if (courses.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">
            <i class="fas fa-folder-open"></i>
          </div>
          <h3 class="empty-state-title">Kurslar topilmadi</h3>
        </div>
      `;
      return;
    }

    listEl.innerHTML = courses.map(course => this._renderCourseCard(course)).join('');
  },

  /**
   * Kurs kartochkasi
   */
  _renderCourseCard(course) {
    const user = Auth.currentUser;
    const isLoggedIn = Auth.isLoggedIn();
    
    // Progress hisoblash
    let progress = 0;
    let completedLessons = 0;
    
    if (isLoggedIn && user?.progress?.[course.id]) {
      const courseProgress = user.progress[course.id];
      completedLessons = Object.keys(courseProgress).length;
      const totalLessons = course.lessons_count || course.modules?.reduce((sum, m) => sum + m.lessons.length, 0) || 0;
      progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    const levelText = course.id === 'foundation' 
      ? I18n.t('course_level_foundation') 
      : I18n.t('course_level_pro');

    return `
      <div class="course-card" onclick="Router.navigate('course/${course.id}')">
        
        <!-- Cover -->
        <div class="course-card-cover cover-${course.color}">
          <div class="course-card-level">${levelText}</div>
          <i class="fas ${course.icon} course-card-icon"></i>
        </div>

        <!-- Body -->
        <div class="course-card-body">
          <h3 class="course-card-title">${course.title}</h3>
          <p class="course-card-desc">${course.description || ''}</p>

          <div class="course-card-meta">
            <span><i class="fas fa-book"></i> ${course.lessons_count || 0} ${I18n.t('course_lessons')}</span>
            <span><i class="fas fa-clock"></i> ${course.duration || '0 ' + I18n.t('course_hours')}</span>
            <span><i class="fas fa-users"></i> ${course.students || 0}</span>
          </div>

          ${isLoggedIn && progress > 0 ? `
            <div class="course-card-progress">
              <div class="course-card-progress-info">
                <span>${completedLessons} / ${course.lessons_count} ${I18n.t('course_lessons')}</span>
                <span><strong>${progress}%</strong></span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill ${course.color === 'pro' ? 'pro' : ''}" style="width: ${progress}%"></div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Footer -->
        <div class="course-card-footer">
          <span class="course-card-price ${course.id === 'foundation' ? 'free' : ''}">
            ${course.id === 'foundation' ? I18n.t('course_free') : I18n.t('course_premium')}
          </span>
          <button class="btn btn-sm ${course.color === 'pro' ? 'btn-purple' : 'btn-green'}">
            ${progress > 0 ? I18n.t('course_continue') : I18n.t('course_start')}
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>

      </div>
    `;
  },

  // ==================== KURS TAFSILOTI SAHIFASI ====================

  async renderDetail(container, courseId) {
    container.innerHTML = `
      <div class="container" style="padding: 60px 0; text-align: center;">
        <div class="empty-state-icon">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>${I18n.t('common_loading')}</p>
      </div>
    `;

    const course = await this.loadCourse(courseId);
    
    if (!course) {
      this._render404(container);
      return;
    }

    const user = Auth.currentUser;
    const isLoggedIn = Auth.isLoggedIn();
    
    // Progress
    let completedLessons = [];
    let unlockedLessons = [];
    
    if (isLoggedIn) {
      const progress = await FB.getProgress(user.uid, courseId);
      completedLessons = Object.keys(progress);
      unlockedLessons = user.unlockedLessons?.[courseId] || ['lesson-1', 'lesson-2'];
    } else {
      // Guest - faqat 1 va 2 darslar
      unlockedLessons = ['lesson-1', 'lesson-2'];
    }

    const totalLessons = course.lessons_count || course.modules?.reduce((sum, m) => sum + m.lessons.length, 0) || 0;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

    const levelText = courseId === 'foundation' 
      ? I18n.t('course_level_foundation') 
      : I18n.t('course_level_pro');

    container.innerHTML = `
      
      <!-- Page Header -->
      <div class="page-header" style="background: linear-gradient(135deg, var(--color-${course.color}) 0%, ${course.color === 'pro' ? '#9b5cf5' : 'var(--excel-green-light)'} 100%); color: #fff; padding: 60px 0;">
        <div class="container">
          <div class="breadcrumb" style="color: rgba(255,255,255,0.8);">
            <a href="#home" data-page="home" style="color: rgba(255,255,255,0.9);">
              <i class="fas fa-home"></i> ${I18n.t('nav_home')}
            </a>
            <i class="fas fa-chevron-right"></i>
            <a href="#courses" data-page="courses" style="color: rgba(255,255,255,0.9);">${I18n.t('nav_courses')}</a>
            <i class="fas fa-chevron-right"></i>
            <span>${course.title}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: center; margin-top: 20px;">
            <div>
              <span style="display: inline-block; padding: 6px 14px; background: rgba(255,255,255,0.2); border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
                ${levelText}
              </span>
              <h1 style="font-size: 38px; font-weight: 800; margin-bottom: 12px; color: #fff;">
                ${course.title}
              </h1>
              <p style="font-size: 17px; opacity: 0.9; max-width: 600px;">
                ${course.description || ''}
              </p>

              <div style="display: flex; gap: 24px; margin-top: 24px; flex-wrap: wrap;">
                <div><i class="fas fa-book"></i> <strong>${course.lessons_count}</strong> ${I18n.t('course_lessons')}</div>
                <div><i class="fas fa-clock"></i> <strong>${course.duration}</strong></div>
                <div><i class="fas fa-users"></i> <strong>${course.students}</strong> ${I18n.t('course_students')}</div>
                <div><i class="fas fa-star"></i> <strong>${course.rating || '4.8'}</strong></div>
              </div>
            </div>

            <div style="font-size: 100px; opacity: 0.3;">
              <i class="fas ${course.icon}"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="container" style="padding: 32px 0;">
        
        <div style="display: grid; grid-template-columns: 1fr 320px; gap: 32px;" class="course-detail-layout">
          
          <!-- Main: Lessons -->
          <div>
            ${isLoggedIn && progressPercent > 0 ? `
              <div class="card mb-3">
                <div class="card-body">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong>${I18n.t('dash_progress')}</strong>
                    <strong style="color: var(--excel-green);">${progressPercent}%</strong>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-bar-fill ${course.color === 'pro' ? 'pro' : ''}" style="width: ${progressPercent}%"></div>
                  </div>
                  <div style="font-size: 13px; color: var(--text-muted); margin-top: 8px;">
                    ${completedLessons.length} / ${totalLessons} ${I18n.t('course_lessons')}
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Modules / Lessons -->
            ${course.modules ? course.modules.map((module, mIdx) => `
              <div class="card mb-3">
                <div class="card-header">
                  <h3>
                    <span style="background: var(--color-${course.color}); color: #fff; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 13px;">
                      ${mIdx + 1}
                    </span>
                    ${module.title}
                  </h3>
                  <span class="badge badge-gray">${module.lessons.length} ${I18n.t('course_lessons')}</span>
                </div>
                <div class="card-body" style="padding: 16px;">
                  <div class="lessons-list">
                    ${module.lessons.map((lesson, lIdx) => this._renderLessonItem(lesson, lIdx, course, completedLessons, unlockedLessons, isLoggedIn)).join('')}
                  </div>
                </div>
              </div>
            `).join('') : `
              <div class="empty-state">
                <div class="empty-state-icon"><i class="fas fa-folder-open"></i></div>
                <p>Darslar mavjud emas</p>
              </div>
            `}

          </div>

          <!-- Sidebar -->
          <div>
            <div class="card" style="position: sticky; top: calc(var(--header-h) + 16px);">
              <div class="card-body">
                <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px;">
                  <i class="fas fa-info-circle" style="color: var(--excel-green);"></i>
                  Kurs haqida
                </h3>

                <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14px;">
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                    <span style="color: var(--text-muted);"><i class="fas fa-signal"></i> Daraja</span>
                    <strong>${levelText}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                    <span style="color: var(--text-muted);"><i class="fas fa-book"></i> Darslar</span>
                    <strong>${course.lessons_count}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                    <span style="color: var(--text-muted);"><i class="fas fa-clock"></i> Davomiyligi</span>
                    <strong>${course.duration}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                    <span style="color: var(--text-muted);"><i class="fas fa-language"></i> Til</span>
                    <strong>O'zbek</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                    <span style="color: var(--text-muted);"><i class="fas fa-certificate"></i> Sertifikat</span>
                    <strong style="color: var(--success);">Ha</strong>
                  </div>
                </div>

                ${!isLoggedIn ? `
                  <div style="margin-top: 20px; padding: 16px; background: var(--excel-green-pale); border-radius: var(--radius-md); text-align: center;">
                    <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
                      <i class="fas fa-info-circle"></i> 
                      Faqat 2 ta dars ko'rish mumkin. To'liq kirish uchun ro'yxatdan o'ting.
                    </p>
                    <button class="btn btn-green btn-block" data-page="register">
                      <i class="fas fa-user-plus"></i> Ro'yxatdan o'tish
                    </button>
                  </div>
                ` : `
                  <button class="btn ${course.color === 'pro' ? 'btn-purple' : 'btn-green'} btn-block btn-lg mt-3" onclick="Courses.startCourse('${course.id}')">
                    <i class="fas fa-play"></i>
                    ${progressPercent > 0 ? I18n.t('course_continue') : I18n.t('course_start')}
                  </button>
                `}

              </div>
            </div>

            ${course.objectives && course.objectives.length > 0 ? `
              <div class="card mt-3">
                <div class="card-header">
                  <h3><i class="fas fa-bullseye"></i> Maqsadlar</h3>
                </div>
                <div class="card-body">
                  <ul style="display: flex; flex-direction: column; gap: 10px; font-size: 14px;">
                    ${course.objectives.map(obj => `
                      <li style="display: flex; gap: 10px;">
                        <i class="fas fa-check" style="color: var(--success); margin-top: 4px;"></i>
                        <span>${obj}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </div>
            ` : ''}

          </div>

        </div>

      </div>
    `;
  },

  /**
   * Bitta dars itemi
   */
  _renderLessonItem(lesson, idx, course, completed, unlocked, isLoggedIn) {
    const lessonId = lesson.id;
    const isCompleted = completed.includes(lessonId);
    const isUnlocked = unlocked.includes(lessonId);
    const isLocked = !isUnlocked;

    let statusIcon = '<i class="fas fa-circle"></i>';
    let statusClass = '';

    if (isCompleted) {
      statusIcon = '<i class="fas fa-check-circle"></i>';
      statusClass = 'completed';
    } else if (isLocked) {
      statusIcon = '<i class="fas fa-lock"></i>';
      statusClass = 'locked';
    } else {
      statusIcon = '<i class="fas fa-play-circle"></i>';
    }

    const clickAction = isLocked 
      ? `Courses.showLockedMsg('${lessonId}')` 
      : `Router.navigate('lesson/${course.id}/${lessonId}')`;

    return `
      <div class="lesson-item ${statusClass}" onclick="${clickAction}">
        <div class="lesson-item-num">${idx + 1}</div>
        <div class="lesson-item-content">
          <div class="lesson-item-title">${lesson.title}</div>
          ${lesson.description ? `<div class="lesson-item-desc">${lesson.description}</div>` : ''}
          <div class="lesson-item-meta">
            ${lesson.day ? `<span><i class="fas fa-calendar-day"></i> ${I18n.t('lesson_day')} ${lesson.day}</span>` : ''}
            ${lesson.duration ? `<span><i class="fas fa-clock"></i> ${lesson.duration}</span>` : ''}
            ${lesson.quiz ? `<span><i class="fas fa-question-circle"></i> ${I18n.t('lesson_quiz')}</span>` : ''}
          </div>
        </div>
        <div class="lesson-item-status">
          ${statusIcon}
        </div>
      </div>
    `;
  },

  // ==================== ACTIONS ====================

  /**
   * Kursni boshlash
   */
  async startCourse(courseId) {
    const course = await this.loadCourse(courseId);
    if (!course || !course.modules || !course.modules[0]) return;

    const user = Auth.currentUser;
    const progress = user ? await FB.getProgress(user.uid, courseId) : {};
    const completed = Object.keys(progress);

    // Birinchi tugatilmagan darsni topish
    let nextLessonId = null;
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!completed.includes(lesson.id)) {
          nextLessonId = lesson.id;
          break;
        }
      }
      if (nextLessonId) break;
    }

    // Agar hammasi tugagan bo'lsa - birinchi dars
    if (!nextLessonId) {
      nextLessonId = course.modules[0].lessons[0].id;
    }

    Router.navigate(`lesson/${courseId}/${nextLessonId}`);
  },

  /**
   * Yopiq dars xabari
   */
  showLockedMsg(lessonId) {
    if (!Auth.isLoggedIn()) {
      App.showToast(I18n.t('lesson_guest_msg'), 'warning');
      setTimeout(() => Router.navigate('register'), 1000);
    } else {
      App.showToast(I18n.t('lesson_locked_msg'), 'warning');
    }
  },

  /**
   * 404
   */
  _render404(container) {
    container.innerHTML = `
      <div class="container" style="padding: 80px 0; text-align: center;">
        <div style="font-size: 80px; color: var(--text-muted); margin-bottom: 16px;">
          <i class="fas fa-folder-open"></i>
        </div>
        <h2>Kurs topilmadi</h2>
        <p style="color: var(--text-muted); margin-bottom: 24px;">Bunday kurs mavjud emas</p>
        <button class="btn btn-green" data-page="courses">
          <i class="fas fa-arrow-left"></i> Kurslarga qaytish
        </button>
      </div>
    `;
  },

  /**
   * Fallback ma'lumotlar (JSON yuklanmasa)
   */
  _getFallbackCourse(courseId) {
    if (courseId === 'foundation') {
      return {
        id: 'foundation',
        color: 'foundation',
        icon: 'fa-table',
        title: 'Excel Foundation',
        description: 'Excel asoslari kursi',
        level: 'foundation',
        lessons_count: 8,
        duration: '8 kun',
        students: 0,
        rating: '4.8',
        modules: [{
          id: 'mod-1',
          title: 'Asoslar',
          lessons: [
            { id: 'lesson-1', title: 'Excel Interface', day: 1 },
            { id: 'lesson-2', title: 'Basic Formulas', day: 2 }
          ]
        }]
      };
    }
    return {
      id: 'pro',
      color: 'pro',
      icon: 'fa-rocket',
      title: 'Excel PRO Automation',
      description: 'Excel professional kursi',
      level: 'pro',
      lessons_count: 12,
      duration: '12 kun',
      students: 0,
      rating: '4.9',
      modules: [{
        id: 'mod-1',
        title: 'Advanced',
        lessons: [
          { id: 'lesson-1', title: 'Advanced Formulas', day: 1 },
          { id: 'lesson-2', title: 'SUMIF + IF', day: 2 }
        ]
      }]
    };
  }
};

console.log('📚 Courses modul yuklandi');