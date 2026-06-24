// ==========================================
// I18N.JS - Ko'p tillilik (UZ / RU / EN)
// ==========================================

window.I18n = {
  currentLang: 'uz',
  
  // Mavjud tillar
  availableLangs: ['uz', 'ru', 'en'],

  // ==================== TARJIMALAR ====================
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
      nav_simulator: "Simulyator",
      nav_admin: "Admin",

      // Hero
      hero_badge: "Excel kurslarini zamonaviy ko'rinishda o'rganing",
      hero_title_1: "Excel'ni",
      hero_title_highlight: "professional",
      hero_title_2: "darajada o'rganing",
      hero_desc: "Formulalar, Pivot Table, VLOOKUP, Dashboard va VBA — barchasi bitta platformada. Interaktiv darslar, real simulyator va sertifikatlar.",
      hero_btn_start: "Bepul boshlash",
      hero_btn_courses: "Kurslarni ko'rish",
      hero_stat_lessons: "Darslar",
      hero_stat_students: "O'quvchilar",
      hero_stat_courses: "Kurslar",
      hero_stat_certs: "Sertifikatlar",

      // Features
      features_title: "Nima uchun Excel Academy?",
      features_subtitle: "Eng yaxshi Excel o'quv platformasi",
      feature_1_title: "Interaktiv darslar",
      feature_1_desc: "Real Excel simulyatorida amaliy mashg'ulotlar",
      feature_2_title: "Bosqichma-bosqich",
      feature_2_desc: "Oson dan murakkabga, har bir mavzu tartibli",
      feature_3_title: "Quiz va testlar",
      feature_3_desc: "Har bir darsdan keyin bilim sinovi",
      feature_4_title: "Sertifikat",
      feature_4_desc: "Kursni tugatib, PDF sertifikat oling",
      feature_5_title: "Progress kuzatuvi",
      feature_5_desc: "Dashboard orqali natijalaringizni ko'ring",
      feature_6_title: "3 tilda",
      feature_6_desc: "O'zbek, Rus va Ingliz tillarida",

      // Courses
      courses_title: "Bizning kurslar",
      courses_subtitle: "Foundation dan Professional darajagacha",
      course_foundation_title: "Excel Foundation",
      course_foundation_desc: "Excel asoslari, formulalar, VLOOKUP, Pivot Table va Mini Dashboard",
      course_pro_title: "Excel PRO Automation",
      course_pro_desc: "Advanced formulalar, Dashboard PRO, VBA va ChatGPT bilan avtomatlashtirish",
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
      auth_password_placeholder: "Kamida 6 belgi",
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
      not_found_desc: "Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan",
      not_found_home: "Bosh sahifaga qaytish"
    },

    // ==================== RUSSIAN ====================
    ru: {
      // Nav
      nav_home: "Главная",
      nav_courses: "Курсы",
      nav_dashboard: "Кабинет",
      nav_certificates: "Сертификаты",
      nav_about: "О нас",
      nav_login: "Войти",
      nav_register: "Регистрация",
      nav_logout: "Выйти",
      nav_profile: "Профиль",
      nav_simulator: "Симулятор",
      nav_admin: "Админ",

      // Hero
      hero_badge: "Изучайте Excel в современном формате",
      hero_title_1: "Изучайте Excel",
      hero_title_highlight: "профессионально",
      hero_title_2: "до уровня эксперта",
      hero_desc: "Формулы, Pivot Table, VLOOKUP, Dashboard и VBA — всё на одной платформе. Интерактивные уроки, реальный симулятор и сертификаты.",
      hero_btn_start: "Начать бесплатно",
      hero_btn_courses: "Посмотреть курсы",
      hero_stat_lessons: "Уроков",
      hero_stat_students: "Студентов",
      hero_stat_courses: "Курсов",
      hero_stat_certs: "Сертификатов",

      // Features
      features_title: "Почему Excel Academy?",
      features_subtitle: "Лучшая платформа для изучения Excel",
      feature_1_title: "Интерактивные уроки",
      feature_1_desc: "Практика в реальном Excel симуляторе",
      feature_2_title: "Пошагово",
      feature_2_desc: "От простого к сложному, всё структурировано",
      feature_3_title: "Тесты и квизы",
      feature_3_desc: "Проверка знаний после каждого урока",
      feature_4_title: "Сертификат",
      feature_4_desc: "Получите PDF сертификат после курса",
      feature_5_title: "Отслеживание прогресса",
      feature_5_desc: "Смотрите свои результаты в Dashboard",
      feature_6_title: "3 языка",
      feature_6_desc: "Узбекский, Русский и Английский",

      // Courses
      courses_title: "Наши курсы",
      courses_subtitle: "От Foundation до Professional",
      course_foundation_title: "Excel Foundation",
      course_foundation_desc: "Основы Excel, формулы, VLOOKUP, Pivot Table и Mini Dashboard",
      course_pro_title: "Excel PRO Automation",
      course_pro_desc: "Продвинутые формулы, Dashboard PRO, VBA и автоматизация с ChatGPT",
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

      // Lessons
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
      lesson_locked_msg: "Этот урок закрыт. Ждите открытия от админа.",
      lesson_guest_msg: "Зарегистрируйтесь чтобы продолжить",

      // Quiz
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

      // Auth
      auth_login_title: "Вход в систему",
      auth_login_subtitle: "Войдите чтобы продолжить обучение",
      auth_register_title: "Регистрация",
      auth_register_subtitle: "Создайте аккаунт и начните учиться",
      auth_email: "Email",
      auth_password: "Пароль",
      auth_name: "Имя и фамилия",
      auth_email_placeholder: "email@example.com",
      auth_password_placeholder: "Минимум 6 символов",
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
      auth_reset_sent: "Письмо для восстановления отправлено",

      // Dashboard
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

      // Profile
      profile_title: "Настройки профиля",
      profile_personal: "Личные данные",
      profile_security: "Безопасность",
      profile_change_password: "Изменить пароль",
      profile_save: "Сохранить",

      // Certificate
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

      // Admin
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

      // Common
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

      // Footer
      footer_desc: "Изучайте Excel в современном формате",
      footer_company: "Компания",
      footer_resources: "Ресурсы",
      footer_legal: "Правовая информация",
      footer_about: "О нас",
      footer_contact: "Контакты",
      footer_privacy: "Конфиденциальность",
      footer_terms: "Условия",
      footer_copyright: "© 2025 Excel Academy. Все права защищены.",

      // 404
      not_found_title: "Страница не найдена",
      not_found_desc: "Запрошенная страница не существует или была перемещена",
      not_found_home: "На главную"
    },

    // ==================== ENGLISH ====================
    en: {
      // Nav
      nav_home: "Home",
      nav_courses: "Courses",
      nav_dashboard: "Dashboard",
      nav_certificates: "Certificates",
      nav_about: "About",
      nav_login: "Login",
      nav_register: "Sign Up",
      nav_logout: "Logout",
      nav_profile: "Profile",
      nav_simulator: "Simulator",
      nav_admin: "Admin",

      // Hero
      hero_badge: "Learn Excel in a modern way",
      hero_title_1: "Master Excel",
      hero_title_highlight: "professionally",
      hero_title_2: "like an expert",
      hero_desc: "Formulas, Pivot Tables, VLOOKUP, Dashboards, and VBA — all on one platform. Interactive lessons, real simulator, and certificates.",
      hero_btn_start: "Start Free",
      hero_btn_courses: "View Courses",
      hero_stat_lessons: "Lessons",
      hero_stat_students: "Students",
      hero_stat_courses: "Courses",
      hero_stat_certs: "Certificates",

      // Features
      features_title: "Why Excel Academy?",
      features_subtitle: "The best platform for learning Excel",
      feature_1_title: "Interactive lessons",
      feature_1_desc: "Practice in a real Excel simulator",
      feature_2_title: "Step by step",
      feature_2_desc: "From basics to advanced, all structured",
      feature_3_title: "Quizzes and tests",
      feature_3_desc: "Knowledge check after each lesson",
      feature_4_title: "Certificate",
      feature_4_desc: "Get a PDF certificate after the course",
      feature_5_title: "Progress tracking",
      feature_5_desc: "See your results in the Dashboard",
      feature_6_title: "3 languages",
      feature_6_desc: "Uzbek, Russian, and English",

      // Courses
      courses_title: "Our Courses",
      courses_subtitle: "From Foundation to Professional",
      course_foundation_title: "Excel Foundation",
      course_foundation_desc: "Excel basics, formulas, VLOOKUP, Pivot Tables and Mini Dashboard",
      course_pro_title: "Excel PRO Automation",
      course_pro_desc: "Advanced formulas, Dashboard PRO, VBA and ChatGPT automation",
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

      // Lessons
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
      lesson_locked_msg: "This lesson is locked. Wait for admin to unlock.",
      lesson_guest_msg: "Sign up to continue",

      // Quiz
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

      // Auth
      auth_login_title: "Login",
      auth_login_subtitle: "Sign in to continue learning",
      auth_register_title: "Sign Up",
      auth_register_subtitle: "Create an account and start learning",
      auth_email: "Email",
      auth_password: "Password",
      auth_name: "Full name",
      auth_email_placeholder: "email@example.com",
      auth_password_placeholder: "Min 6 characters",
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

      // Dashboard
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

      // Profile
      profile_title: "Profile settings",
      profile_personal: "Personal information",
      profile_security: "Security",
      profile_change_password: "Change password",
      profile_save: "Save",

      // Certificate
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

      // Admin
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

      // Common
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

      // Footer
      footer_desc: "Learn Excel in a modern way",
      footer_company: "Company",
      footer_resources: "Resources",
      footer_legal: "Legal",
      footer_about: "About us",
      footer_contact: "Contact",
      footer_privacy: "Privacy",
      footer_terms: "Terms",
      footer_copyright: "© 2025 Excel Academy. All rights reserved.",

      // 404
      not_found_title: "Page not found",
      not_found_desc: "The page you are looking for doesn't exist or has been moved",
      not_found_home: "Back to home"
    }
  },

  // ==================== METHODS ====================

  /**
   * I18n ni ishga tushirish
   */
  init() {
    // Saqlangan tilni olish
    const saved = localStorage.getItem('app_lang');
    if (saved && this.availableLangs.includes(saved)) {
      this.currentLang = saved;
    } else {
      // Brauzer tilini aniqlash
      const browserLang = (navigator.language || 'uz').split('-')[0];
      if (this.availableLangs.includes(browserLang)) {
        this.currentLang = browserLang;
      }
    }

    // HTML lang atributini yangilash
    document.documentElement.lang = this.currentLang;

    // Sahifani tarjima qilish
    this.updatePage();

    // Til indikatorini yangilash
    this.updateLangButton();

    // Lang dropdown event'lari
    this.setupLangDropdown();

    console.log(`🌍 I18n: ${this.currentLang.toUpperCase()}`);
  },

  /**
   * Tilni o'zgartirish
   */
  setLang(lang) {
    if (!this.availableLangs.includes(lang)) return;
    
    this.currentLang = lang;
    localStorage.setItem('app_lang', lang);
    document.documentElement.lang = lang;
    
    this.updatePage();
    this.updateLangButton();
    
    // Lang dropdown ni yopish
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.remove('show');

    // Faol til tugmasi
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    console.log(`🌍 Til o'zgartirildi: ${lang.toUpperCase()}`);

    // Routerni qayta render qilish (agar bor bo'lsa)
    if (window.Router && typeof Router.refresh === 'function') {
      Router.refresh();
    }
  },

  /**
   * Til dropdown ni almashtirish
   */
  toggle() {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  },

  /**
   * Tarjima olish
   */
  t(key, fallback = '') {
    const lang = this.translations[this.currentLang] || this.translations.uz;
    return lang[key] || fallback || key;
  },

  /**
   * Sahifadagi barcha tarjimalarni yangilash
   */
  updatePage() {
    // [data-i18n] atributli elementlar
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      el.textContent = translation;
    });

    // [data-i18n-placeholder] atributli elementlar
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });

    // [data-i18n-title] atributli elementlar
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });

    // [data-i18n-html] atributli elementlar (HTML bilan)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = this.t(key);
    });
  },

  /**
   * Til tugmasini yangilash
   */
  updateLangButton() {
    const btn = document.getElementById('lang-current');
    if (btn) btn.textContent = this.currentLang.toUpperCase();
  },

  /**
   * Til dropdown sozlash
   */
  setupLangDropdown() {
    // Til tugmalari
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = btn.dataset.lang;
        this.setLang(lang);
      });

      // Faol tilni belgilash
      if (btn.dataset.lang === this.currentLang) {
        btn.classList.add('active');
      }
    });

    // Tashqariga bosilsa dropdown yopiladi
    document.addEventListener('click', (e) => {
      const langWrap = document.getElementById('header-lang');
      const dropdown = document.getElementById('lang-dropdown');
      if (langWrap && dropdown && !langWrap.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  },

  /**
   * Joriy tilni olish
   */
  getCurrentLang() {
    return this.currentLang;
  },

  /**
   * Joriy til nomini olish
   */
  getCurrentLangName() {
    const names = {
      uz: "O'zbek",
      ru: "Русский",
      en: "English"
    };
    return names[this.currentLang];
  }
};

console.log('🌍 I18n modul yuklandi');