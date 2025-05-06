<?php
session_start();
require_once 'db_connection.php';

header('Content-Type: application/json');

// Handle POST request for login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, name, email, password, experience_level FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['experience_level'] = $user['experience_level'];
            $_SESSION['logged_in'] = true;

            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'experience_level' => $user['experience_level']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Login error: ' . $e->getMessage()]);
    }
    exit;
}

// Google OAuth handler placeholder
if (isset($_GET['google_login'])) {
    echo "Google OAuth login would be implemented here.";
    exit;
}

// Default fallback for non-POST/GET access
header("Location: index.html");
exit();
?>
