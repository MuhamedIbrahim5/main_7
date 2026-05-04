<?php
require_once 'config.php';

// معالجة تسجيل الدخول
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (login($username, $password)) {
        header('Location: admin.php');
        exit;
    } else {
        $error = 'اسم المستخدم أو كلمة المرور غير صحيحة';
    }
}

// معالجة تسجيل الخروج
if (isset($_GET['logout'])) {
    logout();
}

// معالجة حفظ البيانات
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_data']) && isLoggedIn()) {
    $data = getData();
    
    // تحديث بيانات التواصل
    if (isset($_POST['contact'])) {
        $data['contact'] = $_POST['contact'];
    }
    
    // تحديث الباقات
    if (isset($_POST['packages'])) {
        foreach ($_POST['packages'] as $category => $packages) {
            foreach ($packages as $index => $package) {
                $data['packages'][$category][$index] = $package;
            }
        }
    }
    
    // تحديث معلومات الموقع
    if (isset($_POST['site_info'])) {
        $data['site_info'] = $_POST['site_info'];
    }
    
    if (saveData($data)) {
        $success = 'تم حفظ التعديلات بنجاح!';
    } else {
        $error = 'حدث خطأ أثناء حفظ البيانات';
    }
}

// إذا لم يكن مسجل دخول، عرض صفحة تسجيل الدخول
if (!isLoggedIn()) {
    ?>
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تسجيل الدخول - لوحة التحكم</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #0a4d5c 0%, #0d6d7f 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .login-container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 400px;
                width: 100%;
            }
            
            .login-header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .login-header h1 {
                color: #0a4d5c;
                font-size: 28px;
                margin-bottom: 10px;
            }
            
            .login-header p {
                color: #666;
                font-size: 14px;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                color: #333;
                font-weight: 600;
                margin-bottom: 8px;
                font-size: 14px;
            }
            
            .form-group input {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 15px;
                transition: all 0.3s;
            }
            
            .form-group input:focus {
                outline: none;
                border-color: #0a4d5c;
            }
            
            .login-btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #0a4d5c 0%, #0d6d7f 100%);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .login-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(10, 77, 92, 0.4);
            }
            
            .error {
                background: #fee;
                color: #c33;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                text-align: center;
                font-size: 14px;
            }
            
            .info-box {
                background: #f0f8ff;
                border: 2px solid #0a4d5c;
                border-radius: 10px;
                padding: 15px;
                margin-top: 20px;
                font-size: 13px;
                color: #0a4d5c;
            }
            
            .info-box strong {
                display: block;
                margin-bottom: 8px;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="login-header">
                <h1>لوحة التحكم</h1>
                <p>باقات السكن - مكة والمدينة</p>
            </div>
            
            <?php if (isset($error)): ?>
                <div class="error"><?php echo $error; ?></div>
            <?php endif; ?>
            
            <form method="POST">
                <div class="form-group">
                    <label>اسم المستخدم</label>
                    <input type="text" name="username" required autofocus>
                </div>
                
                <div class="form-group">
                    <label>كلمة المرور</label>
                    <input type="password" name="password" required>
                </div>
                
                <button type="submit" name="login" class="login-btn">
                    تسجيل الدخول
                </button>
            </form>
            
            <div class="info-box">
                <strong>معلومات تسجيل الدخول الافتراضية:</strong>
                اسم المستخدم: <code>admin</code><br>
                كلمة المرور: <code>zamzam2026</code><br>
                <small>يرجى تغيير كلمة المرور من ملف config.php</small>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// إذا كان مسجل دخول، عرض لوحة التحكم
$data = getData();
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة التحكم - إدارة الموقع</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #0a4d5c 0%, #0d6d7f 100%);
            color: white;
            padding: 25px 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            font-size: 26px;
            font-weight: 600;
            margin: 0;
        }
        
        .header-info {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        
        .logout-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 10px 20px;
            border: 2px solid white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .logout-btn:hover {
            background: white;
            color: #0a4d5c;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            border: 2px solid #c3e6cb;
            font-weight: 600;
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            border: 2px solid #f5c6cb;
            font-weight: 600;
        }
        
        .section {
            background: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }
        
        .section-title {
            font-size: 20px;
            color: #0a4d5c;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #0a4d5c;
        }
        
        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            color: #333;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.3s;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #0a4d5c;
        }
        
        .form-group textarea {
            resize: vertical;
            min-height: 60px;
        }
        
        .package-card {
            background: #f8f9fa;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
        }
        
        .package-card h4 {
            color: #0a4d5c;
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .save-btn {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            position: sticky;
            bottom: 20px;
            width: 100%;
            max-width: 300px;
            margin: 30px auto 0;
            display: block;
        }
        
        .save-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 25px rgba(40, 167, 69, 0.5);
        }
        
        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .tab {
            padding: 12px 25px;
            background: #e9ecef;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .tab.active {
            background: linear-gradient(135deg, #0a4d5c 0%, #0d6d7f 100%);
            color: white;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .info-badge {
            display: inline-block;
            background: #d4ed31;
            color: #0a4d5c;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-right: 10px;
        }
        
        @media (max-width: 768px) {
            .header {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            
            .form-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>لوحة التحكم - إدارة الموقع</h1>
        </div>
        <div class="header-info">
            <a href="index.html" target="_blank" class="logout-btn">عرض الموقع</a>
            <a href="?logout" class="logout-btn">تسجيل الخروج</a>
        </div>
    </div>
    
    <div class="container">
        <?php if (isset($success)): ?>
            <div class="success"><?php echo $success; ?></div>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <form method="POST">
            <!-- Tabs -->
            <div class="tabs">
                <button type="button" class="tab active" onclick="showTab('contact')">بيانات التواصل</button>
                <button type="button" class="tab" onclick="showTab('madinah_visit')">برنامج الزيارة</button>
                <button type="button" class="tab" onclick="showTab('umrah')">برنامج العمرة</button>
                <button type="button" class="tab" onclick="showTab('makkah')">سكن مكة</button>
                <button type="button" class="tab" onclick="showTab('madinah')">سكن المدينة</button>
                <button type="button" class="tab" onclick="showTab('site')">إعدادات الموقع</button>
            </div>
            
            <!-- بيانات التواصل -->
            <div id="contact" class="tab-content active">
                <div class="section">
                    <h2 class="section-title">بيانات التواصل</h2>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>رقم الواتساب <span class="info-badge">بدون +</span></label>
                            <input type="text" name="contact[whatsapp]" value="<?php echo sanitize($data['contact']['whatsapp']); ?>" placeholder="966597964958">
                        </div>
                        <div class="form-group">
                            <label>رقم الحجوزات <span class="info-badge">بدون +</span></label>
                            <input type="text" name="contact[bookings]" value="<?php echo sanitize($data['contact']['bookings']); ?>" placeholder="966531158378">
                        </div>
                        <div class="form-group">
                            <label>رقم المقترحات والشكاوى <span class="info-badge">بدون +</span></label>
                            <input type="text" name="contact[suggestions]" value="<?php echo sanitize($data['contact']['suggestions']); ?>" placeholder="966594108303">
                        </div>
                        <div class="form-group">
                            <label>البريد الإلكتروني</label>
                            <input type="email" name="contact[email]" value="<?php echo sanitize($data['contact']['email']); ?>" placeholder="info@zamzam.app">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- برنامج الزيارة -->
            <div id="madinah_visit" class="tab-content">
                <div class="section">
                    <h2 class="section-title">برنامج الزيارة إلى المدينة المنورة</h2>
                    <?php foreach ($data['packages']['madinah_visit'] as $index => $package): ?>
                        <div class="package-card">
                            <h4><?php echo sanitize($package['name']); ?></h4>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>اسم الباقة</label>
                                    <input type="text" name="packages[madinah_visit][<?php echo $index; ?>][name]" value="<?php echo sanitize($package['name']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>الموقع</label>
                                    <input type="text" name="packages[madinah_visit][<?php echo $index; ?>][location]" value="<?php echo sanitize($package['location']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>السعر <span class="info-badge">رقم فقط</span></label>
                                    <input type="text" name="packages[madinah_visit][<?php echo $index; ?>][price]" value="<?php echo sanitize($package['price']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>الوحدة</label>
                                    <input type="text" name="packages[madinah_visit][<?php echo $index; ?>][unit]" value="<?php echo sanitize($package['unit']); ?>">
                                </div>
                                <div class="form-group" style="grid-column: 1 / -1;">
                                    <label>الوصف</label>
                                    <textarea name="packages[madinah_visit][<?php echo $index; ?>][description]"><?php echo sanitize($package['description']); ?></textarea>
                                </div>
                            </div>
                            <input type="hidden" name="packages[madinah_visit][<?php echo $index; ?>][id]" value="<?php echo sanitize($package['id']); ?>">
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- برنامج العمرة -->
            <div id="umrah" class="tab-content">
                <div class="section">
                    <h2 class="section-title">برنامج العمرة (من المدينة إلى مكة)</h2>
                    <?php foreach ($data['packages']['umrah_program'] as $index => $package): ?>
                        <div class="package-card">
                            <h4><?php echo sanitize($package['name']); ?></h4>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>اسم الباقة</label>
                                    <input type="text" name="packages[umrah_program][<?php echo $index; ?>][name]" value="<?php echo sanitize($package['name']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>الموقع</label>
                                    <input type="text" name="packages[umrah_program][<?php echo $index; ?>][location]" value="<?php echo sanitize($package['location']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>السعر <span class="info-badge">رقم فقط</span></label>
                                    <input type="text" name="packages[umrah_program][<?php echo $index; ?>][price]" value="<?php echo sanitize($package['price']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>الوحدة</label>
                                    <input type="text" name="packages[umrah_program][<?php echo $index; ?>][unit]" value="<?php echo sanitize($package['unit']); ?>">
                                </div>
                                <div class="form-group" style="grid-column: 1 / -1;">
                                    <label>الوصف</label>
                                    <textarea name="packages[umrah_program][<?php echo $index; ?>][description]"><?php echo sanitize($package['description']); ?></textarea>
                                </div>
                            </div>
                            <input type="hidden" name="packages[umrah_program][<?php echo $index; ?>][id]" value="<?php echo sanitize($package['id']); ?>">
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- سكن مكة -->
            <div id="makkah" class="tab-content">
                <div class="section">
                    <h2 class="section-title">سكن مكة المخفض</h2>
                    <?php foreach ($data['packages']['makkah_hotel'] as $index => $package): ?>
                        <div class="package-card">
                            <h4><?php echo sanitize($package['name']); ?></h4>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>اسم الباقة</label>
                                    <input type="text" name="packages[makkah_hotel][<?php echo $index; ?>][name]" value="<?php echo sanitize($package['name']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>الموقع</label>
                                    <input type="text" name="packages[makkah_hotel][<?php echo $index; ?>][location]" value="<?php echo sanitize($package['location']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>السعر <span class="info-badge">رقم فقط</span></label>
                                    <input type="text" name="packages[makkah_hotel][<?php echo $index; ?>][price]" value="<?php echo sanitize($package['price']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>الوحدة</label>
                                    <input type="text" name="packages[makkah_hotel][<?php echo $index; ?>][unit]" value="<?php echo sanitize($package['unit']); ?>">
                                </div>
                                <div class="form-group" style="grid-column: 1 / -1;">
                                    <label>الوصف</label>
                                    <textarea name="packages[makkah_hotel][<?php echo $index; ?>][description]"><?php echo sanitize($package['description']); ?></textarea>
                                </div>
                            </div>
                            <input type="hidden" name="packages[makkah_hotel][<?php echo $index; ?>][id]" value="<?php echo sanitize($package['id']); ?>">
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- سكن المدينة -->
            <div id="madinah" class="tab-content">
                <div class="section">
                    <h2 class="section-title">سكن المدينة المنورة</h2>
                    <?php foreach ($data['packages']['madinah_hotel'] as $index => $package): ?>
                        <div class="package-card">
                            <h4><?php echo sanitize($package['name']); ?></h4>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>اسم الباقة</label>
                                    <input type="text" name="packages[madinah_hotel][<?php echo $index; ?>][name]" value="<?php echo sanitize($package['name']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>الموقع</label>
                                    <input type="text" name="packages[madinah_hotel][<?php echo $index; ?>][location]" value="<?php echo sanitize($package['location']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>السعر <span class="info-badge">رقم فقط</span></label>
                                    <input type="text" name="packages[madinah_hotel][<?php echo $index; ?>][price]" value="<?php echo sanitize($package['price']); ?>">
                                </div>
                                <div class="form-group">
                                    <label>الوحدة</label>
                                    <input type="text" name="packages[madinah_hotel][<?php echo $index; ?>][unit]" value="<?php echo sanitize($package['unit']); ?>">
                                </div>
                                <div class="form-group" style="grid-column: 1 / -1;">
                                    <label>الوصف</label>
                                    <textarea name="packages[madinah_hotel][<?php echo $index; ?>][description]"><?php echo sanitize($package['description']); ?></textarea>
                                </div>
                            </div>
                            <input type="hidden" name="packages[madinah_hotel][<?php echo $index; ?>][id]" value="<?php echo sanitize($package['id']); ?>">
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- إعدادات الموقع -->
            <div id="site" class="tab-content">
                <div class="section">
                    <h2 class="section-title">إعدادات الموقع</h2>
                    <div class="form-group">
                        <label>عنوان الصفحة الرئيسية</label>
                        <input type="text" name="site_info[hero_title]" value="<?php echo sanitize($data['site_info']['hero_title']); ?>">
                    </div>
                    <div class="form-group">
                        <label>وصف الصفحة الرئيسية</label>
                        <textarea name="site_info[hero_subtitle]"><?php echo sanitize($data['site_info']['hero_subtitle']); ?></textarea>
                    </div>
                    <div class="form-group">
                        <label>عنوان قسم الخدمات</label>
                        <input type="text" name="site_info[services_title]" value="<?php echo sanitize($data['site_info']['services_title']); ?>">
                    </div>
                    <div class="form-group">
                        <label>وصف قسم الخدمات</label>
                        <input type="text" name="site_info[services_subtitle]" value="<?php echo sanitize($data['site_info']['services_subtitle']); ?>">
                    </div>
                </div>
            </div>
            
            <button type="submit" name="save_data" class="save-btn">
                حفظ جميع التعديلات
            </button>
        </form>
    </div>
    
    <script>
        function showTab(tabName) {
            // Hide all tabs
            const tabs = document.querySelectorAll('.tab');
            const contents = document.querySelectorAll('.tab-content');
            
            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
            
            // Show selected tab
            event.target.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Confirm before leaving if form is dirty
        let formChanged = false;
        const form = document.querySelector('form');
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                formChanged = true;
            });
        });
        
        window.addEventListener('beforeunload', (e) => {
            if (formChanged) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
        
        form.addEventListener('submit', () => {
            formChanged = false;
        });
    </script>
</body>
</html>
