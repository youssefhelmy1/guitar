<?php
// google-login.php
$client_id = "1066739021624-m7fov9u0jmpt6pa76qst1vpul4rdfmld.apps.googleusercontent.com";
$redirect_uri = "https://y7elmy.netlify.app/google-callback";
$scope = "email profile";
$response_type = "code";

$auth_url = "https://accounts.google.com/o/oauth2/auth?" . http_build_query([
    'client_id' => $client_id,
    'redirect_uri' => $redirect_uri,
    'response_type' => $response_type,
    'scope' => $scope,
    'access_type' => 'offline',
    'prompt' => 'consent'
]);

header("Location: $auth_url");
exit;
