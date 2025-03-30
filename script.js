document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const dayOptions = document.querySelectorAll('.day-option');
    const timeSlots = document.querySelectorAll('.time-slot');
    const packageSelect = document.getElementById('package');
    const bookBtn = document.getElementById('bookBtn');
    const paypalContainer = document.getElementById('paypal-button-container');
    
    // Summary elements
    const summaryPackage = document.getElementById('summaryPackage');
    const summaryDate = document.getElementById('summaryDate');
    const summaryTime = document.getElementById('summaryTime');
    const summaryTotal = document.getElementById('summaryTotal');
    
    // Initially hide the book button and show PayPal
    bookBtn.style.display = 'none';
    paypalContainer.style.display = 'block';
    
    // Track selected values
    let selectedDay = null;
    let selectedTime = null;
    let selectedPackage = 'single';
    
    // Add click event to day options
    dayOptions.forEach(day => {
        day.addEventListener('click', function() {
            // Remove selected class from all days
            dayOptions.forEach(d => d.classList.remove('selected'));
            // Add selected class to clicked day
            this.classList.add('selected');
            selectedDay = this.getAttribute('data-day');
            updateSummary();
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
        });
    });
    
    // Package selection change event
    packageSelect.addEventListener('change', function() {
        selectedPackage = this.value;
        updateSummary();
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
        if (isValid) {
            paypalContainer.classList.remove('disabled');
        } else {
            paypalContainer.classList.add('disabled');
        }
    }
    
    // Initialize PayPal
    paypal.Buttons({
        createOrder: function(data, actions) {
            // Validate selections before creating order
            if (!selectedDay || !selectedTime) {
                alert('Please select both a day and time before proceeding to payment.');
                return null;
            }
            
            const amount = selectedPackage === 'package' ? '200.00' : '25.00';
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount
                    },
                    description: `Guitar Lesson: ${selectedPackage === 'package' ? '12-Lesson Package' : 'Single Lesson'} - ${selectedDay} at ${formatTime(selectedTime)}`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // On successful payment
                completeBooking(details);
            });
        },
        onCancel: function(data) {
            showMessage('Payment was cancelled. Your lesson has not been booked.', 'error');
        },
        onError: function(err) {
            showMessage('There was an error processing your payment. Please try again.', 'error');
            console.error('PayPal Error:', err);
        }
    }).render('#paypal-button-container');
    
    // Function to complete booking after successful payment
    function completeBooking(paymentDetails) {
        // Here you would typically send the booking data to your server
        const bookingData = {
            package: selectedPackage,
            day: selectedDay,
            time: selectedTime,
            paymentID: paymentDetails.id,
            customerName: paymentDetails.payer.name.given_name + ' ' + paymentDetails.payer.name.surname,
            customerEmail: paymentDetails.payer.email_address
        };
        
        console.log('Booking data:', bookingData);
        
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
    
    // Add some unavailable time slots for demonstration
    // In a real application, this data would come from your server
    function setupUnavailableSlots() {
        // Randomly mark some slots as unavailable
        timeSlots.forEach((slot, index) => {
            // Mark every third slot as unavailable for demonstration
            if (index % 3 === 0) {
                slot.classList.add('unavailable');
                slot.setAttribute('title', 'This time slot is already booked');
                
                // Add tooltip element
                const tooltip = document.createElement('span');
                tooltip.className = 'tooltip-text';
                tooltip.textContent = 'Already booked';
                slot.classList.add('tooltip');
                slot.appendChild(tooltip);
            }
        });
    }
    
    // Initialize unavailable slots
    setupUnavailableSlots();
});