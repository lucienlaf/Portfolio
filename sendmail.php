<?php
// ====================================
// SENDMAIL.PHP - PORTFOLIO V2.0
// ====================================
// Script d'envoi d'emails sécurisé
// 
// CONFIGURATION REQUISE:
// 1. Modifier $your_email ci-dessous
// 2. Vérifier que PHP mail() est activé
// 3. Uploader sur un hébergeur PHP
// ====================================

// ====================================
// CONFIGURATION
// ====================================

// INSTRUCTION: Remplacez par votre adresse email
$your_email = "lucien.lafpro@gmail.com";

// Sujet par défaut
$default_subject = "Message depuis le portfolio";

// URL de redirection après envoi (votre page de contact)
$redirect_url = "index.html#contact";

// En-têtes de sécurité
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');


// ====================================
// VÉRIFICATION DE LA MÉTHODE
// ====================================

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: " . $redirect_url);
    exit();
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
$success = false;

// Nom
if (empty($_POST["name"])) {
    $errors[] = "Le nom est requis.";
} else {
    $name = clean_input($_POST["name"]);
    if (strlen($name) < 2 || strlen($name) > 50) {
        $errors[] = "Le nom doit contenir entre 2 et 50 caractères.";
    }
    if (!preg_match("/^[a-zA-ZÀ-ÿ\s'-]+$/u", $name)) {
        $errors[] = "Le nom contient des caractères non autorisés.";
    }
}

// Email
if (empty($_POST["email"])) {
    $errors[] = "L'email est requis.";
} else {
    $email = clean_input($_POST["email"]);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "L'adresse email n'est pas valide.";
    }
    // Vérification anti-spam supplémentaire
    if (preg_match("/(content-type|bcc:|cc:|to:)/i", $email)) {
        $errors[] = "Email suspect détecté.";
    }
}

// Sujet
if (empty($_POST["subject"])) {
    $subject = $default_subject;
} else {
    $subject = clean_input($_POST["subject"]);
    if (strlen($subject) > 100) {
        $errors[] = "Le sujet est trop long (max 100 caractères).";
    }
}

// Message
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

// Session pour limiter les envois
session_start();

// Vérification du temps entre deux soumissions
$min_time_between_submissions = 5; // secondes
if (isset($_SESSION['last_submission_time'])) {
    $time_diff = time() - $_SESSION['last_submission_time'];
    if ($time_diff < $min_time_between_submissions) {
        $errors[] = "Veuillez attendre " . ($min_time_between_submissions - $time_diff) . " secondes avant de soumettre à nouveau.";
    }
}

// Limite de 3 soumissions par heure
$max_submissions_per_hour = 3;
if (!isset($_SESSION['submission_count'])) {
    $_SESSION['submission_count'] = 0;
    $_SESSION['submission_hour_start'] = time();
}

// Réinitialiser le compteur après 1 heure
if (time() - $_SESSION['submission_hour_start'] > 3600) {
    $_SESSION['submission_count'] = 0;
    $_SESSION['submission_hour_start'] = time();
}

if ($_SESSION['submission_count'] >= $max_submissions_per_hour) {
    $errors[] = "Limite d'envoi dépassée. Veuillez réessayer dans 1 heure.";
}

// Honeypot simple (champ caché)
if (!empty($_POST['website'])) {
    // C'est probablement un bot
    $errors[] = "Soumission invalide.";
}


// ====================================
// ENVOI DE L'EMAIL
// ====================================

if (empty($errors)) {
    // Construction du sujet
    $email_subject = "Portfolio - " . $subject;
    
    // Construction du corps du message
    $email_body = "Nouveau message depuis votre portfolio\n";
    $email_body .= "========================================\n\n";
    $email_body .= "Nom: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n";
    $email_body .= "Sujet: " . $subject . "\n\n";
    $email_body .= "Message:\n";
    $email_body .= "----------------------------------------\n";
    $email_body .= $message . "\n";
    $email_body .= "----------------------------------------\n\n";
    $email_body .= "Informations supplémentaires:\n";
    $email_body .= "Date: " . date('d/m/Y à H:i:s') . "\n";
    $email_body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $email_body .= "User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "\n";
    
    // En-têtes de l'email
    $headers = array();
    $headers[] = "From: Portfolio <noreply@" . $_SERVER['HTTP_HOST'] . ">";
    $headers[] = "Reply-To: " . $name . " <" . $email . ">";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    $headers[] = "X-Priority: 3";
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    $headers[] = "Content-Transfer-Encoding: 8bit";
    
    // Tentative d'envoi
    $mail_sent = @mail(
        $your_email,
        $email_subject,
        $email_body,
        implode("\r\n", $headers)
    );
    
    if ($mail_sent) {
        // Succès
        $_SESSION['last_submission_time'] = time();
        $_SESSION['submission_count']++;
        
        // Redirection avec succès
        header("Location: " . $redirect_url . "?success=1");
        exit();
    } else {
        $errors[] = "Erreur lors de l'envoi. Veuillez réessayer ou me contacter directement.";
    }
}


// ====================================
// GESTION DES ERREURS
// ====================================

if (!empty($errors)) {
    // Encoder les erreurs pour l'URL
    $error_msg = implode(" | ", $errors);
    header("Location: " . $redirect_url . "?error=" . urlencode($error_msg));
    exit();
}


// ====================================
// AFFICHAGE DES MESSAGES (optionnel)
// ====================================

// Si vous préférez afficher les messages sur cette page
// au lieu de rediriger, décommentez ci-dessous:

/*
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message envoyé</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #0F0A1E;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }
        .message-box {
            background: #251A3A;
            padding: 40px;
            border-radius: 20px;
            border: 1px solid #A78BFA;
            max-width: 500px;
            text-align: center;
        }
        .success {
            color: #4ADE80;
        }
        .error {
            color: #F87171;
        }
        a {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: linear-gradient(135deg, #A78BFA, #6D28D9);
            color: white;
            text-decoration: none;
            border-radius: 25px;
        }
        a:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="message-box">
        <?php if ($success): ?>
            <h2 class="success">✓ Message envoyé !</h2>
            <p>Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
        <?php else: ?>
            <h2 class="error">✗ Erreur</h2>
            <?php foreach ($errors as $error): ?>
                <p><?php echo htmlspecialchars($error); ?></p>
            <?php endforeach; ?>
        <?php endif; ?>
        <a href="index.html">← Retour au portfolio</a>
    </div>
</body>
</html>
<?php
/*
?>