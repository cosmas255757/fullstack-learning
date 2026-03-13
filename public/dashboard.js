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

    if (role === 'superadmin') {
        if (sections.management) sections.management.style.display = 'block';
        if (sections.system) sections.system.style.display = 'block';
    } 
    else if (role === 'admin') {
        if (sections.management) sections.management.style.display = 'block';
    } 
    else if (role === 'borrower') {
        if (sections.borrower) sections.borrower.style.display = 'block';
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
            console.log("Fetched Role Data:", result.data);
            // Example: Update a specific stat if it exists in the data
            // if (result.data.stats) document.getElementById('statsBox').innerText = result.data.stats;
        } else if (response.status === 403 || response.status === 401) {
            // Token expired or invalid
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
