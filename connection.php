<?php
// db_connection.php
$servername = "localhost";
$username = "your_db_username";
$password = "your_db_password";
$dbname = "y7elmy_guitar";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>