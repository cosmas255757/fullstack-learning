// ==========================================
// 1. ELEMENT REFERENCES
// ==========================================
const regForm = document.getElementById('registrationForm');
const loginForm = document.getElementById('loginForm');
const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// 2. UI TOGGLES & UTILS
// ==========================================
const toggleView = (hide, show) => {
    hide.style.display = 'none';
    show.style.display = 'block';
};

showLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleView(regForm, loginForm);
});

showRegister?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleView(loginForm, regForm);
});

// Password Show/Hide Logic
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
        const input = this.parentElement.querySelector('input');
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        this.textContent = isPass ? 'Hide' : 'Show';
    });
});

// ==========================================
// 3. REGISTRATION LOGIC
// ==========================================
regForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear Errors
    regForm.querySelectorAll('.error-msg').forEach(s => s.textContent = '');

    const fields = {
        username: document.getElementById('regUsername').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        password: document.getElementById('regPassword').value,
        confirm: document.getElementById('confirmPassword').value
    };

    let isValid = true;

    if (fields.username.length < 6) {
        document.getElementById('usernameError').textContent = 'Min 6 characters required.';
        isValid = false;
    }
    if (!emailPattern.test(fields.email)) {
        document.getElementById('regEmailError').textContent = 'Invalid email address.';
        isValid = false;
    }
    if (fields.password.length < 6) {
        document.getElementById('regPassError').textContent = 'Min 6 characters required.';
        isValid = false;
    }
    if (fields.confirm !== fields.password) {
        document.getElementById('confirmError').textContent = 'Passwords do not match.';
        isValid = false;
    }

    if (isValid) {
        try {
            const res = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...fields, role: 'borrower' })
            });
            const data = await res.json();

            if (data.success) {
                alert('Success! Please login.');
                regForm.reset();
                toggleView(regForm, loginForm);
            } else {
                alert(data.message || 'Registration failed.');
            }
        } catch (err) {
            alert('Server connection failed.');
        }
    }
});

// ==========================================
// 4. LOGIN LOGIC
// ==========================================
loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    loginForm.querySelectorAll('.error-msg').forEach(s => s.textContent = '');

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!emailPattern.test(email) || !password) {
        alert("Please fill in valid credentials.");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("userName", data.username);
            window.location.href = "dashboard.html";
        } else {
            alert(data.message || 'Login failed.');
        }
    } catch (err) {
        alert('Server connection failed.');
    }
});



