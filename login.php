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
