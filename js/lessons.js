// ==========================================
// LESSONS.JS - Darslar + Excel Simulator + Mashqlar + O'yin + AI
// ==========================================

window.Lessons = {
  currentCourse: null,
  currentLesson: null,
  currentLessonIndex: 0,
  allLessons: [],
  
  // Excel Simulator state
  selectedCell: null,
  cellData: {},
  simAttempts: 0,
  simCompleted: false,

  // Mashqlar state
  exerciseAttempts: {},
  
  // AI Chat state
  aiOpen: false,

  // ==================== ASOSIY RENDER ====================

  async render(container, courseId, lessonId) {
    container.innerHTML = `
      <div class="container" style="padding: 60px 0; text-align: center;">
        <div class="empty-state-icon"><i class="fas fa-spinner fa-spin"></i></div>
        <p>${I18n.t('common_loading')}</p>
      </div>
    `;

    const course = await Courses.loadCourse(courseId);
    if (!course) {
      container.innerHTML = `<div class="container" style="padding: 60px 0; text-align:center;"><h2>Kurs topilmadi</h2></div>`;
      return;
    }

    this.currentCourse = course;

    // Barcha darslarni flat ro'yxat
    this.allLessons = [];
    course.modules?.forEach(module => {
      module.lessons.forEach(lesson => {
        this.allLessons.push({ ...lesson, moduleTitle: module.title });
      });
    });

    // Joriy darsni topish
    const lessonIndex = this.allLessons.findIndex(l => l.id === lessonId);
    if (lessonIndex === -1) {
      container.innerHTML = `<div class="container" style="padding: 60px 0; text-align:center;"><h2>Dars topilmadi</h2></div>`;
      return;
    }

    this.currentLesson = this.allLessons[lessonIndex];
    this.currentLessonIndex = lessonIndex;

    // State reset
    this.simAttempts = 0;
    this.simCompleted = false;
    this.exerciseAttempts = {};
    this.cellData = {};
    this.selectedCell = null;

    // Lock tekshirish
    const user = Auth.currentUser;
    const isLoggedIn = Auth.isLoggedIn();
    const unlockedLessons = isLoggedIn 
      ? (user.unlockedLessons?.[courseId] || ['lesson-1', 'lesson-2'])
      : ['lesson-1', 'lesson-2'];

    if (!unlockedLessons.includes(lessonId)) {
      this._renderLocked(container, courseId);
      return;
    }

    // Progress
    const progress = isLoggedIn ? await FB.getProgress(user.uid, courseId) : {};
    const completed = Object.keys(progress);

    this._renderLesson(container, course, this.currentLesson, lessonIndex, completed, unlockedLessons);
  },

  _renderLocked(container, courseId) {
    const isLoggedIn = Auth.isLoggedIn();
    container.innerHTML = `
      <div class="container" style="padding: 80px 0;">
        <div class="card" style="max-width: 500px; margin: 0 auto; text-align: center;">
          <div class="card-body" style="padding: 48px;">
            <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: var(--bg-elevated); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; color: var(--text-muted);">
              <i class="fas fa-lock"></i>
            </div>
            <h2 style="margin-bottom: 12px;">Bu dars yopiq</h2>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">
              ${isLoggedIn 
                ? 'Admin bilan bog\'laning yoki oldingi darslarni tugating' 
                : 'Bu darsni ko\'rish uchun ro\'yxatdan o\'ting'}
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-outline-green" onclick="Router.navigate('course/${courseId}')">
                <i class="fas fa-arrow-left"></i> Kursga qaytish
              </button>
              ${!isLoggedIn ? `
                <button class="btn btn-green" data-page="register">
                  <i class="fas fa-user-plus"></i> Ro'yxatdan o'tish
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _renderLesson(container, course, lesson, lessonIndex, completed, unlocked) {
    const isCompleted = completed.includes(lesson.id);
    const hasNext = lessonIndex < this.allLessons.length - 1;
    const hasPrev = lessonIndex > 0;
    const nextLesson = hasNext ? this.allLessons[lessonIndex + 1] : null;
    const prevLesson = hasPrev ? this.allLessons[lessonIndex - 1] : null;

    container.innerHTML = `
      <!-- Breadcrumb -->
      <div class="page-header" style="padding: 20px 0;">
        <div class="container">
          <div class="breadcrumb">
            <a href="#courses" data-page="courses"><i class="fas fa-graduation-cap"></i> ${I18n.t('nav_courses')}</a>
            <i class="fas fa-chevron-right"></i>
            <a href="#course/${course.id}" onclick="Router.navigate('course/${course.id}'); return false;">${course.title}</a>
            <i class="fas fa-chevron-right"></i>
            <span>${lesson.title}</span>
          </div>
        </div>
      </div>

      <div class="container" style="padding: 24px 0;">
        <div class="lesson-detail">
          
          <!-- Sidebar -->
          <aside class="lesson-sidebar">
            <h3 class="lesson-sidebar-title">${course.title}</h3>
            <div class="lesson-sidebar-list">
              ${this.allLessons.map((l, idx) => {
                const isLockedItem = !unlocked.includes(l.id);
                const isCompletedItem = completed.includes(l.id);
                const isActive = l.id === lesson.id;
                
                let icon = (idx + 1).toString();
                let cls = '';
                if (isCompletedItem) { icon = '<i class="fas fa-check"></i>'; cls = 'completed'; }
                if (isActive) cls += ' active';
                if (isLockedItem) { icon = '<i class="fas fa-lock"></i>'; cls = 'locked'; }

                const action = isLockedItem ? '' : `onclick="Router.navigate('lesson/${course.id}/${l.id}')"`;

                return `
                  <div class="lesson-sidebar-item ${cls}" ${action}>
                    <div class="lesson-sidebar-icon">${icon}</div>
                    <span>${l.title}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </aside>

          <!-- Main -->
          <article class="lesson-content-area">
            
            <!-- Header -->
            <div class="lesson-content-header">
              <div class="lesson-content-meta">
                ${lesson.day ? `<span><i class="fas fa-calendar-day"></i> ${I18n.t('lesson_day')} ${lesson.day}</span>` : ''}
                <span><i class="fas fa-book"></i> ${I18n.t('lesson_lesson')} ${lessonIndex + 1}</span>
                ${lesson.duration ? `<span><i class="fas fa-clock"></i> ${lesson.duration}</span>` : ''}
                ${isCompleted ? `<span style="color: var(--success);"><i class="fas fa-check-circle"></i> ${I18n.t('lesson_complete')}</span>` : ''}
              </div>
              <h1 class="lesson-content-title">${lesson.title}</h1>
              ${lesson.description ? `<p class="lesson-content-desc">${lesson.description}</p>` : ''}
            </div>

            <!-- 1. NAZARIYA -->
            <div class="lesson-content-body">
              
              ${lesson.topics && lesson.topics.length > 0 ? `
                <h2><i class="fas fa-list" style="color: var(--excel-green);"></i> ${I18n.t('lesson_topics')}</h2>
                <ul>
                  ${lesson.topics.map(t => `<li>${t}</li>`).join('')}
                </ul>
              ` : ''}

              ${lesson.content ? this._renderContent(lesson.content) : ''}

              ${lesson.shortcuts && lesson.shortcuts.length > 0 ? `
                <h2><i class="fas fa-keyboard" style="color: var(--excel-green);"></i> ${I18n.t('lesson_shortcuts')}</h2>
                ${lesson.shortcuts.map(s => `
                  <div class="shortcut-box">
                    <div class="shortcut-box-title">
                      <i class="fas fa-bolt"></i> ${s.action || s.description}
                    </div>
                    <div class="shortcut-keys">
                      ${(s.keys || s.combo || '').split('+').map(k => `<span class="kbd">${k.trim()}</span>`).join(' + ')}
                    </div>
                  </div>
                `).join('')}
              ` : ''}

              ${lesson.formulas && lesson.formulas.length > 0 ? `
                <h2><i class="fas fa-calculator" style="color: var(--excel-green);"></i> ${I18n.t('lesson_formulas')}</h2>
                ${lesson.formulas.map(f => `
                  <div style="background: var(--bg-elevated); border-left: 4px solid var(--color-dashboard); padding: 16px 20px; border-radius: var(--radius-sm); margin: 16px 0;">
                    <div style="font-weight: 700; margin-bottom: 8px;">${f.name || 'Formula'}</div>
                    <code style="display: block; padding: 8px 12px; background: var(--bg-surface); border-radius: var(--radius-xs); color: var(--color-pro); margin-bottom: 8px;">
                      ${f.formula || f.example}
                    </code>
                    ${f.description ? `<p style="font-size: 13px; color: var(--text-secondary); margin: 0;">${f.description}</p>` : ''}
                  </div>
                `).join('')}
              ` : ''}

              ${lesson.examples && lesson.examples.length > 0 ? `
                <h2><i class="fas fa-table" style="color: var(--excel-green);"></i> ${I18n.t('lesson_examples')}</h2>
                ${lesson.examples.map(ex => `
                  <div style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; margin: 16px 0;">
                    ${ex.title ? `<h3 style="font-size: 16px; margin-bottom: 12px;">${ex.title}</h3>` : ''}
                    ${ex.description ? `<p style="margin-bottom: 12px; color: var(--text-secondary);">${ex.description}</p>` : ''}
                    ${ex.table ? this._renderExampleTable(ex.table) : ''}
                    ${ex.formula ? `
                      <div style="margin-top: 12px;">
                        <strong>Formula:</strong>
                        <code style="display: inline-block; padding: 4px 10px; background: var(--bg-surface); border-radius: var(--radius-xs); margin-left: 8px;">
                          ${ex.formula}
                        </code>
                      </div>
                    ` : ''}
                    ${ex.result ? `
                      <div style="margin-top: 8px;">
                        <strong>Natija:</strong>
                        <span style="color: var(--success); font-weight: 600;">${ex.result}</span>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              ` : ''}

              <!-- 2. MINI-EXCEL TRENAJYOR -->
              ${this._renderMiniExcel(lesson)}

              <!-- 3. MASHQLAR -->
              ${lesson.exercises && lesson.exercises.length > 0 ? this._renderExercises(lesson.exercises) : ''}

              <!-- 4. MINI-O'YIN -->
              ${lesson.game ? this._renderGameSection(lesson.game) : ''}

              <!-- 5. AI YORDAMCHI -->
              ${this._renderAIButton()}

              <!-- 6. TEST -->
              ${lesson.quiz ? `
                <div style="background: var(--excel-green-pale); border: 2px dashed var(--excel-green); border-radius: var(--radius-md); padding: 24px; margin: 24px 0; text-align: center;">
                  <i class="fas fa-question-circle" style="font-size: 32px; color: var(--excel-green); margin-bottom: 12px;"></i>
                  <h3 style="margin-bottom: 8px;">Vaqt — testdan o'tish!</h3>
                  <p style="color: var(--text-secondary); margin-bottom: 16px;">
                    Bilimingizni tekshiring va keyingi darsga o'ting
                  </p>
                  <button class="btn btn-green" onclick="Router.navigate('quiz/${course.id}/${lesson.id}')">
                    <i class="fas fa-play"></i> Testni boshlash
                  </button>
                </div>
              ` : ''}

            </div>

            <!-- Navigation -->
            <div class="lesson-actions">
              ${hasPrev ? `
                <button class="btn btn-outline" onclick="Router.navigate('lesson/${course.id}/${prevLesson.id}')">
                  <i class="fas fa-arrow-left"></i> ${I18n.t('lesson_prev')}
                </button>
              ` : '<div></div>'}

              ${!isCompleted ? `
                <button class="btn btn-green" onclick="Lessons.markComplete('${course.id}', '${lesson.id}')">
                  <i class="fas fa-check"></i> ${I18n.t('lesson_complete')}
                </button>
              ` : `
                <button class="btn btn-outline-green" disabled>
                  <i class="fas fa-check-circle"></i> ${I18n.t('lesson_complete')}
                </button>
              `}

              ${hasNext ? `
                <button class="btn ${course.color === 'pro' ? 'btn-purple' : 'btn-green'}" onclick="Router.navigate('lesson/${course.id}/${nextLesson.id}')">
                  ${I18n.t('lesson_next')} <i class="fas fa-arrow-right"></i>
                </button>
              ` : `
                <button class="btn btn-green" onclick="Router.navigate('course/${course.id}')">
                  <i class="fas fa-flag-checkered"></i> Kursni yakunlash
                </button>
              `}
            </div>

          </article>

        </div>
      </div>
    `;

    // Excel simulator init
    this._initExcelSimulator();
  },

  /**
   * Content render (markdown/blocks)
   */
  _renderContent(content) {
    if (typeof content === 'string') return content;

    if (Array.isArray(content)) {
      return content.map(block => {
        if (typeof block === 'string') return `<p>${block}</p>`;
        if (block.type === 'heading') return `<h${block.level || 2}>${block.text}</h${block.level || 2}>`;
        if (block.type === 'paragraph') return `<p>${block.text}</p>`;
        if (block.type === 'list') return `<ul>${block.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
        if (block.type === 'code') return `<pre><code>${block.code}</code></pre>`;
        if (block.type === 'image') return `<img src="${block.src}" alt="${block.alt || ''}" style="max-width:100%; border-radius:8px; margin:16px 0;">`;
        if (block.type === 'note') {
          return `<div style="background: rgba(43,125,233,0.08); border-left: 4px solid var(--color-dashboard); padding: 16px; border-radius: var(--radius-sm); margin: 16px 0;">
            <strong><i class="fas fa-info-circle"></i> Eslatma:</strong>
            <div style="margin-top: 6px;">${block.text}</div>
          </div>`;
        }
        if (block.type === 'warning') {
          return `<div style="background: rgba(247,181,0,0.1); border-left: 4px solid var(--color-bonus); padding: 16px; border-radius: var(--radius-sm); margin: 16px 0;">
            <strong><i class="fas fa-exclamation-triangle"></i> Diqqat:</strong>
            <div style="margin-top: 6px;">${block.text}</div>
          </div>`;
        }
        if (block.type === 'table') return this._renderExampleTable(block);
        return '';
      }).join('');
    }
    return '';
  },

  /**
   * Example table
   */
  _renderExampleTable(table) {
    if (!table || !table.headers || !table.rows) return '';
    return `
      <div style="overflow-x: auto; margin: 12px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr>
              ${table.headers.map(h => `
                <th style="background: var(--excel-green); color: #fff; padding: 8px 12px; text-align: left; font-weight: 600; border: 1px solid var(--excel-green-dark);">${h}</th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${table.rows.map((row, idx) => `
              <tr style="background: ${idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-elevated)'};">
                ${row.map(cell => `<td style="padding: 8px 12px; border: 1px solid var(--border);">${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  /**
   * AI Yordamchi tugmasi
   */
  _renderAIButton() {
    return `
      <div style="background: linear-gradient(135deg, rgba(123,63,242,0.1) 0%, rgba(43,125,233,0.05) 100%); border-radius: var(--radius-md); padding: 24px; margin: 24px 0; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 12px;">🤖</div>
        <h3 style="margin-bottom: 8px;">Savolingiz bormi?</h3>
        <p style="color: var(--text-secondary); margin-bottom: 16px;">
          AI yordamchi sizga 24/7 javob beradi
        </p>
        <button class="btn btn-purple" onclick="Lessons.toggleAI()">
          <i class="fas fa-robot"></i> AI bilan suhbat
        </button>
      </div>
    `;
  },

  /**
   * Mini-Excel section (kichik 4x6)
   */
  _renderMiniExcel(lesson) {
    if (!lesson.sim && lesson.simulator !== true) {
      // Default sim
      lesson.sim = {
        cols: ['A', 'B', 'C', 'D'],
        rows: 6,
        preset: lesson.simulatorData || {},
        task: 'Formula yozib sinab ko\'ring',
        allowedFns: ['SUM', 'IF', 'AVERAGE']
      };
    }

    const sim = lesson.sim || {
      cols: ['A', 'B', 'C', 'D'],
      rows: 6,
      preset: lesson.simulatorData || {},
      task: 'Formula yozib sinab ko\'ring'
    };

    const cols = sim.cols || ['A', 'B', 'C', 'D'];
    const rowCount = sim.rows || 6;
    const preset = sim.preset || {};
    const locked = sim.locked || [];

    let rowsHtml = '';
    for (let r = 1; r <= rowCount; r++) {
      let cellsHtml = '';
      cols.forEach(col => {
        const cellId = `${col}${r}`;
        const value = preset[cellId] || '';
        const isLocked = locked.includes(cellId);
        cellsHtml += `
          <td>
            <div class="excel-cell ${isLocked ? 'locked' : ''}" 
                 id="cell-${cellId}" 
                 data-cell="${cellId}"
                 onclick="Lessons.selectCell('${cellId}')"
                 contenteditable="${!isLocked}"
                 oninput="Lessons.updateCell('${cellId}', this.innerText)"
                 onkeydown="Lessons.handleCellKey(event, '${cellId}')">${value}</div>
          </td>
        `;
      });
      rowsHtml += `<tr><td class="excel-row">${r}</td>${cellsHtml}</tr>`;
    }

    return `
      <h2 style="margin-top: 32px;">
        <i class="fas fa-table" style="color: var(--excel-green);"></i> 
        Mini-Excel Trenajyor
      </h2>
      <p style="color: var(--text-secondary); font-size: 14px;">
        ${sim.task || 'Kataklarni bosing va formulalarni sinab ko\'ring'}
      </p>

      <div class="excel-sim">
        
        <div class="excel-sim-toolbar">
          <i class="fas fa-table"></i>
          <span>Mini-Excel</span>
          <span style="opacity: 0.7; font-size: 12px;">— ${lesson.title}</span>
          ${sim.expected ? `
            <button class="btn btn-sm" style="margin-left: auto; background: rgba(255,255,255,0.2); color: #fff;" onclick="Lessons.checkSim()">
              <i class="fas fa-check"></i> Tekshirish
            </button>
          ` : ''}
        </div>

        <div class="excel-fbar">
          <div class="excel-fbar-name" id="fbar-name">A1</div>
          <div class="excel-fbar-fx">fx</div>
          <input type="text" 
                 class="excel-fbar-input" 
                 id="fbar-input"
                 placeholder="Formula yoki qiymat..."
                 oninput="Lessons.updateFromFbar(this.value)"
                 onkeydown="if(event.key==='Enter'){this.blur();}">
        </div>

        <div class="excel-grid">
          <table class="excel-table">
            <thead>
              <tr>
                <th class="excel-corner"></th>
                ${cols.map(c => `<th class="excel-col">${c}</th>`).join('')}
              </tr>
            </thead>
            <tbody id="excel-tbody">
              ${rowsHtml}
            </tbody>
          </table>
        </div>

      </div>

      <div id="sim-result" style="margin-top: 12px;"></div>

      <p style="font-size: 12px; color: var(--text-muted); text-align: center; margin-top: 8px;">
        💡 <strong>=SUM(B1:B5)</strong>, <strong>=A1+B1</strong>, <strong>=IF(A1>10,"Ko'p","Kam")</strong>
      </p>
    `;
  },

  /**
   * Mashqlar bo'limi
   */
  _renderExercises(exercises) {
    return `
      <h2 style="margin-top: 32px;">
        <i class="fas fa-pencil-alt" style="color: var(--excel-green);"></i> 
        Mashqlar
      </h2>
      <p style="color: var(--text-secondary); font-size: 14px;">
        Bilimingizni mustahkamlash uchun mashqlarni bajaring
      </p>

      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
        ${exercises.map((ex, idx) => `
          <div class="card" id="exercise-${ex.id}" style="border-left: 4px solid var(--excel-green);">
            <div class="card-body">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                  <span style="background: var(--excel-green-pale); color: var(--excel-green); padding: 2px 10px; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; text-transform: uppercase;">
                    Mashq ${idx + 1} ${ex.level || ''}
                  </span>
                </div>
                <span id="exercise-status-${ex.id}" style="font-size: 12px; color: var(--text-muted);"></span>
              </div>
              
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">
                ${ex.q}
              </p>

              ${ex.grid ? this._renderExerciseGrid(ex) : ''}

              <div style="display: flex; gap: 8px; margin-top: 12px;">
                <input type="text" 
                       id="exercise-input-${ex.id}" 
                       class="form-input" 
                       placeholder="${ex.answerType === 'formula' ? 'Formula yoki javob' : 'Javob'}"
                       style="flex: 1;"
                       onkeydown="if(event.key==='Enter') Lessons.checkExercise('${ex.id}')">
                <button class="btn btn-green" onclick="Lessons.checkExercise('${ex.id}')">
                  <i class="fas fa-check"></i> Tekshirish
                </button>
              </div>

              <div id="exercise-result-${ex.id}" style="margin-top: 12px;"></div>
              
              ${ex.explain ? `
                <details style="margin-top: 12px;">
                  <summary style="cursor: pointer; font-size: 13px; color: var(--text-muted);">
                    <i class="fas fa-lightbulb"></i> Maslahat ko'rsatish
                  </summary>
                  <div style="margin-top: 8px; padding: 12px; background: var(--bg-elevated); border-radius: var(--radius-sm); font-size: 13px; color: var(--text-secondary);">
                    ${ex.explain}
                  </div>
                </details>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderExerciseGrid(ex) {
    if (!ex.grid || !ex.grid.preset) return '';
    
    const cols = ex.grid.cols || ['A', 'B'];
    const rows = ex.grid.rows || 4;
    const preset = ex.grid.preset;

    let html = '<div style="overflow-x: auto; margin: 12px 0;"><table class="excel-table" style="min-width: auto;"><thead><tr><th class="excel-corner"></th>';
    cols.forEach(c => html += `<th class="excel-col">${c}</th>`);
    html += '</tr></thead><tbody>';

    for (let r = 1; r <= rows; r++) {
      html += `<tr><td class="excel-row">${r}</td>`;
      cols.forEach(col => {
        const cellId = `${col}${r}`;
        const value = preset[cellId] || '';
        html += `<td><div class="excel-cell" style="cursor: default;">${value}</div></td>`;
      });
      html += '</tr>';
    }

    html += '</tbody></table></div>';
    return html;
  },

  /**
   * Mini-o'yin section
   */
  _renderGameSection(game) {
    return `
      <h2 style="margin-top: 32px;">
        <i class="fas fa-gamepad" style="color: var(--color-pro);"></i> 
        Mini-o'yin
      </h2>
      <p style="color: var(--text-secondary); font-size: 14px;">
        ${this._getGameDescription(game.type)}
      </p>

      <div class="card" style="background: linear-gradient(135deg, rgba(123,63,242,0.05) 0%, rgba(43,125,233,0.05) 100%); border: 2px solid var(--color-pro);">
        <div class="card-body" style="text-align: center; padding: 32px;">
          <div style="font-size: 56px; margin-bottom: 16px;">${this._getGameIcon(game.type)}</div>
          <h3 style="margin-bottom: 8px;">${this._getGameTitle(game.type)}</h3>
          <p style="color: var(--text-secondary); margin-bottom: 16px;">
            ${game.config?.duration ? `⏱️ ${game.config.duration} soniya` : ''}
          </p>
          <button class="btn btn-purple btn-lg" onclick="Games.start('${game.type}', ${JSON.stringify(game.config || {}).replace(/"/g, '&quot;')})">
            <i class="fas fa-play"></i> O'yinni boshlash
          </button>
        </div>
      </div>
    `;
  },

  _getGameIcon(type) {
    const icons = {
      speedrun: '🏃',
      match: '🎯',
      bughunt: '🐛',
      memory: '🧠',
      quizrush: '⚡'
    };
    return icons[type] || '🎮';
  },

  _getGameTitle(type) {
    const titles = {
      speedrun: 'Tezlik o\'yini',
      match: 'Moslashtirish',
      bughunt: 'Xatoni topish',
      memory: 'Xotira o\'yini',
      quizrush: 'Tezkor savollar'
    };
    return titles[type] || 'O\'yin';
  },

  _getGameDescription(type) {
    const descs = {
      speedrun: 'Belgilangan vaqt ichida ko\'proq formulalar yozing',
      match: 'Formulani natija bilan moslashtiring',
      bughunt: 'Formuladagi xatolarni toping',
      memory: 'Funksiya nomi va vazifasini eslab qoling',
      quizrush: 'Tez-tez savollarga javob bering'
    };
    return descs[type] || '';
  },

  /**
   * AI Chat toggle
   */
  toggleAI() {
    if (typeof AIAssistant !== 'undefined') {
      AIAssistant.toggle(this.currentLesson);
    } else {
      App.showToast('AI Yordamchi tez orada qo\'shiladi', 'info');
    }
  }
};

console.log('%c📝 Lessons (1/2) yuklandi', 'color: #217346; font-weight: bold;');
// ==========================================
// LESSONS.JS - 2-QISM (Excel Simulator + Mashqlar + Actions)
// ==========================================

// Yuqoridagi window.Lessons obyektiga qo'shimcha metodlar qo'shamiz:

Object.assign(window.Lessons, {

  // ==================== EXCEL SIMULATOR ====================

  _initExcelSimulator() {
    setTimeout(() => {
      const a1 = document.getElementById('cell-A1');
      if (a1) this.selectCell('A1');
    }, 100);
  },

  selectCell(cellId) {
    document.querySelectorAll('.excel-cell.active').forEach(c => c.classList.remove('active'));
    
    const cell = document.getElementById(`cell-${cellId}`);
    if (cell) {
      cell.classList.add('active');
      this.selectedCell = cellId;

      const fbarName = document.getElementById('fbar-name');
      const fbarInput = document.getElementById('fbar-input');
      
      if (fbarName) fbarName.textContent = cellId;
      
      if (fbarInput) {
        const rawValue = this.cellData[cellId]?.formula || cell.innerText || '';
        fbarInput.value = rawValue;
      }
    }
  },

  updateCell(cellId, value) {
    if (!this.cellData[cellId]) {
      this.cellData[cellId] = {};
    }

    if (value.startsWith('=')) {
      this.cellData[cellId].formula = value;
      this.cellData[cellId].value = this._evaluateFormula(value);
    } else {
      this.cellData[cellId].formula = null;
      this.cellData[cellId].value = value;
    }

    if (this.selectedCell === cellId) {
      this.setFbar(cellId);
    }

    this._recalculateAll();
  },

  setFbar(cellId) {
    const fbarName = document.getElementById('fbar-name');
    const fbarInput = document.getElementById('fbar-input');
    
    if (fbarName) fbarName.textContent = cellId;
    
    if (fbarInput) {
      const data = this.cellData[cellId];
      fbarInput.value = data?.formula || data?.value || '';
    }
  },

  updateFromFbar(value) {
    if (!this.selectedCell) return;
    
    const cell = document.getElementById(`cell-${this.selectedCell}`);
    if (cell) {
      cell.innerText = value;
      this.updateCell(this.selectedCell, value);
    }
  },

  handleCellKey(event, cellId) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const cell = document.getElementById(`cell-${cellId}`);
      if (cell) {
        cell.blur();
        const data = this.cellData[cellId];
        if (data?.formula) {
          cell.innerText = data.value;
          cell.classList.add('has-formula');
        }
      }
      const row = parseInt(cellId.match(/\d+/)[0]);
      const col = cellId.match(/[A-Z]/)[0];
      const nextCell = document.getElementById(`cell-${col}${row + 1}`);
      if (nextCell) {
        nextCell.focus();
        this.selectCell(`${col}${row + 1}`);
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const col = cellId.match(/[A-Z]/)[0];
      const row = cellId.match(/\d+/)[0];
      const colIdx = cols.indexOf(col);
      if (colIdx < cols.length - 1) {
        const nextCellId = `${cols[colIdx + 1]}${row}`;
        const nextCell = document.getElementById(`cell-${nextCellId}`);
        if (nextCell) {
          nextCell.focus();
          this.selectCell(nextCellId);
        }
      }
    }
  },

  /**
   * Mini-Excel ni tekshirish (expected bo'lsa)
   */
  checkSim() {
    if (!this.currentLesson?.sim?.expected) return;

    this.simAttempts++;
    const expected = this.currentLesson.sim.expected;
    const resultEl = document.getElementById('sim-result');
    
    let allCorrect = true;
    let wrongCells = [];

    Object.entries(expected).forEach(([cellId, expectedValue]) => {
      const actual = this.cellData[cellId]?.value;
      if (actual === undefined || String(actual) !== String(expectedValue)) {
        allCorrect = false;
        wrongCells.push(cellId);
      }
    });

    if (allCorrect) {
      this.simCompleted = true;
      resultEl.innerHTML = `
        <div style="background: rgba(16,124,16,0.1); border-left: 4px solid var(--success); padding: 12px 16px; border-radius: var(--radius-sm);">
          <strong style="color: var(--success);">
            <i class="fas fa-check-circle"></i> To'g'ri bajardingiz!
          </strong>
        </div>
      `;
      
      // XP qo'shish
      if (typeof XPSystem !== 'undefined') {
        XPSystem.addSimComplete(this.simAttempts === 1);
      }
    } else {
      resultEl.innerHTML = `
        <div style="background: rgba(216,59,1,0.1); border-left: 4px solid var(--danger); padding: 12px 16px; border-radius: var(--radius-sm);">
          <strong style="color: var(--danger);">
            <i class="fas fa-times-circle"></i> Hozircha noto'g'ri
          </strong>
          <p style="margin-top: 6px; font-size: 13px;">
            Tekshiring: ${wrongCells.join(', ')}
          </p>
        </div>
      `;
    }
  },

  /**
   * Formula hisoblash
   */
  _evaluateFormula(formula) {
    try {
      const expr = formula.substring(1);

      // SUM(A1:A5)
      const sumMatch = expr.match(/^SUM\(([A-Z])(\d+):([A-Z])(\d+)\)$/i);
      if (sumMatch) {
        const [, c1, r1, c2, r2] = sumMatch;
        let sum = 0;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const startCol = cols.indexOf(c1.toUpperCase());
        const endCol = cols.indexOf(c2.toUpperCase());
        const startRow = parseInt(r1);
        const endRow = parseInt(r2);
        for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
            const cellId = `${cols[c]}${r}`;
            const val = parseFloat(this.cellData[cellId]?.value || 0);
            if (!isNaN(val)) sum += val;
          }
        }
        return sum;
      }

      // AVERAGE
      const avgMatch = expr.match(/^AVERAGE\(([A-Z])(\d+):([A-Z])(\d+)\)$/i);
      if (avgMatch) {
        const [, c1, r1, c2, r2] = avgMatch;
        let sum = 0, count = 0;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const startCol = cols.indexOf(c1.toUpperCase());
        const endCol = cols.indexOf(c2.toUpperCase());
        for (let r = parseInt(r1); r <= parseInt(r2); r++) {
          for (let c = startCol; c <= endCol; c++) {
            const val = parseFloat(this.cellData[`${cols[c]}${r}`]?.value || 0);
            if (!isNaN(val)) { sum += val; count++; }
          }
        }
        return count > 0 ? (sum / count).toFixed(2) : 0;
      }

      // COUNT
      const countMatch = expr.match(/^COUNT\(([A-Z])(\d+):([A-Z])(\d+)\)$/i);
      if (countMatch) {
        const [, c1, r1, c2, r2] = countMatch;
        let count = 0;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const startCol = cols.indexOf(c1.toUpperCase());
        const endCol = cols.indexOf(c2.toUpperCase());
        for (let r = parseInt(r1); r <= parseInt(r2); r++) {
          for (let c = startCol; c <= endCol; c++) {
            const val = parseFloat(this.cellData[`${cols[c]}${r}`]?.value || 0);
            if (!isNaN(val) && this.cellData[`${cols[c]}${r}`]?.value) count++;
          }
        }
        return count;
      }

      // MAX
      const maxMatch = expr.match(/^MAX\(([A-Z])(\d+):([A-Z])(\d+)\)$/i);
      if (maxMatch) {
        const [, c1, r1, c2, r2] = maxMatch;
        let max = -Infinity;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        for (let r = parseInt(r1); r <= parseInt(r2); r++) {
          for (let c = cols.indexOf(c1.toUpperCase()); c <= cols.indexOf(c2.toUpperCase()); c++) {
            const val = parseFloat(this.cellData[`${cols[c]}${r}`]?.value || 0);
            if (!isNaN(val) && val > max) max = val;
          }
        }
        return max === -Infinity ? 0 : max;
      }

      // MIN
      const minMatch = expr.match(/^MIN\(([A-Z])(\d+):([A-Z])(\d+)\)$/i);
      if (minMatch) {
        const [, c1, r1, c2, r2] = minMatch;
        let min = Infinity;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        for (let r = parseInt(r1); r <= parseInt(r2); r++) {
          for (let c = cols.indexOf(c1.toUpperCase()); c <= cols.indexOf(c2.toUpperCase()); c++) {
            const val = parseFloat(this.cellData[`${cols[c]}${r}`]?.value || 0);
            if (!isNaN(val) && val < min) min = val;
          }
        }
        return min === Infinity ? 0 : min;
      }

      // IF
      const ifMatch = expr.match(/^IF\((.+?)([><=]+)(.+?),(.+?),(.+?)\)$/);
      if (ifMatch) {
        const [, left, op, right, ifTrue, ifFalse] = ifMatch;
        const lVal = this._resolveValue(left.trim());
        const rVal = this._resolveValue(right.trim());
        let result = false;
        if (op === '>') result = lVal > rVal;
        if (op === '<') result = lVal < rVal;
        if (op === '=' || op === '==') result = lVal == rVal;
        if (op === '>=') result = lVal >= rVal;
        if (op === '<=') result = lVal <= rVal;
        const val = result ? ifTrue : ifFalse;
        return val.trim().replace(/^["']|["']$/g, '');
      }

      // COUNTIF
      const countifMatch = expr.match(/^COUNTIF\(([A-Z])(\d+):([A-Z])(\d+),"?([^"]+)"?\)$/i);
      if (countifMatch) {
        const [, c1, r1, c2, r2, criterion] = countifMatch;
        let count = 0;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        for (let r = parseInt(r1); r <= parseInt(r2); r++) {
          for (let c = cols.indexOf(c1.toUpperCase()); c <= cols.indexOf(c2.toUpperCase()); c++) {
            const val = this.cellData[`${cols[c]}${r}`]?.value;
            if (val == criterion) count++;
          }
        }
        return count;
      }

      // Oddiy arifmetik
      let mathExpr = expr.replace(/([A-Z]\d+)/g, (match) => {
        return parseFloat(this.cellData[match]?.value || 0) || 0;
      });

      if (/^[\d+\-*/().\s]+$/.test(mathExpr)) {
        return Function('"use strict"; return (' + mathExpr + ')')();
      }

      return '#ERROR';
    } catch (e) {
      return '#ERROR';
    }
  },

  _resolveValue(str) {
    str = str.trim();
    if (/^[A-Z]\d+$/.test(str)) {
      return parseFloat(this.cellData[str]?.value || 0);
    }
    return parseFloat(str);
  },

  _recalculateAll() {
    Object.keys(this.cellData).forEach(cellId => {
      const data = this.cellData[cellId];
      if (data.formula) {
        const newVal = this._evaluateFormula(data.formula);
        data.value = newVal;
        const cell = document.getElementById(`cell-${cellId}`);
        if (cell && document.activeElement !== cell) {
          cell.innerText = newVal;
          cell.classList.add('has-formula');
        }
      }
    });
  },

  // ==================== MASHQLAR ====================

  /**
   * Mashqni tekshirish
   */
  checkExercise(exerciseId) {
    const lesson = this.currentLesson;
    const exercise = lesson.exercises?.find(e => e.id === exerciseId);
    if (!exercise) return;

    const input = document.getElementById(`exercise-input-${exerciseId}`);
    const resultEl = document.getElementById(`exercise-result-${exerciseId}`);
    const statusEl = document.getElementById(`exercise-status-${exerciseId}`);
    
    if (!input) return;

    const userAnswer = input.value.trim();
    if (!userAnswer) {
      App.showToast('Javob kiriting', 'warning');
      return;
    }

    // Attempts hisoblash
    if (!this.exerciseAttempts[exerciseId]) {
      this.exerciseAttempts[exerciseId] = 0;
    }
    this.exerciseAttempts[exerciseId]++;

    // Tekshirish
    const isCorrect = this._checkAnswer(userAnswer, exercise.expected, exercise.answerType);

    if (isCorrect) {
      resultEl.innerHTML = `
        <div style="background: rgba(16,124,16,0.1); border-left: 4px solid var(--success); padding: 12px 16px; border-radius: var(--radius-sm);">
          <strong style="color: var(--success);">
            <i class="fas fa-check-circle"></i> To'g'ri javob!
          </strong>
          ${exercise.explain ? `<p style="margin-top: 6px; font-size: 13px;">${exercise.explain}</p>` : ''}
        </div>
      `;

      input.disabled = true;
      input.style.background = 'rgba(16,124,16,0.05)';
      
      // Status
      if (statusEl) {
        statusEl.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success);"></i> Bajarildi`;
      }

      // Card border
      const card = document.getElementById(`exercise-${exerciseId}`);
      if (card) card.style.borderLeftColor = 'var(--success)';

      // XP qo'shish
      if (typeof XPSystem !== 'undefined') {
        XPSystem.addExercise(this.exerciseAttempts[exerciseId]);
      }
    } else {
      resultEl.innerHTML = `
        <div style="background: rgba(216,59,1,0.1); border-left: 4px solid var(--danger); padding: 12px 16px; border-radius: var(--radius-sm);">
          <strong style="color: var(--danger);">
            <i class="fas fa-times-circle"></i> Noto'g'ri javob
          </strong>
          <p style="margin-top: 6px; font-size: 13px;">
            Qaytadan urinib ko'ring. Urinishlar: ${this.exerciseAttempts[exerciseId]}
          </p>
        </div>
      `;
    }
  },

  _checkAnswer(userAnswer, expected, answerType) {
    if (answerType === 'number') {
      return parseFloat(userAnswer) === parseFloat(expected);
    }
    
    if (answerType === 'formula') {
      // Formula tekshirish (normalize)
      const norm = (s) => s.toUpperCase().replace(/\s/g, '').replace(/['"]/g, '"');
      return norm(userAnswer) === norm(expected);
    }
    
    if (answerType === 'choice') {
      return String(userAnswer).toLowerCase() === String(expected).toLowerCase();
    }
    
    // text yoki default
    return String(userAnswer).trim().toLowerCase() === String(expected).trim().toLowerCase();
  },

  // ==================== ACTIONS ====================

  async markComplete(courseId, lessonId) {
    if (!Auth.isLoggedIn()) {
      App.showToast('Ro\'yxatdan o\'ting', 'warning');
      Router.navigate('register');
      return;
    }

    const user = Auth.currentUser;

    try {
      const result = await FB.saveProgress(user.uid, courseId, lessonId, {
        type: 'lesson_completed'
      });

      if (result.success) {
        // XP qo'shish
        if (typeof XPSystem !== 'undefined') {
          XPSystem.addLessonComplete();
        }
        
        App.showToast('✅ Dars muvaffaqiyatli tugatildi!', 'success');
        
        setTimeout(() => Router.refresh(), 500);
      }
    } catch (error) {
      App.showToast('Xatolik: ' + error.message, 'error');
    }
  }
});

console.log('%c📝 Lessons (2/2) yuklandi', 'color: #217346; font-weight: bold;');
