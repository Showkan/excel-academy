// ============================================
// Quiz Module
// ============================================

const Quiz = {
    currentQuiz: null,
    currentQuestion: 0,
    answers: [],
    
    render(courseId, lessonNum) {
        const lesson = Courses.getLesson(courseId, lessonNum);
        if (!lesson || !lesson.quiz || lesson.quiz.length === 0) return '';
        
        this.currentQuiz = { courseId, lessonNum, questions: lesson.quiz };
        this.currentQuestion = 0;
        this.answers = new Array(lesson.quiz.length).fill(-1);
        
        return `
            <div class="quiz-section" id="quiz-section">
                <div class="quiz-header">
                    <h2>📝 ${I18n.t('quiz_title')}</h2>
                    <span class="quiz-progress" id="quiz-progress">
                        ${I18n.t('quiz_question')} 1 ${I18n.t('of')} ${lesson.quiz.length}
                    </span>
                </div>
                <div class="quiz-body" id="quiz-body">
                    ${this.renderQuestion(0)}
                </div>
                <div class="quiz-footer" id="quiz-footer">
                    <div></div>
                    <button class="btn btn-primary" id="quiz-next-btn" onclick="Quiz.nextQuestion()">
                        ${lesson.quiz.length > 1 ? I18n.t('quiz_next') : I18n.t('quiz_submit')}
                    </button>
                </div>
            </div>
        `;
    },
    
    renderQuestion(index) {
        const q = this.currentQuiz.questions[index];
        const lang = I18n.currentLang;
        const questionText = q.q[lang] || q.q.uz;
        const options = q.options[lang] || q.options.uz;
        
        return `
            <div class="quiz-question fade-in">
                <p class="quiz-question-text">${index + 1}. ${questionText}</p>
                <div class="quiz-options">
                    ${options.map((opt, i) => `
                        <div class="quiz-option ${this.answers[index] === i ? 'selected' : ''}" 
                             onclick="Quiz.selectOption(${index}, ${i})">
                            <div class="quiz-option-radio"></div>
                            <span>${opt}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    selectOption(questionIndex, optionIndex) {
        this.answers[questionIndex] = optionIndex;
        
        // Update UI
        document.querySelectorAll('.quiz-option').forEach((opt, i) => {
            opt.classList.toggle('selected', i === optionIndex);
        });
    },
    
    nextQuestion() {
        if (this.answers[this.currentQuestion] === -1) {
            App.showToast('Javobni tanlang!', 'warning');
            return;
        }
        
        const total = this.currentQuiz.questions.length;
        
        if (this.currentQuestion < total - 1) {
            this.currentQuestion++;
            
            const quizBody = document.getElementById('quiz-body');
            const quizProgress = document.getElementById('quiz-progress');
            const nextBtn = document.getElementById('quiz-next-btn');
            
            quizBody.innerHTML = this.renderQuestion(this.currentQuestion);
            quizProgress.textContent = `${I18n.t('quiz_question')} ${this.currentQuestion + 1} ${I18n.t('of')} ${total}`;
            
            if (this.currentQuestion === total - 1) {
                nextBtn.textContent = I18n.t('quiz_finish');
                nextBtn.setAttribute('onclick', 'Quiz.finish()');
            }
        }
    },
    
    finish() {
        if (this.answers[this.currentQuestion] === -1) {
            App.showToast('Javobni tanlang!', 'warning');
            return;
        }
        
        const questions = this.currentQuiz.questions;
        let correct = 0;
        
        questions.forEach((q, i) => {
            if (this.answers[i] === q.correct) correct++;
        });
        
        const total = questions.length;
        const percent = Math.round((correct / total) * 100);
        const passed = percent >= 60;
        
        // Save result
        if (Auth.isLoggedIn()) {
            Auth.saveQuizResult(this.currentQuiz.courseId, this.currentQuiz.lessonNum, correct, total);
            
            if (passed) {
                Auth.completeLesson(this.currentQuiz.courseId, this.currentQuiz.lessonNum);
            }
        }
        
        // Show result
        const quizSection = document.getElementById('quiz-section');
        quizSection.innerHTML = `
            <div class="quiz-header">
                <h2>📝 ${I18n.t('quiz_result')}</h2>
            </div>
            <div class="quiz-result fade-in">
                <div class="quiz-result-score ${passed ? 'pass' : 'fail'}">
                    ${correct}/${total}
                </div>
                <p class="quiz-result-text">
                    ${percent}% — ${passed ? I18n.t('quiz_pass') : I18n.t('quiz_fail')}
                </p>
                
                ${questions.map((q, i) => {
                    const lang = I18n.currentLang;
                    const questionText = q.q[lang] || q.q.uz;
                    const options = q.options[lang] || q.options.uz;
                    const isCorrect = this.answers[i] === q.correct;
                    
                    return `
                        <div style="text-align:left; margin-bottom: 16px; padding: 16px; border-radius: 8px; border: 1px solid var(--border-light);">
                            <p style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">${i + 1}. ${questionText}</p>
                            <p style="font-size: 13px; color: ${isCorrect ? 'var(--success-green)' : 'var(--warning-red)'};">
                                ${isCorrect ? '✓' : '✗'} ${I18n.t(isCorrect ? 'quiz_correct' : 'quiz_incorrect')}: ${options[q.correct]}
                            </p>
                            ${!isCorrect ? `<p style="font-size: 12px; color: var(--text-tertiary); margin-top: 4px;">Sizning javobingiz: ${options[this.answers[i]]}</p>` : ''}
                        </div>
                    `;
                }).join('')}
                
                <button class="btn ${passed ? 'btn-primary' : 'btn-danger'}" onclick="Quiz.retry()" style="margin-top: 16px;">
                    ${passed ? '✓ ' + I18n.t('lesson_completed') : I18n.t('quiz_retry')}
                </button>
            </div>
        `;
        
        if (passed) {
            App.showToast(I18n.t('quiz_pass'), 'success');
        }
    },
    
    retry() {
        if (!this.currentQuiz) return;
        
        this.currentQuestion = 0;
        this.answers = new Array(this.currentQuiz.questions.length).fill(-1);
        
        const quizSection = document.getElementById('quiz-section');
        quizSection.innerHTML = `
            <div class="quiz-header">
                <h2>📝 ${I18n.t('quiz_title')}</h2>
                <span class="quiz-progress" id="quiz-progress">
                    ${I18n.t('quiz_question')} 1 ${I18n.t('of')} ${this.currentQuiz.questions.length}
                </span>
            </div>
            <div class="quiz-body" id="quiz-body">
                ${this.renderQuestion(0)}
            </div>
            <div class="quiz-footer" id="quiz-footer">
                <div></div>
                <button class="btn btn-primary" id="quiz-next-btn" onclick="Quiz.nextQuestion()">
                    ${this.currentQuiz.questions.length > 1 ? I18n.t('quiz_next') : I18n.t('quiz_submit')}
                </button>
            </div>
        `;
    }
};