<?php
// logout.php
session_start();

// Clear all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Redirect to home page
header("Location: index.php");
exit();
?>