<?php
// get_booked_slots.php
session_start();
require_once 'db_connection.php';

// Query to get all booked slots
$sql = "SELECT booking_day as day, booking_time as time FROM bookings";
$result = $conn->query($sql);

$booked_slots = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $booked_slots[] = $row;
    }
}

// Return response
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'booked_slots' => $booked_slots
]);

$conn->close();
?>