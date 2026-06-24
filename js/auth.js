// ============================================
// Authentication Module
// ============================================

const Auth = {
    currentUser: null,
    userData: null,
    
    init() {
        auth.onAuthStateChanged(async (user) => {
            this.currentUser = user;
            if (user) {
                await this.loadUserData(user);
                this.updateUILoggedIn();
            } else {
                this.userData = null;
                this.updateUILoggedOut();
            }
            
            // Hide loading screen after auth check
            setTimeout(() => {
                document.getElementById('loading-screen')?.classList.add('hidden');
            }, 500);
        });
    },
    
    async loadUserData(user) {
        try {
            const doc = await db.collection('users').doc(user.uid).get();
            if (doc.exists) {
                this.userData = doc.data();
            } else {
                // Create user document
                const data = {
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    role: user.email === SUPER_ADMIN_EMAIL ? 'super_admin' : 'student',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    openedLessons: {
                        foundation: [1, 2],
                        pro: [1, 2]
                    },
                    completedLessons: {
                        foundation: [],
                        pro: []
                    },
                    quizResults: {},
                    lastActivity: firebase.firestore.FieldValue.serverTimestamp()
                };
                await db.collection('users').doc(user.uid).set(data);
                this.userData = data;
            }
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    },
    
    updateUILoggedIn() {
        document.body.classList.add('logged-in');
        
        const name = this.userData?.name || this.currentUser?.email?.split('@')[0] || 'U';
        const initial = name.charAt(0).toUpperCase();
        const email = this.currentUser?.email || '';
        
        const avatarCircle = document.getElementById('avatar-circle');
        const avatarCircleLg = document.getElementById('avatar-circle-lg');
        const dropdownName = document.getElementById('dropdown-user-name');
        const dropdownEmail = document.getElementById('dropdown-user-email');
        
        if (avatarCircle) avatarCircle.textContent = initial;
        if (avatarCircleLg) avatarCircleLg.textContent = initial;
        if (dropdownName) dropdownName.textContent = name;
        if (dropdownEmail) dropdownEmail.textContent = email;
        
        // Check admin role
        const role = this.userData?.role;
        if (role === 'super_admin' || role === 'admin') {
            document.body.classList.add('is-admin');
        } else {
            document.body.classList.remove('is-admin');
        }
    },
    
    updateUILoggedOut() {
        document.body.classList.remove('logged-in', 'is-admin');
    },
    
    async login(email, password) {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            App.showToast(I18n.t('success'), 'success');
            window.location.hash = '#/';
            return { success: true };
        } catch (e) {
            return { success: false, error: this.getErrorMessage(e.code) };
        }
    },
    
    async register(name, email, password) {
        try {
            const cred = await auth.createUserWithEmailAndPassword(email, password);
            await cred.user.updateProfile({ displayName: name });
            
            const data = {
                name: name,
                email: email,
                role: email === SUPER_ADMIN_EMAIL ? 'super_admin' : 'student',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                openedLessons: {
                    foundation: [1, 2],
                    pro: [1, 2]
                },
                completedLessons: {
                    foundation: [],
                    pro: []
                },
                quizResults: {},
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('users').doc(cred.user.uid).set(data);
            App.showToast(I18n.t('success'), 'success');
            window.location.hash = '#/';
            return { success: true };
        } catch (e) {
            return { success: false, error: this.getErrorMessage(e.code) };
        }
    },
    
    async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (e) {
            return { success: false, error: this.getErrorMessage(e.code) };
        }
    },
    
    async logout() {
        try {
            await auth.signOut();
            window.location.hash = '#/';
        } catch (e) {
            console.error('Logout error:', e);
        }
    },
    
    isLoggedIn() {
        return !!this.currentUser;
    },
    
    isAdmin() {
        return this.userData?.role === 'admin' || this.userData?.role === 'super_admin';
    },
    
    isSuperAdmin() {
        return this.userData?.role === 'super_admin';
    },
    
    getErrorMessage(code) {
        const messages = {
            'auth/email-already-in-use': 'Bu email allaqachon ro\'yxatdan o\'tgan',
            'auth/invalid-email': 'Noto\'g\'ri email format',
            'auth/weak-password': 'Parol juda qisqa (kamida 6 ta belgi)',
            'auth/user-not-found': 'Foydalanuvchi topilmadi',
            'auth/wrong-password': 'Noto\'g\'ri parol',
            'auth/too-many-requests': 'Juda ko\'p urinish. Keyinroq qayta urinib ko\'ring',
            'auth/network-request-failed': 'Internet ulanishi yo\'q'
        };
        return messages[code] || 'Xatolik yuz berdi';
    },
    
    hasAccessToLesson(course, lessonNum) {
        // Guest access: lessons 1 and 2 of each course
        if (!this.isLoggedIn()) {
            return lessonNum <= 2;
        }
        
        if (!this.userData) return false;
        
        const opened = this.userData.openedLessons?.[course] || [1, 2];
        return opened.includes(lessonNum);
    },
    
    isLessonCompleted(course, lessonNum) {
        if (!this.userData) return false;
        const completed = this.userData.completedLessons?.[course] || [];
        return completed.includes(lessonNum);
    },
    
    async completeLesson(course, lessonNum) {
        if (!this.isLoggedIn()) return;
        
        const uid = this.currentUser.uid;
        const completed = this.userData.completedLessons?.[course] || [];
        
        if (!completed.includes(lessonNum)) {
            completed.push(lessonNum);
            this.userData.completedLessons[course] = completed;
            
            await db.collection('users').doc(uid).update({
                [`completedLessons.${course}`]: completed,
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    },
    
    async saveQuizResult(course, lessonNum, score, total) {
        if (!this.isLoggedIn()) return;
        
        const uid = this.currentUser.uid;
        const key = `${course}_lesson${lessonNum}`;
        
        if (!this.userData.quizResults) this.userData.quizResults = {};
        this.userData.quizResults[key] = { score, total, date: new Date().toISOString() };
        
        await db.collection('users').doc(uid).update({
            [`quizResults.${key}`]: { score, total, date: new Date().toISOString() },
            lastActivity: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
};