// Advanced Authentication Module
class AuthManager {
    constructor() {
        console.log('AuthManager initialized');
        this.initEventListeners();
    }

    // Validation Utilities
    static validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(String(email).toLowerCase());
    }

    static validatePassword(password) {
        // Strong password requirements:
        // - At least 8 characters
        // - Contains at least one uppercase letter
        // - Contains at least one lowercase letter
        // - Contains at least one number
        // - Contains at least one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    // Initialize form event listeners
    initEventListeners() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        console.log('Login Form:', loginForm);
        console.log('Register Form:', registerForm);

        if (loginForm) {
            loginForm.addEventListener('submit', (event) => {
                console.log('Login form submit event triggered');
                this.handleLogin(event);
            });
            this.addPasswordToggle(loginForm);
        } else {
            console.error('Login form not found. Check the form ID.');
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (event) => {
                console.log('Register form submit event triggered');
                this.handleRegistration(event);
            });
            this.addPasswordToggle(registerForm);
        } else {
            console.log('Register form not found.');
        }
    }

    // Login Handler
    async handleLogin(event) {
        event.preventDefault();
        
        console.log('handleLogin method called');
        
        const form = event.target;
        const email = form.querySelector('#email').value.trim();
        const password = form.querySelector('#password').value;
        const rememberMe = form.querySelector('#remember-me')?.checked;

        console.log('Login attempt:', { email, rememberMe });

        // Clear previous error messages
        this.clearErrors(form);

        // Validate inputs
        if (!this.validateLoginInputs(email, password)) {
            console.log('Login input validation failed');
            return;
        }

        try {
            const response = await this.performLogin(email, password, rememberMe);
            
            console.log('Login response:', response);
            
            if (response.success) {
                this.handleLoginSuccess(response);
            } else {
                this.handleLoginFailure(form, response.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.handleLoginError(form, error);
        }
    }

    // Validate Login Inputs
    validateLoginInputs(email, password) {
        let isValid = true;

        if (!email) {
            this.showError('email', 'Email is required');
            isValid = false;
        } else if (!AuthManager.validateEmail(email)) {
            this.showError('email', 'Invalid email format');
            isValid = false;
        }

        if (!password) {
            this.showError('password', 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    // Show Error Message
    showError(inputId, message) {
        const inputElement = document.getElementById(inputId);
        if (!inputElement) {
            console.error(`Input element with ID ${inputId} not found`);
            return;
        }

        // Add error styling
        inputElement.classList.add('border-red-500');

        // Create or update error message element
        let errorElement = inputElement.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('p');
            errorElement.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
        }
        errorElement.textContent = message;
    }

    // Clear Errors
    clearErrors(form) {
        const errorElements = form.querySelectorAll('.error-message');
        const inputElements = form.querySelectorAll('input');

        errorElements.forEach(el => el.remove());
        inputElements.forEach(input => input.classList.remove('border-red-500'));
    }

    // Simulated Login (to be replaced with actual API call)
    async performLogin(email, password, rememberMe) {
        console.log('Performing login:', { email, rememberMe });
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock authentication
        if (email === 'user@example.com' && password === 'Password123!') {
            // Store login state (in a real app, use secure token)
            this.setAuthToken({
                token: 'mock-jwt-token',
                user: { email, name: 'John Doe' }
            });
            return { 
                success: true,
                user: { email, name: 'John Doe' }
            };
        }

        return { 
            success: false, 
            message: 'Invalid email or password' 
        };
    }

    // Handle Successful Login
    handleLoginSuccess(response) {
        console.log('Login successful, redirecting to dashboard');
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }

    // Handle Login Failure
    handleLoginFailure(form, message) {
        console.log('Login failed:', message);
        // Show error at form level
        const formErrorElement = form.querySelector('.form-error') || this.createFormErrorElement(form);
        formErrorElement.textContent = message;
        formErrorElement.style.display = 'block';
    }

    // Create form error element if it doesn't exist
    createFormErrorElement(form) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('form-error', 'text-red-500', 'text-center', 'mb-4');
        form.insertBefore(errorElement, form.firstChild);
        return errorElement;
    }

    // Handle Login Error
    handleLoginError(form, error) {
        console.error('Login error:', error);
        this.handleLoginFailure(form, 'An unexpected error occurred. Please try again.');
    }

    // Set Authentication Token
    setAuthToken(authData) {
        localStorage.setItem('authToken', JSON.stringify(authData));
    }

    // Get Authentication Token
    getAuthToken() {
        return JSON.parse(localStorage.getItem('authToken'));
    }

    // Remove Authentication Token
    removeAuthToken() {
        localStorage.removeItem('authToken');
    }

    // Add Password Visibility Toggle
    addPasswordToggle(form) {
        const passwordInputs = form.querySelectorAll('input[type="password"]');
        
        passwordInputs.forEach(passwordInput => {
            const toggleButton = document.createElement('button');
            toggleButton.type = 'button';
            toggleButton.innerHTML = '👁️';
            toggleButton.classList.add('password-toggle');
            
            toggleButton.addEventListener('click', () => {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleButton.innerHTML = '🙈';
                } else {
                    passwordInput.type = 'password';
                    toggleButton.innerHTML = '👁️';
                }
            });

            // Position the toggle button
            passwordInput.parentNode.style.position = 'relative';
            toggleButton.style.position = 'absolute';
            toggleButton.style.right = '10px';
            toggleButton.style.top = '50%';
            toggleButton.style.transform = 'translateY(-50%)';
            
            passwordInput.parentNode.appendChild(toggleButton);
        });
    }
}

// Initialize AuthManager when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing AuthManager');
    new AuthManager();
});