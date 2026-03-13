// ==========================================
// 1. SESSION CHECK & UI INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole'); // 'superadmin', 'admin', or 'borrower'
    const name = localStorage.getItem('userName');

    // Redirect if not logged in
    if (!token || !role) {
        window.location.href = 'index.html';
        return;
    }

    // Update Basic Welcome Info
    const welcomeMsg = document.getElementById('welcomeMessage');
    const roleDisp = document.getElementById('roleDisplay');

    if (welcomeMsg) welcomeMsg.innerText = `HELLO ${name.toUpperCase()}, YOU ARE ${role.toUpperCase()}`;
    if (roleDisp) roleDisp.innerText = `Role: ${role.replace('_', ' ')}`;

    // ==========================================
    // 2. ROLE-BASED VISIBILITY (UI SECTIONS)
    // ==========================================

    const sections = {
        management: document.getElementById('managementSection'),
        system: document.getElementById('systemSection'),
        borrower: document.getElementById('borrowerSection')
    };

    // Use 'flex' instead of 'block' to maintain the button grid layout
    if (role === 'superadmin') {
        if (sections.management) sections.management.style.display = 'flex';
        if (sections.system) sections.system.style.display = 'flex';
    }
    else if (role === 'admin') {
        if (sections.management) sections.management.style.display = 'flex';
    }
    else if (role === 'borrower') {
        if (sections.borrower) sections.borrower.style.display = 'flex';
    }


    // ==========================================
    // 3. FETCH ROLE-SPECIFIC DATA FROM API
    // ==========================================
    try {
        const response = await fetch('http://localhost:3000/api/dashboard-data', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json();

        if (result.success) {
            const data = result.data;
            console.log("Fetched Dashboard Data:", data);

            // 1. Update Global/Shared Content (News)
            const commonSection = document.getElementById('commonSection');
            if (data.sharedNews && commonSection) {
                const newsEl = document.createElement('p');
                newsEl.className = 'data-text';
                newsEl.innerHTML = `<strong>News:</strong> ${data.sharedNews}`;
                commonSection.prepend(newsEl); // Put news at the top of the common section
            }

            // 2. Update Admin/SuperAdmin Stats
            if (data.stats) {
                const managementSection = document.getElementById('managementSection');
                const statsEl = document.createElement('div');
                statsEl.className = 'data-text';
                statsEl.innerText = data.stats;
                managementSection.prepend(statsEl);
            }

            // 3. Update Borrower Loan Info
            if (data.myLoans) {
                const borrowerSection = document.getElementById('borrowerSection');
                const loanEl = document.createElement('div');
                loanEl.className = 'data-text';
                loanEl.innerText = data.myLoans;
                borrowerSection.prepend(loanEl);
            }

            // 4. Update SuperAdmin Logs (if applicable)
            if (data.adminLogs && Array.isArray(data.adminLogs)) {
                const systemSection = document.getElementById('systemSection');
                const logContainer = document.createElement('div');
                logContainer.className = 'data-text log-list';
                logContainer.innerHTML = '<strong>Logs:</strong><br>' + data.adminLogs.join('<br>');
                systemSection.prepend(logContainer);
            }

        } else if (response.status === 403 || response.status === 401) {
            // Handle Session Expiry
            localStorage.clear();
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Data fetch error:', error);
    }
});

// ==========================================
// 4. LOGOUT LOGIC
// ==========================================
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});
