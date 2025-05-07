<?php
$host = 'localhost';
$dbname = 'y7elmy'; // ✅ Replace with your actual DB name
$username = 'root';
$password = ''; // Default in XAMPP

try {
    $conn = new mysqli($host, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}
?>
