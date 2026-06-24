// ============================================
// Internationalization (i18n) Module
// ============================================

const I18n = {
    currentLang: 'uz',
    
    translations: {
        uz: {
            // Navigation
            nav_home: "Bosh sahifa",
            nav_courses: "Kurslar",
            nav_dashboard: "Dashboard",
            nav_admin: "Admin",
            
            // Auth
            login: "Kirish",
            register: "Ro'yxatdan o'tish",
            logout: "Chiqish",
            profile: "Profil",
            email: "Email",
            password: "Parol",
            name: "Ism",
            forgot_password: "Parolni unutdingizmi?",
            login_title: "Hisobga kirish",
            login_subtitle: "Excel Academy ga xush kelibsiz",
            register_title: "Ro'yxatdan o'tish",
            register_subtitle: "Yangi hisob yarating",
            no_account: "Hisobingiz yo'qmi?",
            have_account: "Hisobingiz bormi?",
            reset_password: "Parolni tiklash",
            reset_sent: "Parol tiklash havolasi emailga yuborildi",
            
            // Home
            hero_badge: "📊 Excel bo'yicha #1 platforma",
            hero_title: "Excelni Professional Darajada O'rganing",
            hero_description: "Boshlang'ichdan ilg'or darajagacha — interaktiv darslar, real loyihalar va sertifikat bilan.",
            hero_btn_start: "Boshlash",
            hero_btn_courses: "Kurslarni ko'rish",
            stat_courses: "Kurslar",
            stat_lessons: "Darslar",
            stat_students: "O'quvchilar",
            
            // Features
            features_title: "Nima uchun Excel Academy?",
            features_subtitle: "Zamonaviy o'quv tizimi bilan Excelni tez va samarali o'rganing",
            feature_interactive: "Interaktiv darslar",
            feature_interactive_desc: "Excel simulyatorida amaliy mashqlar bilan o'rganing",
            feature_progress: "Progressni kuzatish",
            feature_progress_desc: "Dashboard orqali o'z natijalaringizni real vaqtda kuzating",
            feature_certificate: "Sertifikat",
            feature_certificate_desc: "Kursni tugatib, rasmiy sertifikat oling",
            feature_quiz: "Quiz va testlar",
            feature_quiz_desc: "Har bir darsdan keyin bilimingizni tekshiring",
            
            // Courses
            courses_title: "Barcha Kurslar",
            courses_subtitle: "O'zingizga mos kursni tanlang",
            foundation_title: "Excel Foundation",
            foundation_desc: "Excel asoslari — interfeys, formulalar, jadvallar va dashboardlar",
            pro_title: "Excel PRO Automation",
            pro_desc: "Ilg'or formulalar, avtomatlashtirish, VBA va ChatGPT integratsiyasi",
            lessons_count: "darslar",
            level_beginner: "Boshlang'ich",
            level_advanced: "Ilg'or",
            start_learning: "O'rganishni boshlash",
            continue_learning: "Davom ettirish",
            
            // Lesson
            lesson: "Dars",
            day: "Kun",
            topics: "Mavzular",
            shortcuts: "Shortcutlar",
            table_example: "Jadval misoli",
            formula_example: "Formula misoli",
            prev_lesson: "Oldingi dars",
            next_lesson: "Keyingi dars",
            complete_lesson: "Darsni tugatish",
            lesson_completed: "Dars tugallandi!",
            lesson_locked: "Bu dars qulflangan",
            lesson_locked_desc: "Bu darsni ochish uchun admin bilan bog'laning",
            
            // Quiz
            quiz_title: "Quiz",
            quiz_question: "Savol",
            quiz_submit: "Javobni tekshirish",
            quiz_next: "Keyingi savol",
            quiz_finish: "Tugatish",
            quiz_result: "Natija",
            quiz_correct: "To'g'ri",
            quiz_incorrect: "Noto'g'ri",
            quiz_pass: "Tabriklaymiz! Siz quizdan o'tdingiz!",
            quiz_fail: "Afsuski, qayta urinib ko'ring",
            quiz_retry: "Qayta topshirish",
            quiz_score: "Ball",
            
            // Dashboard
            dashboard_title: "Dashboard",
            dashboard_welcome: "Xush kelibsiz",
            total_progress: "Umumiy progress",
            completed_lessons: "Tugallangan darslar",
            quiz_results: "Quiz natijalari",
            last_activity: "Oxirgi faoliyat",
            certificate_status: "Sertifikat holati",
            not_started: "Boshlanmagan",
            in_progress: "Jarayonda",
            completed: "Tugallangan",
            
            // Certificate
            certificate: "Sertifikat",
            cert_title: "SERTIFIKAT",
            cert_heading: "MUVAFFAQIYAT SERTIFIKATI",
            cert_presented: "Ushbu sertifikat beriladi:",
            cert_desc: "Excel Academy platformasida Excel Foundation va Excel PRO Automation kurslarini muvaffaqiyatli tugatgani uchun",
            cert_date: "Sana",
            cert_id: "Sertifikat ID",
            cert_download: "PDF yuklash",
            cert_locked_title: "Sertifikat hali tayyor emas",
            cert_locked_desc: "Sertifikat olish uchun quyidagi talablarni bajaring:",
            cert_req_foundation: "Foundation kursini tugatish",
            cert_req_pro: "PRO kursini tugatish",
            cert_req_quiz: "Barcha quizlarni topshirish",
            
            // Admin
            admin_dashboard: "Boshqaruv paneli",
            admin_users: "Foydalanuvchilar",
            admin_admins: "Adminlar",
            admin_courses: "Kurslar",
            admin_lessons: "Darslar",
            admin_progress: "Progress",
            admin_certificates: "Sertifikatlar",
            admin_total_users: "Jami foydalanuvchilar",
            admin_total_admins: "Jami adminlar",
            admin_active_students: "Faol o'quvchilar",
            admin_certificates_issued: "Berilgan sertifikatlar",
            admin_open_lessons: "Darslarni ochish",
            admin_user_progress: "Foydalanuvchi progressi",
            admin_make_admin: "Admin qilish",
            admin_remove_admin: "Adminlikni olib tashlash",
            admin_delete: "O'chirish",
            admin_save: "Saqlash",
            admin_cancel: "Bekor qilish",
            
            // General
            loading: "Yuklanmoqda...",
            error: "Xatolik yuz berdi",
            success: "Muvaffaqiyatli",
            save: "Saqlash",
            cancel: "Bekor qilish",
            delete: "O'chirish",
            edit: "Tahrirlash",
            close: "Yopish",
            search: "Qidirish",
            filter: "Filter",
            all: "Barchasi",
            guest: "Mehmon",
            of: "dan"
        },
        
        ru: {
            nav_home: "Главная",
            nav_courses: "Курсы",
            nav_dashboard: "Панель",
            nav_admin: "Админ",
            
            login: "Войти",
            register: "Регистрация",
            logout: "Выйти",
            profile: "Профиль",
            email: "Email",
            password: "Пароль",
            name: "Имя",
            forgot_password: "Забыли пароль?",
            login_title: "Вход в аккаунт",
            login_subtitle: "Добро пожаловать в Excel Academy",
            register_title: "Регистрация",
            register_subtitle: "Создайте новый аккаунт",
            no_account: "Нет аккаунта?",
            have_account: "Есть аккаунт?",
            reset_password: "Сбросить пароль",
            reset_sent: "Ссылка для сброса отправлена на email",
            
            hero_badge: "📊 Платформа #1 по Excel",
            hero_title: "Изучайте Excel на профессиональном уровне",
            hero_description: "От начального до продвинутого уровня — интерактивные уроки, реальные проекты и сертификат.",
            hero_btn_start: "Начать",
            hero_btn_courses: "Смотреть курсы",
            stat_courses: "Курсов",
            stat_lessons: "Уроков",
            stat_students: "Студентов",
            
            features_title: "Почему Excel Academy?",
            features_subtitle: "Изучайте Excel быстро и эффективно с современной системой обучения",
            feature_interactive: "Интерактивные уроки",
            feature_interactive_desc: "Учитесь с практическими упражнениями в симуляторе Excel",
            feature_progress: "Отслеживание прогресса",
            feature_progress_desc: "Следите за результатами в реальном времени через Dashboard",
            feature_certificate: "Сертификат",
            feature_certificate_desc: "Завершите курс и получите официальный сертификат",
            feature_quiz: "Тесты и квизы",
            feature_quiz_desc: "Проверяйте знания после каждого урока",
            
            courses_title: "Все курсы",
            courses_subtitle: "Выберите подходящий курс",
            foundation_title: "Excel Foundation",
            foundation_desc: "Основы Excel — интерфейс, формулы, таблицы и дашборды",
            pro_title: "Excel PRO Automation",
            pro_desc: "Продвинутые формулы, автоматизация, VBA и интеграция с ChatGPT",
            lessons_count: "уроков",
            level_beginner: "Начальный",
            level_advanced: "Продвинутый",
            start_learning: "Начать обучение",
            continue_learning: "Продолжить",
            
            lesson: "Урок",
            day: "День",
            topics: "Темы",
            shortcuts: "Горячие клавиши",
            table_example: "Пример таблицы",
            formula_example: "Пример формулы",
            prev_lesson: "Предыдущий урок",
            next_lesson: "Следующий урок",
            complete_lesson: "Завершить урок",
            lesson_completed: "Урок завершён!",
            lesson_locked: "Этот урок заблокирован",
            lesson_locked_desc: "Свяжитесь с администратором для открытия",
            
            quiz_title: "Тест",
            quiz_question: "Вопрос",
            quiz_submit: "Проверить",
            quiz_next: "Следующий",
            quiz_finish: "Завершить",
            quiz_result: "Результат",
            quiz_correct: "Правильно",
            quiz_incorrect: "Неправильно",
            quiz_pass: "Поздравляем! Вы прошли тест!",
            quiz_fail: "К сожалению, попробуйте ещё раз",
            quiz_retry: "Повторить",
            quiz_score: "Баллы",
            
            dashboard_title: "Панель управления",
            dashboard_welcome: "Добро пожаловать",
            total_progress: "Общий прогресс",
            completed_lessons: "Завершённые уроки",
            quiz_results: "Результаты тестов",
            last_activity: "Последняя активность",
            certificate_status: "Статус сертификата",
            not_started: "Не начат",
            in_progress: "В процессе",
            completed: "Завершён",
            
            certificate: "Сертификат",
            cert_title: "СЕРТИФИКАТ",
            cert_heading: "СЕРТИФИКАТ ДОСТИЖЕНИЯ",
            cert_presented: "Настоящий сертификат выдаётся:",
            cert_desc: "За успешное завершение курсов Excel Foundation и Excel PRO Automation на платформе Excel Academy",
            cert_date: "Дата",
            cert_id: "ID сертификата",
            cert_download: "Скачать PDF",
            cert_locked_title: "Сертификат ещё не готов",
            cert_locked_desc: "Для получения сертификата выполните требования:",
            cert_req_foundation: "Завершить курс Foundation",
            cert_req_pro: "Завершить курс PRO",
            cert_req_quiz: "Пройти все тесты",
            
            admin_dashboard: "Панель управления",
            admin_users: "Пользователи",
            admin_admins: "Администраторы",
            admin_courses: "Курсы",
            admin_lessons: "Уроки",
            admin_progress: "Прогресс",
            admin_certificates: "Сертификаты",
            admin_total_users: "Всего пользователей",
            admin_total_admins: "Всего админов",
            admin_active_students: "Активных студентов",
            admin_certificates_issued: "Выдано сертификатов",
            admin_open_lessons: "Открыть уроки",
            admin_user_progress: "Прогресс пользователя",
            admin_make_admin: "Сделать админом",
            admin_remove_admin: "Убрать админа",
            admin_delete: "Удалить",
            admin_save: "Сохранить",
            admin_cancel: "Отмена",
            
            loading: "Загрузка...",
            error: "Произошла ошибка",
            success: "Успешно",
            save: "Сохранить",
            cancel: "Отмена",
            delete: "Удалить",
            edit: "Редактировать",
            close: "Закрыть",
            search: "Поиск",
            filter: "Фильтр",
            all: "Все",
            guest: "Гость",
            of: "из"
        },
        
        en: {
            nav_home: "Home",
            nav_courses: "Courses",
            nav_dashboard: "Dashboard",
            nav_admin: "Admin",
            
            login: "Login",
            register: "Register",
            logout: "Logout",
            profile: "Profile",
            email: "Email",
            password: "Password",
            name: "Name",
            forgot_password: "Forgot password?",
            login_title: "Sign In",
            login_subtitle: "Welcome to Excel Academy",
            register_title: "Sign Up",
            register_subtitle: "Create a new account",
            no_account: "Don't have an account?",
            have_account: "Already have an account?",
            reset_password: "Reset Password",
            reset_sent: "Password reset link sent to your email",
            
            hero_badge: "📊 #1 Excel Learning Platform",
            hero_title: "Learn Excel at Professional Level",
            hero_description: "From beginner to advanced — interactive lessons, real projects and certification.",
            hero_btn_start: "Get Started",
            hero_btn_courses: "View Courses",
            stat_courses: "Courses",
            stat_lessons: "Lessons",
            stat_students: "Students",
            
            features_title: "Why Excel Academy?",
            features_subtitle: "Learn Excel quickly and effectively with modern learning system",
            feature_interactive: "Interactive Lessons",
            feature_interactive_desc: "Learn with hands-on exercises in Excel simulator",
            feature_progress: "Progress Tracking",
            feature_progress_desc: "Monitor your results in real-time through Dashboard",
            feature_certificate: "Certificate",
            feature_certificate_desc: "Complete the course and get official certificate",
            feature_quiz: "Quizzes & Tests",
            feature_quiz_desc: "Test your knowledge after each lesson",
            
            courses_title: "All Courses",
            courses_subtitle: "Choose the right course for you",
            foundation_title: "Excel Foundation",
            foundation_desc: "Excel basics — interface, formulas, tables and dashboards",
            pro_title: "Excel PRO Automation",
            pro_desc: "Advanced formulas, automation, VBA and ChatGPT integration",
            lessons_count: "lessons",
            level_beginner: "Beginner",
            level_advanced: "Advanced",
            start_learning: "Start Learning",
            continue_learning: "Continue",
            
            lesson: "Lesson",
            day: "Day",
            topics: "Topics",
            shortcuts: "Shortcuts",
            table_example: "Table Example",
            formula_example: "Formula Example",
            prev_lesson: "Previous Lesson",
            next_lesson: "Next Lesson",
            complete_lesson: "Complete Lesson",
            lesson_completed: "Lesson Completed!",
            lesson_locked: "This lesson is locked",
            lesson_locked_desc: "Contact admin to unlock this lesson",
            
            quiz_title: "Quiz",
            quiz_question: "Question",
            quiz_submit: "Check Answer",
            quiz_next: "Next Question",
            quiz_finish: "Finish",
            quiz_result: "Result",
            quiz_correct: "Correct",
            quiz_incorrect: "Incorrect",
            quiz_pass: "Congratulations! You passed the quiz!",
            quiz_fail: "Unfortunately, try again",
            quiz_retry: "Retry",
            quiz_score: "Score",
            
            dashboard_title: "Dashboard",
            dashboard_welcome: "Welcome",
            total_progress: "Total Progress",
            completed_lessons: "Completed Lessons",
            quiz_results: "Quiz Results",
            last_activity: "Last Activity",
            certificate_status: "Certificate Status",
            not_started: "Not Started",
            in_progress: "In Progress",
            completed: "Completed",
            
            certificate: "Certificate",
            cert_title: "CERTIFICATE",
            cert_heading: "CERTIFICATE OF ACHIEVEMENT",
            cert_presented: "This certificate is presented to:",
            cert_desc: "For successfully completing Excel Foundation and Excel PRO Automation courses on Excel Academy platform",
            cert_date: "Date",
            cert_id: "Certificate ID",
            cert_download: "Download PDF",
            cert_locked_title: "Certificate not ready yet",
            cert_locked_desc: "Complete the following requirements to get your certificate:",
            cert_req_foundation: "Complete Foundation course",
            cert_req_pro: "Complete PRO course",
            cert_req_quiz: "Pass all quizzes",
            
            admin_dashboard: "Admin Dashboard",
            admin_users: "Users",
            admin_admins: "Admins",
            admin_courses: "Courses",
            admin_lessons: "Lessons",
            admin_progress: "Progress",
            admin_certificates: "Certificates",
            admin_total_users: "Total Users",
            admin_total_admins: "Total Admins",
            admin_active_students: "Active Students",
            admin_certificates_issued: "Certificates Issued",
            admin_open_lessons: "Open Lessons",
            admin_user_progress: "User Progress",
            admin_make_admin: "Make Admin",
            admin_remove_admin: "Remove Admin",
            admin_delete: "Delete",
            admin_save: "Save",
            admin_cancel: "Cancel",
            
            loading: "Loading...",
            error: "An error occurred",
            success: "Success",
            save: "Save",
            cancel: "Cancel",
            delete: "Delete",
            edit: "Edit",
            close: "Close",
            search: "Search",
            filter: "Filter",
            all: "All",
            guest: "Guest",
            of: "of"
        }
    },
    
    init() {
        const saved = localStorage.getItem('excel_academy_lang');
        if (saved && this.translations[saved]) {
            this.currentLang = saved;
        }
        this.updateUI();
    },
    
    setLang(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('excel_academy_lang', lang);
            this.updateUI();
            document.documentElement.lang = lang;
            
            // Update lang button text
            const langBtn = document.getElementById('current-lang');
            if (langBtn) langBtn.textContent = lang.toUpperCase();
            
            // Update active option
            document.querySelectorAll('.lang-option').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.lang === lang);
            });
            
            // Re-render current page
            if (window.Router) {
                Router.handleRoute();
            }
        }
    },
    
    t(key) {
        const trans = this.translations[this.currentLang];
        return trans && trans[key] ? trans[key] : key;
    },
    
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const text = this.t(key);
            if (text !== key) {
                el.textContent = text;
            }
        });
    }
};