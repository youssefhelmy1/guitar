<?php
// google-callback.php
session_start();
require_once 'db_connection.php';

$client_id = "1066739021624-m7fov9u0jmpt6pa76qst1vpul4rdfmld.apps.googleusercontent.com";
$client_secret = "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";
$redirect_uri = "https://y7elmy.netlify.app/google-callback";

// Exchange code for access token
if (isset($_GET['code'])) {
    $code = $_GET['code'];
    
    $token_url = "https://oauth2.googleapis.com/token";
    $data = [
        'code' => $code,
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'redirect_uri' => $redirect_uri,
        'grant_type' => 'authorization_code'
    ];
    
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($token_url, false, $context);
    
    if ($response === FALSE) {
        die('Error getting access token');
    }
    
    $token_data = json_decode($response, true);
    
    // Get user info with the access token
    $user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo";
    $options = [
        'http' => [
            'header' => "Authorization: Bearer " . $token_data['access_token'] . "\r\n",
            'method' => 'GET'
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($user_info_url, false, $context);
    
    if ($response === FALSE) {
        die('Error getting user info');
    }
    
    $user_info = json_decode($response, true);
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT id, name FROM users WHERE email = ?");
    $stmt->bind_param("s", $user_info['email']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // User exists, log them in
        $user = $result->fetch_assoc();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user_info['email'];
        $_SESSION['logged_in'] = true;
    } else {
        // New user, create account
        $random_password = bin2hex(random_bytes(16)); // Generate random password
        $hashed_password = password_hash($random_password, PASSWORD_DEFAULT);
        $name = $user_info['name'];
        $email = $user_info['email'];
        $experience = 'beginner'; // Default
        
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, experience_level) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $name, $email, $hashed_password, $experience);
        
        if ($stmt->execute()) {
            $_SESSION['user_id'] = $conn->insert_id;
            $_SESSION['user_name'] = $name;
            $_SESSION['user_email'] = $email;
            $_SESSION['logged_in'] = true;
        } else {
            die('Error creating user account');
        }
    }
    
    // Redirect to the booking page
    header("Location: index.php#booking");
    exit();
} else {
    // No code provided
    header("Location: index.php");
    exit();
}
?>
<?php
// Close the database connection
$conn->close();
?>