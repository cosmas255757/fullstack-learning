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
// 3. REGISTRATION FORM VALIDATION
// ==========================================
regForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Clear previous errors inside the registration form only
    const errorSpans = regForm.querySelectorAll('.error-msg');
    errorSpans.forEach(span => span.textContent = '');

    let isValid = true;

    // Get Registration input values using unique IDs
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Username Validation (Min 6 chars)
    if (username.length < 6) {
        document.getElementById('usernameError').textContent = 'Username must be at least 6 characters.';
        isValid = false;
    }

    // Email Validation
    if (!emailPattern.test(email)) {
        document.getElementById('regEmailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Password Validation (Min 6 chars)
    if (password.length < 6) {
        document.getElementById('regPassError').textContent = 'Password must be at least 6 characters.';
        isValid = false;
    }

    // Confirm Password Validation (Match check)
    if (confirmPassword === '') {
        document.getElementById('confirmError').textContent = 'Please confirm your password.';
        isValid = false;
    } else if (confirmPassword !== password) {
        document.getElementById('confirmError').textContent = 'Passwords do not match.';
        isValid = false;
    }

    // Final Result and Field Clear
    if (isValid) {
        alert('Registration Successful!');
        regForm.reset(); // This clears all fields in the registration form
    }

});

// ==========================================
// 4. LOGIN FORM VALIDATION
// ==========================================
loginForm.addEventListener('submit',  async function (event) {
    // Stop the page from refreshing on submit
    event.preventDefault();

    // Clear previous errors inside the login form only to start fresh
    const errorSpans = loginForm.querySelectorAll('.error-msg');
    errorSpans.forEach(span => span.textContent = '');

    // Track validation status
    let isValid = true;

    // Get Login input values using unique IDs
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Email Validation: Check if it matches the email regex pattern
    if (!emailPattern.test(email)) {
        document.getElementById('loginEmailError').textContent = 'Enter a valid email.';
        isValid = false;
    }

    // Password Validation: Ensure the field is not empty
    if (password === '') {
        document.getElementById('loginPassError').textContent = 'Password is required.';
        isValid = false;
    }

    // Final Result: If all checks pass, alert the user and clear the form
   // Inside your loginForm.addEventListener('submit', ...)
if (isValid) {
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
        localStorage.setItem('userRole', data.role); // Store role locally
        window.location.href = 'dashboard.html';     // Go to dashboard
    } else {
        alert(data.message);
    }
}

});

// ==========================================
// 5. PASSWORD TOGGLE (SHOW/HIDE LOGIC)
// ==========================================
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
        // Target the input field immediately preceding the button's wrapper or parent
        const passwordInput = this.parentElement.querySelector('input');

        // Switch between password and text type
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

        // Update button text label
        this.textContent = isPassword ? 'Hide' : 'Show';
    });
});
