// ==========================================
// XP.JS - XP va Level tizimi
// ==========================================

window.XPSystem = {
  // Ma'lumotlar
  data: null,

  // Level jadvali
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

  // XP mukofotlari (default)
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

  /**
   * Ishga tushirish
   */
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

    // Bar ni render qilish
    this.renderBar();
    console.log(`%c⭐ XP System: Level ${this.data.level} (${this.data.xp} XP)`, 'color: #f7b500; font-weight: bold;');
  },

  /**
   * XP qo'shish
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

    // Maksimum 200 ta tarix
    if (this.data.history.length > 200) {
      this.data.history = this.data.history.slice(-200);
    }

    // Yangi level hisoblash
    this.data.level = this._calcLevel(this.data.xp);

    this._save();
    this.renderBar();

    // Level up bo'ldimi?
    if (this.data.level > oldLevel) {
      this._showLevelUp(this.data.level);
    }

    // XP toast
    this._showXPToast(points, reason);
  },

  /**
   * Maxsus XP qo'shish funksiyalari
   */
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
      reason = `Mini-o'yin: ${score} ball (Yaxshi)`;
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
      // 60% dan past = XP berilmaydi
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
    // Kuniga max 3 marta
    const today = new Date().toDateString();
    if (this.data.lastInspectorDate !== today) {
      this.data.dailyInspector = 0;
      this.data.lastInspectorDate = today;
    }

    if (this.data.dailyInspector >= 3) return;

    this.data.dailyInspector++;
    this.add(this.rewards.inspectorUse, 'Formula Inspector ishlatildi');
  },

  addExamPass() {
    this.add(this.rewards.examPass, 'Foundation imtihon o\'tildi!');
  },

  /**
   * Level hisoblash
   */
  _calcLevel(xp) {
    let lvl = 1;
    for (const l of this.levels) {
      if (xp >= l.xp) lvl = l.level;
    }
    return lvl;
  },

  /**
   * Joriy level ma'lumotini olish
   */
  getCurrentLevel() {
    return this.levels.find(l => l.level === this.data.level) || this.levels[0];
  },

  /**
   * Keyingi level
   */
  getNextLevel() {
    return this.levels.find(l => l.level > this.data.level) || null;
  },

  /**
   * Progress foizi (joriy leveldan keyingisiga)
   */
  getProgress() {
    const curr = this.getCurrentLevel();
    const next = this.getNextLevel();
    if (!next) return 100;
    return Math.round(((this.data.xp - curr.xp) / (next.xp - curr.xp)) * 100);
  },

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
      <div class="xp-bar-inner" title="${curr.title} — ${this.data.xp} XP">
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
   * Level Up animatsiya
   */
  _showLevelUp(newLevel) {
    const lvl = this.levels.find(l => l.level === newLevel);
    if (!lvl) return;

    // Confetti (agar mavjud bo'lsa)
    if (window.confetti) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    // Modal
    const modal = `
      <div class="modal-overlay show" id="levelup-modal" style="z-index: 9999;">
        <div class="modal" style="max-width: 400px; text-align: center;">
          <div class="modal-body" style="padding: 48px 32px;">
            <div style="font-size: 72px; margin-bottom: 16px; animation: bounce 0.6s ease;">
              ${lvl.badge}
            </div>
            <h2 style="color: ${lvl.color}; margin-bottom: 8px;">
              Yangi daraja!
            </h2>
            <h3 style="font-size: 24px; margin-bottom: 16px;">
              Level ${lvl.level}
            </h3>
            <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 24px;">
              ${lvl.title}
            </p>
            <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px;">
              Jami: ${this.data.xp} XP
            </div>
            <button class="btn btn-green btn-lg" onclick="document.getElementById('levelup-modal').remove()">
              <i class="fas fa-star"></i> Ajoyib!
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);

    // 5 sekunddan keyin avtomatik yopish
    setTimeout(() => {
      const m = document.getElementById('levelup-modal');
      if (m) m.remove();
    }, 5000);
  },

  /**
   * XP toast (pastda o'ng tarafda)
   */
  _showXPToast(points, reason) {
    const toast = document.createElement('div');
    toast.className = 'xp-toast';
    toast.innerHTML = `
      <span class="xp-toast-points">+${points} XP</span>
      <span class="xp-toast-reason">${reason}</span>
    `;
    document.body.appendChild(toast);

    // Animatsiya
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },

  /**
   * XP tarixini olish
   */
  getHistory(limit = 20) {
    if (!this.data) return [];
    return this.data.history.slice(-limit).reverse();
  },

  /**
   * Bugungi XP
   */
  getTodayXP() {
    const today = new Date().toDateString();
    return this.data.history
      .filter(h => new Date(h.at).toDateString() === today)
      .reduce((sum, h) => sum + h.points, 0);
  },

  /**
   * Dashboard uchun statistika
   */
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

  /**
   * Reset (test uchun)
   */
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

  /**
   * Saqlash
   */
  _save() {
    localStorage.setItem('xpData', JSON.stringify(this.data));
  }
};

console.log('%c⭐ XP System yuklandi', 'color: #f7b500; font-weight: bold;');
