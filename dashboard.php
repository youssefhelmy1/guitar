<?php
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: index.html"); // Redirect if not logged in
    exit();
}

$user = $_SESSION['user']; // Get user details from session
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Dashboard</title>
</head>
<body>
    <h1>Welcome, <?php echo $user['name']; ?>!</h1>
    <p>Email: <?php echo $user['email']; ?></p>
    <img src="<?php echo $user['picture']; ?>" alt="Profile Picture">
    <br>
    <a href="logout.php">Logout</a>
</body>
</html>
