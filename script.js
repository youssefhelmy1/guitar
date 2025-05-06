document.addEventListener('DOMContentLoaded', function() {
    // Auth elements
    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const experienceOptions = document.querySelectorAll('.experience-option');
    
    // Booking elements
    const dayOptions = document.querySelectorAll('.day-option');
    const timeSlots = document.querySelectorAll('.time-slot');
    const packageSelect = document.getElementById('package');
    const paypalContainer = document.getElementById('paypal-button-container');
    
    // Summary elements
    const summaryPackage = document.getElementById('summaryPackage');
    const summaryDate = document.getElementById('summaryDate');
    const summaryTime = document.getElementById('summaryTime');
    const summaryTotal = document.getElementById('summaryTotal');
    
    // User session state
    let isLoggedIn = false;
    
    // Check if user is logged in using AJAX
    function checkLoginStatus() {
        fetch('check_login.php')
            .then(response => response.json())
            .then(data => {
                isLoggedIn = data.logged_in;
                updateLoginButton();
                
                // If on booking section and not logged in, show login modal
                if (window.location.hash === '#booking' && !isLoggedIn) {
                    openAuthModal();
                } else if (isLoggedIn && window.location.hash === '#booking') {
                    enableBookingForm();
                }
            })
            .catch(error => console.error('Error checking login status:', error));
    }
    
    // Update login button text based on login status
    function updateLoginButton() {
        if (isLoggedIn) {
            loginBtn.textContent = 'My Account';
        } else {
            loginBtn.textContent = 'Login';
        }
    }
    
    // Initially check login status
    checkLoginStatus();
    
    // Open auth modal
    function openAuthModal() {
        authModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Close auth modal
    function closeAuthModal() {
        authModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Allow scrolling
    }
    
            // Check login status again in case it has changed
            fetch('check_login.php')
                .then(response => response.json())
                .then(data => {
                    isLoggedIn = data.logged_in;
                    updateLoginButton();
    
                    if (isLoggedIn) {
                        window.location.href = 'dashboard.php';
                    } else {
                        openAuthModal();
                    }
                })
                .catch(error => {
                    console.error('Error checking login status:', error);
                    openAuthModal(); // fallback to modal if error
                });
        });
    }
    
    // Close modal button
    if (closeModal) {
        closeModal.addEventListener('click', closeAuthModal);
    }
    
    // Auth tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding form
            const formId = this.getAttribute('data-tab') + 'Form';
            document.getElementById(formId).classList.add('active');
        });
    });
    
    // Experience level selection
    experienceOptions.forEach(option => {
        option.addEventListener('click', function() {
            experienceOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
         
            // Validate inputs
            if (!email || !password) {
                showAuthMessage('Please enter both email and password', 'error');
                return;
            }
            
            // Send login request
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            
            fetch('login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    isLoggedIn = true;
                    updateLoginButton();
                    closeAuthModal();
                    
                    // If on booking page, enable booking
                    if (window.location.hash === '#booking') {
                        enableBookingForm();
                    }
                } else {
                    showAuthMessage(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                showAuthMessage('An error occurred. Please try again.', 'error');
            });
            
            // Validate inputs
            if (!name || !email || !password) {
                showAuthMessage('Please fill in all required fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showAuthMessage('Passwords do not match', 'error');
                return;
            }
            
            fetch('signup.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    isLoggedIn = true;
                    updateLoginButton();
                    closeAuthModal();
                    
                    // If on booking page, enable booking
                    if (window.location.hash === '#booking') {
                        enableBookingForm();
                    }
                } else {
                    showAuthMessage(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Signup error:', error);
                showAuthMessage('An error occurred. Please try again.', 'error');
            });
    
    // Show message in auth modal
    function showAuthMessage(message, type) {
        let messageEl = document.querySelector('.auth-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'auth-message';
            document.querySelector('.modal-content').prepend(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}-message`;
        messageEl.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
    
    // Enable booking form when logged in
    function enableBookingForm() {
        // Show booking form
        document.querySelector('.booking-form').classList.remove('login-required');
        
        // Initialize booking functionality
        initializeBookingForm();
        setupUnavailableSlots();
    }
    
    // Track selected values
    let selectedDay = null;
    let selectedTime = null;
    let selectedPackage = 'single';
    
    // Initialize booking form
    function initializeBookingForm() {
        // Add click event to day options
        dayOptions.forEach(day => {
            day.addEventListener('click', function() {
                // Remove selected class from all days
                dayOptions.forEach(d => d.classList.remove('selected'));
                // Add selected class to clicked day
                this.classList.add('selected');
                selectedDay = this.getAttribute('data-day');
                updateSummary();
                
                // Hide day selection required message
                document.getElementById('dayRequired').style.display = 'none';
            });
        });
        
        // Add click event to time slots
        timeSlots.forEach(slot => {
            slot.addEventListener('click', function() {
                // Skip if slot is unavailable
                if (this.classList.contains('unavailable')) return;
                
                // Remove selected class from all slots
                timeSlots.forEach(s => s.classList.remove('selected'));
                // Add selected class to clicked slot
                this.classList.add('selected');
                selectedTime = this.getAttribute('data-time');
                updateSummary();
                
                // Hide time selection required message
                document.getElementById('timeRequired').style.display = 'none';
            });
        });
        
        // Package selection change event
        if (packageSelect) {
            packageSelect.addEventListener('change', function() {
                selectedPackage = this.value;
                updateSummary();
            });
        }
    }
    
    // Check if the user is on the booking section
    if (window.location.hash === '#booking') {
        if (isLoggedIn) {
            enableBookingForm();
        } else {
            openAuthModal();
        }
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#booking' && !isLoggedIn) {
            openAuthModal();
        }
    });
    
    // Update booking summary
    function updateSummary() {
        // Update package info
        if (selectedPackage === 'package') {
            summaryPackage.textContent = '12-Lesson Package';
            summaryTotal.textContent = '$200.00';
        } else {
            summaryPackage.textContent = 'Single Lesson';
            summaryTotal.textContent = '$25.00';
        }
        
        // Update date and time
        summaryDate.textContent = selectedDay ? selectedDay : 'Not selected';
        summaryTime.textContent = selectedTime ? formatTime(selectedTime) : 'Not selected';
        
        // Check if all selections are made
        validateSelections();
    }
    
    // Format time for display
    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        
        if (hour === 0) {
            return '12:00 AM';
        } else if (hour < 12) {
            return `${hour}:${minutes} AM`;
        } else if (hour === 12) {
            return `12:${minutes} PM`;
        } else {
            return `${hour - 12}:${minutes} PM`;
        }
    }
    
    // Validate all selections are made
    function validateSelections() {
        const isValid = selectedDay && selectedTime;
        
        // Update PayPal button status
        if (isValid && paypalContainer) {
            paypalContainer.classList.remove('disabled');
        } else if (paypalContainer) {
            paypalContainer.classList.add('disabled');
        }
    }
    
    // Function to complete booking after successful payment
    function completeBooking(paymentDetails) {
        // Send booking data to server
        const bookingData = {
            package: selectedPackage,
            day: selectedDay,
            time: selectedTime,
            paymentID: paymentDetails.id
        };
        
        fetch('save_booking.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
                showMessage(`
                    <h3>Booking Successful!</h3>
                    <p>Thank you, ${paymentDetails.payer.name.given_name}! Your lesson has been booked.</p>
                    <p><strong>Details:</strong></p>
                    <p>${selectedPackage === 'package' ? '12-Lesson Package' : 'Single Lesson'}<br>
                    Day: ${selectedDay}<br>
                    Time: ${formatTime(selectedTime)}</p>
                    <p>A confirmation email will be sent to you shortly.</p>
                `, 'success');
                
                // Reset form
                resetForm();
            } else {
                showMessage('Error saving booking: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Booking error:', error);
            showMessage('An error occurred while saving your booking. Please try again.', 'error');
        });
    }
    
    // Show message to user
    function showMessage(message, type) {
        // Create message element if it doesn't exist
        let messageEl = document.getElementById('bookingMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'bookingMessage';
            document.querySelector('.booking-form').appendChild(messageEl);
        }
        
        // Set message content and style
        messageEl.innerHTML = message;
        messageEl.className = `booking-message ${type}-message`;
        messageEl.style.display = 'block';
        
        // Scroll to message
        messageEl.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Reset form after booking
    function resetForm() {
        // Reset selections
        dayOptions.forEach(d => d.classList.remove('selected'));
        timeSlots.forEach(s => s.classList.remove('selected'));
        packageSelect.value = 'single';
        
        // Reset variables
        selectedDay = null;
        selectedTime = null;
        selectedPackage = 'single';
        
        // Update summary
        updateSummary();
    }
    
    // Setup unavailable time slots
    function setupUnavailableSlots() {
        // Get unavailable slots from server
        fetch('get_booked_slots.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Mark unavailable slots
                    data.booked_slots.forEach(slot => {
                        const dayElement = document.querySelector(`.day-option[data-day="${slot.day}"]`);
                        const timeElement = document.querySelector(`.time-slot[data-time="${slot.time}"]`);
                        
                        if (dayElement && timeElement) {
                            timeElement.classList.add('unavailable');
                            
                            // Add tooltip
                            const tooltip = document.createElement('span');
                            tooltip.className = 'tooltip-text';
                            tooltip.textContent = 'Already booked';
                            timeElement.classList.add('tooltip');
                            timeElement.appendChild(tooltip);
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error loading booked slots:', error);
            });
    }

    // Handle "Sign in with Google" button click
    const googleAuthBtn = document.querySelector('.social-auth-btn.google');
    if (googleAuthBtn) {
        googleAuthBtn.addEventListener('click', function() {
            window.location.href = 'login.php?google_auth=1';
        });
    }

    // Password strength indicator
    const signupPassword = document.getElementById('signupPassword');
    const passwordStrength = document.querySelector('.password-strength');
    
    if (signupPassword && passwordStrength) {
        signupPassword.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength += 1;
            
            // Uppercase check
            if (/[A-Z]/.test(password)) strength += 1;
            
            // Lowercase check
            if (/[a-z]/.test(password)) strength += 1;
            
            // Number check
            if (/[0-9]/.test(password)) strength += 1;
            
            // Special character check
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            // Update strength indicator
            passwordStrength.className = 'password-strength';
            
            if (password.length === 0) {
                passwordStrength.style.width = '0%';
                passwordStrength.classList.add('empty');
            } else if (strength <= 2) {
                passwordStrength.style.width = '33%';
                passwordStrength.classList.add('weak');
            } else if (strength <= 4) {
                passwordStrength.style.width = '66%';
                passwordStrength.classList.add('medium');
            } else {
                passwordStrength.style.width = '100%';
                passwordStrength.classList.add('strong');
            }
        });
    }
});

// Initialize if logged in
if (isLoggedIn) {
    setupUnavailableSlots();
    enableBookingForm();
}

// Handle "Sign in with Google" button click
const googleAuthBtn = document.querySelector('.social-auth-btn.google');
if (googleAuthBtn) {
    googleAuthBtn.addEventListener('click', function() {
        window.location.href = 'login.php?google_auth=1';
    });
}

// Password strength indicator
const signupPassword = document.getElementById('signupPassword');
const passwordStrength = document.querySelector('.password-strength');

if (signupPassword && passwordStrength) {
    signupPassword.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        
        // Uppercase check
        if (/[A-Z]/.test(password)) strength += 1;
        
        // Lowercase check
        if (/[a-z]/.test(password)) strength += 1;
        
        // Number check
        if (/[0-9]/.test(password)) strength += 1;
        
        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update strength indicator
        passwordStrength.className = 'password-strength';
        
        if (password.length === 0) {
            passwordStrength.style.width = '0%';
            passwordStrength.classList.add('empty');
        } else if (strength <= 2) {
            passwordStrength.style.width = '33%';
            passwordStrength.classList.add('weak');
        } else if (strength <= 4) {
            passwordStrength.style.width = '66%';
            passwordStrength.classList.add('medium');
        } else {
            passwordStrength.style.width = '100%';
            passwordStrength.classList.add('strong');
        }
    });
}