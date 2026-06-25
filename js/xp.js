// ==========================================
// XP.JS - XP va Level tizimi
// ==========================================

window.XPSystem = {
  data: null,

  // Level jadvali (TZ ga mos)
  levels: [
    { level: 1,  xp: 0,    title: 'Excel Shogirdi',              badge: '🌱', color: '#6b7280' },
    { level: 2,  xp: 100,  title: 'Formula Yozuvchi',            badge: '📝', color: '#3b82f6' },
    { level: 3,  xp: 250,  title: 'Hisoblash Ustasi',            badge: '🔢', color: '#8b5cf6' },
    { level: 4,  xp: 500,  title: 'Tahlilchi',                   badge: '🔍', color: '#06b6d4' },
    { level: 5,  xp: 800,  title: 'Formula Ustasi',              badge: '⭐', color: '#f59e0b' },
    { level: 7,  xp: 1400, title: 'Funksiya Eksperti',           badge: '⭐⭐', color: '#f59e0b' },
    { level: 10, xp: 2500, title: 'Dashboard Ustasi',            badge: '⭐⭐⭐', color: '#ef4444' },
    { level: 15, xp: 4500, title: 'Excel Pro',                   badge: '🏅', color: '#ec4899' },
    { level: 20, xp: 8000, title: 'Excel Qirolligi Chempioni',   badge: '👑', color: '#f7b500' }
  ],

  // XP mukofotlari
  rewards: {
    simComplete: 15,
    simRetry: 8,
    exerciseFirst: 10,
    exerciseSecond: 6,
    exerciseRetry: 3,
    gameHigh: 20,
    gameMid: 12,
    gameLow: 5,
    testPass: 25,
    testMid: 15,
    lessonComplete: 10,
    sandboxFormulas: 5,
    inspectorUse: 2,
    examPass: 50
  },

  init() {
    this.data = JSON.parse(localStorage.getItem('xpData') || 'null');
    
    if (!this.data) {
      this.data = {
        xp: 0,
        level: 1,
        history: [],
        dailyInspector: 0,
        lastInspectorDate: null
      };
      this._save();
    }

    this.renderBar();
    console.log(`%c⭐ XP System: Level ${this.data.level} (${this.data.xp} XP)`, 'color: #f7b500; font-weight: bold;');
  },

  /**
   * Asosiy XP qo'shish
   */
  add(points, reason) {
    if (!points || points <= 0) return;
    if (!this.data) this.init();

    const oldLevel = this.data.level;

    this.data.xp += points;
    this.data.history.push({
      points,
      reason,
      at: new Date().toISOString()
    });

    if (this.data.history.length > 200) {
      this.data.history = this.data.history.slice(-200);
    }

    this.data.level = this._calcLevel(this.data.xp);

    this._save();
    this.renderBar();

    if (this.data.level > oldLevel) {
      this._showLevelUp(this.data.level);
    }

    this._showXPToast(points, reason);
  },

  // ==================== MAXSUS XP FUNKSIYALARI ====================

  addSimComplete(isFirstTry) {
    this.add(
      isFirstTry ? this.rewards.simComplete : this.rewards.simRetry,
      isFirstTry ? 'Mini-Excel: 1-urinishda!' : 'Mini-Excel bajarildi'
    );
  },

  addExercise(attemptNumber) {
    let points, reason;
    if (attemptNumber === 1) {
      points = this.rewards.exerciseFirst;
      reason = 'Mashq: 1-urinishda!';
    } else if (attemptNumber === 2) {
      points = this.rewards.exerciseSecond;
      reason = 'Mashq: 2-urinishda';
    } else {
      points = this.rewards.exerciseRetry;
      reason = 'Mashq bajarildi';
    }
    this.add(points, reason);
  },

  addGame(score) {
    let points, reason;
    if (score >= 15) {
      points = this.rewards.gameHigh;
      reason = `Mini-o'yin: ${score} ball (Zo'r!)`;
    } else if (score >= 10) {
      points = this.rewards.gameMid;
      reason = `Mini-o'yin: ${score} ball`;
    } else {
      points = this.rewards.gameLow;
      reason = `Mini-o'yin: ${score} ball`;
    }
    this.add(points, reason);
  },

  addTest(percentage) {
    let points, reason;
    if (percentage >= 80) {
      points = this.rewards.testPass;
      reason = `Test: ${percentage}% (A'lo!)`;
    } else if (percentage >= 60) {
      points = this.rewards.testMid;
      reason = `Test: ${percentage}%`;
    } else {
      return;
    }
    this.add(points, reason);
  },

  addLessonComplete() {
    this.add(this.rewards.lessonComplete, 'Dars tugatildi');
  },

  addSandbox() {
    this.add(this.rewards.sandboxFormulas, 'Sandbox: formulalar sinaldi');
  },

  addInspector() {
    const today = new Date().toDateString();
    if (this.data.lastInspectorDate !== today) {
      this.data.dailyInspector = 0;
      this.data.lastInspectorDate = today;
    }

    if (this.data.dailyInspector >= 3) return;

    this.data.dailyInspector++;
    this.add(this.rewards.inspectorUse, 'Formula Inspector');
  },

  addExamPass() {
    this.add(this.rewards.examPass, 'Foundation imtihon o\'tildi!');
  },

  // ==================== LEVEL HISOBLASH ====================

  _calcLevel(xp) {
    let lvl = 1;
    for (const l of this.levels) {
      if (xp >= l.xp) lvl = l.level;
    }
    return lvl;
  },

  getCurrentLevel() {
    return this.levels.find(l => l.level === this.data.level) || this.levels[0];
  },

  getNextLevel() {
    return this.levels.find(l => l.level > this.data.level) || null;
  },

  getProgress() {
    const curr = this.getCurrentLevel();
    const next = this.getNextLevel();
    if (!next) return 100;
    return Math.round(((this.data.xp - curr.xp) / (next.xp - curr.xp)) * 100);
  },

  // ==================== UI ====================

  /**
   * XP Bar render (header da)
   */
  renderBar() {
    const el = document.getElementById('xp-bar');
    if (!el) return;
    if (!this.data) return;

    const curr = this.getCurrentLevel();
    const next = this.getNextLevel();
    const progress = this.getProgress();

    el.innerHTML = `
      <div class="xp-bar-inner" title="${curr.title} — ${this.data.xp} XP" onclick="XPSystem.showHistory()">
        <span class="xp-badge" style="color: ${curr.color};">
          ${curr.badge} Lv.${this.data.level}
        </span>
        <div class="xp-progress-wrap">
          <div class="xp-progress-fill" style="width: ${progress}%; background: ${curr.color};"></div>
        </div>
        <span class="xp-points">
          ${this.data.xp}${next ? '/' + next.xp : ''} XP
        </span>
      </div>
    `;
  },

  /**
   * Level Up modal
   */
  _showLevelUp(newLevel) {
    const lvl = this.levels.find(l => l.level === newLevel);
    if (!lvl) return;

    if (window.confetti) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });

      // Yana 2 marta
      setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5, x: 0.3 } }), 200);
      setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5, x: 0.7 } }), 400);
    }

    const modal = `
      <div class="modal-overlay show" id="levelup-modal" style="z-index: 9999;">
        <div class="modal" style="max-width: 420px; text-align: center;">
          <div class="modal-body" style="padding: 48px 32px;">
            <div style="font-size: 80px; margin-bottom: 16px; animation: bounce 0.8s ease;">
              ${lvl.badge}
            </div>
            <div style="font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">
              Yangi daraja!
            </div>
            <h2 style="color: ${lvl.color}; margin-bottom: 8px; font-size: 36px;">
              Level ${lvl.level}
            </h2>
            <p style="font-size: 20px; color: var(--text-main); margin-bottom: 24px; font-weight: 600;">
              ${lvl.title}
            </p>
            <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px;">
              Jami: <strong style="color: ${lvl.color};">${this.data.xp} XP</strong>
            </div>
            <button class="btn btn-green btn-lg" onclick="document.getElementById('levelup-modal').remove()">
              <i class="fas fa-star"></i> Ajoyib!
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);

    setTimeout(() => {
      const m = document.getElementById('levelup-modal');
      if (m) m.remove();
    }, 8000);
  },

  /**
   * XP toast
   */
  _showXPToast(points, reason) {
    const toast = document.createElement('div');
    toast.className = 'xp-toast';
    toast.innerHTML = `
      <span class="xp-toast-points">+${points} XP</span>
      <span class="xp-toast-reason">${reason}</span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },

  /**
   * XP tarixi modal
   */
  showHistory() {
    const history = this.getHistory(50);
    const todayXP = this.getTodayXP();
    const curr = this.getCurrentLevel();
    const next = this.getNextLevel();

    const modal = `
      <div class="modal-overlay show" id="xp-history-modal" onclick="if(event.target===this) document.getElementById('xp-history-modal').remove()">
        <div class="modal" style="max-width: 540px;">
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fas fa-star" style="color: ${curr.color};"></i> 
              XP Tarixi
            </h3>
            <button class="modal-close" onclick="document.getElementById('xp-history-modal').remove()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            
            <!-- Level Info -->
            <div style="text-align: center; padding: 24px; background: var(--bg-elevated); border-radius: var(--radius-md); margin-bottom: 16px;">
              <div style="font-size: 48px; margin-bottom: 8px;">${curr.badge}</div>
              <h3 style="color: ${curr.color}; margin-bottom: 4px;">Level ${curr.level}</h3>
              <p style="color: var(--text-secondary); font-size: 14px;">${curr.title}</p>
              
              <div style="margin-top: 16px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">
                  <span>${this.data.xp} XP</span>
                  ${next ? `<span>${next.xp} XP gacha</span>` : '<span>MAX</span>'}
                </div>
                <div style="height: 8px; background: var(--border); border-radius: var(--radius-full); overflow: hidden;">
                  <div style="width: ${this.getProgress()}%; height: 100%; background: ${curr.color}; transition: width 0.5s;"></div>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <div style="text-align: center; padding: 12px; background: var(--bg-elevated); border-radius: var(--radius-sm);">
                <div style="font-size: 20px; font-weight: 800; color: var(--excel-green);">${todayXP}</div>
                <div style="font-size: 11px; color: var(--text-muted);">Bugun</div>
              </div>
              <div style="text-align: center; padding: 12px; background: var(--bg-elevated); border-radius: var(--radius-sm);">
                <div style="font-size: 20px; font-weight: 800; color: var(--color-dashboard);">${this.data.history.length}</div>
                <div style="font-size: 11px; color: var(--text-muted);">Faoliyatlar</div>
              </div>
            </div>

            <!-- History -->
            <h4 style="margin-bottom: 12px; font-size: 13px; color: var(--text-muted); text-transform: uppercase;">
              So'nggi faoliyatlar
            </h4>
            <div style="max-height: 280px; overflow-y: auto;">
              ${history.length > 0 ? history.map(h => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-elevated); border-radius: var(--radius-sm); margin-bottom: 6px;">
                  <div style="flex: 1;">
                    <div style="font-size: 13px; font-weight: 500;">${h.reason}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${this._timeAgo(h.at)}</div>
                  </div>
                  <div style="background: var(--color-xp); color: #000; padding: 4px 10px; border-radius: var(--radius-full); font-size: 12px; font-weight: 700;">
                    +${h.points}
                  </div>
                </div>
              `).join('') : '<p style="text-align: center; color: var(--text-muted); padding: 20px;">Hali faoliyat yo\'q</p>'}
            </div>

          </div>
          <div class="modal-footer">
            <button class="btn btn-green" onclick="document.getElementById('xp-history-modal').remove()">
              Yopish
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
  },

  _timeAgo(dateStr) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'Hozir';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' daqiqa oldin';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' soat oldin';
    return Math.floor(seconds / 86400) + ' kun oldin';
  },

  // ==================== GETTER ====================

  getHistory(limit = 20) {
    if (!this.data) return [];
    return this.data.history.slice(-limit).reverse();
  },

  getTodayXP() {
    if (!this.data) return 0;
    const today = new Date().toDateString();
    return this.data.history
      .filter(h => new Date(h.at).toDateString() === today)
      .reduce((sum, h) => sum + h.points, 0);
  },

  getStats() {
    return {
      totalXP: this.data.xp,
      level: this.data.level,
      levelInfo: this.getCurrentLevel(),
      nextLevel: this.getNextLevel(),
      progress: this.getProgress(),
      todayXP: this.getTodayXP(),
      totalActivities: this.data.history.length
    };
  },

  reset() {
    this.data = {
      xp: 0,
      level: 1,
      history: [],
      dailyInspector: 0,
      lastInspectorDate: null
    };
    this._save();
    this.renderBar();
  },

  _save() {
    localStorage.setItem('xpData', JSON.stringify(this.data));
  }
};

console.log('%c⭐ XP System yuklandi', 'color: #f7b500; font-weight: bold;');
