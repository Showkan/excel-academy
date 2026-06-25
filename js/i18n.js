// ==========================================
// I18N.JS - Ko'p tillilik (UZ / RU / EN)
// ==========================================

window.I18n = {
  currentLang: 'uz',
  availableLangs: ['uz', 'ru', 'en'],

  translations: {
    
    // ==================== UZBEK ====================
    uz: {
      // Nav
      nav_home: "Bosh sahifa",
      nav_courses: "Kurslar",
      nav_dashboard: "Dashboard",
      nav_certificates: "Sertifikat",
      nav_about: "Biz haqimizda",
      nav_login: "Kirish",
      nav_register: "Ro'yxatdan o'tish",
      nav_logout: "Chiqish",
      nav_profile: "Profil",
      nav_sandbox: "Sandbox",
      nav_admin: "Admin",

      // Hero
      hero_badge: "Excel kurslarini zamonaviy ko'rinishda o'rganing",
      hero_title_1: "Excel'ni",
      hero_title_highlight: "professional",
      hero_title_2: "darajada o'rganing",
      hero_desc: "Formulalar, Pivot Table, VLOOKUP, Dashboard va VBA — barchasi bitta platformada.",
      hero_btn_start: "Bepul boshlash",
      hero_btn_courses: "Kurslarni ko'rish",
      hero_stat_lessons: "Darslar",
      hero_stat_students: "O'quvchilar",
      hero_stat_courses: "Kurslar",
      hero_stat_certs: "Sertifikatlar",

      // Features
      features_title: "Nima uchun Excel Academy?",
      features_subtitle: "Eng yaxshi Excel o'quv platformasi",

      // Courses
      courses_title: "Bizning kurslar",
      courses_subtitle: "Foundation dan Professional darajagacha",
      course_level_foundation: "Boshlang'ich",
      course_level_pro: "Professional",
      course_lessons: "darslar",
      course_hours: "soat",
      course_students: "o'quvchi",
      course_free: "Bepul",
      course_premium: "Premium",
      course_start: "Boshlash",
      course_continue: "Davom etish",
      course_view: "Ko'rish",
      course_locked: "Yopiq",

      // Lessons
      lesson_lesson: "Dars",
      lesson_day: "Kun",
      lesson_topics: "Mavzular",
      lesson_shortcuts: "Tezkor tugmalar",
      lesson_examples: "Misollar",
      lesson_formulas: "Formulalar",
      lesson_quiz: "Test",
      lesson_complete: "Bajarildi",
      lesson_next: "Keyingi",
      lesson_prev: "Oldingi",
      lesson_back_to_course: "Kursga qaytish",
      lesson_locked_msg: "Bu dars yopiq. Admin tomonidan ochilishini kuting.",
      lesson_guest_msg: "Davom etish uchun ro'yxatdan o'ting",

      // Quiz
      quiz_title: "Test",
      quiz_question: "Savol",
      quiz_of: "dan",
      quiz_next: "Keyingi savol",
      quiz_submit: "Tugatish",
      quiz_result_title: "Test natijasi",
      quiz_passed: "Tabriklaymiz! Siz testdan o'tdingiz",
      quiz_failed: "Afsuski, siz testdan o'ta olmadingiz",
      quiz_retake: "Qayta urinish",
      quiz_correct: "To'g'ri",
      quiz_wrong: "Noto'g'ri",
      quiz_score: "Ball",
      quiz_time: "Vaqt",
      quiz_select_answer: "Iltimos, javobni tanlang",

      // Auth
      auth_login_title: "Tizimga kirish",
      auth_login_subtitle: "Hisobingizga kirib darslarni davom ettiring",
      auth_register_title: "Ro'yxatdan o'tish",
      auth_register_subtitle: "Yangi hisob yarating va o'rganishni boshlang",
      auth_email: "Email",
      auth_password: "Parol",
      auth_name: "Ism va familiya",
      auth_email_placeholder: "email@example.com",
      auth_password_placeholder: "Kamida 8 belgi, harf+raqam",
      auth_name_placeholder: "Sizning ismingiz",
      auth_login_btn: "Kirish",
      auth_register_btn: "Ro'yxatdan o'tish",
      auth_forgot: "Parolni unutdingizmi?",
      auth_no_account: "Hisobingiz yo'qmi?",
      auth_have_account: "Hisobingiz bormi?",
      auth_register_link: "Ro'yxatdan o'ting",
      auth_login_link: "Kirish",
      auth_terms: "Ro'yxatdan o'tish orqali siz",
      auth_terms_link: "Foydalanish shartlari",
      auth_terms_accept: "ga rozilik bildirasiz",
      auth_logout_success: "Tizimdan chiqdingiz",
      auth_login_success: "Muvaffaqiyatli kirdingiz",
      auth_register_success: "Ro'yxatdan o'tdingiz!",
      auth_reset_sent: "Parolni tiklash uchun email yuborildi",

      // Dashboard
      dash_welcome: "Xush kelibsiz",
      dash_welcome_back: "Qaytib kelganingiz bilan",
      dash_progress: "Umumiy progress",
      dash_completed_lessons: "Tugatilgan darslar",
      dash_quiz_avg: "Quiz o'rtacha",
      dash_certificates: "Sertifikatlar",
      dash_my_courses: "Mening kurslarim",
      dash_recent_activity: "So'nggi faoliyat",
      dash_no_activity: "Hali faoliyat yo'q",
      dash_continue_learning: "O'rganishni davom ettirish",

      // Profile
      profile_title: "Profil sozlamalari",
      profile_personal: "Shaxsiy ma'lumotlar",
      profile_security: "Xavfsizlik",
      profile_change_password: "Parolni o'zgartirish",
      profile_save: "Saqlash",

      // Certificate
      cert_title: "Sertifikatlar",
      cert_subtitle: "Sizning yutuqlaringiz",
      cert_empty: "Hali sertifikat yo'q",
      cert_empty_desc: "Kursni tugatib sertifikat oling",
      cert_download: "Yuklab olish",
      cert_view: "Ko'rish",
      cert_issued: "Berilgan sana",
      cert_id: "Sertifikat ID",
      cert_certificate: "SERTIFIKAT",
      cert_awarded: "Quyidagi shaxsga beriladi",
      cert_completed: "muvaffaqiyatli tugatgani uchun",

      // Admin
      admin_title: "Admin Panel",
      admin_dashboard: "Dashboard",
      admin_users: "Foydalanuvchilar",
      admin_admins: "Adminlar",
      admin_courses: "Kurslar",
      admin_lessons: "Darslar",
      admin_progress: "Progress",
      admin_certificates: "Sertifikatlar",
      admin_total_users: "Jami foydalanuvchilar",
      admin_active_courses: "Faol kurslar",
      admin_completed_quizzes: "Tugatilgan testlar",
      admin_issued_certs: "Berilgan sertifikatlar",

      // Common
      common_loading: "Yuklanmoqda...",
      common_save: "Saqlash",
      common_cancel: "Bekor qilish",
      common_delete: "O'chirish",
      common_edit: "Tahrirlash",
      common_close: "Yopish",
      common_yes: "Ha",
      common_no: "Yo'q",
      common_confirm: "Tasdiqlash",
      common_search: "Qidirish...",
      common_filter: "Filter",
      common_sort: "Saralash",
      common_actions: "Amallar",
      common_status: "Holat",
      common_date: "Sana",
      common_error: "Xatolik yuz berdi",
      common_success: "Muvaffaqiyatli",
      common_warning: "Ogohlantirish",
      common_back: "Orqaga",
      common_next: "Keyingi",
      common_more: "Ko'proq",
      common_view_all: "Hammasini ko'rish",

      // Footer
      footer_desc: "Excel kurslarini zamonaviy ko'rinishda o'rganing",
      footer_company: "Kompaniya",
      footer_resources: "Resurslar",
      footer_legal: "Huquqiy",
      footer_about: "Biz haqimizda",
      footer_contact: "Bog'lanish",
      footer_privacy: "Maxfiylik",
      footer_terms: "Shartlar",
      footer_copyright: "© 2025 Excel Academy. Barcha huquqlar himoyalangan.",

      // 404
      not_found_title: "Sahifa topilmadi",
      not_found_desc: "Siz qidirayotgan sahifa mavjud emas",
      not_found_home: "Bosh sahifaga qaytish"
    },

    // ==================== RUSSIAN ====================
    ru: {
      nav_home: "Главная",
      nav_courses: "Курсы",
      nav_dashboard: "Кабинет",
      nav_certificates: "Сертификаты",
      nav_about: "О нас",
      nav_login: "Войти",
      nav_register: "Регистрация",
      nav_logout: "Выйти",
      nav_profile: "Профиль",
      nav_sandbox: "Песочница",
      nav_admin: "Админ",

      hero_badge: "Изучайте Excel в современном формате",
      hero_title_1: "Изучайте Excel",
      hero_title_highlight: "профессионально",
      hero_title_2: "до уровня эксперта",
      hero_desc: "Формулы, Pivot Table, VLOOKUP, Dashboard и VBA — всё на одной платформе.",
      hero_btn_start: "Начать бесплатно",
      hero_btn_courses: "Посмотреть курсы",
      hero_stat_lessons: "Уроков",
      hero_stat_students: "Студентов",
      hero_stat_courses: "Курсов",
      hero_stat_certs: "Сертификатов",

      features_title: "Почему Excel Academy?",
      features_subtitle: "Лучшая платформа для изучения Excel",

      courses_title: "Наши курсы",
      courses_subtitle: "От Foundation до Professional",
      course_level_foundation: "Начальный",
      course_level_pro: "Профессиональный",
      course_lessons: "уроков",
      course_hours: "часов",
      course_students: "студентов",
      course_free: "Бесплатно",
      course_premium: "Premium",
      course_start: "Начать",
      course_continue: "Продолжить",
      course_view: "Посмотреть",
      course_locked: "Закрыто",

      lesson_lesson: "Урок",
      lesson_day: "День",
      lesson_topics: "Темы",
      lesson_shortcuts: "Горячие клавиши",
      lesson_examples: "Примеры",
      lesson_formulas: "Формулы",
      lesson_quiz: "Тест",
      lesson_complete: "Завершено",
      lesson_next: "Следующий",
      lesson_prev: "Предыдущий",
      lesson_back_to_course: "Назад к курсу",
      lesson_locked_msg: "Этот урок закрыт.",
      lesson_guest_msg: "Зарегистрируйтесь чтобы продолжить",

      quiz_title: "Тест",
      quiz_question: "Вопрос",
      quiz_of: "из",
      quiz_next: "Следующий",
      quiz_submit: "Завершить",
      quiz_result_title: "Результат теста",
      quiz_passed: "Поздравляем! Вы прошли тест",
      quiz_failed: "К сожалению, тест не пройден",
      quiz_retake: "Попробовать снова",
      quiz_correct: "Правильно",
      quiz_wrong: "Неправильно",
      quiz_score: "Балл",
      quiz_time: "Время",
      quiz_select_answer: "Пожалуйста, выберите ответ",

      auth_login_title: "Вход в систему",
      auth_login_subtitle: "Войдите чтобы продолжить обучение",
      auth_register_title: "Регистрация",
      auth_register_subtitle: "Создайте аккаунт и начните учиться",
      auth_email: "Email",
      auth_password: "Пароль",
      auth_name: "Имя и фамилия",
      auth_email_placeholder: "email@example.com",
      auth_password_placeholder: "Минимум 8 символов",
      auth_name_placeholder: "Ваше имя",
      auth_login_btn: "Войти",
      auth_register_btn: "Зарегистрироваться",
      auth_forgot: "Забыли пароль?",
      auth_no_account: "Нет аккаунта?",
      auth_have_account: "Уже есть аккаунт?",
      auth_register_link: "Зарегистрироваться",
      auth_login_link: "Войти",
      auth_terms: "Регистрируясь, вы соглашаетесь с",
      auth_terms_link: "Условиями использования",
      auth_terms_accept: "",
      auth_logout_success: "Вы вышли из системы",
      auth_login_success: "Вход выполнен",
      auth_register_success: "Регистрация успешна!",
      auth_reset_sent: "Письмо отправлено",

      dash_welcome: "Добро пожаловать",
      dash_welcome_back: "С возвращением",
      dash_progress: "Общий прогресс",
      dash_completed_lessons: "Завершённые уроки",
      dash_quiz_avg: "Средний балл",
      dash_certificates: "Сертификаты",
      dash_my_courses: "Мои курсы",
      dash_recent_activity: "Последняя активность",
      dash_no_activity: "Активности пока нет",
      dash_continue_learning: "Продолжить обучение",

      profile_title: "Настройки профиля",
      profile_personal: "Личные данные",
      profile_security: "Безопасность",
      profile_change_password: "Изменить пароль",
      profile_save: "Сохранить",

      cert_title: "Сертификаты",
      cert_subtitle: "Ваши достижения",
      cert_empty: "Сертификатов пока нет",
      cert_empty_desc: "Завершите курс чтобы получить сертификат",
      cert_download: "Скачать",
      cert_view: "Посмотреть",
      cert_issued: "Дата выдачи",
      cert_id: "ID сертификата",
      cert_certificate: "СЕРТИФИКАТ",
      cert_awarded: "Выдан следующему лицу",
      cert_completed: "за успешное завершение",

      admin_title: "Админ Панель",
      admin_dashboard: "Дашборд",
      admin_users: "Пользователи",
      admin_admins: "Админы",
      admin_courses: "Курсы",
      admin_lessons: "Уроки",
      admin_progress: "Прогресс",
      admin_certificates: "Сертификаты",
      admin_total_users: "Всего пользователей",
      admin_active_courses: "Активных курсов",
      admin_completed_quizzes: "Завершённые тесты",
      admin_issued_certs: "Выданные сертификаты",

      common_loading: "Загрузка...",
      common_save: "Сохранить",
      common_cancel: "Отмена",
      common_delete: "Удалить",
      common_edit: "Изменить",
      common_close: "Закрыть",
      common_yes: "Да",
      common_no: "Нет",
      common_confirm: "Подтвердить",
      common_search: "Поиск...",
      common_filter: "Фильтр",
      common_sort: "Сортировка",
      common_actions: "Действия",
      common_status: "Статус",
      common_date: "Дата",
      common_error: "Произошла ошибка",
      common_success: "Успешно",
      common_warning: "Предупреждение",
      common_back: "Назад",
      common_next: "Далее",
      common_more: "Больше",
      common_view_all: "Посмотреть всё",

      footer_desc: "Изучайте Excel в современном формате",
      footer_company: "Компания",
      footer_resources: "Ресурсы",
      footer_legal: "Правовая информация",
      footer_about: "О нас",
      footer_contact: "Контакты",
      footer_privacy: "Конфиденциальность",
      footer_terms: "Условия",
      footer_copyright: "© 2025 Excel Academy. Все права защищены.",

      not_found_title: "Страница не найдена",
      not_found_desc: "Запрошенная страница не существует",
      not_found_home: "На главную"
    },

    // ==================== ENGLISH ====================
    en: {
      nav_home: "Home",
      nav_courses: "Courses",
      nav_dashboard: "Dashboard",
      nav_certificates: "Certificates",
      nav_about: "About",
      nav_login: "Login",
      nav_register: "Sign Up",
      nav_logout: "Logout",
      nav_profile: "Profile",
      nav_sandbox: "Sandbox",
      nav_admin: "Admin",

      hero_badge: "Learn Excel in a modern way",
      hero_title_1: "Master Excel",
      hero_title_highlight: "professionally",
      hero_title_2: "like an expert",
      hero_desc: "Formulas, Pivot Tables, VLOOKUP, Dashboards, and VBA — all on one platform.",
      hero_btn_start: "Start Free",
      hero_btn_courses: "View Courses",
      hero_stat_lessons: "Lessons",
      hero_stat_students: "Students",
      hero_stat_courses: "Courses",
      hero_stat_certs: "Certificates",

      features_title: "Why Excel Academy?",
      features_subtitle: "The best platform for learning Excel",

      courses_title: "Our Courses",
      courses_subtitle: "From Foundation to Professional",
      course_level_foundation: "Beginner",
      course_level_pro: "Professional",
      course_lessons: "lessons",
      course_hours: "hours",
      course_students: "students",
      course_free: "Free",
      course_premium: "Premium",
      course_start: "Start",
      course_continue: "Continue",
      course_view: "View",
      course_locked: "Locked",

      lesson_lesson: "Lesson",
      lesson_day: "Day",
      lesson_topics: "Topics",
      lesson_shortcuts: "Shortcuts",
      lesson_examples: "Examples",
      lesson_formulas: "Formulas",
      lesson_quiz: "Quiz",
      lesson_complete: "Completed",
      lesson_next: "Next",
      lesson_prev: "Previous",
      lesson_back_to_course: "Back to course",
      lesson_locked_msg: "This lesson is locked.",
      lesson_guest_msg: "Sign up to continue",

      quiz_title: "Quiz",
      quiz_question: "Question",
      quiz_of: "of",
      quiz_next: "Next",
      quiz_submit: "Submit",
      quiz_result_title: "Quiz Result",
      quiz_passed: "Congratulations! You passed",
      quiz_failed: "Sorry, you didn't pass",
      quiz_retake: "Retake",
      quiz_correct: "Correct",
      quiz_wrong: "Wrong",
      quiz_score: "Score",
      quiz_time: "Time",
      quiz_select_answer: "Please select an answer",

      auth_login_title: "Login",
      auth_login_subtitle: "Sign in to continue learning",
      auth_register_title: "Sign Up",
      auth_register_subtitle: "Create an account and start learning",
      auth_email: "Email",
      auth_password: "Password",
      auth_name: "Full name",
      auth_email_placeholder: "email@example.com",
      auth_password_placeholder: "Min 8 characters",
      auth_name_placeholder: "Your name",
      auth_login_btn: "Login",
      auth_register_btn: "Sign Up",
      auth_forgot: "Forgot password?",
      auth_no_account: "Don't have an account?",
      auth_have_account: "Already have an account?",
      auth_register_link: "Sign up",
      auth_login_link: "Login",
      auth_terms: "By signing up, you agree to our",
      auth_terms_link: "Terms of Service",
      auth_terms_accept: "",
      auth_logout_success: "Logged out successfully",
      auth_login_success: "Logged in successfully",
      auth_register_success: "Successfully registered!",
      auth_reset_sent: "Password reset email sent",

      dash_welcome: "Welcome",
      dash_welcome_back: "Welcome back",
      dash_progress: "Overall progress",
      dash_completed_lessons: "Completed lessons",
      dash_quiz_avg: "Quiz average",
      dash_certificates: "Certificates",
      dash_my_courses: "My courses",
      dash_recent_activity: "Recent activity",
      dash_no_activity: "No activity yet",
      dash_continue_learning: "Continue learning",

      profile_title: "Profile settings",
      profile_personal: "Personal information",
      profile_security: "Security",
      profile_change_password: "Change password",
      profile_save: "Save",

      cert_title: "Certificates",
      cert_subtitle: "Your achievements",
      cert_empty: "No certificates yet",
      cert_empty_desc: "Complete a course to get a certificate",
      cert_download: "Download",
      cert_view: "View",
      cert_issued: "Issued date",
      cert_id: "Certificate ID",
      cert_certificate: "CERTIFICATE",
      cert_awarded: "Awarded to",
      cert_completed: "for successfully completing",

      admin_title: "Admin Panel",
      admin_dashboard: "Dashboard",
      admin_users: "Users",
      admin_admins: "Admins",
      admin_courses: "Courses",
      admin_lessons: "Lessons",
      admin_progress: "Progress",
      admin_certificates: "Certificates",
      admin_total_users: "Total users",
      admin_active_courses: "Active courses",
      admin_completed_quizzes: "Completed quizzes",
      admin_issued_certs: "Issued certificates",

      common_loading: "Loading...",
      common_save: "Save",
      common_cancel: "Cancel",
      common_delete: "Delete",
      common_edit: "Edit",
      common_close: "Close",
      common_yes: "Yes",
      common_no: "No",
      common_confirm: "Confirm",
      common_search: "Search...",
      common_filter: "Filter",
      common_sort: "Sort",
      common_actions: "Actions",
      common_status: "Status",
      common_date: "Date",
      common_error: "An error occurred",
      common_success: "Success",
      common_warning: "Warning",
      common_back: "Back",
      common_next: "Next",
      common_more: "More",
      common_view_all: "View all",

      footer_desc: "Learn Excel in a modern way",
      footer_company: "Company",
      footer_resources: "Resources",
      footer_legal: "Legal",
      footer_about: "About us",
      footer_contact: "Contact",
      footer_privacy: "Privacy",
      footer_terms: "Terms",
      footer_copyright: "© 2025 Excel Academy. All rights reserved.",

      not_found_title: "Page not found",
      not_found_desc: "The page doesn't exist",
      not_found_home: "Back to home"
    }
  },

  // ==================== METHODS ====================

  init() {
    const saved = localStorage.getItem('app_lang');
    if (saved && this.availableLangs.includes(saved)) {
      this.currentLang = saved;
    } else {
      const browserLang = (navigator.language || 'uz').split('-')[0];
      if (this.availableLangs.includes(browserLang)) {
        this.currentLang = browserLang;
      }
    }

    document.documentElement.lang = this.currentLang;
    this.updatePage();
    this.updateLangButton();
    this.setupLangDropdown();

    console.log(`%c🌍 I18n: ${this.currentLang.toUpperCase()}`, 'color: #2b7de9; font-weight: bold;');
  },

  setLang(lang) {
    if (!this.availableLangs.includes(lang)) return;
    
    this.currentLang = lang;
    localStorage.setItem('app_lang', lang);
    document.documentElement.lang = lang;
    
    this.updatePage();
    this.updateLangButton();
    
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.remove('show');

    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    if (window.Router && typeof Router.refresh === 'function') {
      Router.refresh();
    }
  },

  toggle() {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.toggle('show');
  },

  t(key, fallback = '') {
    const lang = this.translations[this.currentLang] || this.translations.uz;
    return lang[key] || fallback || key;
  },

  updatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });
  },

  updateLangButton() {
    const btn = document.getElementById('lang-current');
    if (btn) btn.textContent = this.currentLang.toUpperCase();
  },

  setupLangDropdown() {
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setLang(btn.dataset.lang);
      });

      if (btn.dataset.lang === this.currentLang) {
        btn.classList.add('active');
      }
    });

    document.addEventListener('click', (e) => {
      const langWrap = document.getElementById('header-lang');
      const dropdown = document.getElementById('lang-dropdown');
      if (langWrap && dropdown && !langWrap.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  },

  getCurrentLang() {
    return this.currentLang;
  },

  getCurrentLangName() {
    const names = { uz: "O'zbek", ru: "Русский", en: "English" };
    return names[this.currentLang];
  }
};

console.log('%c🌍 I18n yuklandi', 'color: #2b7de9; font-weight: bold;');
