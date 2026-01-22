<?php
// ====================================
// SENDMAIL.PHP - CORRIGÉ POUR ERREUR 405
// ====================================

// Headers de sécurité AVANT toute sortie
header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Autoriser les méthodes POST
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Allow: POST, OPTIONS');
    http_response_code(200);
    exit();
}

// ====================================
// CONFIGURATION
// ====================================

$your_email = "lucien.lafpro@gmail.com";
$default_subject = "Message depuis le portfolio";
$redirect_url = "index.html#contact";

// ====================================
// VÉRIFICATION DE LA MÉTHODE
// ====================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    header("Allow: POST");
    die("Méthode non autorisée. Utilisez POST.");
}

// ====================================
// FONCTION DE NETTOYAGE
// ====================================

function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// ====================================
// RÉCUPÉRATION DES DONNÉES
// ====================================

$errors = array();

// Nom
$name = '';
if (empty($_POST["name"])) {
    $errors[] = "Le nom est requis.";
} else {
    $name = clean_input($_POST["name"]);
    if (strlen($name) < 2 || strlen($name) > 50) {
        $errors[] = "Le nom doit contenir entre 2 et 50 caractères.";
    }
}

// Email
$email = '';
if (empty($_POST["email"])) {
    $errors[] = "L'email est requis.";
} else {
    $email = clean_input($_POST["email"]);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "L'adresse email n'est pas valide.";
    }
    if (preg_match("/(content-type|bcc:|cc:|to:)/i", $email)) {
        $errors[] = "Email suspect détecté.";
    }
}

// Sujet
$subject = '';
if (empty($_POST["subject"])) {
    $subject = $default_subject;
} else {
    $subject = clean_input($_POST["subject"]);
    if (strlen($subject) > 100) {
        $errors[] = "Le sujet est trop long (max 100 caractères).";
    }
}

// Message
$message = '';
if (empty($_POST["message"])) {
    $errors[] = "Le message est requis.";
} else {
    $message = clean_input($_POST["message"]);
    if (strlen($message) < 10) {
        $errors[] = "Le message doit contenir au moins 10 caractères.";
    }
    if (strlen($message) > 5000) {
        $errors[] = "Le message est trop long (max 5000 caractères).";
    }
}

// ====================================
// PROTECTION ANTI-SPAM
// ====================================

session_start();

// Temps entre soumissions
$min_time = 5;
if (isset($_SESSION['last_submission_time'])) {
    $time_diff = time() - $_SESSION['last_submission_time'];
    if ($time_diff < $min_time) {
        $errors[] = "Veuillez attendre " . ($min_time - $time_diff) . " secondes.";
    }
}

// Limite par heure
$max_per_hour = 3;
if (!isset($_SESSION['submission_count'])) {
    $_SESSION['submission_count'] = 0;
    $_SESSION['submission_hour_start'] = time();
}

if (time() - $_SESSION['submission_hour_start'] > 3600) {
    $_SESSION['submission_count'] = 0;
    $_SESSION['submission_hour_start'] = time();
}

if ($_SESSION['submission_count'] >= $max_per_hour) {
    $errors[] = "Limite d'envoi dépassée. Réessayez dans 1 heure.";
}

// Honeypot
if (!empty($_POST['website'])) {
    $errors[] = "Soumission invalide.";
}

// ====================================
// ENVOI DE L'EMAIL
// ====================================

if (empty($errors)) {
    $email_subject = "Portfolio - " . $subject;
    
    $email_body = "Nouveau message depuis votre portfolio\n";
    $email_body .= "========================================\n\n";
    $email_body .= "Nom: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n";
    $email_body .= "Sujet: " . $subject . "\n\n";
    $email_body .= "Message:\n";
    $email_body .= "----------------------------------------\n";
    $email_body .= $message . "\n";
    $email_body .= "----------------------------------------\n\n";
    $email_body .= "Date: " . date('d/m/Y à H:i:s') . "\n";
    $email_body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    
    $headers = array();
    $headers[] = "From: Portfolio <noreply@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . ">";
    $headers[] = "Reply-To: " . $name . " <" . $email . ">";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    
    $mail_sent = @mail(
        $your_email,
        $email_subject,
        $email_body,
        implode("\r\n", $headers)
    );
    
    if ($mail_sent) {
        $_SESSION['last_submission_time'] = time();
        $_SESSION['submission_count']++;
        
        header("Location: " . $redirect_url . "?success=1");
        exit();
    } else {
        $errors[] = "Erreur lors de l'envoi. Contactez-moi directement par email (lucien.lafpro@gmail.com).";
    }
}

// ====================================
// GESTION DES ERREURS
// ====================================

if (!empty($errors)) {
    $error_msg = implode(" | ", $errors);
    header("Location: " . $redirect_url . "?error=" . urlencode($error_msg));
    exit();
}
?>