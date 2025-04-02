<?php
// save_booking.php
session_start();
require_once 'db_connection.php';

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'You must be logged in to book a lesson']);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get booking data
    $data = json_decode(file_get_contents('php://input'), true);
    
    $user_id = $_SESSION['user_id'];
    $package_type = $data['package'];
    $booking_day = $data['day'];
    $booking_time = $data['time'];
    $payment_id = $data['paymentID'];
    
    // Validate data
    if (empty($user_id) || empty($package_type) || empty($booking_day) || empty($booking_time) || empty($payment_id)) {
        echo json_encode(['success' => false, 'message' => 'All booking details are required']);
        exit();
    }
    
    // Check if slot is already booked
    $stmt = $conn->prepare("SELECT id FROM bookings WHERE booking_day = ? AND booking_time = ?");
    $stmt->bind_param("ss", $booking_day, $booking_time);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'This time slot is already booked']);
        exit();
    }
    
    // Save booking
    $stmt = $conn->prepare("INSERT INTO bookings (user_id, package_type, booking_day, booking_time, payment_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $user_id, $package_type, $booking_day, $booking_time, $payment_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Booking saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error saving booking: ' . $conn->error]);
    }
    
    $stmt->close();
    $conn->close();
}
?>