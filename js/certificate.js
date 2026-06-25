// ==========================================
// CERTIFICATE.JS - Sertifikatlar
// ==========================================

window.Certificate = {
  certificates: [],

  async renderList(container) {
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
    this.certificates = await FB.getCertificates(user.uid);
    const eligibleCourses = await this._checkEligibility();

    container.innerHTML = `
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a href="#home" data-page="home"><i class="fas fa-home"></i> ${I18n.t('nav_home')}</a>
            <i class="fas fa-chevron-right"></i>
            <span>${I18n.t('cert_title')}</span>
          </div>
          <div class="page-header-content">
            <div>
              <h1><i class="fas fa-certificate"></i> ${I18n.t('cert_title')}</h1>
              <p>${I18n.t('cert_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="padding: 32px 0;">

        ${eligibleCourses.length > 0 ? `
          <div class="card mb-3" style="border: 2px dashed var(--color-bonus); background: rgba(247, 181, 0, 0.05);">
            <div class="card-body">
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                <div style="width: 56px; height: 56px; background: var(--color-bonus); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                  <i class="fas fa-gift"></i>
                </div>
                <div>
                  <h3 style="margin-bottom: 4px;">🎉 Tabriklaymiz!</h3>
                  <p style="color: var(--text-secondary); margin: 0;">
                    Siz ${eligibleCourses.length} ta kursni tugatdingiz. Sertifikatingizni oling!
                  </p>
                </div>
              </div>
              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                ${eligibleCourses.map(c => `
                  <button class="btn btn-yellow" onclick="Certificate.issue('${c.id}')">
                    <i class="fas fa-award"></i> ${c.title} sertifikat
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        ${this.certificates.length > 0 ? `
          <div class="certificates-grid">
            ${this.certificates.map(cert => this._renderCertCard(cert)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon"><i class="fas fa-certificate"></i></div>
            <h3 class="empty-state-title">${I18n.t('cert_empty')}</h3>
            <p class="empty-state-desc">${I18n.t('cert_empty_desc')}</p>
            <button class="btn btn-green" data-page="courses">
              <i class="fas fa-graduation-cap"></i> ${I18n.t('nav_courses')}
            </button>
          </div>
        `}

      </div>
    `;
  },

  async _checkEligibility() {
    const user = Auth.currentUser;
    if (!user) return [];

    const eligible = [];
    const courses = await Courses.loadAllCourses();
    
    for (const course of courses) {
      const hasIt = this.certificates.find(c => c.courseId === course.id);
      if (hasIt) continue;

      const progress = await FB.getProgress(user.uid, course.id);
      const completedLessons = Object.keys(progress);
      
      let totalLessons = 0;
      course.modules?.forEach(m => totalLessons += m.lessons.length);

      const quizResults = await FB.getQuizResults(user.uid);
      let passedQuizzes = 0;
      let totalQuizzes = 0;

      course.modules?.forEach(m => {
        m.lessons.forEach(l => {
          if (l.quiz) {
            totalQuizzes++;
            const key = `${course.id}_${l.id}`;
            if (quizResults[key]?.passed) passedQuizzes++;
          }
        });
      });

      const allLessonsCompleted = completedLessons.length >= totalLessons;
      const allQuizzesPassed = totalQuizzes === 0 || passedQuizzes >= totalQuizzes;

      if (allLessonsCompleted && allQuizzesPassed) {
        eligible.push(course);
      }
    }

    return eligible;
  },

  _renderCertCard(cert) {
    const issuedDate = new Date(cert.issuedAt).toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    return `
      <div class="cert-card">
        <div class="cert-preview" style="background: linear-gradient(135deg, ${cert.courseId === 'pro' ? 'var(--color-pro) 0%, #9b5cf5' : 'var(--excel-green) 0%, var(--excel-green-light)'} 100%);">
          <div class="cert-preview-content">
            <div class="cert-preview-icon"><i class="fas fa-certificate"></i></div>
            <div class="cert-preview-title">${I18n.t('cert_certificate')}</div>
          </div>
        </div>

        <div class="cert-card-body">
          <h3 class="cert-card-title">${cert.courseTitle || cert.courseId}</h3>
          <div class="cert-card-meta">
            <div style="margin-bottom: 4px;">
              <i class="fas fa-calendar"></i> ${issuedDate}
            </div>
            <div>
              <i class="fas fa-hashtag"></i> ${cert.certId}
            </div>
          </div>

          <div class="cert-card-actions">
            <button class="btn btn-sm btn-green" onclick="Certificate.view('${cert.certId}')">
              <i class="fas fa-eye"></i> ${I18n.t('cert_view')}
            </button>
            <button class="btn btn-sm btn-outline-green" onclick="Certificate.download('${cert.certId}')">
              <i class="fas fa-download"></i> ${I18n.t('cert_download')}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  async issue(courseId) {
    if (!Auth.isLoggedIn()) {
      App.showToast('Tizimga kiring', 'warning');
      return;
    }

    const user = Auth.currentUser;
    const course = await Courses.loadCourse(courseId);
    
    if (!course) {
      App.showToast('Kurs topilmadi', 'error');
      return;
    }

    if (!confirm(`"${course.title}" kursi uchun sertifikat olishni xohlaysizmi?`)) return;

    App.showToast('Sertifikat tayyorlanmoqda...', 'info');

    try {
      const certData = {
        userName: Auth.getDisplayName(user),
        userEmail: user.email,
        courseId: courseId,
        courseTitle: course.title,
        courseLevel: course.id === 'foundation' ? 'Foundation' : 'Professional',
        lessonsCount: course.lessons_count
      };

      const result = await FB.saveCertificate(user.uid, courseId, certData);

      if (result.success) {
        // Confetti
        if (window.confetti) {
          confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        }
        
        App.showToast('🎉 Sertifikat muvaffaqiyatli berildi!', 'success');
        setTimeout(() => this.view(result.certificate.certId), 1000);
      } else {
        App.showToast('Xatolik: ' + result.error, 'error');
      }
    } catch (error) {
      App.showToast('Xatolik: ' + error.message, 'error');
    }
  },

  async view(certId) {
    const cert = this.certificates.find(c => c.certId === certId) || 
                 (await FB.getCertificates(Auth.currentUser.uid)).find(c => c.certId === certId);

    if (!cert) {
      App.showToast('Sertifikat topilmadi', 'error');
      return;
    }

    const container = document.getElementById('main-content');
    
    container.innerHTML = `
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a href="#certificates" data-page="certificates"><i class="fas fa-certificate"></i> ${I18n.t('cert_title')}</a>
            <i class="fas fa-chevron-right"></i>
            <span>${cert.certId}</span>
          </div>
          <div class="page-header-content">
            <div>
              <h1><i class="fas fa-certificate"></i> Sertifikat</h1>
              <p>ID: ${cert.certId}</p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline-green" onclick="window.print()">
                <i class="fas fa-print"></i> Chop etish
              </button>
              <button class="btn btn-green" onclick="Certificate.download('${cert.certId}')">
                <i class="fas fa-download"></i> ${I18n.t('cert_download')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="padding: 40px 24px;">
        ${this._renderFullCertificate(cert)}
      </div>
    `;
  },

  _renderFullCertificate(cert) {
    const issuedDate = new Date(cert.issuedAt).toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const qrData = `https://excel-academy.uz/verify/${cert.certId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;

    return `
      <div class="cert-full" id="cert-full-${cert.certId}">
        
        <div class="cert-full-header">
          <div class="cert-full-logo">
            <i class="fas fa-medal"></i>
          </div>
          <div class="cert-full-platform">Excel Academy Platform</div>
          <h1 class="cert-full-title">${I18n.t('cert_certificate')}</h1>
          <p class="cert-full-subtitle">of Achievement & Completion</p>
        </div>

        <div style="margin: 32px 0;">
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
            ${I18n.t('cert_awarded')}
          </p>
          
          <div class="cert-full-name">${cert.userName}</div>
          
          <p style="color: #6b7280; font-size: 14px; margin: 16px 0 8px;">
            ${I18n.t('cert_completed')}
          </p>
          
          <div class="cert-full-course">${cert.courseTitle}</div>

          <div style="font-size: 14px; color: #6b7280; margin-top: 16px;">
            <strong>${cert.lessonsCount || 0}</strong> ta darsni muvaffaqiyatli tugatdi va 
            barcha testlardan o'tdi
          </div>
        </div>

        <div class="cert-full-footer">
          <div class="cert-full-footer-item">
            <div>${I18n.t('cert_issued')}</div>
            <strong>${issuedDate}</strong>
          </div>

          <div class="cert-full-qr">
            <img src="${qrUrl}" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;">
          </div>

          <div class="cert-full-footer-item">
            <div>${I18n.t('cert_id')}</div>
            <strong>${cert.certId}</strong>
          </div>
        </div>

      </div>

      <style>
        @media print {
          body * { visibility: hidden; }
          .cert-full, .cert-full * { visibility: visible; }
          .cert-full {
            position: absolute;
            left: 0; top: 0;
            width: 100%; margin: 0;
            box-shadow: none;
          }
          .header, .page-header, .footer, .breadcrumb { display: none !important; }
        }
      </style>
    `;
  },

  async download(certId) {
    const cert = this.certificates.find(c => c.certId === certId) || 
                 (await FB.getCertificates(Auth.currentUser.uid)).find(c => c.certId === certId);

    if (!cert) {
      App.showToast('Sertifikat topilmadi', 'error');
      return;
    }

    App.showToast('Sertifikat tayyorlanmoqda...', 'info');

    try {
      this._downloadAsHTML(cert);
    } catch (error) {
      App.showToast('Yuklab olishda xato: ' + error.message, 'error');
    }
  },

  _downloadAsHTML(cert) {
    const issuedDate = new Date(cert.issuedAt).toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const qrData = `https://excel-academy.uz/verify/${cert.certId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Sertifikat - ${cert.certId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #f5f5f5;
      padding: 40px;
      display: flex; justify-content: center; align-items: center;
      min-height: 100vh;
    }
    .cert {
      background: #fff; max-width: 900px; width: 100%;
      padding: 60px; border: 12px solid #217346;
      position: relative; text-align: center;
      box-shadow: 0 12px 48px rgba(0,0,0,0.16);
    }
    .cert::before {
      content: ''; position: absolute; inset: 12px;
      border: 2px solid #217346; pointer-events: none;
    }
    .cert-logo { font-size: 56px; color: #217346; margin-bottom: 12px; }
    .cert-platform {
      font-size: 14px; color: #6b7280;
      text-transform: uppercase; letter-spacing: 3px; font-weight: 600;
    }
    .cert-title {
      font-size: 42px; font-weight: 900; color: #217346;
      margin: 16px 0; letter-spacing: 2px;
    }
    .cert-subtitle { font-size: 14px; color: #6b7280; margin-bottom: 32px; }
    .cert-name {
      font-size: 38px; font-weight: 700; color: #1a1a1a;
      margin: 24px 0; font-style: italic;
      border-bottom: 2px solid #217346;
      padding-bottom: 16px; display: inline-block; min-width: 400px;
    }
    .cert-course { font-size: 22px; font-weight: 600; color: #217346; margin: 24px 0; }
    .cert-footer {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-top: 48px; font-size: 13px; color: #6b7280;
    }
    .cert-footer-item { text-align: center; }
    .cert-footer-item strong { display: block; color: #1a1a1a; font-size: 14px; margin-top: 4px; }
    .cert-qr { width: 100px; height: 100px; }
    .print-btn {
      position: fixed; top: 20px; right: 20px;
      padding: 12px 24px; background: #217346; color: #fff;
      border: none; border-radius: 6px; cursor: pointer;
      font-size: 14px; font-weight: 600;
    }
    @media print {
      .print-btn { display: none; }
      body { background: #fff; padding: 0; }
      .cert { box-shadow: none; }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">
    🖨️ Chop etish / PDF saqlash
  </button>
  
  <div class="cert">
    <div class="cert-logo">🏅</div>
    <div class="cert-platform">Excel Academy Platform</div>
    <h1 class="cert-title">SERTIFIKAT</h1>
    <p class="cert-subtitle">of Achievement & Completion</p>
    
    <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
      Quyidagi shaxsga beriladi
    </p>
    
    <div class="cert-name">${cert.userName}</div>
    
    <p style="color: #6b7280; font-size: 14px; margin: 16px 0 8px;">
      muvaffaqiyatli tugatgani uchun
    </p>
    
    <div class="cert-course">${cert.courseTitle}</div>
    
    <div style="font-size: 14px; color: #6b7280; margin-top: 16px;">
      <strong>${cert.lessonsCount || 0}</strong> ta darsni muvaffaqiyatli tugatdi
    </div>
    
    <div class="cert-footer">
      <div class="cert-footer-item">
        <div>Berilgan sana</div>
        <strong>${issuedDate}</strong>
      </div>
      <img src="${qrUrl}" alt="QR" class="cert-qr">
      <div class="cert-footer-item">
        <div>Sertifikat ID</div>
        <strong>${cert.certId}</strong>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    
    if (!win) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${cert.certId}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    App.showToast('Sertifikat ochildi. Chop etish tugmasini bosing.', 'success');
  }
};

console.log('%c🏆 Certificate yuklandi', 'color: #f7b500; font-weight: bold;');
