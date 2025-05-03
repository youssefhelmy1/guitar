<?php
// db_connection.php
$servername = "localhost";
$username = "root"; // Replace with your database username
$password = "";
$dbname = "y7elmy";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>