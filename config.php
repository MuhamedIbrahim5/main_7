<?php
// ملف الإعدادات - تأمين صفحة الإدارة

// بيانات تسجيل الدخول
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'zamzam2026'); // يرجى تغيير كلمة المرور بعد أول تسجيل دخول

// مسار ملف البيانات
define('DATA_FILE', __DIR__ . '/data.json');

// بدء الجلسة
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// دالة التحقق من تسجيل الدخول
function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

// دالة تسجيل الدخول
function login($username, $password) {
    if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        return true;
    }
    return false;
}

// دالة تسجيل الخروج
function logout() {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// دالة قراءة البيانات
function getData() {
    if (!file_exists(DATA_FILE)) {
        return null;
    }
    $json = file_get_contents(DATA_FILE);
    return json_decode($json, true);
}

// دالة حفظ البيانات
function saveData($data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents(DATA_FILE, $json) !== false;
}

// دالة تأمين النصوص
function sanitize($text) {
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}
?>
