// ==========================================
// 1. CORE INITIALIZATION & SESSION CHECK
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole'); 
    const name = localStorage.getItem('userName');

    if (!token || !role) {
        window.location.href = 'index.html';
        return;
    }

    // UI Elements
    const welcomeMsg = document.getElementById('welcomeMessage');
    const roleDisp = document.getElementById('roleDisplay');
    if (welcomeMsg) welcomeMsg.innerText = `HELLO ${name.toUpperCase()}, YOU ARE ${role.toUpperCase()}`;
    if (roleDisp) roleDisp.innerText = `Role: ${role.replace('_', ' ')}`;

    // Role-Based Section Visibility
    const sections = {
        management: document.getElementById('managementSection'),
        system: document.getElementById('systemSection'),
        borrower: document.getElementById('borrowerSection')
    };

    if (role === 'superadmin') {
        if (sections.management) sections.management.style.display = 'block';
        if (sections.system) sections.system.style.display = 'block';
        loadAdminLoans(); // Load all loans for admin
    } 
    else if (role === 'admin') {
        if (sections.management) sections.management.style.display = 'block';
        loadAdminLoans(); // Load all loans for admin
    } 
    else if (role === 'borrower') {
        if (sections.borrower) sections.borrower.style.display = 'block';
        loadLoanHistory(); // Load personal history
    }
});

// ==========================================
// 2. BORROWER LOGIC: APPLY & HISTORY
// ==========================================
const loanForm = document.getElementById('loanForm');
loanForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const loanData = {
        amount: document.getElementById('loanAmount').value,
        living_location: document.getElementById('loanLocation').value,
        installment_type: document.getElementById('installmentType').value,
        loan_reason: document.getElementById('loanReason').value
    };

    try {
        const res = await fetch('http://localhost:3000/api/loans/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(loanData)
        });
        const result = await res.json();
        if (result.success) {
            alert("Application Submitted!");
            loanForm.reset();
            loadLoanHistory();
        } else { alert(result.message); }
    } catch (err) { alert("Server error."); }
});

async function loadLoanHistory() {
    const token = localStorage.getItem('token');
    const historyList = document.getElementById('loanHistoryList');
    if (!historyList) return;

    const res = await fetch('http://localhost:3000/api/loans/my-loans', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();

    if (result.success) {
        historyList.innerHTML = result.data.map(loan => `
            <div class="loan-item" style="color:white; background:rgba(255,255,255,0.1); padding:10px; margin-top:10px; border-radius:8px;">
                <p><strong>Amount:</strong> ${Number(loan.amount).toLocaleString()} Tsh</p>
                <p><strong>Status:</strong> <span class="status-${loan.status}">${loan.status.toUpperCase()}</span></p>
            </div>
        `).join('') || "<p>No loans found.</p>";
    }
}

// ==========================================
// 3. ADMIN LOGIC: VIEW ALL & PROCESS
// ==========================================
async function loadAdminLoans() {
    const token = localStorage.getItem('token');
    const list = document.getElementById('allLoansList');
    if (!list) return;

    const res = await fetch('http://localhost:3000/api/loans/all', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();

    if (result.success) {
        list.innerHTML = result.data.map(loan => `
            <tr>
                <td>${loan.username}</td>
                <td>${Number(loan.amount).toLocaleString()}</td>
                <td class="status-${loan.status}">${loan.status.toUpperCase()}</td>
                <td>
                    ${loan.status === 'pending' ? `
                        <button onclick="processLoan(${loan.id}, 'approved')" style="background:green; padding:5px;">✓</button>
                        <button onclick="processLoan(${loan.id}, 'rejected')" style="background:red; padding:5px;">X</button>
                    ` : 'Processed'}
                </td>
            </tr>
        `).join('');
    }
}

async function processLoan(loanId, status) {
    const token = localStorage.getItem('token');
    if (!confirm(`Are you sure you want to ${status} this loan?`)) return;

    try {
        const res = await fetch('http://localhost:3000/api/loans/process', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ loanId, status })
        });
        const result = await res.json();
        if (result.success) {
            alert(result.message);
            loadAdminLoans(); // Refresh table
        }
    } catch (err) { alert("Error processing loan."); }
}

// Expose processLoan to the global window so the HTML buttons can find it
window.processLoan = processLoan;

// ==========================================
// 4. LOGOUT
// ==========================================
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});
