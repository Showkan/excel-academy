// ============================================
// Admin Panel Module
// ============================================

const Admin = {
    currentSection: 'dashboard',
    users: [],
    
    async render() {
        if (!Auth.isAdmin()) {
            window.location.hash = '#/';
            return '<div></div>';
        }
        
        return `
            <div class="admin-page page-transition">
                <div class="admin-sidebar" id="admin-sidebar">
                    <p class="admin-sidebar-title">${I18n.t('admin_dashboard')}</p>
                    <div class="admin-nav-item active" data-section="dashboard" onclick="Admin.switchSection('dashboard')">
                        <span class="admin-nav-icon">📊</span>
                        <span>Dashboard</span>
                    </div>
                    <div class="admin-nav-item" data-section="users" onclick="Admin.switchSection('users')">
                        <span class="admin-nav-icon">👥</span>
                        <span>${I18n.t('admin_users')}</span>
                    </div>
                    ${Auth.isSuperAdmin() ? `
                    <div class="admin-nav-item" data-section="admins" onclick="Admin.switchSection('admins')">
                        <span class="admin-nav-icon">🛡️</span>
                        <span>${I18n.t('admin_admins')}</span>
                    </div>
                    ` : ''}
                    <div class="admin-nav-item" data-section="progress" onclick="Admin.switchSection('progress')">
                        <span class="admin-nav-icon">📈</span>
                        <span>${I18n.t('admin_progress')}</span>
                    </div>
                    <div class="admin-nav-item" data-section="lessons-mgmt" onclick="Admin.switchSection('lessons-mgmt')">
                        <span class="admin-nav-icon">📖</span>
                        <span>${I18n.t('admin_open_lessons')}</span>
                    </div>
                </div>
                <div class="admin-main" id="admin-main">
                    ${await this.renderSection('dashboard')}
                </div>
            </div>
        `;
    },
    
    async switchSection(section) {
        this.currentSection = section;
        
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });
        
        const main = document.getElementById('admin-main');
        if (main) {
            main.innerHTML = '<div class="text-center mt-4"><p>Yuklanmoqda...</p></div>';
            main.innerHTML = await this.renderSection(section);
        }
    },
    
    async renderSection(section) {
        switch (section) {
            case 'dashboard': return await this.renderDashboard();
            case 'users': return await this.renderUsers();
            case 'admins': return await this.renderAdmins();
            case 'progress': return await this.renderProgress();
            case 'lessons-mgmt': return await this.renderLessonsMgmt();
            default: return '';
        }
    },
    
    async loadUsers() {
        try {
            const snapshot = await db.collection('users').get();
            this.users = [];
            snapshot.forEach(doc => {
                this.users.push({ id: doc.id, ...doc.data() });
            });
        } catch (e) {
            console.error('Error loading users:', e);
        }
    },
    
    async renderDashboard() {
        await this.loadUsers();
        
        const totalUsers = this.users.length;
        const admins = this.users.filter(u => u.role === 'admin' || u.role === 'super_admin').length;
        const activeStudents = this.users.filter(u => {
            const completed = u.completedLessons || {};
            return (completed.foundation || []).length > 0 || (completed.pro || []).length > 0;
        }).length;
        
        return `
            <div class="admin-header">
                <h1>📊 ${I18n.t('admin_dashboard')}</h1>
            </div>
            <div class="admin-stats">
                <div class="admin-stat-card">
                    <h3>${totalUsers}</h3>
                    <p>${I18n.t('admin_total_users')}</p>
                </div>
                <div class="admin-stat-card">
                    <h3>${admins}</h3>
                    <p>${I18n.t('admin_total_admins')}</p>
                </div>
                <div class="admin-stat-card">
                    <h3>${activeStudents}</h3>
                    <p>${I18n.t('admin_active_students')}</p>
                </div>
            </div>
            <h2 style="margin-bottom:16px;">${I18n.t('admin_users')} (${I18n.t('last_activity')})</h2>
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>${I18n.t('name')}</th>
                            <th>${I18n.t('email')}</th>
                            <th>Role</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.users.slice(0, 10).map(u => `
                            <tr>
                                <td>${u.name || '-'}</td>
                                <td>${u.email || '-'}</td>
                                <td><span class="admin-badge ${u.role === 'super_admin' ? 'super' : u.role === 'admin' ? 'admin' : 'student'}">${u.role}</span></td>
                                <td>${((u.completedLessons?.foundation || []).length + (u.completedLessons?.pro || []).length)}/20</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    async renderUsers() {
        await this.loadUsers();
        
        return `
            <div class="admin-header">
                <h1>👥 ${I18n.t('admin_users')}</h1>
            </div>
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>${I18n.t('name')}</th>
                            <th>${I18n.t('email')}</th>
                            <th>Role</th>
                            <th>Foundation</th>
                            <th>PRO</th>
                            <th>${I18n.t('edit')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.users.map((u, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${u.name || '-'}</td>
                                <td style="font-size:12px;">${u.email || '-'}</td>
                                <td><span class="admin-badge ${u.role === 'super_admin' ? 'super' : u.role === 'admin' ? 'admin' : 'student'}">${u.role}</span></td>
                                <td>${(u.completedLessons?.foundation || []).length}/8</td>
                                <td>${(u.completedLessons?.pro || []).length}/12</td>
                                <td>
                                    <div class="admin-actions">
                                        <button class="admin-action-btn" onclick="Admin.openLessonsModal('${u.id}')" title="${I18n.t('admin_open_lessons')}">📖</button>
                                        ${Auth.isSuperAdmin() && u.role !== 'super_admin' ? `
                                            <button class="admin-action-btn" onclick="Admin.toggleAdmin('${u.id}', '${u.role}')" title="${u.role === 'admin' ? I18n.t('admin_remove_admin') : I18n.t('admin_make_admin')}">
                                                ${u.role === 'admin' ? '🔓' : '🛡️'}
                                            </button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    async renderAdmins() {
        if (!Auth.isSuperAdmin()) return '<p>Access denied</p>';
        
        await this.loadUsers();
        const admins = this.users.filter(u => u.role === 'admin' || u.role === 'super_admin');
        
        return `
            <div class="admin-header">
                <h1>🛡️ ${I18n.t('admin_admins')}</h1>
            </div>
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>${I18n.t('name')}</th>
                            <th>${I18n.t('email')}</th>
                            <th>Role</th>
                            <th>${I18n.t('edit')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${admins.map(u => `
                            <tr>
                                <td>${u.name || '-'}</td>
                                <td>${u.email || '-'}</td>
                                <td><span class="admin-badge ${u.role === 'super_admin' ? 'super' : 'admin'}">${u.role}</span></td>
                                <td>
                                    ${u.role !== 'super_admin' ? `
                                        <button class="admin-action-btn danger" onclick="Admin.toggleAdmin('${u.id}', '${u.role}')" title="${I18n.t('admin_remove_admin')}">🔓</button>
                                    ` : '<span style="color:var(--text-tertiary)">—</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    async renderProgress() {
        await this.loadUsers();
        const students = this.users.filter(u => u.role === 'student');
        
        return `
            <div class="admin-header">
                <h1>📈 ${I18n.t('admin_progress')}</h1>
            </div>
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>${I18n.t('name')}</th>
                            <th>Foundation</th>
                            <th>PRO</th>
                            <th>Quizzes</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(u => {
                            const fc = (u.completedLessons?.foundation || []).length;
                            const pc = (u.completedLessons?.pro || []).length;
                            const qc = Object.keys(u.quizResults || {}).length;
                            const total = Math.round(((fc + pc) / 20) * 100);
                            
                            return `
                                <tr>
                                    <td>${u.name || '-'}</td>
                                    <td>${fc}/8</td>
                                    <td>${pc}/12</td>
                                    <td>${qc}/20</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:8px;">
                                            <div class="progress-bar" style="flex:1;height:6px;">
                                                <div class="progress-bar-fill green" style="width:${total}%"></div>
                                            </div>
                                            <span style="font-size:12px;font-weight:600;">${total}%</span>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    async renderLessonsMgmt() {
        await this.loadUsers();
        const students = this.users.filter(u => u.role === 'student');
        
        return `
            <div class="admin-header">
                <h1>📖 ${I18n.t('admin_open_lessons')}</h1>
            </div>
            <p style="margin-bottom:16px;color:var(--text-secondary);font-size:14px;">
                Foydalanuvchilarga darslarni ochish uchun "📖" tugmasini bosing
            </p>
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>${I18n.t('name')}</th>
                            <th>${I18n.t('email')}</th>
                            <th>Foundation ochilgan</th>
                            <th>PRO ochilgan</th>
                            <th>${I18n.t('edit')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(u => {
                            const fOpened = (u.openedLessons?.foundation || [1, 2]);
                            const pOpened = (u.openedLessons?.pro || [1, 2]);
                            
                            return `
                                <tr>
                                    <td>${u.name || '-'}</td>
                                    <td style="font-size:12px;">${u.email || '-'}</td>
                                    <td>1-${Math.max(...fOpened)}</td>
                                    <td>1-${Math.max(...pOpened)}</td>
                                    <td>
                                        <button class="btn btn-sm btn-primary" onclick="Admin.openLessonsModal('${u.id}')">
                                            📖 ${I18n.t('edit')}
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    async toggleAdmin(userId, currentRole) {
        if (!Auth.isSuperAdmin()) return;
        
        const newRole = currentRole === 'admin' ? 'student' : 'admin';
        
        try {
            await db.collection('users').doc(userId).update({ role: newRole });
            App.showToast(I18n.t('success'), 'success');
            this.switchSection(this.currentSection);
        } catch (e) {
            App.showToast(I18n.t('error'), 'error');
        }
    },
    
    openLessonsModal(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        const fOpened = user.openedLessons?.foundation || [1, 2];
        const pOpened = user.openedLessons?.pro || [1, 2];
        
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${I18n.t('admin_open_lessons')} — ${user.name}</h2>
                <button class="modal-close" onclick="App.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Foundation (1-8)</label>
                    <p style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">Ochilgan darslar sonini kiriting</p>
                    <input type="number" class="form-input" id="modal-foundation" min="1" max="8" value="${Math.max(...fOpened)}">
                </div>
                <div class="form-group">
                    <label class="form-label">PRO (1-12)</label>
                    <input type="number" class="form-input" id="modal-pro" min="1" max="12" value="${Math.max(...pOpened)}">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="App.closeModal()">${I18n.t('admin_cancel')}</button>
                <button class="btn btn-primary" onclick="Admin.saveLessons('${userId}')">${I18n.t('admin_save')}</button>
            </div>
        `;
        
        App.openModal();
    },
    
    async saveLessons(userId) {
        const fMax = parseInt(document.getElementById('modal-foundation').value) || 2;
        const pMax = parseInt(document.getElementById('modal-pro').value) || 2;
        
        const fLessons = [];
        for (let i = 1; i <= Math.min(fMax, 8); i++) fLessons.push(i);
        
        const pLessons = [];
        for (let i = 1; i <= Math.min(pMax, 12); i++) pLessons.push(i);
        
        try {
            await db.collection('users').doc(userId).update({
                'openedLessons.foundation': fLessons,
                'openedLessons.pro': pLessons
            });
            
            // Update local data
            const user = this.users.find(u => u.id === userId);
            if (user) {
                user.openedLessons = { foundation: fLessons, pro: pLessons };
            }
            
            // If editing own lessons, reload user data
            if (Auth.currentUser && userId === Auth.currentUser.uid) {
                await Auth.loadUserData(Auth.currentUser);
            }
            
            App.closeModal();
            App.showToast(I18n.t('success'), 'success');
            this.switchSection(this.currentSection);
        } catch (e) {
            App.showToast(I18n.t('error'), 'error');
        }
    }
};