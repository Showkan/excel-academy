// ==========================================
// QUIZ.JS - Test tizimi
// ==========================================

window.Quiz = {
  currentQuiz: null,
  currentCourse: null,
  currentLesson: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  startTime: null,
  timer: null,
  elapsedSeconds: 0,

  /**
   * Quiz sahifasini render qilish
   */
  async render(container, courseId, lessonId) {
    container.innerHTML = `
      <div class="container" style="padding: 60px 0; text-align: center;">
        <div class="empty-state-icon">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>${I18n.t('common_loading')}</p>
      </div>
    `;

    // Auth tekshirish
    if (!Auth.isLoggedIn()) {
      App.showToast('Test topshirish uchun tizimga kiring', 'warning');
      Router.navigate('login');
      return;
    }

    // Kursni yuklash
    const course = await Courses.loadCourse(courseId);
    if (!course) {
      this._renderError(container, 'Kurs topilmadi');
      return;
    }

    // Darsni topish
    let lesson = null;
    for (const module of course.modules || []) {
      lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) break;
    }

    if (!lesson) {
      this._renderError(container, 'Dars topilmadi');
      return;
    }

    if (!lesson.quiz || !lesson.quiz.questions || lesson.quiz.questions.length === 0) {
      this._renderError(container, 'Bu darsda test mavjud emas');
      return;
    }

    // State ni reset qilish
    this.currentQuiz = lesson.quiz;
    this.currentCourse = course;
    this.currentLesson = lesson;
    this.currentQuestionIndex = 0;
    this.userAnswers = new Array(lesson.quiz.questions.length).fill(null);
    this.startTime = Date.now();
    this.elapsedSeconds = 0;

    // Quiz boshlanish ekranini ko'rsatish
    this._renderStartScreen(container);
  },

  /**
   * Quiz boshlanish ekrani
   */
  _renderStartScreen(container) {
    const quiz = this.currentQuiz;
    const course = this.currentCourse;
    const lesson = this.currentLesson;

    container.innerHTML = `
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a href="#courses" data-page="courses"><i class="fas fa-graduation-cap"></i> ${I18n.t('nav_courses')}</a>
            <i class="fas fa-chevron-right"></i>
            <a href="#course/${course.id}" onclick="Router.navigate('course/${course.id}'); return false;">${course.title}</a>
            <i class="fas fa-chevron-right"></i>
            <span>${lesson.title}</span>
            <i class="fas fa-chevron-right"></i>
            <span>${I18n.t('quiz_title')}</span>
          </div>
        </div>
      </div>

      <div class="quiz-page">
        <div class="quiz-container">
          <div class="card">
            <div class="card-body" style="padding: 40px; text-align: center;">
              
              <div style="width: 80px; height: 80px; margin: 0 auto 24px; border-radius: 50%; background: var(--excel-green-pale); color: var(--excel-green); display: flex; align-items: center; justify-content: center; font-size: 36px;">
                <i class="fas fa-question-circle"></i>
              </div>

              <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 8px;">
                ${lesson.title}
              </h1>
              <p style="color: var(--text-secondary); margin-bottom: 32px;">
                ${I18n.t('quiz_title')}
              </p>

              <!-- Quiz info -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
                <div style="background: var(--bg-elevated); padding: 20px; border-radius: var(--radius-md);">
                  <div style="font-size: 28px; font-weight: 800; color: var(--excel-green);">
                    ${quiz.questions.length}
                  </div>
                  <div style="font-size: 13px; color: var(--text-muted);">Savollar</div>
                </div>
                <div style="background: var(--bg-elevated); padding: 20px; border-radius: var(--radius-md);">
                  <div style="font-size: 28px; font-weight: 800; color: var(--color-dashboard);">
                    ${quiz.timeLimit || '∞'}
                  </div>
                  <div style="font-size: 13px; color: var(--text-muted);">Daqiqa</div>
                </div>
                <div style="background: var(--bg-elevated); padding: 20px; border-radius: var(--radius-md);">
                  <div style="font-size: 28px; font-weight: 800; color: var(--color-bonus);">
                    ${quiz.passingScore || 70}%
                  </div>
                  <div style="font-size: 13px; color: var(--text-muted);">O'tish bali</div>
                </div>
              </div>

              <!-- Qoidalar -->
              <div style="background: var(--bg-elevated); padding: 20px; border-radius: var(--radius-md); margin-bottom: 24px; text-align: left;">
                <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">
                  <i class="fas fa-info-circle" style="color: var(--color-dashboard);"></i> Qoidalar:
                </h3>
                <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--text-secondary); padding-left: 20px;">
                  <li>Har bir savolga faqat bitta to'g'ri javob</li>
                  <li>Testdan o'tish uchun kamida ${quiz.passingScore || 70}% to'g'ri javob</li>
                  <li>Testni keyinroq qayta topshirsangiz bo'ladi</li>
                  <li>Diqqat bilan o'qing va aniq javob bering</li>
                </ul>
              </div>

              <button class="btn btn-green btn-lg btn-block" onclick="Quiz.start()">
                <i class="fas fa-play"></i> Testni boshlash
              </button>

              <button class="btn btn-ghost btn-sm mt-2" onclick="Router.navigate('lesson/${course.id}/${lesson.id}')">
                <i class="fas fa-arrow-left"></i> Darsga qaytish
              </button>

            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Testni boshlash
   */
  start() {
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this._startTimer();
    this._renderQuestion();
  },

  /**
   * Taymer
   */
  _startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.elapsedSeconds++;
      const timerEl = document.getElementById('quiz-timer');
      if (timerEl) {
        timerEl.textContent = this._formatTime(this.elapsedSeconds);
      }
    }, 1000);
  },

  _stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  _formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  /**
   * Savol renderi
   */
  _renderQuestion() {
    const container = document.getElementById('main-content');
    if (!container) return;

    const quiz = this.currentQuiz;
    const question = quiz.questions[this.currentQuestionIndex];
    const progress = ((this.currentQuestionIndex + 1) / quiz.questions.length) * 100;
    const userAnswer = this.userAnswers[this.currentQuestionIndex];
    const isLastQuestion = this.currentQuestionIndex === quiz.questions.length - 1;

    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

    container.innerHTML = `
      <div class="quiz-page">
        <div class="quiz-container">
          
          <!-- Header -->
          <div class="quiz-header">
            <div class="quiz-header-top">
              <div class="quiz-title">
                <i class="fas fa-question-circle" style="color: var(--excel-green);"></i>
                ${this.currentLesson.title}
              </div>
              <div class="quiz-meta">
                <span><i class="fas fa-clock"></i> <strong id="quiz-timer">${this._formatTime(this.elapsedSeconds)}</strong></span>
              </div>
            </div>
            
            <div class="quiz-meta">
              <span>
                <i class="fas fa-list-ol"></i>
                ${I18n.t('quiz_question')} <strong>${this.currentQuestionIndex + 1}</strong> ${I18n.t('quiz_of')} <strong>${quiz.questions.length}</strong>
              </span>
              <span>
                <i class="fas fa-check"></i>
                Javob berilgan: <strong>${this.userAnswers.filter(a => a !== null).length}</strong> / ${quiz.questions.length}
              </span>
            </div>

            <div class="quiz-progress-bar">
              <div class="quiz-progress-fill" style="width: ${progress}%"></div>
            </div>
          </div>

          <!-- Question Card -->
          <div class="quiz-card">
            <div class="quiz-question-num">
              ${I18n.t('quiz_question')} ${this.currentQuestionIndex + 1}
            </div>
            <div class="quiz-question">
              ${question.question}
            </div>

            ${question.image ? `
              <div style="margin: 16px 0; text-align: center;">
                <img src="${question.image}" alt="Question" style="max-width: 100%; border-radius: var(--radius-md);">
              </div>
            ` : ''}

            ${question.code ? `
              <pre style="background: var(--bg-elevated); padding: 16px; border-radius: var(--radius-sm); margin: 16px 0; overflow-x: auto;"><code>${question.code}</code></pre>
            ` : ''}

            <div class="quiz-options">
              ${question.options.map((option, idx) => `
                <button 
                  class="quiz-option ${userAnswer === idx ? 'selected' : ''}" 
                  onclick="Quiz.selectAnswer(${idx})"
                  data-index="${idx}">
                  <span class="quiz-option-letter">${letters[idx]}</span>
                  <span>${option}</span>
                </button>
              `).join('')}
            </div>

            <!-- Actions -->
            <div class="quiz-actions">
              <button 
                class="btn btn-outline" 
                onclick="Quiz.prevQuestion()"
                ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
                <i class="fas fa-arrow-left"></i> ${I18n.t('common_back')}
              </button>

              <div style="display: flex; gap: 8px;">
                ${quiz.questions.map((_, idx) => {
                  const isAnswered = this.userAnswers[idx] !== null;
                  const isCurrent = idx === this.currentQuestionIndex;
                  return `
                    <button 
                      onclick="Quiz.goToQuestion(${idx})"
                      style="
                        width: 32px; 
                        height: 32px; 
                        border-radius: 50%; 
                        font-size: 12px; 
                        font-weight: 700;
                        border: 2px solid ${isCurrent ? 'var(--excel-green)' : isAnswered ? 'var(--success)' : 'var(--border)'};
                        background: ${isCurrent ? 'var(--excel-green)' : isAnswered ? 'rgba(16,124,16,0.1)' : 'var(--bg-surface)'};
                        color: ${isCurrent ? '#fff' : isAnswered ? 'var(--success)' : 'var(--text-secondary)'};
                        cursor: pointer;
                        transition: var(--t-fast);
                      "
                      title="Savol ${idx + 1}">
                      ${idx + 1}
                    </button>
                  `;
                }).join('')}
              </div>

              ${isLastQuestion ? `
                <button class="btn btn-green" onclick="Quiz.submit()">
                  <i class="fas fa-check"></i> ${I18n.t('quiz_submit')}
                </button>
              ` : `
                <button class="btn btn-green" onclick="Quiz.nextQuestion()">
                  ${I18n.t('quiz_next')} <i class="fas fa-arrow-right"></i>
                </button>
              `}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  /**
   * Javobni tanlash
   */
  selectAnswer(idx) {
    this.userAnswers[this.currentQuestionIndex] = idx;
    
    // UI yangilash
    document.querySelectorAll('.quiz-option').forEach((btn, i) => {
      btn.classList.toggle('selected', i === idx);
    });
  },

  /**
   * Keyingi savol
   */
  nextQuestion() {
    if (this.userAnswers[this.currentQuestionIndex] === null) {
      App.showToast(I18n.t('quiz_select_answer'), 'warning');
      return;
    }

    if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
      this.currentQuestionIndex++;
      this._renderQuestion();
    }
  },

  /**
   * Oldingi savol
   */
  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this._renderQuestion();
    }
  },

  /**
   * Belgilangan savolga o'tish
   */
  goToQuestion(idx) {
    this.currentQuestionIndex = idx;
    this._renderQuestion();
  },

  /**
   * Testni topshirish
   */
  async submit() {
    // Tekshirish - barcha savollarga javob berilganmi?
    const unanswered = this.userAnswers.filter(a => a === null).length;
    
    if (unanswered > 0) {
      if (!confirm(`${unanswered} ta savolga javob berilmagan. Davom etasizmi?`)) {
        return;
      }
    }

    this._stopTimer();

    // Natijani hisoblash
    const result = this._calculateResult();
    
    // Firebase ga saqlash
    if (Auth.isLoggedIn()) {
      try {
        await FB.saveQuizResult(
          Auth.currentUser.uid,
          this.currentCourse.id,
          this.currentLesson.id,
          result
        );

        // Agar o'tgan bo'lsa, darsni ham tugatilgan deb belgilash
        if (result.passed) {
          await FB.saveProgress(
            Auth.currentUser.uid,
            this.currentCourse.id,
            this.currentLesson.id,
            { type: 'quiz_passed', score: result.percentage }
          );
        }
      } catch (error) {
        console.error('Saqlashda xato:', error);
      }
    }

    // Natijani ko'rsatish
    this._renderResult(result);
  },

  /**
   * Natijani hisoblash
   */
  _calculateResult() {
    const questions = this.currentQuiz.questions;
    let correct = 0;
    const details = [];

    questions.forEach((q, idx) => {
      const userAnswer = this.userAnswers[idx];
      const isCorrect = userAnswer === q.correct;
      if (isCorrect) correct++;
      
      details.push({
        question: q.question,
        userAnswer: userAnswer !== null ? q.options[userAnswer] : 'Javob berilmadi',
        correctAnswer: q.options[q.correct],
        isCorrect,
        explanation: q.explanation || null
      });
    });

    const total = questions.length;
    const percentage = Math.round((correct / total) * 100);
    const passingScore = this.currentQuiz.passingScore || 70;
    const passed = percentage >= passingScore;

    return {
      score: correct,
      total,
      percentage,
      passed,
      passingScore,
      timeSpent: this.elapsedSeconds,
      answers: details
    };
  },

  /**
   * Natija ekrani
   */
  _renderResult(result) {
    const container = document.getElementById('main-content');
    if (!container) return;

    const courseId = this.currentCourse.id;
    const lessonId = this.currentLesson.id;

    container.innerHTML = `
      <div class="quiz-page">
        <div class="quiz-container">
          
          <!-- Natija kartochkasi -->
          <div class="card">
            <div class="quiz-result">
              
              <div class="quiz-result-icon ${result.passed ? 'success' : 'fail'}">
                <i class="fas ${result.passed ? 'fa-trophy' : 'fa-times'}"></i>
              </div>

              <h1 class="quiz-result-title">
                ${result.passed ? I18n.t('quiz_passed') : I18n.t('quiz_failed')}
              </h1>

              <div class="quiz-result-score">
                ${result.percentage}%
              </div>

              <p class="quiz-result-message">
                Siz <strong>${result.score} / ${result.total}</strong> ta savolga to'g'ri javob berdingiz
              </p>

              <!-- Statistika -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 500px; margin: 0 auto 24px;">
                <div style="background: var(--bg-elevated); padding: 16px; border-radius: var(--radius-md);">
                  <div style="font-size: 24px; font-weight: 800; color: var(--success);">${result.score}</div>
                  <div style="font-size: 12px; color: var(--text-muted);">${I18n.t('quiz_correct')}</div>
                </div>
                <div style="background: var(--bg-elevated); padding: 16px; border-radius: var(--radius-md);">
                  <div style="font-size: 24px; font-weight: 800; color: var(--danger);">${result.total - result.score}</div>
                  <div style="font-size: 12px; color: var(--text-muted);">${I18n.t('quiz_wrong')}</div>
                </div>
                <div style="background: var(--bg-elevated); padding: 16px; border-radius: var(--radius-md);">
                  <div style="font-size: 24px; font-weight: 800; color: var(--color-dashboard);">${this._formatTime(result.timeSpent)}</div>
                  <div style="font-size: 12px; color: var(--text-muted);">${I18n.t('quiz_time')}</div>
                </div>
              </div>

              ${!result.passed ? `
                <div style="background: rgba(247, 181, 0, 0.1); border-left: 4px solid var(--color-bonus); padding: 16px; border-radius: var(--radius-sm); margin: 16px 0; text-align: left;">
                  <strong><i class="fas fa-info-circle"></i> Eslatma:</strong>
                  <p style="margin-top: 6px; font-size: 14px;">
                    O'tish uchun kamida ${result.passingScore}% kerak. Materialni qayta o'rganib, yana urinib ko'ring!
                  </p>
                </div>
              ` : `
                <div style="background: rgba(16, 124, 16, 0.1); border-left: 4px solid var(--success); padding: 16px; border-radius: var(--radius-sm); margin: 16px 0; text-align: left;">
                  <strong><i class="fas fa-check-circle"></i> Tabriklaymiz!</strong>
                  <p style="margin-top: 6px; font-size: 14px;">
                    Siz testdan muvaffaqiyatli o'tdingiz va dars tugatilgan deb belgilandi.
                  </p>
                </div>
              `}

              <!-- Tugmalar -->
              <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
                <button class="btn btn-outline-green" onclick="Quiz.toggleDetails()">
                  <i class="fas fa-list-check"></i> Javoblarni ko'rish
                </button>
                
                ${!result.passed ? `
                  <button class="btn btn-green" onclick="Router.navigate('quiz/${courseId}/${lessonId}')">
                    <i class="fas fa-redo"></i> ${I18n.t('quiz_retake')}
                  </button>
                ` : ''}

                <button class="btn btn-green" onclick="Router.navigate('lesson/${courseId}/${lessonId}')">
                  <i class="fas fa-book"></i> Darsga qaytish
                </button>

                <button class="btn btn-outline" onclick="Router.navigate('course/${courseId}')">
                  <i class="fas fa-graduation-cap"></i> Kursga qaytish
                </button>
              </div>

            </div>
          </div>

          <!-- Batafsil natijalar (yashirin) -->
          <div id="quiz-details" style="display: none; margin-top: 24px;">
            <div class="card">
              <div class="card-header">
                <h3><i class="fas fa-list-check"></i> Batafsil natija</h3>
              </div>
              <div class="card-body">
                ${result.answers.map((a, idx) => `
                  <div style="padding: 16px; margin-bottom: 12px; border-radius: var(--radius-md); background: ${a.isCorrect ? 'rgba(16,124,16,0.05)' : 'rgba(216,59,1,0.05)'}; border-left: 4px solid ${a.isCorrect ? 'var(--success)' : 'var(--danger)'};">
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                      <strong>Savol ${idx + 1}</strong>
                      <span style="color: ${a.isCorrect ? 'var(--success)' : 'var(--danger)'};">
                        <i class="fas ${a.isCorrect ? 'fa-check' : 'fa-times'}"></i>
                        ${a.isCorrect ? I18n.t('quiz_correct') : I18n.t('quiz_wrong')}
                      </span>
                    </div>
                    
                    <p style="margin-bottom: 12px; font-weight: 500;">${a.question}</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px;">
                      <div style="padding: 8px 12px; background: var(--bg-surface); border-radius: var(--radius-xs);">
                        <strong>Sizning javobingiz:</strong> 
                        <span style="color: ${a.isCorrect ? 'var(--success)' : 'var(--danger)'};">${a.userAnswer}</span>
                      </div>
                      ${!a.isCorrect ? `
                        <div style="padding: 8px 12px; background: var(--bg-surface); border-radius: var(--radius-xs);">
                          <strong>To'g'ri javob:</strong> 
                          <span style="color: var(--success);">${a.correctAnswer}</span>
                        </div>
                      ` : ''}
                      ${a.explanation ? `
                        <div style="padding: 12px; background: var(--excel-green-pale); border-radius: var(--radius-xs); margin-top: 4px;">
                          <strong><i class="fas fa-lightbulb"></i> Tushuntirish:</strong>
                          <div style="margin-top: 4px;">${a.explanation}</div>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  /**
   * Batafsil natijani ko'rsatish/yashirish
   */
  toggleDetails() {
    const details = document.getElementById('quiz-details');
    if (details) {
      const isHidden = details.style.display === 'none';
      details.style.display = isHidden ? 'block' : 'none';
      
      if (isHidden) {
        details.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  },

  /**
   * Xato sahifa
   */
  _renderError(container, message) {
    container.innerHTML = `
      <div class="container" style="padding: 60px 0; text-align: center;">
        <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: rgba(216,59,1,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; color: var(--danger);">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2 style="margin-bottom: 12px;">${message}</h2>
        <button class="btn btn-green" data-page="courses">
          <i class="fas fa-arrow-left"></i> Kurslarga qaytish
        </button>
      </div>
    `;
  }
};

console.log('🎯 Quiz modul yuklandi');