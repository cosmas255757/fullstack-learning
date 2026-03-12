// ==========================================
// 1. FORM ELEMENT REFERENCES
// ==========================================
const regForm = document.getElementById('registrationForm');
const loginForm = document.getElementById('loginForm');
const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');

// Common Email validation pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// 2. TOGGLE BETWEEN LOGIN & REGISTER
// ==========================================

// Switch to Login View
showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    regForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Switch to Registration View
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    regForm.style.display = 'block';
});

// ==========================================
// 3. REGISTRATION FORM VALIDATION & API CALL
// ==========================================
regForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Clear previous errors
    const errorSpans = regForm.querySelectorAll('.error-msg');
    errorSpans.forEach(span => span.textContent = '');

    let isValid = true;

    // Get Registration input values
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Username Validation
    if (username.length < 6) {
        document.getElementById('usernameError').textContent = 'Username must be at least 6 characters.';
        isValid = false;
    }

    // Email Validation
    if (!emailPattern.test(email)) {
        document.getElementById('regEmailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Password Validation
    if (password.length < 6) {
        document.getElementById('regPassError').textContent = 'Password must be at least 6 characters.';
        isValid = false;
    }

    // Confirm Password Validation
    if (confirmPassword === '') {
        document.getElementById('confirmError').textContent = 'Please confirm your password.';
        isValid = false;
    } else if (confirmPassword !== password) {
        document.getElementById('confirmError').textContent = 'Passwords do not match.';
        isValid = false;
    }

    // Send data to Backend if valid
    if (isValid) {
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role: 'borrower' // Default role for new signups
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Registration Successful! Please login.');
                regForm.reset();
                // Switch to login view
                regForm.style.display = 'none';
                loginForm.style.display = 'block';
            } else {
                alert(data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Could not connect to the server.');
        }
    }
});

// ==========================================
// 4. LOGIN FORM VALIDATION & API CALL
// ==========================================
loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Clear previous errors
    const errorSpans = loginForm.querySelectorAll('.error-msg');
    errorSpans.forEach(span => span.textContent = '');

    let isValid = true;

    // Get Login input values
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!emailPattern.test(email)) {
        document.getElementById('loginEmailError').textContent = 'Enter a valid email.';
        isValid = false;
    }

    if (password === '') {
        document.getElementById('loginPassError').textContent = 'Password is required.';
        isValid = false;
    }

    // API Call for Login
    if (isValid) {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.success) {

                localStorage.setItem("token", data.token);
                localStorage.setItem("userRole", data.role);
                localStorage.setItem("userName", data.username);

                window.location.href = "dashboard.html";
            } else {
                alert(data.message || 'Login failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Could not connect to the server.');
        }
    }
});

// ==========================================
// 5. PASSWORD TOGGLE (SHOW/HIDE LOGIC)
// ==========================================
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
        const passwordInput = this.parentElement.querySelector('input');
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        this.textContent = isPassword ? 'Hide' : 'Show';
    });
});


// ==========================================
// 1. SESSION CHECK & DISPLAY LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');

    // If no role is found, the user isn't logged in, redirect to login page
    if (!role) {
        window.location.href = 'index.html';
        return;
    }

    // Display the specific message requested
    document.getElementById('welcomeMessage').innerText = `HELLO ${name.toUpperCase()}, YOU ARE ${role.toUpperCase()}`;
    document.getElementById('roleDisplay').innerText = `Role: ${role.replace('_', ' ')}`;
});

// ==========================================
// 2. LOGOUT LOGIC
// ==========================================
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear(); // Clear all user data
    window.location.href = 'index.html'; // Go back to login
});