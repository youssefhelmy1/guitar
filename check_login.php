<?php
session_start();

// Check if user is logged in
$loggedIn = isset($_SESSION['user_id']);

// Return login status
echo json_encode([
    'logged_in' => $loggedIn,
    'user' => $loggedIn ? [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name'] ?? '',
        'email' => $_SESSION['user_email'] ?? ''
    ] : null
]);
?>