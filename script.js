// DOM Elements
const dayOptions = document.querySelectorAll('.day-option');
const timeSlots = document.querySelectorAll('.time-slot');
const bookBtn = document.getElementById('bookBtn');
const successMessage = document.getElementById('successMessage');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const experienceOptions = document.querySelectorAll('.experience-option');

// Helper function to toggle classes
function toggleClass(element, className) {
    element.classList.toggle(className);
}

// Initialize booking state
let bookingState = {
    package: 'single',
    day: null,
    time: null,
    isAuthenticated: false
};

// Set up calendar functionality
dayOptions.forEach(dayOption => {
    dayOption.addEventListener('click', function() {
        // Remove selected class from all day options
        dayOptions.forEach(day => day.classList.remove('selected'));
        
        // Add selected class to clicked day option
        this.classList.add('selected');
        
        // Update booking state
        bookingState.day = this.textContent;
        
        // Show available time slots for the selected day
        updateAvailableTimeSlots();
    });
});

// Time slot selection
timeSlots.forEach(timeSlot => {
    timeSlot.addEventListener('click', function() {
        if (this.classList.contains('unavailable')) return;
        
        // Remove selected class from all time slots
        timeSlots.forEach(slot => slot.classList.remove('selected'));
        
        // Add selected class to clicked time slot
        this.classList.add('selected');
        
        // Update booking state
        bookingState.time = this.textContent;
    });
});

// Package selection
document.getElementById('package').addEventListener('change', function() {
    bookingState.package = this.value;
});

// Book button click event
bookBtn.addEventListener('click', function() {
    if (!bookingState.day || !bookingState.time) {
        alert('Please select both a day and time for your lesson.');
        return;
    }
    
    // Check if user is authenticated, if not, show auth modal
    if (!bookingState.isAuthenticated) {
        authModal.classList.add('active');
        return;
    }
    
    // Process booking
    processBooking();
});

// Process booking function
function processBooking() {
    // Here you would typically send the booking data to your server
    console.log('Booking processed:', bookingState);
    
    // Show success message
    successMessage.style.display = 'block';
    
    // Reset form after 3 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
        resetBookingForm();
    }, 3000);
}

// Reset booking form
function resetBookingForm() {
    dayOptions.forEach(day => day.classList.remove('selected'));
    timeSlots.forEach(slot => {
        slot.classList.remove('selected');
        slot.classList.remove('unavailable');
    });
    document.getElementById('package').value = 'single';
    bookingState = {
        package: 'single',
        day: null,
        time: null,
        isAuthenticated: bookingState.isAuthenticated
    };
}

// Update available time slots based on selected day
function updateAvailableTimeSlots() {
    // Reset all time slots
    timeSlots.forEach(slot => {
        slot.classList.remove('unavailable');
    });
    
    // Simulate some time slots being unavailable based on the day
    // In a real application, this would come from your backend
    const unavailableTimes = getUnavailableTimes(bookingState.day);
    
    unavailableTimes.forEach(time => {
        const slot = Array.from(timeSlots).find(slot => slot.textContent === time);
        if (slot) {
            slot.classList.add('unavailable');
        }
    });
}

// Get unavailable times for a given day (simulation)
function getUnavailableTimes(day) {
    // This would typically come from your backend
    const unavailableTimes = {
        'Monday': ['3:00 PM', '4:00 PM', '5:00 PM'],
        'Tuesday': ['7:00 PM', '8:00 PM'],
        'Wednesday': ['6:00 PM', '9:00 PM'],
        'Thursday': ['10:00 PM', '11:00 PM'],
        'Friday': ['12:00 AM', '1:00 AM'],
        'Saturday': ['3:00 PM', '8:00 PM'],
        'Sunday': ['5:00 PM', '6:00 PM', '7:00 PM']
    };
    
    return unavailableTimes[day] || [];
}

// Authentication modal functionality
closeModal.addEventListener('click', function() {
    authModal.classList.remove('active');
});

// Auth tabs functionality
authTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Remove active class from all tabs and forms
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding form
        this.classList.add('active');
        document.getElementById(`${tabName}Form`).classList.add('active');
    });
});

// Experience level selection
experienceOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Remove selected class from all experience options
        experienceOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked experience option
        this.classList.add('selected');
    });
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validate login (this would typically be done on the server)
    if (email && password) {
        // Set authenticated state
        bookingState.isAuthenticated = true;
        
        // Close modal
        authModal.classList.remove('active');
        
        // Show success message
        alert('Login successful! You can now book your lesson.');
    } else {
        alert('Please enter both email and password.');
    }
});

// Signup form submission
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validate signup
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    
    // Set authenticated state
    bookingState.isAuthenticated = true;
    
    // Close modal
    authModal.classList.remove('active');
    
    // Show success message
    alert('Account created successfully! You can now book your lesson.');
});

// Show auth modal when clicking on header CTA buttons
document.querySelectorAll('.call-to-action').forEach(cta => {
    if (cta.getAttribute('href') === '#booking') {
        cta.addEventListener('click', function(event) {
            if (!bookingState.isAuthenticated) {
                event.preventDefault();
                authModal.classList.add('active');
            }
        });
    }
});

// Add hover effects and animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    featureCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});