// ==========================================
// CERTIFICATE.JS - Sertifikatlar
// 3 dizayn: Foundation / PRO / MASTER (ikkalasi)
// ==========================================

window.Certificate = {
  certificates: [],

  /**
   * Sertifikatlar sahifasini render qilish
   */
  async renderList(container) {
    if (!Auth.isLoggedIn()) {
      App.showToast('Iltimos, avval tizimga kiring', 'warning');
      Router.navigate('login');
      return;
    }

    container.innerHTML = `
      <div class="container" style="padding: 60px 0; text-align: center;">
        <div class="empty-state-icon">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>${I18n.t('common_loading')}</p>
      </div>
    `;

    const user = Auth.currentUser;

    // Mavjud sertifikatlarni olish
    this.certificates = await FB.getCertificates(user.uid);

    // Sertifikat olish mumkin bo'lgan kurslarni tekshirish
    const eligibleCourses = await this._checkEligibility();

    container.innerHTML = `
      <!-- Page Header -->
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

        <!-- Olinishi mumkin bo'lgan sertifikatlar -->
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
                    Siz ${eligibleCourses.length} ta sertifikat olishga loyiqsiz!
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

        <!-- Mavjud sertifikatlar -->
        ${this.certificates.length > 0 ? `
          <div class="certificates-grid">
            ${this.certificates.map(cert => this._renderCertCard(cert)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">
              <i class="fas fa-certificate"></i>
            </div>
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

  /**
   * Sertifikat olish mumkinligini tekshirish
   * (Foundation, PRO va ikkalasi uchun MASTER sertifikat)
   */
  async _checkEligibility() {
    const user = Auth.currentUser;
    if (!user) return [];

    const eligible = [];
    const courses = await Courses.loadAllCourses();
    const haveOrEligible = {}; // courseId -> true agar olingan yoki olishga tayyor

    for (const course of courses) {
      const hasIt = this.certificates.find(c => c.courseId === course.id);
      if (hasIt) { haveOrEligible[course.id] = true; continue; }

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
        haveOrEligible[course.id] = true;
      }
    }

    // MASTER sertifikat: Foundation + PRO ikkalasi ham bor/tayyor bo'lsa
    const hasMaster = this.certificates.find(c => c.courseId === 'master');
    if (!hasMaster && haveOrEligible['foundation'] && haveOrEligible['pro']) {
      eligible.push({ id: 'master', title: 'Excel Master 🏆', isMaster: true });
    }

    return eligible;
  },

  /**
   * Sertifikat kartochkasi (ro'yxatdagi mini-preview)
   */
  _renderCertCard(cert) {
    const issuedDate = new Date(cert.issuedAt).toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const theme = this._theme(cert.courseId);

    return `
      <div class="cert-card">
        <div class="cert-preview" style="background: ${theme.previewBg};">
          <div class="cert-preview-content">
            <div class="cert-preview-icon"><i class="fas ${theme.icon}"></i></div>
            <div class="cert-preview-title">${theme.label}</div>
          </div>
        </div>
        <div class="cert-card-body">
          <h3 class="cert-card-title">${cert.courseTitle || cert.courseId}</h3>
          <div class="cert-card-meta">
            <div style="margin-bottom: 4px;"><i class="fas fa-calendar"></i> ${issuedDate}</div>
            <div><i class="fas fa-hashtag"></i> ${cert.certId}</div>
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

  /**
   * Dizayn mavzusi: courseId bo'yicha rang/ikonka/nom
   */
  _theme(courseId) {
    if (courseId === 'pro') {
      return {
        label: 'PRO SERTIFIKAT',
        icon: 'fa-crown',
        previewBg: 'linear-gradient(135deg, #2b1a4d 0%, #6c3ce0 60%, #9b5cf5 100%)',
        accent: '#9b5cf5',
        accentDark: '#6c3ce0',
        gold: '#f7b500',
        formulaTag: '=PRO.STUDENT()'
      };
    }
    if (courseId === 'master') {
      return {
        label: 'EXCEL MASTER',
        icon: 'fa-trophy',
        previewBg: 'linear-gradient(135deg, #145c34 0%, #217346 35%, #6c3ce0 70%, #f7b500 100%)',
        accent: '#f7b500',
        accentDark: '#217346',
        gold: '#f7b500',
        formulaTag: '=MASTER("FOUNDATION","PRO")'
      };
    }
    // foundation (default)
    return {
      label: 'FOUNDATION SERTIFIKAT',
      icon: 'fa-table-cells',
      previewBg: 'linear-gradient(135deg, #217346 0%, #36a35a 100%)',
      accent: '#217346',
      accentDark: '#145c34',
      gold: '#f7b500',
      formulaTag: '=STUDENT.NAME()'
    };
  },

  /* ============================================================
   * ISM-FAMILIYA-SHARIF SO'RASH MODALI
   * Sertifikat yasashdan oldin to'liq F.I.Sh. so'raydi
   * ============================================================ */
  _promptFullName(defaultName = '') {
    return new Promise((resolve) => {
      const parts = (defaultName || '').split(' ');
      const overlay = document.createElement('div');
      overlay.className = 'cert-name-modal-overlay';
      overlay.innerHTML = `
        <div class="cert-name-modal">
          <div class="cert-name-modal-head">
            <i class="fas fa-id-card"></i>
            <h3>Sertifikat uchun F.I.Sh.</h3>
            <p>Sertifikatda chop etiladigan to'liq ismingizni kiriting</p>
          </div>
          <div class="cert-name-modal-body">
            <label>Familiya
              <input type="text" id="certFamiliya" placeholder="Masalan: Karimov" value="${parts[0] || ''}">
            </label>
            <label>Ism
              <input type="text" id="certIsm" placeholder="Masalan: Sherzod" value="${parts[1] || ''}">
            </label>
            <label>Sharifi / Otasining ismi
              <input type="text" id="certSharif" placeholder="Masalan: Bahodir o'g'li" value="${parts[2] || ''}">
            </label>
            <div class="cert-name-error" id="certNameError" style="display:none;">
              Iltimos, Familiya va Ismni kiriting
            </div>
          </div>
          <div class="cert-name-modal-actions">
            <button class="btn btn-outline-green" id="certNameCancel">Bekor qilish</button>
            <button class="btn btn-green" id="certNameOk"><i class="fas fa-check"></i> Tasdiqlash</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      setTimeout(() => overlay.classList.add('show'), 10);

      const close = (result) => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 200);
        resolve(result);
      };

      overlay.querySelector('#certNameCancel').onclick = () => close(null);
      overlay.querySelector('.cert-name-modal-overlay')?.addEventListener?.('click', () => {});
      overlay.addEventListener('click', (e) => { if (e.target === overlay) close(null); });

      overlay.querySelector('#certNameOk').onclick = () => {
        const fam = overlay.querySelector('#certFamiliya').value.trim();
        const ism = overlay.querySelector('#certIsm').value.trim();
        const sharif = overlay.querySelector('#certSharif').value.trim();
        if (!fam || !ism) {
          overlay.querySelector('#certNameError').style.display = 'block';
          return;
        }
        const fullName = [fam, ism, sharif].filter(Boolean).join(' ');
        close(fullName);
      };

      overlay.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') overlay.querySelector('#certNameOk').click();
        });
      });
      overlay.querySelector('#certFamiliya').focus();
    });
  },

  /**
   * Sertifikat berish (oddiy kurs: foundation yoki pro)
   */
  async issue(courseId) {
    if (!Auth.isLoggedIn()) {
      App.showToast('Tizimga kiring', 'warning');
      return;
    }

    const user = Auth.currentUser;

    // MASTER sertifikat alohida oqim
    if (courseId === 'master') {
      return this._issueMaster();
    }

    const course = await Courses.loadCourse(courseId);
    if (!course) {
      App.showToast('Kurs topilmadi', 'error');
      return;
    }

    // 1) Avval F.I.Sh. so'raymiz
    const fullName = await this._promptFullName(Auth.getDisplayName(user));
    if (!fullName) return; // bekor qilindi

    // 2) Tasdiqlash
    if (!confirm(`"${course.title}" kursi uchun "${fullName}" nomiga sertifikat olishni xohlaysizmi?`)) {
      return;
    }

    App.showToast('Sertifikat tayyorlanmoqda...', 'info');

    try {
      const certData = {
        userName: fullName,
        userEmail: user.email,
        courseId: courseId,
        courseTitle: course.title,
        courseLevel: course.id === 'foundation' ? 'Foundation' : 'Professional',
        lessonsCount: course.lessons_count
      };

      const result = await FB.saveCertificate(user.uid, courseId, certData);

      if (result.success) {
        App.showToast('🎉 Sertifikat muvaffaqiyatli berildi!', 'success');
        setTimeout(() => { this.view(result.certificate.certId); }, 1000);
      } else {
        App.showToast('Xatolik: ' + result.error, 'error');
      }
    } catch (error) {
      App.showToast('Xatolik: ' + error.message, 'error');
    }
  },

  /**
   * MASTER sertifikat berish (Foundation + PRO ikkalasi tugatilgan)
   */
  async _issueMaster() {
    const user = Auth.currentUser;

    const allCerts = await FB.getCertificates(user.uid);
    const foundationCert = allCerts.find(c => c.courseId === 'foundation');
    const proCert = allCerts.find(c => c.courseId === 'pro');

    if (!foundationCert || !proCert) {
      App.showToast('Avval Foundation va PRO sertifikatlarini oling', 'warning');
      return;
    }

    const fullName = await this._promptFullName(foundationCert.userName || proCert.userName || Auth.getDisplayName(user));
    if (!fullName) return;

    if (!confirm(`"${fullName}" nomiga EXCEL MASTER sertifikatini berishni xohlaysizmi?`)) return;

    App.showToast('Sertifikat tayyorlanmoqda...', 'info');

    try {
      const certData = {
        userName: fullName,
        userEmail: user.email,
        courseId: 'master',
        courseTitle: 'Excel Foundation + PRO',
        courseLevel: 'Master',
        lessonsCount: (foundationCert.lessonsCount || 0) + (proCert.lessonsCount || 0),
        subCourses: [
          { title: foundationCert.courseTitle || 'Foundation', level: 'Foundation' },
          { title: proCert.courseTitle || 'PRO', level: 'Professional' }
        ]
      };

      const result = await FB.saveCertificate(user.uid, 'master', certData);

      if (result.success) {
        App.showToast('🏆 EXCEL MASTER sertifikati berildi!', 'success');
        setTimeout(() => { this.view(result.certificate.certId); }, 1000);
      } else {
        App.showToast('Xatolik: ' + result.error, 'error');
      }
    } catch (error) {
      App.showToast('Xatolik: ' + error.message, 'error');
    }
  },

  /**
   * Sertifikatni ko'rish (to'liq)
   */
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

      ${this._certStyles()}
    `;
  },

  /**
   * To'liq sertifikat (chop etish uchun) — courseId bo'yicha 3 dizaynning birini chiqaradi
   */
  _renderFullCertificate(cert) {
    const issuedDate = new Date(cert.issuedAt).toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const qrData = `https://excel-academy.uz/verify/${cert.certId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;
    const theme = this._theme(cert.courseId);
    const colLetters = ['A','B','C','D','E','F','G','H'];

    // Spreadsheet-grid watermark (column harflar qatori)
    const gridHeader = `
      <div class="cert-grid-row">
        <div class="cert-grid-corner"></div>
        ${colLetters.map(c => `<div class="cert-grid-col">${c}</div>`).join('')}
      </div>`;

    // MASTER uchun — ikki kursni "spreadsheet" jadval ko'rinishida ko'rsatish
    const subCoursesTable = (cert.courseId === 'master' && cert.subCourses) ? `
      <table class="cert-mini-table">
        <thead><tr><th>#</th><th>Kurs</th><th>Daraja</th><th>Holat</th></tr></thead>
        <tbody>
          ${cert.subCourses.map((s, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${s.title}</td>
              <td>${s.level}</td>
              <td><i class="fas fa-circle-check" style="color:#36a35a;"></i> Tugatildi</td>
            </tr>`).join('')}
        </tbody>
      </table>
    ` : '';

    return `
      <div class="cert-full cert-theme-${cert.courseId || 'foundation'}" id="cert-full-${cert.certId}">
        ${gridHeader}

        <div class="cert-full-header">
          <div class="cert-full-logo"><i class="fas ${theme.icon}"></i></div>
          <div class="cert-full-platform">Excel Academy Platform</div>
          <h1 class="cert-full-title">${theme.label}</h1>
          <p class="cert-full-subtitle">of Achievement &amp; Completion</p>
        </div>

        <div style="margin: 28px 0;">
          <p class="cert-line-label">Quyidagi shaxsga beriladi</p>

          <div class="cert-formula-bar">${theme.formulaTag}</div>
          <div class="cert-name-cell">
            <span>${cert.userName}</span>
          </div>

          <p class="cert-line-label" style="margin-top:18px;">muvaffaqiyatli tugatgani uchun</p>
          <div class="cert-full-course">${cert.courseTitle}</div>

          ${subCoursesTable}

          <div class="cert-stat-row">
            <div class="cert-stat"><i class="fas fa-book"></i> ${cert.lessonsCount || 0} dars</div>
            <div class="cert-stat"><i class="fas fa-square-check"></i> Barcha testlar</div>
            <div class="cert-stat"><i class="fas fa-table-cells"></i> Amaliy mashqlar</div>
          </div>
        </div>

        <div class="cert-full-footer">
          <div class="cert-full-footer-item">
            <div>${I18n.t('cert_issued')}</div>
            <strong>${issuedDate}</strong>
          </div>
          <div class="cert-full-qr">
            <img src="${qrUrl}" alt="QR Code" style="width:100%;height:100%;object-fit:contain;">
          </div>
          <div class="cert-full-footer-item">
            <div>${I18n.t('cert_id')}</div>
            <strong>${cert.certId}</strong>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 3 dizaynga oid CSS (Excel-mavzuli: rang, ikonka, jadval, formula bar)
   */
  _certStyles() {
    return `
      <style>
        .cert-full {
          position: relative;
          max-width: 920px;
          margin: 0 auto;
          background: #fff;
          padding: 56px 48px 40px;
          overflow: hidden;
          border-radius: 4px;
        }

        /* ---- Spreadsheet grid watermark (ustun harflari) ---- */
        .cert-grid-row { display: flex; gap: 2px; margin-bottom: 18px; opacity: .55; }
        .cert-grid-corner, .cert-grid-col {
          flex: 1; height: 22px; display:flex; align-items:center; justify-content:center;
          font-family: 'Segoe UI', sans-serif; font-size: 11px; font-weight: 700;
          background: #f0f2f1; color: #6b7280; border: 1px solid #dfe3e1;
        }
        .cert-grid-corner { max-width: 28px; flex: 0 0 28px; background:#e3e7e5; }

        .cert-full-header { text-align:center; }
        .cert-full-logo { font-size: 50px; margin-bottom: 8px; }
        .cert-full-platform { font-size:13px; letter-spacing:3px; font-weight:700; text-transform:uppercase; color:#6b7280; }
        .cert-full-title { font-size: 38px; font-weight:900; letter-spacing:2px; margin:14px 0 4px; }
        .cert-full-subtitle { font-size:13px; color:#6b7280; }

        .cert-line-label { text-align:center; color:#6b7280; font-size:13px; margin-bottom:6px; }

        .cert-formula-bar {
          width: fit-content; margin: 0 auto 6px; padding: 4px 14px;
          font-family: 'Consolas', monospace; font-size: 12px; border-radius: 3px;
          background: #f0f2f1; color: #36a35a; border: 1px solid #d8dcda;
        }
        .cert-name-cell {
          width: fit-content; margin: 0 auto; position: relative;
          padding: 10px 36px; min-width: 380px; text-align:center;
        }
        .cert-name-cell span {
          font-size: 34px; font-weight: 800; font-style: italic; color:#1a1a1a;
        }
        .cert-name-cell::before {
          content:''; position:absolute; inset:0; border: 2.5px solid; pointer-events:none;
        }
        .cert-name-cell::after {
          content:''; position:absolute; right:-4px; bottom:-4px; width:9px; height:9px;
        }

        .cert-full-course { text-align:center; font-size:22px; font-weight:700; margin: 16px 0 8px; }

        .cert-mini-table {
          width: 100%; max-width: 560px; margin: 18px auto; border-collapse: collapse; font-size: 13px;
        }
        .cert-mini-table th, .cert-mini-table td {
          border: 1px solid #dfe3e1; padding: 8px 10px; text-align: left;
        }
        .cert-mini-table th { background: #f0f2f1; font-weight: 700; color:#374151; }

        .cert-stat-row { display:flex; justify-content:center; gap:22px; margin-top:18px; flex-wrap:wrap; }
        .cert-stat { font-size:13px; color:#374151; display:flex; align-items:center; gap:6px; }

        .cert-full-footer {
          display:flex; justify-content:space-between; align-items:flex-end; margin-top:40px;
          font-size:13px; color:#6b7280; border-top: 1px dashed #d8dcda; padding-top: 18px;
        }
        .cert-full-footer-item { text-align:center; }
        .cert-full-footer-item strong { display:block; color:#1a1a1a; font-size:14px; margin-top:4px; }
        .cert-full-qr { width:90px; height:90px; }

        /* ===== FOUNDATION ===== */
        .cert-theme-foundation { border: 10px solid #217346; }
        .cert-theme-foundation .cert-full-title,
        .cert-theme-foundation .cert-full-course { color: #217346; }
        .cert-theme-foundation .cert-name-cell::before { border-color: #217346; }
        .cert-theme-foundation .cert-name-cell::after { background:#217346; }
        .cert-theme-foundation .cert-full-logo { color:#217346; }

        /* ===== PRO ===== */
        .cert-theme-pro { border: 10px solid #6c3ce0; background: linear-gradient(180deg,#fbf9ff 0%, #fff 18%); }
        .cert-theme-pro .cert-full-title,
        .cert-theme-pro .cert-full-course { color: #6c3ce0; }
        .cert-theme-pro .cert-name-cell::before { border-color: #f7b500; }
        .cert-theme-pro .cert-name-cell::after { background:#f7b500; }
        .cert-theme-pro .cert-full-logo { color:#f7b500; }
        .cert-theme-pro .cert-formula-bar { color:#6c3ce0; }

        /* ===== MASTER ===== */
        .cert-theme-master {
          border: 10px double #f7b500;
          background: linear-gradient(180deg, #fffaf0 0%, #fff 22%);
        }
        .cert-theme-master .cert-full-title { color:#b9860b; }
        .cert-theme-master .cert-full-course { color: #217346; }
        .cert-theme-master .cert-name-cell::before { border-color: #217346; box-shadow: 0 0 0 4px rgba(108,60,224,.15); }
        .cert-theme-master .cert-name-cell::after { background:#f7b500; }
        .cert-theme-master .cert-full-logo { color:#f7b500; }
        .cert-theme-master .cert-formula-bar { color:#b9860b; }

        @media print {
          body * { visibility:hidden; }
          .cert-full, .cert-full * { visibility:visible; }
          .cert-full { position:absolute; left:0; top:0; width:100%; margin:0; box-shadow:none; }
          .header, .page-header, .footer, .breadcrumb { display:none !important; }
        }

        /* ===== F.I.Sh. MODAL ===== */
        .cert-name-modal-overlay {
          position: fixed; inset:0; background: rgba(15,23,20,.55);
          display:flex; align-items:center; justify-content:center; z-index: 9999;
          opacity:0; transition: opacity .2s ease;
        }
        .cert-name-modal-overlay.show { opacity:1; }
        .cert-name-modal {
          background:#fff; width: 92%; max-width: 420px; border-radius: 10px;
          padding: 24px; box-shadow: 0 16px 50px rgba(0,0,0,.25);
          transform: translateY(8px); transition: transform .2s ease;
        }
        .cert-name-modal-overlay.show .cert-name-modal { transform: translateY(0); }
        .cert-name-modal-head { text-align:center; margin-bottom: 16px; }
        .cert-name-modal-head i { font-size: 30px; color:#217346; margin-bottom:8px; }
        .cert-name-modal-head h3 { margin: 4px 0; font-size: 18px; }
        .cert-name-modal-head p { font-size: 13px; color:#6b7280; margin:0; }
        .cert-name-modal-body label {
          display:block; font-size: 13px; font-weight:600; color:#374151; margin-bottom: 12px;
        }
        .cert-name-modal-body input {
          width:100%; margin-top:4px; padding: 10px 12px; border:1px solid #d8dcda;
          border-radius:6px; font-size:14px;
        }
        .cert-name-modal-body input:focus { outline: 2px solid #217346; border-color:#217346; }
        .cert-name-error { color:#dc2626; font-size:12px; margin-bottom:8px; }
        .cert-name-modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top: 8px; }
      </style>
    `;
  },

  /**
   * Sertifikatni yuklab olish (HTML — chop etish/PDF saqlash)
   */
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

  /**
   * HTML formatda yuklab olish — to'liq mustaqil sahifa (3 dizaynning birini ishlatadi)
   */
  _downloadAsHTML(cert) {
    const bodyHtml = this._renderFullCertificate(cert);
    const styles = this._certStyles();

    const html = `
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Sertifikat - ${cert.certId}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Segoe UI', sans-serif; background:#f5f5f5; padding:40px;
      display:flex; justify-content:center; align-items:center; min-height:100vh;
    }
    .print-btn {
      position:fixed; top:20px; right:20px; padding:12px 24px; background:#217346;
      color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:600;
    }
    @media print { .print-btn { display:none; } body { background:#fff; padding:0; } }
  </style>
  ${styles}
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ Chop etish / PDF saqlash</button>
  ${bodyHtml}
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
  },

  /**
   * Sertifikatni verify qilish (public link)
   */
  async verify(certId) {
    App.showToast(`Sertifikat ID: ${certId}`, 'info');
  }
};

console.log('🏆 Certificate modul yuklandi (3 dizayn: Foundation / PRO / Master)');