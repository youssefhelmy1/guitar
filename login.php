<?php
session_start();
require_once 'db_connection.php';

// Handle AJAX login request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    // Validate inputs
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Please enter both email and password']);
        exit();
    }
    
    // Prepare SQL statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT id, name, email, password, experience_level FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Verify password
        if (password_verify($password, $user['password'])) {
            // Password is correct, start a new session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['experience_level'] = $user['experience_level'];
            $_SESSION['logged_in'] = true;
            
            echo json_encode(['success' => true, 'message' => 'Login successful']);
        } else {
            // Password is not correct
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        }
    } else {
        // Email not found
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    }
    
    $stmt->close();
    $conn->close();
    exit();
}

// For Google OAuth login (simplified example)
if (isset($_GET['google_login'])) {
    // In a real implementation, you would redirect to Google's OAuth endpoint
    // For this example, we'll just create a simplified placeholder
    echo "Google OAuth login would be implemented here";
    exit();
}

// If not handling POST/GET requests, display the login page or redirect to index
// For this example, we'll just redirect back to index
header("Location: index.html");
exit();
?>