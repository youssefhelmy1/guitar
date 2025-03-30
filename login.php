<?php
session_start();

$client_id = "1066739021624-m7fov9u0jmpt6pa76qst1vpul4rdfmld.apps.googleusercontent.com";
$redirect_uri = "https://y7elmy.netlify.app/google-callback";

// Google OAuth authorization URL
$auth_url = "https://accounts.google.com/o/oauth2/auth?"
    . "client_id={$client_id}&"
    . "redirect_uri={$redirect_uri}&"
    . "response_type=code&"
    . "scope=email%20profile&"
    . "access_type=offline";

header("Location: " . $auth_url);
exit();
?>

<?php
session_start();
require_once 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT id, email, password FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            header("Location: dashboard.php");
            exit();
        } else {
            $error = "Invalid email or password";
        }
    } else {
        $error = "Invalid email or password";
    }
}
?>
