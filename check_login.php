<?php
// check_login.php
session_start();

$response = [
    'logged_in' => false,
    'user_name' => '',
    'user_email' => ''
];

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    $response['logged_in'] = true;
    $response['user_name'] = $_SESSION['user_name'];
    $response['user_email'] = $_SESSION['user_email'];
}

header('Content-Type: application/json');
echo json_encode($response);
?>