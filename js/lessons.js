// ==========================================
// LESSONS.JS - Darslar + Mini-Excel + AI
// ==========================================

window.Lessons = {
  currentCourse: null,
  currentLesson: null,
  currentLessonIndex: 0,
  allLessons: [],
  
  // Yangi Mini-Excel state
  simState: {},
  exerciseState: {},

  // Eski Excel Simulator state
  selectedCell: null,
  cellData: {},

  async render(container, courseId, lessonId) {
    container.innerHTML = `<div class="container" style="padding: 60px 0; text-align: center;"><div class="empty-state-icon"><i class="fas fa-spinner fa-spin"></i></div><p>${I18n.t('common_loading')}</p></div>`;

    const course = await Courses.loadCourse(courseId);
    if (!course) return container.innerHTML = `<div class="container" style="padding: 60px 0; text-align:center;"><h2>Kurs topilmadi</h2></div>`;

    this.currentCourse = course;
    this.allLessons = [];
    course.modules?.forEach(m => m.lessons.forEach(l => this.allLessons.push({ ...l, moduleTitle: m.title })));

    const lessonIndex = this.allLessons.findIndex(l => l.id === lessonId);
    if (lessonIndex === -1) return container.innerHTML = `<div class="container" style="padding: 60px 0; text-align:center;"><h2>Dars topilmadi</h2></div>`;

    this.currentLesson = this.allLessons[lessonIndex];
    this.currentLessonIndex = lessonIndex;

    const user = Auth.currentUser;
    const unlockedLessons = Auth.isLoggedIn() ? (user.unlockedLessons?.[courseId] || ['lesson-1', 'lesson-2']) : ['lesson-1', 'lesson-2'];

    if (!unlockedLessons.includes(lessonId)) return this._renderLocked(container, courseId);

    const progress = Auth.isLoggedIn() ? await FB.getProgress(user.uid, courseId) : {};
    const completed = Object.keys(progress);

    this._renderLesson(container, course, this.currentLesson, lessonIndex, completed, unlockedLessons);
  },

  _renderLocked(container, courseId) {
    const isLoggedIn = Auth.isLoggedIn();
    container.innerHTML = `
      <div class="container" style="padding: 80px 0;">
        <div class="card" style="max-width: 500px; margin: 0 auto; text-align: center;">
          <div class="card-body" style="padding: 48px;">
            <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: var(--bg-elevated); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; color: var(--text-muted);"><i class="fas fa-lock"></i></div>
            <h2 style="margin-bottom: 12px;">Bu dars yopiq</h2>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">${isLoggedIn ? 'Bu darsni ochish uchun admin bilan bog\'laning yoki oldingi darslarni tugating' : 'Bu darsni ko\'rish uchun ro\'yxatdan o\'ting'}</p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-outline-green" onclick="Router.navigate('course/${courseId}')"><i class="fas fa-arrow-left"></i> Kursga qaytish</button>
              ${!isLoggedIn ? `<button class="btn btn-green" data-page="register"><i class="fas fa-user-plus"></i> Ro'yxatdan o'tish</button>` : ''}
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
          <aside class="lesson-sidebar">
            <h3 class="lesson-sidebar-title">${course.title}</h3>
            <div class="lesson-sidebar-list">
              ${this.allLessons.map((l, idx) => {
                const isLockedItem = !unlocked.includes(l.id);
                const isCompletedItem = completed.includes(l.id);
                const isActive = l.id === lesson.id;
                let icon = (idx + 1).toString(), cls = '';
                if (isCompletedItem) { icon = '<i class="fas fa-check"></i>'; cls = 'completed'; }
                if (isActive) cls += ' active';
                if (isLockedItem) { icon = '<i class="fas fa-lock"></i>'; cls = 'locked'; }
                const action = isLockedItem ? '' : `onclick="Router.navigate('lesson/${course.id}/${l.id}')"`;
                return `<div class="lesson-sidebar-item ${cls}" ${action}><div class="lesson-sidebar-icon">${icon}</div><span>${l.title}</span></div>`;
              }).join('')}
            </div>
          </aside>

          <article class="lesson-content-area">
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

            <div class="lesson-content-body">
              ${lesson.topics && lesson.topics.length > 0 ? `<h2><i class="fas fa-list" style="color: var(--excel-green);"></i> ${I18n.t('lesson_topics')}</h2><ul>${lesson.topics.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
              ${lesson.content ? this._renderContent(lesson.content) : ''}
              ${lesson.shortcuts && lesson.shortcuts.length > 0 ? `<h2><i class="fas fa-keyboard" style="color: var(--excel-green);"></i> ${I18n.t('lesson_shortcuts')}</h2>${lesson.shortcuts.map(s => `<div class="shortcut-box"><div class="shortcut-box-title"><i class="fas fa-bolt"></i> ${s.action || s.description}</div><div class="shortcut-keys">${(s.keys || s.combo || '').split('+').map(k => `<span class="kbd">${k.trim()}</span>`).join(' + ')}</div>${s.description && s.action ? `<p style="margin-top: 8px; font-size: 13px; color: var(--text-secondary);">${s.description}</p>` : ''}</div>`).join('')}` : ''}
              ${lesson.formulas && lesson.formulas.length > 0 ? `<h2><i class="fas fa-calculator" style="color: var(--excel-green);"></i> ${I18n.t('lesson_formulas')}</h2>${lesson.formulas.map(f => `<div style="background: var(--bg-elevated); border-left: 4px solid var(--color-dashboard); padding: 16px 20px; border-radius: var(--radius-sm); margin: 16px 0;"><div style="font-weight: 700; margin-bottom: 8px;">${f.name || 'Formula'}</div><code style="display: block; padding: 8px 12px; background: var(--bg-surface); border-radius: var(--radius-xs); color: var(--color-pro); margin-bottom: 8px;">${f.formula || f.example}</code>${f.description ? `<p style="font-size: 13px; color: var(--text-secondary); margin: 0;">${f.description}</p>` : ''}</div>`).join('')}` : ''}
              ${lesson.examples && lesson.examples.length > 0 ? `<h2><i class="fas fa-table" style="color: var(--excel-green);"></i> ${I18n.t('lesson_examples')}</h2>${lesson.examples.map(ex => `<div style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; margin: 16px 0;">${ex.title ? `<h3 style="font-size: 16px; margin-bottom: 12px;">${ex.title}</h3>` : ''}${ex.description ? `<p style="margin-bottom: 12px; color: var(--text-secondary);">${ex.description}</p>` : ''}${ex.table ? this._renderExampleTable(ex.table) : ''}${ex.formula ? `<div style="margin-top: 12px;"><strong>Formula:</strong><code style="display: inline-block; padding: 4px 10px; background: var(--bg-surface); border-radius: var(--radius-xs); margin-left: 8px;">${ex.formula}</code></div>` : ''}${ex.result ? `<div style="margin-top: 8px;"><strong>Natija:</strong><span style="color: var(--success); font-weight: 600;">${ex.result}</span></div>` : ''}</div>`).join('')}` : ''}

              <!-- MINI-EXCEL TRENAJYOR (Sim bilan) -->
              ${lesson.sim ? this._renderMiniExcel(lesson) : (lesson.simulator !== false ? this._renderExcelSimulator(lesson) : '')}

              <!-- MASHQLAR -->
              ${lesson.exercises && lesson.exercises.length > 0 ? this._renderExercises(lesson) : ''}

              <!-- MINI-O'YIN -->
              ${lesson.game ? this._renderMiniGame(lesson) : ''}

              <!-- TEST PROMPT -->
              ${lesson.quiz ? `<div style="background: var(--excel-green-pale); border: 2px dashed var(--excel-green); border-radius: var(--radius-md); padding: 24px; margin: 24px 0; text-align: center;"><i class="fas fa-question-circle" style="font-size: 32px; color: var(--excel-green); margin-bottom: 12px;"></i><h3 style="margin-bottom: 8px;">Vaqt — testdan o'tish!</h3><p style="color: var(--text-secondary); margin-bottom: 16px;">Bilimingizni tekshiring va keyingi darsga o'ting</p><button class="btn btn-green" onclick="Router.navigate('quiz/${course.id}/${lesson.id}')"><i class="fas fa-play"></i> Testni boshlash</button></div>` : ''}
            </div>

            <div class="lesson-actions">
              ${hasPrev ? `<button class="btn btn-outline" onclick="Router.navigate('lesson/${course.id}/${prevLesson.id}')"><i class="fas fa-arrow-left"></i> ${I18n.t('lesson_prev')}</button>` : '<div></div>'}
              ${!isCompleted ? `<button class="btn btn-green" onclick="Lessons.markComplete('${course.id}', '${lesson.id}')"><i class="fas fa-check"></i> ${I18n.t('lesson_complete')}</button>` : `<button class="btn btn-outline-green" disabled><i class="fas fa-check-circle"></i> ${I18n.t('lesson_complete')}</button>`}
              ${hasNext ? `<button class="btn ${course.color === 'pro' ? 'btn-purple' : 'btn-green'}" onclick="Router.navigate('lesson/${course.id}/${nextLesson.id}')">${I18n.t('lesson_next')} <i class="fas fa-arrow-right"></i></button>` : `<button class="btn btn-green" onclick="Router.navigate('course/${course.id}')"><i class="fas fa-flag-checkered"></i> Kursni yakunlash</button>`}
            </div>
          </article>
        </div>
      </div>

      <!-- AI YORDAMCHI -->
      ${this._renderAIHelper()}
    `;

    if (lesson.sim) this._initMiniExcel();
    if (lesson.simulator !== false && !lesson.sim) this._initExcelSimulator();
  },

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
        if (block.type === 'note') return `<div style="background: rgba(43, 125, 233, 0.08); border-left: 4px solid var(--color-dashboard); padding: 16px; border-radius: var(--radius-sm); margin: 16px 0;"><strong><i class="fas fa-info-circle"></i> Eslatma:</strong><div style="margin-top: 6px;">${block.text}</div></div>`;
        if (block.type === 'warning') return `<div style="background: rgba(247, 181, 0, 0.1); border-left: 4px solid var(--color-bonus); padding: 16px; border-radius: var(--radius-sm); margin: 16px 0;"><strong><i class="fas fa-exclamation-triangle"></i> Diqqat:</strong><div style="margin-top: 6px;">${block.text}</div></div>`;
        return '';
      }).join('');
    }
    return '';
  },

  _renderExampleTable(table) {
    if (!table || !table.headers || !table.rows) return '';
    return `<div style="overflow-x: auto; margin: 12px 0;"><table style="width: 100%; border-collapse: collapse; font-size: 13px;"><thead><tr>${table.headers.map(h => `<th style="background: var(--excel-green); color: #fff; padding: 8px 12px; text-align: left; border: 1px solid var(--excel-green-dark);">${h}</th>`).join('')}</tr></thead><tbody>${table.rows.map((r, i) => `<tr style="background: ${i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-elevated)'};">${r.map(c => `<td style="padding: 8px 12px; border: 1px solid var(--border);">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  },

  // --- ESKI EXCEL SIMULATOR (JSON simulatorData bilan ishlaydi) ---
  _renderExcelSimulator(lesson) {
    const presetData = lesson.simulatorData || {};
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const rowCount = 15;
    let rowsHtml = '';
    for (let r = 1; r <= rowCount; r++) {
      let cellsHtml = '';
      cols.forEach(col => {
        const cellId = `${col}${r}`;
        const value = presetData[cellId] || '';
        cellsHtml += `<td><div class="excel-cell" id="cell-${cellId}" data-cell="${cellId}" onclick="Lessons.selectCell('${cellId}')" contenteditable="true" oninput="Lessons.updateCell('${cellId}', this.innerText)" onkeydown="Lessons.handleCellKey(event, '${cellId}')">${value}</div></td>`;
      });
      rowsHtml += `<tr><td class="excel-row">${r}</td>${cellsHtml}</tr>`;
    }

    return `
      <h2 style="margin-top: 32px;"><i class="fas fa-table" style="color: var(--excel-green);"></i> Excel Simulyator</h2>
      <p style="color: var(--text-secondary); font-size: 14px;">Kataklarni bosing va Excel formulalarini sinab ko'ring. Formula <code>=</code> bilan boshlanadi.</p>
      <div class="excel-sim">
        <div class="excel-sim-toolbar"><i class="fas fa-save"></i><span>Excel Simulator</span><span style="opacity: 0.7; font-size: 12px;">— ${lesson.title}</span></div>
        <div class="excel-sim-tabs"><div class="excel-sim-tab active">Home</div><div class="excel-sim-tab">Insert</div><div class="excel-sim-tab">Formulas</div></div>
        <div class="excel-fbar">
          <div class="excel-fbar-name" id="fbar-name">A1</div>
          <div class="excel-fbar-fx">fx</div>
          <input type="text" class="excel-fbar-input" id="fbar-input" placeholder="Formula yoki qiymat kiriting..." oninput="Lessons.updateFromFbar(this.value)" onkeydown="if(event.key==='Enter'){this.blur();Lessons.applyFormula();}">
        </div>
        <div class="excel-grid"><table class="excel-table"><thead><tr><th class="excel-corner"></th>${cols.map(c => `<th class="excel-col">${c}</th>`).join('')}</tr></thead><tbody id="excel-tbody">${rowsHtml}</tbody></table></div>
        <div class="excel-sim-sheets"><div class="excel-sheet-tab active">Sheet1</div><div class="excel-sheet-tab">+ New</div></div>
      </div>
      <p style="font-size: 12px; color: var(--text-muted); text-align: center; margin-top: 8px;">💡 Maslahat: <strong>=SUM(A1:A5)</strong>, <strong>=A1+B1</strong>, <strong>=IF(A1>10,"Ko'p","Kam")</strong> kabi formulalarni sinab ko'ring</p>
    `;
  },

  _initExcelSimulator() {
    setTimeout(() => { const a1 = document.getElementById('cell-A1'); if (a1) this.selectCell('A1'); }, 100);
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
      if (fbarInput) fbarInput.value = this.cellData[cellId]?.formula || cell.innerText || '';
    }
  },

  updateCell(cellId, value) {
    if (!this.cellData[cellId]) this.cellData[cellId] = {};
    if (value.startsWith('=')) {
      this.cellData[cellId].formula = value;
      this.cellData[cellId].value = this._evaluateFormula(value);
    } else {
      this.cellData[cellId].formula = null;
      this.cellData[cellId].value = value;
    }
    if (this.selectedCell === cellId) this.setFbar(cellId);
    this._recalculateAll();
  },

  setFbar(cellId) {
    const fbarName = document.getElementById('fbar-name');
    const fbarInput = document.getElementById('fbar-input');
    if (fbarName) fbarName.textContent = cellId;
    if (fbarInput) { const data = this.cellData[cellId]; fbarInput.value = data?.formula || data?.value || ''; }
  },

  updateFromFbar(value) {
    if (!this.selectedCell) return;
    const cell = document.getElementById(`cell-${this.selectedCell}`);
    if (cell) { cell.innerText = value; this.updateCell(this.selectedCell, value); }
  },

  applyFormula() {
    if (!this.selectedCell) return;
    const data = this.cellData[this.selectedCell];
    if (data?.formula) {
      const cell = document.getElementById(`cell-${this.selectedCell}`);
      if (cell) { cell.innerText = data.value; cell.classList.add('has-formula'); }
    }
  },

  handleCellKey(event, cellId) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const cell = document.getElementById(`cell-${cellId}`);
      if (cell) {
        cell.blur();
        const data = this.cellData[cellId];
        if (data?.formula) { cell.innerText = data.value; cell.classList.add('has-formula'); }
      }
      const row = parseInt(cellId.match(/\d+/)[0]); const col = cellId.match(/[A-H]/)[0];
      const nextCell = document.getElementById(`cell-${col}${row + 1}`);
      if (nextCell) { nextCell.focus(); this.selectCell(`${col}${row + 1}`); }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const col = cellId.match(/[A-H]/)[0]; const row = cellId.match(/\d+/)[0];
      const colIdx = cols.indexOf(col);
      if (colIdx < cols.length - 1) {
        const nextCellId = `${cols[colIdx + 1]}${row}`;
        const nextCell = document.getElementById(`cell-${nextCellId}`);
        if (nextCell) { nextCell.focus(); this.selectCell(nextCellId); }
      }
    }
  },

  _evaluateFormula(formula) {
    try {
      // RU -> EN tarjima qilamiz
      const expr = I18n.untranslateFormula(formula).substring(1);
      const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

      const fnMatch = expr.match(/^(SUM|AVERAGE|MIN|MAX|COUNT)\(([A-H])(\d+):([A-H])(\d+)\)$/i);
      if (fnMatch) {
        const fn = fnMatch[1].toUpperCase();
        const [, c1, r1, c2, r2] = fnMatch;
        let sum = 0, count = 0, max = -Infinity, min = Infinity;
        const startCol = cols.indexOf(c1.toUpperCase()), endCol = cols.indexOf(c2.toUpperCase());
        for (let r = parseInt(r1); r <= parseInt(r2); r++) {
          for (let c = startCol; c <= endCol; c++) {
            const v = parseFloat(this.cellData[`${cols[c]}${r}`]?.value || 0);
            if (!isNaN(v)) { sum += v; count++; if(v>max) max=v; if(v<min) min=v; }
          }
        }
        if (fn === 'SUM') return sum;
        if (fn === 'AVERAGE') return count > 0 ? (sum / count).toFixed(2) : 0;
        if (fn === 'COUNT') return count;
        if (fn === 'MAX') return max === -Infinity ? 0 : max;
        if (fn === 'MIN') return min === Infinity ? 0 : min;
      }

      const ifMatch = expr.match(/^IF\((.+?)([><=]+)(.+?),(.+?),(.+?)\)$/);
      if (ifMatch) {
        const [, left, op, right, t, f] = ifMatch;
        const lVal = this._resolveValue(left.trim()), rVal = this._resolveValue(right.trim());
        let res = false;
        if (op === '>') res = lVal > rVal; if (op === '<') res = lVal < rVal;
        if (op === '=' || op === '==') res = lVal == rVal; if (op === '>=') res = lVal >= rVal; if (op === '<=') res = lVal <= rVal;
        return (res ? t : f).trim().replace(/^["']|["']$/g, '');
      }

      let mathExpr = expr.replace(/([A-H]\d+)/g, m => parseFloat(this.cellData[m]?.value || 0) || 0);
      if (/^[\d+\-*/().\s]+$/.test(mathExpr)) return Function('"use strict"; return (' + mathExpr + ')')();
      return '#NAME?';
    } catch { return '#ERROR'; }
  },

  _resolveValue(str) {
    str = str.trim();
    if (/^[A-H]\d+$/.test(str)) return parseFloat(this.cellData[str]?.value || 0);
    return parseFloat(str);
  },

  _recalculateAll() {
    Object.keys(this.cellData).forEach(cellId => {
      const data = this.cellData[cellId];
      if (data.formula) {
        const newVal = this._evaluateFormula(data.formula);
        data.value = newVal;
        const cell = document.getElementById(`cell-${cellId}`);
        if (cell && document.activeElement !== cell) { cell.innerText = newVal; cell.classList.add('has-formula'); }
      }
    });
  },

  // --- YANGI MINI-EXCEL (TZ dagi sim uchun) ---
  _renderMiniExcel(lesson) {
    const sim = lesson.sim;
    this.simState = {};
    let rowsHtml = '';
    for (let r = 1; r <= sim.rows; r++) {
      let cellsHtml = '';
      sim.cols.forEach(col => {
        const cellId = `${col}${r}`;
        const value = sim.preset?.[cellId] || '';
        const isLocked = sim.locked?.includes(cellId);
        if (value) this.simState[cellId] = { value, formula: null };
        cellsHtml += `<td><div class="excel-cell ${isLocked ? 'locked' : ''}" id="sim-cell-${cellId}" data-cell="${cellId}" style="${isLocked ? 'background: var(--bg-elevated); cursor: not-allowed;' : ''}" ${isLocked ? '' : `onclick="Lessons.selectSimCell('${cellId}')"`}>${value}</div></td>`;
      });
      rowsHtml += `<tr><td class="excel-row">${r}</td>${cellsHtml}</tr>`;
    }

    return `
      <h2 style="margin-top: 32px;"><i class="fas fa-laptop-code" style="color: var(--excel-green);"></i> Mini-Excel Trenejyor</h2>
      <p style="color: var(--text-secondary); font-size: 14px;">Vazifa: <strong>${sim.task}</strong></p>
      <div class="excel-sim">
        <div class="excel-sim-toolbar"><i class="fas fa-save"></i><span>Simulyator — ${lesson.title}</span></div>
        <div class="excel-fbar">
          <div class="excel-fbar-name" id="sim-fbar-name">A1</div>
          <div class="excel-fbar-fx">fx</div>
          <input type="text" class="excel-fbar-input" id="sim-fbar-input" placeholder="Formula yozing..." onkeydown="if(event.key==='Enter'){Lessons.applySimFormula();}">
        </div>
        <div class="excel-grid">
          <table class="excel-table">
            <thead><tr><th class="excel-corner"></th>${sim.cols.map(c => `<th class="excel-col">${c}</th>`).join('')}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
        <div style="padding: 12px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border);">
          <div id="sim-feedback" style="font-size: 13px; font-weight: 600;"></div>
          <div>
            <button class="btn btn-sm btn-outline" onclick="Lessons.resetSim()">Tozalash</button>
            <button class="btn btn-sm btn-green" onclick="Lessons.checkSim()">Tekshirish</button>
          </div>
        </div>
      </div>
    `;
  },

  _initMiniExcel() { this.selectSimCell(this.currentLesson.sim.cols[0] + '1'); },

  selectSimCell(cellId) {
    document.querySelectorAll('#sim-tbody .excel-cell.active').forEach(c => c.classList.remove('active'));
    const cell = document.getElementById(`sim-cell-${cellId}`);
    if (cell) {
      cell.classList.add('active');
      const fbarInput = document.getElementById('sim-fbar-input');
      const fbarName = document.getElementById('sim-fbar-name');
      if (fbarName) fbarName.textContent = cellId;
      if (fbarInput) fbarInput.value = this.simState[cellId]?.formula || this.simState[cellId]?.value || '';
      fbarInput?.focus();
    }
  },

  applySimFormula() {
    const cellId = document.getElementById('sim-fbar-name').textContent;
    const fbarInput = document.getElementById('sim-fbar-input');
    const val = fbarInput.value.trim();
    const cell = document.getElementById(`sim-cell-${cellId}`);
    if (!cell || cell.classList.contains('locked')) return;

    if (val.startsWith('=')) {
      this.simState[cellId] = { formula: val, value: this._evalSimFormula(val) };
      cell.innerText = this.simState[cellId].value;
      cell.classList.add('has-formula');
      if (String(this.simState[cellId].value).startsWith('#')) cell.classList.add('has-error');
    } else {
      this.simState[cellId] = { formula: null, value: val };
      cell.innerText = val;
      cell.classList.remove('has-formula', 'has-error');
    }
  },

  _evalSimFormula(formula) {
    try {
      const expr = I18n.untranslateFormula(formula).substring(1);
      const sim = this.currentLesson.sim;
      const fnMatch = expr.match(/^(SUM|AVERAGE|MIN|MAX|COUNT)\(([A-Z])(\d+):([A-Z])(\d+)\)$/i);
      if (fnMatch) {
        const fn = fnMatch[1].toUpperCase();
        const [, c1, r1, c2, r2] = fnMatch;
        const vals = this._getRangeValues(`${c1}${r1}:${c2}${r2}`, sim.cols);
        if (fn === 'SUM') return vals.reduce((a, b) => a + b, 0);
        if (fn === 'AVERAGE') return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : 0;
        if (fn === 'MIN') return vals.length ? Math.min(...vals) : 0;
        if (fn === 'MAX') return vals.length ? Math.max(...vals) : 0;
        if (fn === 'COUNT') return vals.length;
      }
      const ifMatch = expr.match(/^IF\((.+?)([><=]+)(.+?),(.+?),(.+?)\)$/);
      if (ifMatch) {
        const [, left, op, right, t, f] = ifMatch;
        const lVal = this._resolveSimVal(left.trim()), rVal = this._resolveSimVal(right.trim());
        let res = false;
        if (op === '>') res = lVal > rVal; if (op === '<') res = lVal < rVal;
        if (op === '=' || op === '==') res = lVal == rVal; if (op === '>=') res = lVal >= rVal; if (op === '<=') res = lVal <= rVal;
        return (res ? t : f).trim().replace(/^["']|["']$/g, '');
      }
      let mathExpr = expr.replace(/([A-Z]\d+)/g, m => this._resolveSimVal(m) || 0);
      if (/^[\d+\-*/().\s]+$/.test(mathExpr)) return Function('"use strict"; return (' + mathExpr + ')')();
      return '#NAME?';
    } catch { return '#ERROR'; }
  },

  _getRangeValues(range, cols) {
    const m = range.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
    if(!m) return [];
    const [, c1, r1, c2, r2] = m;
    const vals = [];
    const startCol = cols.indexOf(c1), endCol = cols.indexOf(c2);
    for (let r = parseInt(r1); r <= parseInt(r2); r++) {
      for (let c = startCol; c <= endCol; c++) {
        const v = parseFloat(this.simState[`${cols[c]}${r}`]?.value || 0);
        if (!isNaN(v)) vals.push(v);
      }
    }
    return vals;
  },

  _resolveSimVal(str) {
    if (/^[A-Z]\d+$/.test(str.trim())) return parseFloat(this.simState[str.trim()]?.value || 0);
    return parseFloat(str);
  },

  async checkSim() {
    const sim = this.currentLesson.sim;
    let allCorrect = true, details = '';
    for (const cellId in sim.expected) {
      const expectedVal = sim.expected[cellId];
      const userVal = this.simState[cellId]?.value || document.getElementById(`sim-cell-${cellId}`)?.innerText || '';
      let isCorrect = typeof expectedVal === 'number' ? Math.abs(parseFloat(userVal) - expectedVal) <= (sim.tolerance || 0) : String(userVal).toLowerCase() === String(expectedVal).toLowerCase();
      if (!isCorrect) allCorrect = false;
      details += `<div style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}">${cellId}: Kutilgan ${expectedVal}, Sizning ${userVal} ${isCorrect ? '✅' : '❌'}</div>`;
    }
    const fb = document.getElementById('sim-feedback');
    if (allCorrect) {
      fb.innerHTML = `<span style="color: var(--success);">🎉 Ajoyib! Vazifa to'g'ri bajarildi. +10 XP</span>`;
      if (Auth.isLoggedIn()) App.addXP(10);
    } else {
      fb.innerHTML = `<span style="color: var(--danger);">❌ Xato. Qayta urinib ko'ring.</span>${details}`;
    }
  },

  resetSim() { this._renderMiniExcel(this.currentLesson); this._initMiniExcel(); },

  // --- MASHQLAR ---
  _renderExercises(lesson) {
    this.exerciseState = {};
    let html = `<h2 style="margin-top: 32px;"><i class="fas fa-pen-to-square" style="color: var(--excel-green);"></i> Mashqlar</h2>`;
    html += lesson.exercises.map((ex, idx) => {
      this.exerciseState[ex.id] = { attempts: 0, score: 0, solved: false };
      return `
        <div class="card mb-3" id="ex-card-${ex.id}" style="border-left: 4px solid var(--excel-green);">
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span class="badge badge-gray">${ex.level || '🟢'}</span>
              <span style="font-size: 12px; color: var(--text-muted);">Ball: <strong id="ex-score-${ex.id}">0</strong>/10</span>
            </div>
            <h4 style="margin-bottom: 12px;">${idx+1}. ${ex.q}</h4>
            ${ex.grid ? this._renderMiniGrid(ex.grid, ex.id) : ''}
            <div class="form-group"><input type="text" class="form-input" id="ex-input-${ex.id}" placeholder="Javobingiz yoki formulangiz..." style="font-family: 'JetBrains Mono', monospace;"></div>
            <div id="ex-feedback-${ex.id}" style="margin-top: 8px; font-size: 13px;"></div>
            <div style="display: flex; gap: 8px; margin-top: 12px;">
              <button class="btn btn-sm btn-green" onclick="Lessons.checkExercise('${ex.id}')">Tekshirish</button>
              <button class="btn btn-sm btn-outline" onclick="Lessons.showSolution('${ex.id}')">Yechimni ko'rsatish</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    return html;
  },

  _renderMiniGrid(grid, exId) {
    let html = `<div style="overflow-x: auto; margin: 12px 0;"><table style="border-collapse: collapse; font-size: 12px; font-family: monospace;">`;
    html += `<tr><td style="border: 1px solid var(--border); background: var(--bg-elevated); width: 30px;"></td>${grid.cols.map(c => `<td style="border: 1px solid var(--border); background: var(--bg-elevated); padding: 4px 8px; font-weight: 700; text-align: center;">${c}</td>`).join('')}</tr>`;
    for (let r = 1; r <= grid.rows; r++) {
      html += `<tr><td style="border: 1px solid var(--border); background: var(--bg-elevated); padding: 4px 8px; font-weight: 700; text-align: center;">${r}</td>`;
      grid.cols.forEach(c => {
        const val = grid.preset?.[`${c}${r}`] || '';
        html += `<td style="border: 1px solid var(--border); padding: 4px 8px; min-width: 50px;">${val}</td>`;
      });
      html += `</tr>`;
    }
    return html + `</table></div>`;
  },

  checkExercise(exId) {
    const ex = this.currentLesson.exercises.find(e => e.id === exId);
    const input = document.getElementById(`ex-input-${exId}`).value.trim();
    const fb = document.getElementById(`ex-feedback-${exId}`);
    const scoreEl = document.getElementById(`ex-score-${exId}`);
    const state = this.exerciseState[exId];
    if (state.solved) return;
    state.attempts++;
    let isCorrect = false;
    if (ex.answerType === 'formula') {
      const u = I18n.untranslateFormula(input).replace(/\s/g, '').toLowerCase();
      const e = I18n.untranslateFormula(ex.expected).replace(/\s/g, '').toLowerCase();
      isCorrect = u === e;
    } else if (ex.answerType === 'number') {
      isCorrect = parseFloat(input) === ex.expected;
    } else {
      isCorrect = input.toLowerCase() === String(ex.expected).toLowerCase();
    }
    if (isCorrect) {
      state.solved = true;
      state.score = state.attempts === 1 ? 10 : (state.attempts === 2 ? 6 : 2);
      scoreEl.innerText = state.score;
      fb.innerHTML = `<div style="color: var(--success);"><strong>✅ To'g'ri!</strong> ${ex.explain || ''}</div>`;
      if (Auth.isLoggedIn()) App.addXP(state.score);
    } else {
      fb.innerHTML = `<div style="color: var(--danger);"><strong>❌ Noto'g'ri.</strong> Urinishlar: ${state.attempts}</div>`;
    }
  },

  showSolution(exId) {
    const ex = this.currentLesson.exercises.find(e => e.id === exId);
    document.getElementById(`ex-input-${exId}`).value = ex.expected;
    const state = this.exerciseState[exId];
    if (!state.solved) { state.solved = true; state.score = 2; document.getElementById(`ex-score-${exId}`).innerText = 2; }
    document.getElementById(`ex-feedback-${exId}`).innerHTML = `<div style="color: var(--info);"><strong>Yechim:</strong> ${ex.explain || ''}</div>`;
  },

  // --- MINI O'YIN ---
  _renderMiniGame(lesson) {
    return `
      <h2 style="margin-top: 32px;"><i class="fas fa-gamepad" style="color: var(--excel-green);"></i> Mini-O'yin</h2>
      <div class="card" style="text-align: center; padding: 32px;">
        <i class="fas fa-trophy" style="font-size: 48px; color: var(--color-bonus); margin-bottom: 16px;"></i>
        <h3>${lesson.game.type.toUpperCase()}</h3>
        <p style="color: var(--text-secondary); margin-bottom: 16px;">Tezkor o'yin orqali bilimingizni mustahkamlang (0-20 XP gacha)</p>
        <button class="btn btn-yellow" onclick="Lessons.startMiniGame()">O'yinni boshlash</button>
        <div id="mini-game-area" style="margin-top: 24px;"></div>
      </div>
    `;
  },

  startMiniGame() {
    const area = document.getElementById('mini-game-area');
    const game = this.currentLesson.game;
    if (game.type === 'quizrush' && game.config.items) {
      const q = game.config.items[Math.floor(Math.random() * game.config.items.length)];
      area.innerHTML = `
        <div style="background: var(--bg-elevated); padding: 16px; border-radius: 8px;">
          <p style="font-weight: 600; margin-bottom: 12px;">${q.q}</p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            ${q.opts.map((opt, i) => `<button class="btn btn-sm btn-outline-green" onclick="Lessons.answerMiniGame(${i === q.ans})">${opt}</button>`).join('')}
          </div>
        </div>
      `;
    } else { area.innerHTML = `<p>Ushbu o'yin turi (${game.type}) demo rejimida ishlamoqda.</p>`; }
  },

  answerMiniGame(isCorrect) {
    const area = document.getElementById('mini-game-area');
    if (isCorrect) {
      const xp = Math.floor(Math.random() * 15) + 5;
      area.innerHTML = `<div style="color: var(--success); font-weight: bold;">🎉 To'g'ri! +${xp} XP</div>`;
      if (Auth.isLoggedIn()) App.addXP(xp);
    } else {
      area.innerHTML = `<div style="color: var(--danger); font-weight: bold;">❌ Noto'g'ri. Qayta urining.</div>`;
      setTimeout(() => this.startMiniGame(), 1500);
    }
  },

  // --- AI YORDAMCHI ---
  _renderAIHelper() {
    return `
      <button id="ai-float-btn" onclick="Lessons.toggleAIChat()" style="position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; background: var(--excel-green); color: #fff; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-size: 24px; cursor: pointer; z-index: 900; display: flex; align-items: center; justify-content: center;">🤖</button>
      <div id="ai-chat-window" style="position: fixed; bottom: 90px; right: 24px; width: 360px; height: 480px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 901; display: none; flex-direction: column; overflow: hidden;">
        <div style="background: var(--excel-green); color: #fff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
          <strong><i class="fas fa-robot"></i> AI Yordamchi</strong>
          <button onclick="Lessons.toggleAIChat()" style="background: none; border: none; color: #fff; cursor: pointer;"><i class="fas fa-times"></i></button>
        </div>
        <div id="ai-chat-body" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
          <div style="background: var(--bg-elevated); padding: 10px 14px; border-radius: 12px; max-width: 80%; font-size: 14px;">Salom! Men Excel bo'yicha yordamchiman. Savolingizni bering yoki xato (#N/A, #VALUE!) haqida so'rang.</div>
        </div>
        <div style="padding: 12px; border-top: 1px solid var(--border); display: flex; gap: 8px;">
          <input type="text" id="ai-chat-input" class="form-input" placeholder="Savolingiz..." onkeydown="if(event.key==='Enter') Lessons.askAI()" style="flex: 1;">
          <button class="btn btn-green" onclick="Lessons.askAI()"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    `;
  },

  toggleAIChat() { const win = document.getElementById('ai-chat-window'); win.style.display = win.style.display === 'none' ? 'flex' : 'none'; },

  _addAIMsg(text, isUser) {
    const body = document.getElementById('ai-chat-body');
    const style = isUser ? `background: var(--excel-green); color: #fff; margin-left: auto;` : `background: var(--bg-elevated); margin-right: auto;`;
    body.innerHTML += `<div style="${style} padding: 10px 14px; border-radius: 12px; max-width: 85%; font-size: 14px;">${text}</div>`;
    body.scrollTop = body.scrollHeight;
  },

  askAI() {
    const inp = document.getElementById('ai-chat-input');
    const q = inp.value.trim().toLowerCase();
    if (!q) return;
    this._addAIMsg(q, true);
    inp.value = '';
    if (q.includes('#n/a') || q.includes('#ref!') || q.includes('#value!') || q.includes('#div/0!') || q.includes('#name')) {
      const errCode = q.match(/#[a-z\/]+!?/i)[0].toUpperCase();
      return this._addAIMsg(`⚠️ ${errCode} xatosi: ${I18n.getErrorExplanation(errCode)}`, false);
    }
    const kb = this.currentLesson.aiKB || [];
    let found = false;
    for (const item of kb) {
      if (item.q.some(kw => q.includes(kw))) { this._addAIMsg(item.a, false); found = true; break; }
    }
    if (!found) this._addAIMsg("Bu savolni hali bilmayman. Iltimos, dars materialini qayta o'qib chiqing yoki o'qituvchidan so'rang.", false);
  },

  // --- ACTIONS ---
  async markComplete(courseId, lessonId) {
    if (!Auth.isLoggedIn()) { Router.navigate('register'); return; }
    const user = Auth.currentUser;
    const result = await FB.saveProgress(user.uid, courseId, lessonId, { type: 'lesson_completed' });
    if (result.success) {
      App.showToast('Dars muvaffaqiyatli tugatildi! +15 XP', 'success');
      if (Auth.isLoggedIn()) App.addXP(15);
      setTimeout(() => Router.refresh(), 500);
    }
  }
};

console.log('📝 Lessons modul yuklandi (To\'liq simulyator, AI va Mashqlar bilan)');