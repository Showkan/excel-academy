// ============================================
// Certificate Module
// ============================================

const Certificate = {
    
    async checkEligibility() {
        if (!Auth.isLoggedIn() || !Auth.userData) {
            return { eligible: false, foundation: false, pro: false, quizzes: false };
        }
        
        const completed = Auth.userData.completedLessons || {};
        const foundationDone = (completed.foundation || []).length >= 8;
        const proDone = (completed.pro || []).length >= 12;
        
        // Check if all quizzes completed
        const quizResults = Auth.userData.quizResults || {};
        let allQuizzes = true;
        
        for (let i = 1; i <= 8; i++) {
            if (!quizResults[`foundation_lesson${i}`]) { allQuizzes = false; break; }
        }
        if (allQuizzes) {
            for (let i = 1; i <= 12; i++) {
                if (!quizResults[`pro_lesson${i}`]) { allQuizzes = false; break; }
            }
        }
        
        return {
            eligible: foundationDone && proDone && allQuizzes,
            foundation: foundationDone,
            pro: proDone,
            quizzes: allQuizzes
        };
    },
    
    generateId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = 'EA-';
        for (let i = 0; i < 8; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    },
    
    async render() {
        const eligibility = await this.checkEligibility();
        
        if (!Auth.isLoggedIn()) {
            return `
                <div class="certificate-page page-transition">
                    <div class="certificate-container">
                        <div class="cert-locked">
                            <div class="cert-locked-icon">🔒</div>
                            <h2>${I18n.t('cert_locked_title')}</h2>
                            <p>${I18n.t('lesson_locked_desc')}</p>
                            <button class="btn btn-primary mt-3" onclick="window.location.hash='#/login'">${I18n.t('login')}</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (!eligibility.eligible) {
            return `
                <div class="certificate-page page-transition">
                    <div class="certificate-container">
                        <div class="cert-locked">
                            <div class="cert-locked-icon">📜</div>
                            <h2>${I18n.t('cert_locked_title')}</h2>
                            <p>${I18n.t('cert_locked_desc')}</p>
                            <div class="cert-requirements mt-3">
                                <div class="cert-req-item">
                                    <div class="cert-req-icon ${eligibility.foundation ? 'done' : 'pending'}">
                                        ${eligibility.foundation ? '✓' : '○'}
                                    </div>
                                    <span>${I18n.t('cert_req_foundation')}</span>
                                </div>
                                <div class="cert-req-item">
                                    <div class="cert-req-icon ${eligibility.pro ? 'done' : 'pending'}">
                                        ${eligibility.pro ? '✓' : '○'}
                                    </div>
                                    <span>${I18n.t('cert_req_pro')}</span>
                                </div>
                                <div class="cert-req-item">
                                    <div class="cert-req-icon ${eligibility.quizzes ? 'done' : 'pending'}">
                                        ${eligibility.quizzes ? '✓' : '○'}
                                    </div>
                                    <span>${I18n.t('cert_req_quiz')}</span>
                                </div>
                            </div>
                            <button class="btn btn-primary mt-3" onclick="window.location.hash='#/courses'">${I18n.t('continue_learning')}</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        const userName = Auth.userData?.name || 'User';
        const certId = this.generateId();
        const date = new Date().toLocaleDateString(I18n.currentLang === 'uz' ? 'uz-UZ' : I18n.currentLang === 'ru' ? 'ru-RU' : 'en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        
        return `
            <div class="certificate-page page-transition">
                <div class="certificate-container">
                    <div class="certificate-preview" id="certificate-preview">
                        <div class="cert-border-inner"></div>
                        <div class="cert-logo">
                            <svg width="48" height="48" viewBox="0 0 64 64">
                                <rect width="64" height="64" rx="12" fill="#217346"/>
                                <text x="32" y="42" text-anchor="middle" fill="white" font-size="32" font-weight="bold">X</text>
                            </svg>
                        </div>
                        <p class="cert-title">${I18n.t('cert_title')}</p>
                        <h1 class="cert-heading">${I18n.t('cert_heading')}</h1>
                        <p class="cert-presented">${I18n.t('cert_presented')}</p>
                        <h2 class="cert-name">${userName}</h2>
                        <p class="cert-description">${I18n.t('cert_desc')}</p>
                        <div class="cert-footer">
                            <div class="cert-footer-item">
                                <p class="cert-footer-label">${I18n.t('cert_date')}</p>
                                <p class="cert-footer-value">${date}</p>
                            </div>
                            <div class="cert-footer-item">
                                <div style="width:64px;height:64px;border:2px solid #217346;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#217346;">QR</div>
                            </div>
                            <div class="cert-footer-item">
                                <p class="cert-footer-label">${I18n.t('cert_id')}</p>
                                <p class="cert-footer-value">${certId}</p>
                            </div>
                        </div>
                    </div>
                    <div class="certificate-actions">
                        <button class="btn btn-primary" onclick="Certificate.download()">
                            📄 ${I18n.t('cert_download')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    download() {
        App.showToast('PDF yuklab olish tez kunda qo\'shiladi', 'info');
    }
};