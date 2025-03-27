<?php
session_start();

$client_id = "1066739021624-m7fov9u0jmpt6pa76qst1vpul4rdfmld.apps.googleusercontent.com";  
$client_secret = "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";
$redirect_uri = "https://y7elmy.netlify.app/google-callback";

// Get the authorization code from the URL
if (!isset($_GET['code'])) {
    die("No authorization code provided.");
}
$code = $_GET['code'];

// Exchange authorization code for access token
$token_url = "https://oauth2.googleapis.com/token";
$data = [
    "client_id" => $client_id,
    "client_secret" => $client_secret,
    "redirect_uri" => $redirect_uri,
    "code" => $code,
    "grant_type" => "authorization_code",
];

$options = [
    "http" => [
        "header" => "Content-Type: application/x-www-form-urlencoded",
        "method" => "POST",
        "content" => http_build_query($data),
    ],
];

$context = stream_context_create($options);
$response = file_get_contents($token_url, false, $context);
$token_info = json_decode($response, true);

if (isset($token_info['access_token'])) {
    // Fetch user data
    $access_token = $token_info['access_token'];
    $user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token={$access_token}";
    $user_info = json_decode(file_get_contents($user_info_url), true);

    $_SESSION['user'] = $user_info; // Store user data in session

    // ✅ Redirect to another page (e.g., dashboard)
    header("Location: dashboard.php");
    exit();
} else {
    echo "Error logging in!";
}
?>
