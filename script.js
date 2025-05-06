document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const experienceOptions = document.querySelectorAll('.experience-option');
    const dayOptions = document.querySelectorAll('.day-option');
    const timeSlots = document.querySelectorAll('.time-slot');
    const packageSelect = document.getElementById('package');
    const paypalContainer = document.getElementById('paypal-button-container');
    const summaryPackage = document.getElementById('summaryPackage');
    const summaryDate = document.getElementById('summaryDate');
    const summaryTime = document.getElementById('summaryTime');
    const summaryTotal = document.getElementById('summaryTotal');
    const googleAuthBtn = document.querySelector('.social-auth-btn.google');
    const signupPassword = document.getElementById('signupPassword');
    const passwordStrength = document.querySelector('.password-strength');

    let isLoggedIn = false;
    let selectedDay = null;
    let selectedTime = null;
    let selectedPackage = 'single';

    function checkLoginStatus() {
        fetch('check_login.php')
            .then(res => res.json())
            .then(data => {
                isLoggedIn = data.logged_in;
                updateLoginButton();

                if (window.location.hash === '#booking') {
                    isLoggedIn ? enableBookingForm() : openAuthModal();
                }
            })
            .catch(err => {
                console.error('Login check error:', err);
                if (window.location.hash === '#booking') openAuthModal();
            });
    }

    function updateLoginButton() {
        loginBtn.textContent = isLoggedIn ? 'My Account' : 'Login';
    }

    function openAuthModal() {
        authModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeAuthModal() {
        authModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (closeModal) closeModal.addEventListener('click', closeAuthModal);

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
        });
    });

    experienceOptions.forEach(option => {
        option.addEventListener('click', () => {
            experienceOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
        });
    });

    function showAuthMessage(message, type) {
        let msgEl = document.querySelector('.auth-message') || document.createElement('div');
        msgEl.className = `auth-message ${type}-message`;
        msgEl.textContent = message;
        msgEl.style.display = 'block';
        document.querySelector('.modal-content').prepend(msgEl);
        setTimeout(() => msgEl.style.display = 'none', 5000);
    }

    function enableBookingForm() {
        document.querySelector('.booking-form').classList.remove('login-required');
        initializeBookingForm();
        setupUnavailableSlots();
    }

    function initializeBookingForm() {
        dayOptions.forEach(day => {
            day.addEventListener('click', () => {
                dayOptions.forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                selectedDay = day.dataset.day;
                document.getElementById('dayRequired').style.display = 'none';
                updateSummary();
            });
        });

        timeSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                if (slot.classList.contains('unavailable')) return;
                timeSlots.forEach(s => s.classList.remove('selected'));
                slot.classList.add('selected');
                selectedTime = slot.dataset.time;
                document.getElementById('timeRequired').style.display = 'none';
                updateSummary();
            });
        });

        packageSelect.addEventListener('change', () => {
            selectedPackage = packageSelect.value;
            updateSummary();
        });
    }

    function updateSummary() {
        summaryPackage.textContent = selectedPackage === 'package' ? '12-Lesson Package' : 'Single Lesson';
        summaryTotal.textContent = selectedPackage === 'package' ? '$200.00' : '$25.00';
        summaryDate.textContent = selectedDay || 'Not selected';
        summaryTime.textContent = selectedTime ? formatTime(selectedTime) : 'Not selected';
        validateSelections();
    }

    function formatTime(time) {
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        return hour === 0 ? `12:${m} AM` : hour < 12 ? `${hour}:${m} AM` : hour === 12 ? `12:${m} PM` : `${hour - 12}:${m} PM`;
    }

    function validateSelections() {
        if (paypalContainer) paypalContainer.classList.toggle('disabled', !(selectedDay && selectedTime));
    }

    function completeBooking(paymentDetails) {
        const bookingData = {
            package: selectedPackage,
            day: selectedDay,
            time: selectedTime,
            paymentID: paymentDetails.id
        };

        fetch('save_booking.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showMessage(`
                    <h3>Booking Successful!</h3>
                    <p>Thank you, ${paymentDetails.payer.name.given_name}! Your lesson has been booked.</p>
                    <p><strong>Details:</strong><br>${selectedPackage === 'package' ? '12-Lesson Package' : 'Single Lesson'}<br>Day: ${selectedDay}<br>Time: ${formatTime(selectedTime)}</p>
                    <p>A confirmation email will be sent to you shortly.</p>
                `, 'success');
                resetForm();
            } else {
                showMessage('Error: ' + data.message, 'error');
            }
        })
        .catch(err => {
            console.error('Booking error:', err);
            showMessage('Booking failed. Try again.', 'error');
        });
    }

    function showMessage(message, type) {
        let msg = document.getElementById('bookingMessage') || document.createElement('div');
        msg.id = 'bookingMessage';
        msg.innerHTML = message;
        msg.className = `booking-message ${type}-message`;
        document.querySelector('.booking-form').appendChild(msg);
        msg.scrollIntoView({ behavior: 'smooth' });
    }

    function resetForm() {
        dayOptions.forEach(d => d.classList.remove('selected'));
        timeSlots.forEach(s => s.classList.remove('selected'));
        packageSelect.value = 'single';
        selectedDay = null;
        selectedTime = null;
        selectedPackage = 'single';
        updateSummary();
    }

    function setupUnavailableSlots() {
        fetch('get_booked_slots.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    data.booked_slots.forEach(slot => {
                        const timeElement = document.querySelector(`.time-slot[data-time="${slot.time}"]`);
                        if (timeElement) {
                            timeElement.classList.add('unavailable');
                            const tip = document.createElement('span');
                            tip.className = 'tooltip-text';
                            tip.textContent = 'Already booked';
                            timeElement.classList.add('tooltip');
                            timeElement.appendChild(tip);
                        }
                    });
                }
            })
            .catch(err => console.error('Unavailable slot fetch error:', err));
    }

    if (googleAuthBtn) {
        googleAuthBtn.addEventListener('click', () => {
            window.location.href = 'login.php?google_auth=1';
        });
    }

    if (signupPassword && passwordStrength) {
        signupPassword.addEventListener('input', function() {
            const pwd = this.value;
            let strength = 0;
            if (pwd.length >= 8) strength++;
            if (/[A-Z]/.test(pwd)) strength++;
            if (/[a-z]/.test(pwd)) strength++;
            if (/[0-9]/.test(pwd)) strength++;
            if (/[^A-Za-z0-9]/.test(pwd)) strength++;

            passwordStrength.className = 'password-strength';
            passwordStrength.style.width = ['0%', '33%', '66%', '66%', '100%'][Math.min(strength, 4)];
            passwordStrength.classList.add(['empty', 'weak', 'medium', 'medium', 'strong'][Math.min(strength, 4)]);
        });
    }

    checkLoginStatus();
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#booking' && !isLoggedIn) openAuthModal();
    });
});
