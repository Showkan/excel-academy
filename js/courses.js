// ============================================
// Courses Module
// ============================================

const Courses = {
    data: {
        foundation: {
            id: 'foundation',
            title_key: 'foundation_title',
            desc_key: 'foundation_desc',
            color: 'foundation',
            level_key: 'level_beginner',
            totalLessons: 8,
            lessons: [
                {
                    num: 1, day: 1,
                    title: { uz: "Excel Interface", ru: "Интерфейс Excel", en: "Excel Interface" },
                    desc: {
                        uz: "Excel interfeysi bilan tanishing — Ribbon, ustunlar, qatorlar, kataklar va asosiy tushunchalar",
                        ru: "Знакомство с интерфейсом Excel — Ribbon, столбцы, строки, ячейки и основные понятия",
                        en: "Introduction to Excel interface — Ribbon, columns, rows, cells and basic concepts"
                    },
                    topics: {
                        uz: ["Excel oynasini ochish", "Ribbon (lenta) tuzilishi", "Ustunlar va qatorlar", "Katak (Cell) nima?", "Sheet, Workbook tushunchalari", "Ma'lumot kiritish"],
                        ru: ["Открытие окна Excel", "Структура Ribbon", "Столбцы и строки", "Что такое ячейка?", "Понятия Sheet, Workbook", "Ввод данных"],
                        en: ["Opening Excel window", "Ribbon structure", "Columns and rows", "What is a Cell?", "Sheet, Workbook concepts", "Data entry"]
                    },
                    shortcuts: [
                        { keys: ["Ctrl", "N"], desc: { uz: "Yangi fayl", ru: "Новый файл", en: "New file" } },
                        { keys: ["Ctrl", "O"], desc: { uz: "Faylni ochish", ru: "Открыть файл", en: "Open file" } },
                        { keys: ["Ctrl", "S"], desc: { uz: "Saqlash", ru: "Сохранить", en: "Save" } },
                        { keys: ["Ctrl", "Z"], desc: { uz: "Bekor qilish", ru: "Отменить", en: "Undo" } }
                    ],
                    tableType: 'basic',
                    formulas: ["=A1+B1", "=SUM(A1:A10)"],
                    quiz: [
                        {
                            q: { uz: "Excel interfeysdagi asosiy panel qanday nomlanadi?", ru: "Как называется главная панель в Excel?", en: "What is the main panel in Excel called?" },
                            options: { uz: ["Ribbon", "Taskbar", "Menu", "Toolbar"], ru: ["Ribbon", "Taskbar", "Menu", "Toolbar"], en: ["Ribbon", "Taskbar", "Menu", "Toolbar"] },
                            correct: 0
                        },
                        {
                            q: { uz: "Excelda A1 nima?", ru: "Что такое A1 в Excel?", en: "What is A1 in Excel?" },
                            options: { uz: ["Katak manzili", "Formula", "Funksiya", "Sheet nomi"], ru: ["Адрес ячейки", "Формула", "Функция", "Имя листа"], en: ["Cell address", "Formula", "Function", "Sheet name"] },
                            correct: 0
                        },
                        {
                            q: { uz: "Ctrl+S nimaga ishlatiladi?", ru: "Для чего используется Ctrl+S?", en: "What is Ctrl+S used for?" },
                            options: { uz: ["Saqlash", "Tanlash", "Qidirish", "Yopish"], ru: ["Сохранить", "Выделить", "Найти", "Закрыть"], en: ["Save", "Select", "Find", "Close"] },
                            correct: 0
                        }
                    ]
                },
                {
                    num: 2, day: 2,
                    title: { uz: "Basic Formulas", ru: "Базовые формулы", en: "Basic Formulas" },
                    desc: {
                        uz: "SUM, AVERAGE, MIN, MAX — asosiy formulalar bilan ishlash",
                        ru: "SUM, AVERAGE, MIN, MAX — работа с основными формулами",
                        en: "SUM, AVERAGE, MIN, MAX — working with basic formulas"
                    },
                    topics: {
                        uz: ["SUM formulasi", "AVERAGE formulasi", "MIN va MAX", "COUNT va COUNTA", "Formulalar paneli", "Avtomatik hisoblash"],
                        ru: ["Формула SUM", "Формула AVERAGE", "MIN и MAX", "COUNT и COUNTA", "Панель формул", "Автоматический расчёт"],
                        en: ["SUM formula", "AVERAGE formula", "MIN and MAX", "COUNT and COUNTA", "Formula bar", "Auto-calculation"]
                    },
                    shortcuts: [
                        { keys: ["Alt", "="], desc: { uz: "AutoSum", ru: "AutoSum", en: "AutoSum" } },
                        { keys: ["F2"], desc: { uz: "Katakni tahrirlash", ru: "Редактировать ячейку", en: "Edit cell" } },
                        { keys: ["Tab"], desc: { uz: "Keyingi katak", ru: "Следующая ячейка", en: "Next cell" } }
                    ],
                    tableType: 'basic',
                    formulas: ["=SUM(B2:B10)", "=AVERAGE(C2:C10)", "=MAX(D2:D10)", "=MIN(D2:D10)", "=COUNT(A2:A10)"],
                    quiz: [
                        {
                            q: { uz: "=SUM(A1:A5) nima qiladi?", ru: "Что делает =SUM(A1:A5)?", en: "What does =SUM(A1:A5) do?" },
                            options: { uz: ["A1 dan A5 gacha yig'indi", "A1 dan A5 gacha o'rtacha", "A1 qiymatini ko'rsatadi", "A5 qiymatini ko'rsatadi"], ru: ["Сумма от A1 до A5", "Среднее от A1 до A5", "Показывает A1", "Показывает A5"], en: ["Sum from A1 to A5", "Average from A1 to A5", "Shows A1", "Shows A5"] },
                            correct: 0
                        },
                        {
                            q: { uz: "AVERAGE qaysi natijani beradi?", ru: "Какой результат даёт AVERAGE?", en: "What result does AVERAGE give?" },
                            options: { uz: ["O'rtacha qiymat", "Eng katta qiymat", "Eng kichik qiymat", "Yig'indi"], ru: ["Среднее", "Максимум", "Минимум", "Сумма"], en: ["Average", "Maximum", "Minimum", "Sum"] },
                            correct: 0
                        },
                        {
                            q: { uz: "Alt+= shortcuti nima qiladi?", ru: "Что делает Alt+=?", en: "What does Alt+= do?" },
                            options: { uz: ["AutoSum qo'yadi", "Nusxa oladi", "Faylni saqlaydi", "Formatni o'zgartiradi"], ru: ["Вставляет AutoSum", "Копирует", "Сохраняет", "Меняет формат"], en: ["Inserts AutoSum", "Copies", "Saves", "Changes format"] },
                            correct: 0
                        }
                    ]
                },
                {
                    num: 3, day: 3,
                    title: { uz: "IF Formula", ru: "Формула IF", en: "IF Formula" },
                    desc: {
                        uz: "IF, AND, OR funksiyalari bilan mantiqiy tekshiruvlar",
                        ru: "Логические проверки с функциями IF, AND, OR",
                        en: "Logical checks with IF, AND, OR functions"
                    },
                    topics: {
                        uz: ["IF funksiyasi sintaksisi", "Ichma-ich IF", "AND va OR operatorlari", "Nested IF", "IFERROR funksiyasi", "Amaliy misollar"],
                        ru: ["Синтаксис IF", "Вложенный IF", "AND и OR", "Nested IF", "IFERROR", "Практические примеры"],
                        en: ["IF syntax", "Nested IF", "AND and OR", "Nested IF", "IFERROR", "Practical examples"]
                    },
                    shortcuts: [
                        { keys: ["Ctrl", "Shift", "Enter"], desc: { uz: "Array formula", ru: "Формула массива", en: "Array formula" } }
                    ],
                    tableType: 'if_formula',
                    formulas: ['=IF(B2>=60,"O\'tdi","Yiqildi")', '=IF(AND(B2>=60,B2<=100),"Valid","Invalid")', '=IFERROR(A1/B1,"Xato")'],
                    quiz: [
                        {
                            q: { uz: 'IF(B2>60,"Ha","Yo\'q") — B2=75 bo\'lsa natija?', ru: 'IF(B2>60,"Да","Нет") — если B2=75?', en: 'IF(B2>60,"Yes","No") — if B2=75?' },
                            options: { uz: ["Ha", "Yo'q", "75", "Xato"], ru: ["Да", "Нет", "75", "Ошибка"], en: ["Yes", "No", "75", "Error"] },
                            correct: 0
                        },
                        {
                            q: { uz: "AND funksiyasi qachon TRUE qaytaradi?", ru: "Когда AND возвращает TRUE?", en: "When does AND return TRUE?" },
                            options: { uz: ["Barcha shartlar to'g'ri", "Bitta shart to'g'ri", "Hech biri to'g'ri emas", "Birinchi shart to'g'ri"], ru: ["Все условия верны", "Одно условие верно", "Ни одно не верно", "Первое верно"], en: ["All conditions true", "One condition true", "None true", "First true"] },
                            correct: 0
                        },
                        {
                            q: { uz: "IFERROR nima uchun ishlatiladi?", ru: "Для чего используется IFERROR?", en: "What is IFERROR used for?" },
                            options: { uz: ["Xatolikni ushlab boshqa qiymat berish", "Formulani tekshirish", "Katakni formatlash", "Ma'lumotni filtrlash"], ru: ["Перехват ошибки", "Проверка формулы", "Форматирование", "Фильтрация"], en: ["Catch error and return value", "Check formula", "Format cell", "Filter data"] },
                            correct: 0
                        }
                    ]
                },
                {
                    num: 4, day: 4,
                    title: { uz: "COUNTIF & SUMIF", ru: "COUNTIF и SUMIF", en: "COUNTIF & SUMIF" },
                    desc: {
                        uz: "Shartli sanash va yig'ish funksiyalari",
                        ru: "Условные функции подсчёта и суммирования",
                        en: "Conditional counting and summing functions"
                    },
                    topics: {
                        uz: ["COUNTIF funksiyasi", "SUMIF funksiyasi", "COUNTIFS (ko'p shart)", "SUMIFS (ko'p shart)", "Wildcard belgilar", "Amaliy loyiha"],
                        ru: ["Функция COUNTIF", "Функция SUMIF", "COUNTIFS", "SUMIFS", "Подстановочные знаки", "Практический проект"],
                        en: ["COUNTIF function", "SUMIF function", "COUNTIFS", "SUMIFS", "Wildcards", "Practical project"]
                    },
                    shortcuts: [
                        { keys: ["Ctrl", "Shift", "L"], desc: { uz: "Filter qo'yish", ru: "Добавить фильтр", en: "Add filter" } }
                    ],
                    tableType: 'countif',
                    formulas: ['=COUNTIF(B2:B10,"IT")', '=SUMIF(B2:B10,"IT",C2:C10)', '=COUNTIFS(B2:B10,"IT",C2:C10,">5000000")'],
                    quiz: [
                        {
                            q: { uz: '=COUNTIF(A1:A5,"Olma") nima qiladi?', ru: 'Что делает =COUNTIF(A1:A5,"Olma")?', en: 'What does =COUNTIF(A1:A5,"Apple") do?' },
                            options: { uz: ["'Olma' so'zini sanaydi", "Barcha qatorlarni sanaydi", "Yig'indini hisoblaydi", "O'rtachani topadi"], ru: ["Считает слово 'Olma'", "Считает все строки", "Вычисляет сумму", "Находит среднее"], en: ["Counts 'Apple'", "Counts all rows", "Calculates sum", "Finds average"] },
                            correct: 0
                        },
                        {
                            q: { uz: "SUMIF va SUMIFS orasidagi farq?", ru: "Разница между SUMIF и SUMIFS?", en: "Difference between SUMIF and SUMIFS?" },
                            options: { uz: ["SUMIFS ko'p shart", "SUMIF ko'p shart", "Farq yo'q", "SUMIFS eski versiya"], ru: ["SUMIFS — много условий", "SUMIF — много условий", "Нет разницы", "SUMIFS — старая версия"], en: ["SUMIFS multiple conditions", "SUMIF multiple conditions", "No difference", "SUMIFS is older"] },
                            correct: 0
                        },
                        {
                            q: { uz: "Wildcard * belgisi nimani anglatadi?", ru: "Что означает * в Wildcard?", en: "What does wildcard * mean?" },
                            options: { uz: ["Istalgan belgilar ketma-ketligi", "Bitta belgi", "Raqam", "Bo'sh katak"], ru: ["Любая последовательность", "Один символ", "Число", "Пустая ячейка"], en: ["Any sequence of characters", "One character", "Number", "Empty cell"] },
                            correct: 0
                        }
                    ]
                },
                {
                    num: 5, day: 5,
                    title: { uz: "VLOOKUP & XLOOKUP", ru: "VLOOKUP и XLOOKUP", en: "VLOOKUP & XLOOKUP" },
                    desc: {
                        uz: "Ma'lumotlarni qidirish funksiyalari",
                        ru: "Функции поиска данных",
                        en: "Data lookup functions"
                    },
                    topics: {
                        uz: ["VLOOKUP sintaksisi", "HLOOKUP funksiyasi", "XLOOKUP (yangi)", "INDEX + MATCH", "Approximate vs Exact match", "Amaliy misollar"],
                        ru: ["Синтаксис VLOOKUP", "HLOOKUP", "XLOOKUP (новая)", "INDEX + MATCH", "Approximate vs Exact", "Примеры"],
                        en: ["VLOOKUP syntax", "HLOOKUP", "XLOOKUP (new)", "INDEX + MATCH", "Approximate vs Exact", "Examples"]
                    },
                    shortcuts: [
                        { keys: ["Ctrl", "F"], desc: { uz: "Qidirish", ru: "Найти", en: "Find" } },
                        { keys: ["Ctrl", "H"], desc: { uz: "Almashtirish", ru: "Заменить", en: "Replace" } }
                    ],
                    tableType: 'vlookup',
                    formulas: ['=VLOOKUP(102,A2:D4,2,FALSE)', '=XLOOKUP(102,A2:A4,B2:B4)', '=INDEX(B2:B4,MATCH(102,A2:A4,0))'],
                    quiz: [
                        {
                            q: { uz: "VLOOKUP qaysi yo'nalishda qidiradi?", ru: "В каком направлении ищет VLOOKUP?", en: "In which direction does VLOOKUP search?" },
                            options: { uz: ["Vertikal (pastga)", "Gorizontal (o'ngga)", "Har ikki yo'nalishda", "Diagonal"], ru: ["Вертикально", "Горизонтально", "В обоих", "Диагонально"], en: ["Vertically", "Horizontally", "Both", "Diagonally"] },
                            correct: 0
                        },
                        {
                            q: { uz: "XLOOKUP ning VLOOKUP dan afzalligi?", ru: "Преимущество XLOOKUP перед VLOOKUP?", en: "Advantage of XLOOKUP over VLOOKUP?" },
                            options: { uz: ["Chap tomonga ham qidira oladi", "Tezroq ishlaydi", "Eski versiyalarda ishlaydi", "Formatlash imkoniyati"], ru: ["Ищет и влево", "Быстрее", "Работает в старых версиях", "Форматирование"], en: ["Can search left", "Faster", "Works in old versions", "Formatting"] },
                            correct: 0
                        },
                        {
                            q: { uz: "FALSE parametri VLOOKUP da nimani bildiradi?", ru: "Что означает FALSE в VLOOKUP?", en: "What does FALSE mean in VLOOKUP?" },
                            options: { uz: ["Aniq mos kelish", "Taxminiy mos kelish", "Xato", "Teskari qidirish"], ru: ["Точное совпадение", "Приблизительное", "Ошибка", "Обратный поиск"], en: ["Exact match", "Approximate", "Error", "Reverse search"] },
                            correct: 0
                        }
                    ]
                },
                {
                    num: 6, day: 6,
                    title: { uz: "Filter & Sort", ru: "Фильтр и сортировка", en: "Filter & Sort" },
                    desc: {
                        uz: "Ma'lumotlarni filtrlash va tartiblash usullari",
                        ru: "Методы фильтрации и сортировки данных",
                        en: "Data filtering and sorting methods"
                    },
                    topics: {
                        uz: ["AutoFilter", "Custom Filter", "Sort A-Z / Z-A", "Multi-level Sort", "FILTER funksiyasi", "SORT funksiyasi"],
                        ru: ["AutoFilter", "Custom Filter", "Sort A-Z / Z-A", "Multi-level Sort", "FILTER функция", "SORT функция"],
                        en: ["AutoFilter", "Custom Filter", "Sort A-Z / Z-A", "Multi-level Sort", "FILTER function", "SORT function"]
                    },
                    shortcuts: [
                        { keys: ["Ctrl", "Shift", "L"], desc: { uz: "Filter", ru: "Фильтр", en: "Filter" } },
                        { keys: ["Alt", "D", "S"], desc: { uz: "Sort", ru: "Сортировка", en: "Sort" } }
                    ],
                    tableType: 'basic',
                    formulas: ['=SORT(A2:D10,2,1)', '=FILTER(A2:D10,C2:C10>50000)'],
                    quiz: [
                        {
                            q: { uz: "AutoFilter ni qanday yoqish mumkin?", ru: "Как включить AutoFilter?", en: "How to enable AutoFilter?" },
                            options: { uz: ["Ctrl+Shift+L", "Ctrl+F", "Alt+F4", "Ctrl+A"], ru: ["Ctrl+Shift+L", "Ctrl+F", "Alt+F4", "Ctrl+A"], en: ["Ctrl+Shift+L", "Ctrl+F", "Alt+F4", "Ctrl+A"] },
                            correct: 0
                        },
                        {
                            q: { uz: "Multi-level Sort nima?", ru: "Что такое Multi-level Sort?", en: "What is Multi-level Sort?" },
                            options: { uz: ["Bir necha ustun bo'yicha tartiblash", "Bitta ustun tartiblash", "Filtrlash", "Guruhlash"], ru: ["Сортировка по нескольким столбцам", "По одному столбцу", "Фильтрация", "Группировка"], en: ["Sort by multiple columns", "Sort by one column", "Filtering", "Grouping"] },
                            correct: 0
                        },
                        {
                            q: { uz: "FILTER funksiyasi nima qaytaradi?", ru: "Что возвращает FILTER?", en: "What does FILTER return?" },
                            options: { uz: ["Shartga mos qatorlar", "Bitta qiymat", "Yig'indi", "Son"], ru: ["Подходящие строки", "Одно значение", "Сумму", "Число"], en: ["Matching rows", "Single value", "Sum", "Number"] },
                            correct: 0
                        }
                    ]
                },
                {
                    num: 7, day: 7,
                    title: { uz: "Pivot Table", ru: "Сводная таблица", en: "Pivot Table" },
                    desc: {
                        uz: "Pivot Table yaratish va ma'lumotlarni tahlil qilish",
                        ru: "Создание сводных таблиц и анализ данных",
                        en: "Creating Pivot Tables and data analysis"
                    },
                    topics: {
                        uz: ["Pivot Table nima?", "Pivot Table yaratish", "Rows, Columns, Values", "Filters", "Pivot Chart", "Slicers"],
                        ru: ["Что такое Pivot Table?", "Создание", "Rows, Columns, Values", "Фильтры", "Pivot Chart", "Срезы"],
                        en: ["What is Pivot Table?", "Creating", "Rows, Columns, Values", "Filters", "Pivot Chart", "Slicers"]
                    },
                    shortcuts: [
                        { keys: ["Alt", "N", "V"], desc: { uz: "Pivot Table yaratish", ru: "Создать Pivot Table", en: "Create Pivot Table" } }
                    ],
                    tableType: 'basic',
                    formulas: [],
                    quiz: [
                        {
                            q: { uz: "Pivot Table nimaga ishlatiladi?", ru: "Для чего используется Pivot Table?", en: "What is Pivot Table used for?" },
                            options: { uz: ["Ma'lumotlarni guruhlash va tahlil qilish", "Formulalar yozish", "Grafikalar yaratish", "Fayllarni saqlash"], ru: ["Группировка и анализ", "Написание формул", "Создание графиков", "Сохранение файлов"], en: ["Group and analyze data", "Write formulas", "Create charts", "Save files"] },
                            correct: 0
                        },
                        {
                            q: { uz: "Pivot Table da 'Values' bo'limi nima?", ru: "Что такое 'Values' в Pivot Table?", en: "What is 'Values' in Pivot Table?" },
                            options: { uz: ["Hisoblangan qiymatlar", "Satr nomlari", "Ustun nomlari", "Filterlar"], ru: ["Вычисленные значения", "Имена строк", "Имена столбцов", "Фильтры"], en: ["Calculated values", "Row names", "Column names", "Filters"] },
                            correct: 0
                        },
                        {
                            q: { uz: "Slicer nima?", ru: "Что такое Slicer?", en: "What is a Slicer?" },
                            options: { uz: ["Vizual filter", "Formula", "Jadval turi", "Grafik"], ru: ["Визуальный фильтр", "Формула", "Тип таблицы", "График"], en: ["Visual filter", "Formula", "Table type", "Chart"] },
                            correct: 0
                        }
                    ]
                },
                {
                    num: 8, day: 8,
                    title: { uz: "Mini Dashboard", ru: "Мини дашборд", en: "Mini Dashboard" },
                    desc: {
                        uz: "Excel da mini dashboard yaratish — grafiklar, KPI va vizualizatsiya",
                        ru: "Создание мини дашборда — графики, KPI и визуализация",
                        en: "Creating mini dashboard — charts, KPI and visualization"
                    },
                    topics: {
                        uz: ["Chart turlari", "KPI ko'rsatkichlar", "Conditional Formatting", "Sparklines", "Dashboard layout", "Interaktiv elementlar"],
                        ru: ["Типы графиков", "KPI показатели", "Conditional Formatting", "Sparklines", "Layout дашборда", "Интерактивные элементы"],
                        en: ["Chart types", "KPI indicators", "Conditional Formatting", "Sparklines", "Dashboard layout", "Interactive elements"]
                    },
                    shortcuts: [
                        { keys: ["Alt", "F1"], desc: { uz: "Tez grafik", ru: "Быстрый график", en: "Quick chart" } },
                        { keys: ["F11"], desc: { uz: "Grafik sheet", ru: "Лист графика", en: "Chart sheet" } }
                    ],
                    tableType: 'basic',
                    formulas: [],
                    quiz: [
                        {
                            q: { uz: "Dashboard nima?", ru: "Что такое Dashboard?", en: "What is a Dashboard?" },
                            options: { uz: ["Ma'lumotlarni vizual ko'rsatuvchi panel", "Jadval turi", "Formula", "Fayl formati"], ru: ["Панель визуализации", "Тип таблицы", "Формула", "Формат файла"], en: ["Visual data display panel", "Table type", "Formula", "File format"] },
                            correct: 0
                        },
                        {
                            q: { uz: "Conditional Formatting nima qiladi?", ru: "Что делает Conditional Formatting?", en: "What does Conditional Formatting do?" },
                            options: { uz: ["Shartga ko'ra rangni o'zgartiradi", "Formulani yozadi", "Faylni saqlaydi", "Chop etadi"], ru: ["Меняет цвет по условию", "Пишет формулу", "Сохраняет", "Печатает"], en: ["Changes color by condition", "Writes formula", "Saves file", "Prints"] },
                            correct: 0
                        },
                        {
                            q: { uz: "Sparkline nima?", ru: "Что такое Sparkline?", en: "What is a Sparkline?" },
                            options: { uz: ["Katak ichidagi mini grafik", "Katta grafik", "Formula", "Filter"], ru: ["Мини-график в ячейке", "Большой график", "Формула", "Фильтр"], en: ["Mini chart inside cell", "Large chart", "Formula", "Filter"] },
                            correct: 0
                        }
                    ]
                }
            ]
        },
        
        pro: {
            id: 'pro',
            title_key: 'pro_title',
            desc_key: 'pro_desc',
            color: 'pro',
            level_key: 'level_advanced',
            totalLessons: 12,
            lessons: [
                { num: 1, day: 1, title: { uz: "Advanced Formulas", ru: "Продвинутые формулы", en: "Advanced Formulas" }, desc: { uz: "Ilg'or formulalar — INDIRECT, OFFSET, TEXT funksiyalari", ru: "Продвинутые формулы — INDIRECT, OFFSET, TEXT", en: "Advanced formulas — INDIRECT, OFFSET, TEXT" }, topics: { uz: ["INDIRECT funksiyasi", "OFFSET funksiyasi", "TEXT funksiyasi", "LEFT, RIGHT, MID", "CONCATENATE / TEXTJOIN", "Amaliy mashqlar"], ru: ["INDIRECT", "OFFSET", "TEXT", "LEFT, RIGHT, MID", "CONCATENATE / TEXTJOIN", "Практика"], en: ["INDIRECT", "OFFSET", "TEXT", "LEFT, RIGHT, MID", "CONCATENATE / TEXTJOIN", "Practice"] }, shortcuts: [], tableType: 'basic', formulas: ['=INDIRECT("A"&B1)', '=OFFSET(A1,2,1,3,2)', '=TEXT(A1,"#,##0")'], quiz: [{ q: { uz: "INDIRECT funksiyasi nima qiladi?", ru: "Что делает INDIRECT?", en: "What does INDIRECT do?" }, options: { uz: ["Matn ko'rinishidagi manzilni katak manziliga aylantiradi", "Qiymatni o'zgartiradi", "Formatni beradi", "Filtrlaydi"], ru: ["Преобразует текст в ссылку", "Меняет значение", "Форматирует", "Фильтрует"], en: ["Converts text to cell reference", "Changes value", "Formats", "Filters"] }, correct: 0 }, { q: { uz: "TEXT funksiyasi nimaga kerak?", ru: "Для чего TEXT?", en: "What is TEXT for?" }, options: { uz: ["Sonni formatlangan matnga aylantirish", "Matnni songa", "Qidirish", "Saralash"], ru: ["Форматирование числа в текст", "Текст в число", "Поиск", "Сортировка"], en: ["Format number as text", "Text to number", "Search", "Sort"] }, correct: 0 }, { q: { uz: "OFFSET funksiyasida nechta parametr bor?", ru: "Сколько параметров у OFFSET?", en: "How many parameters does OFFSET have?" }, options: { uz: ["5", "3", "2", "4"], ru: ["5", "3", "2", "4"], en: ["5", "3", "2", "4"] }, correct: 0 }] },
                { num: 2, day: 2, title: { uz: "SUMIF + IF Kombinatsiyasi", ru: "SUMIF + IF Комбинация", en: "SUMIF + IF Combination" }, desc: { uz: "Murakkab shartli formulalar", ru: "Сложные условные формулы", en: "Complex conditional formulas" }, topics: { uz: ["SUMIFS ko'p shartli", "AVERAGEIF", "Nested IF + SUMIF", "SUMPRODUCT", "Array formulas", "Amaliy loyiha"], ru: ["SUMIFS многоусловный", "AVERAGEIF", "Вложенный IF + SUMIF", "SUMPRODUCT", "Формулы массива", "Проект"], en: ["SUMIFS multi-condition", "AVERAGEIF", "Nested IF + SUMIF", "SUMPRODUCT", "Array formulas", "Project"] }, shortcuts: [], tableType: 'countif', formulas: ['=SUMPRODUCT((A2:A10="IT")*(C2:C10))', '=AVERAGEIF(B2:B10,"IT",C2:C10)'], quiz: [{ q: { uz: "SUMPRODUCT nima?", ru: "Что такое SUMPRODUCT?", en: "What is SUMPRODUCT?" }, options: { uz: ["Massivlarni ko'paytirib yig'adi", "Oddiy yig'indi", "O'rtacha", "Sanash"], ru: ["Умножает и суммирует", "Простая сумма", "Среднее", "Подсчёт"], en: ["Multiplies and sums arrays", "Simple sum", "Average", "Count"] }, correct: 0 }] },
                { num: 3, day: 3, title: { uz: "XLOOKUP Advanced", ru: "XLOOKUP Продвинутый", en: "XLOOKUP Advanced" }, desc: { uz: "XLOOKUP ilg'or imkoniyatlari", ru: "Продвинутые возможности XLOOKUP", en: "Advanced XLOOKUP capabilities" }, topics: { uz: ["XLOOKUP wildcards", "Multiple return values", "Search mode", "Match mode", "XLOOKUP vs INDEX/MATCH", "Dynamic arrays"], ru: ["Подстановочные", "Множественный возврат", "Режим поиска", "Режим совпадения", "vs INDEX/MATCH", "Динамические массивы"], en: ["Wildcards", "Multiple return", "Search mode", "Match mode", "vs INDEX/MATCH", "Dynamic arrays"] }, shortcuts: [], tableType: 'vlookup', formulas: ['=XLOOKUP(G2,A2:A10,B2:D10)', '=XLOOKUP(G2,A2:A10,B2:B10,"Topilmadi",0,-1)'], quiz: [{ q: { uz: "XLOOKUP qaysi Excel versiyasidan bor?", ru: "С какой версии есть XLOOKUP?", en: "Which Excel version has XLOOKUP?" }, options: { uz: ["Microsoft 365", "Excel 2010", "Excel 2007", "Excel 2003"], ru: ["Microsoft 365", "Excel 2010", "Excel 2007", "Excel 2003"], en: ["Microsoft 365", "Excel 2010", "Excel 2007", "Excel 2003"] }, correct: 0 }] },
                { num: 4, day: 4, title: { uz: "Dynamic Formulas", ru: "Динамические формулы", en: "Dynamic Formulas" }, desc: { uz: "Dinamik formulalar va spill range", ru: "Динамические формулы и spill range", en: "Dynamic formulas and spill range" }, topics: { uz: ["FILTER funksiyasi", "SORT / SORTBY", "UNIQUE", "SEQUENCE", "Spill range (#)", "LET funksiyasi"], ru: ["FILTER", "SORT / SORTBY", "UNIQUE", "SEQUENCE", "Spill range", "LET"], en: ["FILTER", "SORT / SORTBY", "UNIQUE", "SEQUENCE", "Spill range", "LET"] }, shortcuts: [], tableType: 'basic', formulas: ['=UNIQUE(A2:A10)', '=SORT(FILTER(A2:C10,B2:B10="IT"))'], quiz: [{ q: { uz: "UNIQUE funksiyasi nima qiladi?", ru: "Что делает UNIQUE?", en: "What does UNIQUE do?" }, options: { uz: ["Takrorlanmas qiymatlarni ajratib oladi", "Saralaydi", "Filtr qo'yadi", "Sanaydi"], ru: ["Извлекает уникальные", "Сортирует", "Фильтрует", "Считает"], en: ["Extracts unique values", "Sorts", "Filters", "Counts"] }, correct: 0 }] },
                { num: 5, day: 5, title: { uz: "Order Management Project", ru: "Проект управления заказами", en: "Order Management Project" }, desc: { uz: "Buyurtma boshqarish tizimi loyihasi", ru: "Проект системы управления заказами", en: "Order management system project" }, topics: { uz: ["Ma'lumotlar bazasi", "Buyurtma formasi", "Hisobot tizimi", "Status boshqarish", "Dashboard", "Avtomatik hisoblash"], ru: ["База данных", "Форма заказа", "Отчёты", "Статусы", "Дашборд", "Авто-расчёт"], en: ["Database", "Order form", "Reports", "Status management", "Dashboard", "Auto-calculation"] }, shortcuts: [], tableType: 'basic', formulas: [], quiz: [{ q: { uz: "Data Validation nima uchun kerak?", ru: "Для чего Data Validation?", en: "What is Data Validation for?" }, options: { uz: ["Ma'lumot kiritishni cheklash va tekshirish", "Formatlash", "Chop etish", "Filtrlash"], ru: ["Ограничение ввода", "Форматирование", "Печать", "Фильтрация"], en: ["Restrict and validate input", "Formatting", "Printing", "Filtering"] }, correct: 0 }] },
                { num: 6, day: 6, title: { uz: "Data Processing", ru: "Обработка данных", en: "Data Processing" }, desc: { uz: "Ma'lumotlarni qayta ishlash texnikalari", ru: "Техники обработки данных", en: "Data processing techniques" }, topics: { uz: ["Power Query asoslari", "Data Cleaning", "Text to Columns", "Flash Fill", "Remove Duplicates", "Data Consolidation"], ru: ["Power Query", "Очистка данных", "Text to Columns", "Flash Fill", "Удаление дубликатов", "Консолидация"], en: ["Power Query basics", "Data Cleaning", "Text to Columns", "Flash Fill", "Remove Duplicates", "Consolidation"] }, shortcuts: [{ keys: ["Ctrl", "E"], desc: { uz: "Flash Fill", ru: "Flash Fill", en: "Flash Fill" } }], tableType: 'basic', formulas: ['=TRIM(A1)', '=CLEAN(A1)', '=PROPER(A1)'], quiz: [{ q: { uz: "Flash Fill nima?", ru: "Что такое Flash Fill?", en: "What is Flash Fill?" }, options: { uz: ["Pattern bo'yicha avtomatik to'ldirish", "Formatlash", "Filtrlash", "Saralash"], ru: ["Авто-заполнение по шаблону", "Форматирование", "Фильтрация", "Сортировка"], en: ["Auto-fill by pattern", "Formatting", "Filtering", "Sorting"] }, correct: 0 }] },
                { num: 7, day: 7, title: { uz: "Dashboard PRO", ru: "Dashboard PRO", en: "Dashboard PRO" }, desc: { uz: "Professional darajadagi dashboard yaratish", ru: "Создание профессионального дашборда", en: "Creating professional dashboard" }, topics: { uz: ["Advanced Charts", "Dynamic Charts", "Form Controls", "Camera Tool", "Dashboard Design", "Color Schemes"], ru: ["Продвинутые графики", "Динамические", "Элементы управления", "Camera Tool", "Дизайн", "Цветовые схемы"], en: ["Advanced Charts", "Dynamic Charts", "Form Controls", "Camera Tool", "Design", "Color Schemes"] }, shortcuts: [], tableType: 'basic', formulas: [], quiz: [{ q: { uz: "Form Controls nima uchun ishlatiladi?", ru: "Для чего Form Controls?", en: "What are Form Controls for?" }, options: { uz: ["Interaktiv boshqaruv elementlari", "Formatlash", "Formulalar", "Fayllar"], ru: ["Интерактивные элементы", "Форматирование", "Формулы", "Файлы"], en: ["Interactive controls", "Formatting", "Formulas", "Files"] }, correct: 0 }] },
                { num: 8, day: 8, title: { uz: "Interactive Dashboard", ru: "Интерактивный дашборд", en: "Interactive Dashboard" }, desc: { uz: "To'liq interaktiv dashboard loyihasi", ru: "Полностью интерактивный дашборд", en: "Fully interactive dashboard project" }, topics: { uz: ["Slicer va Timeline", "GETPIVOTDATA", "Dynamic Named Ranges", "Combo Charts", "KPI Gauges", "Final Project"], ru: ["Slicer и Timeline", "GETPIVOTDATA", "Dynamic Ranges", "Combo Charts", "KPI", "Финальный проект"], en: ["Slicer & Timeline", "GETPIVOTDATA", "Dynamic Ranges", "Combo Charts", "KPI Gauges", "Final Project"] }, shortcuts: [], tableType: 'basic', formulas: [], quiz: [{ q: { uz: "Timeline slicer nima uchun ishlatiladi?", ru: "Для чего Timeline slicer?", en: "What is Timeline slicer for?" }, options: { uz: ["Sana bo'yicha filtrlash", "Matn filtrlash", "Son filtrlash", "Rang filtrlash"], ru: ["Фильтр по дате", "По тексту", "По числу", "По цвету"], en: ["Filter by date", "By text", "By number", "By color"] }, correct: 0 }] },
                { num: 9, day: 9, title: { uz: "ChatGPT + Excel", ru: "ChatGPT + Excel", en: "ChatGPT + Excel" }, desc: { uz: "ChatGPT yordamida Excel ishlash", ru: "Работа в Excel с ChatGPT", en: "Using ChatGPT with Excel" }, topics: { uz: ["ChatGPT bilan formulalar yozish", "Prompt engineering", "Ma'lumot tahlili", "VBA kod generatsiyasi", "Data Cleaning bilan", "Real use cases"], ru: ["Формулы с ChatGPT", "Prompt engineering", "Анализ данных", "Генерация VBA", "Очистка данных", "Реальные кейсы"], en: ["Formulas with ChatGPT", "Prompt engineering", "Data analysis", "VBA generation", "Data Cleaning", "Real use cases"] }, shortcuts: [], tableType: 'basic', formulas: [], quiz: [{ q: { uz: "ChatGPT Excel da qanday yordam beradi?", ru: "Как ChatGPT помогает в Excel?", en: "How does ChatGPT help in Excel?" }, options: { uz: ["Formulalar yozish, tahlil qilish, VBA kod yaratish", "Faqat matn yozish", "Faqat grafik yaratish", "Fayllarni saqlash"], ru: ["Формулы, анализ, VBA", "Только текст", "Только графики", "Сохранение"], en: ["Formulas, analysis, VBA code", "Only text", "Only charts", "Saving files"] }, correct: 0 }] },
                { num: 10, day: 10, title: { uz: "Automation", ru: "Автоматизация", en: "Automation" }, desc: { uz: "Excel da jarayonlarni avtomatlashtirish", ru: "Автоматизация процессов в Excel", en: "Process automation in Excel" }, topics: { uz: ["Macro Recorder", "Macro Security", "Personal Macro Workbook", "Scheduled Tasks", "Power Automate", "Automation Best Practices"], ru: ["Macro Recorder", "Безопасность", "Personal Workbook", "Расписание", "Power Automate", "Best Practices"], en: ["Macro Recorder", "Security", "Personal Workbook", "Scheduling", "Power Automate", "Best Practices"] }, shortcuts: [{ keys: ["Alt", "F8"], desc: { uz: "Macro dialog", ru: "Диалог макросов", en: "Macro dialog" } }, { keys: ["Alt", "F11"], desc: { uz: "VBA Editor", ru: "Редактор VBA", en: "VBA Editor" } }], tableType: 'basic', formulas: [], quiz: [{ q: { uz: "Macro Recorder nima qiladi?", ru: "Что делает Macro Recorder?", en: "What does Macro Recorder do?" }, options: { uz: ["Harakatlarni yozib oladi va takrorlaydi", "Formulalar yozadi", "Faylni saqlaydi", "Chop etadi"], ru: ["Записывает действия", "Пишет формулы", "Сохраняет", "Печатает"], en: ["Records and replays actions", "Writes formulas", "Saves file", "Prints"] }, correct: 0 }] },
                { num: 11, day: 11, title: { uz: "VBA Basics", ru: "Основы VBA", en: "VBA Basics" }, desc: { uz: "VBA dasturlash asoslari", ru: "Основы программирования VBA", en: "VBA programming basics" }, topics: { uz: ["VBA nima?", "Sub va Function", "Variables va Types", "If-Then-Else", "Loops (For, Do While)", "MsgBox va InputBox"], ru: ["Что такое VBA?", "Sub и Function", "Переменные и типы", "If-Then-Else", "Циклы", "MsgBox и InputBox"], en: ["What is VBA?", "Sub & Function", "Variables & Types", "If-Then-Else", "Loops", "MsgBox & InputBox"] }, shortcuts: [{ keys: ["Alt", "F11"], desc: { uz: "VBA Editor", ru: "VBA Editor", en: "VBA Editor" } }], tableType: 'basic', formulas: [], quiz: [{ q: { uz: "VBA da Sub nima?", ru: "Что такое Sub в VBA?", en: "What is Sub in VBA?" }, options: { uz: ["Protsedura (qaytish qiymatsiz)", "O'zgaruvchi", "Funksiya", "Tsikl"], ru: ["Процедура без возврата", "Переменная", "Функция", "Цикл"], en: ["Procedure (no return value)", "Variable", "Function", "Loop"] }, correct: 0 }] },
                { num: 12, day: 12, title: { uz: "Automated Reports", ru: "Автоматизированные отчёты", en: "Automated Reports" }, desc: { uz: "VBA bilan avtomatlashtirilgan hisobotlar", ru: "Автоматизированные отчёты с VBA", en: "Automated reports with VBA" }, topics: { uz: ["Report Generator VBA", "Email yuborish", "PDF eksport", "Scheduled Reports", "Error Handling", "Final Loyiha"], ru: ["Report Generator", "Отправка email", "PDF экспорт", "Расписание", "Обработка ошибок", "Финальный проект"], en: ["Report Generator", "Send emails", "PDF export", "Scheduled Reports", "Error Handling", "Final Project"] }, shortcuts: [], tableType: 'basic', formulas: [], quiz: [{ q: { uz: "VBA bilan PDF qanday yaratish mumkin?", ru: "Как создать PDF через VBA?", en: "How to create PDF with VBA?" }, options: { uz: ["ExportAsFixedFormat metodi", "Save As dialog", "Print Screen", "Copy Paste"], ru: ["ExportAsFixedFormat", "Save As", "Print Screen", "Copy Paste"], en: ["ExportAsFixedFormat method", "Save As dialog", "Print Screen", "Copy Paste"] }, correct: 0 }] }
            ]
        }
    },
    
    getCourse(courseId) {
        return this.data[courseId] || null;
    },
    
    getLesson(courseId, lessonNum) {
        const course = this.getCourse(courseId);
        if (!course) return null;
        return course.lessons.find(l => l.num === lessonNum) || null;
    },
    
    getLessonTitle(lesson) {
        return lesson.title[I18n.currentLang] || lesson.title.uz;
    },
    
    getLessonDesc(lesson) {
        return lesson.desc[I18n.currentLang] || lesson.desc.uz;
    },
    
    getLessonTopics(lesson) {
        return lesson.topics[I18n.currentLang] || lesson.topics.uz;
    }
};