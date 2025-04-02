<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: index.php");
    exit();
}

require_once 'db_connection.php';

// Get user's bookings
$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$bookings = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Account - y7elmy Guitar Lessons</title>
    <link href="styles.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <style>
        .dashboard {
            padding: 50px 0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .user-welcome {
            font-size: 24px;
            font-weight: bold;
        }
        .logout-btn {
            background-color: #f44336;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .logout-btn:hover {
            background-color: #d32f2f;
        }
        .dashboard-content {
            display: grid;
            grid-template-columns: 1fr 3fr;
            gap: 30px;
        }
        .sidebar {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
        }
        .sidebar-menu {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .sidebar-menu li {
            margin-bottom: 10px;
        }
        .sidebar-menu a {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-radius: 5px;
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: background-color 0.3s;
        }
        .sidebar-menu a.active, .sidebar-menu a:hover {
            background-color: #e0e0e0;
        }
        .main-content {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .section-title {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: bold;
        }
        .booking-table {
            width: 100%;
            border-collapse: collapse;
        }
        .booking-table th, .booking-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        .booking-table th {
            background-color: #f5f5f5;
            font-weight: 600;
        }
        .booking-table tr:last-child td {
            border-bottom: none;
        }
        .no-bookings {
            text-align: center;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
            color: #666;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header" style="height: auto; padding-bottom: 20px;">
        <nav class="navbar">
            <div class="logo">
                <span class="gradient-text">y7elmy</span> Guitar
            </div>
            <div class="nav-links">
                <a href="index.php#features">Features</a>
                <a href="index.php#pricing">Pricing</a>
                <a href="index.php#booking">Book a Lesson</a>
                <a href="index.php#testimonials">Feedback</a>
            </div>
            <div class="user-actions">
                <button id="logoutBtn" class="login-button">Logout</button>
                <a href="index.php#booking" class="call-to-action">Book Lesson</a>
            </div>
        </nav>
    </header>
    
    <!-- Dashboard Section -->
    <section class="dashboard">
        <div class="container">
            <div class="dashboard-header">
                <h1 class="user-welcome">Welcome, <?php echo htmlspecialchars($_SESSION['user_name']); ?>!</h1>
                <a href="logout.php" class="logout-btn">Logout</a>
            </div>
            
            <div class="dashboard-content">
                <div class="sidebar">
                    <ul class="sidebar-menu">
                        <li><a href="#" class="tab-link active" data-tab="bookings"><i class="fas fa-calendar-alt"></i> My Bookings</a></li>
                        <li><a href="#" class="tab-link" data-tab="profile"><i class="fas fa-user"></i> Profile</a></li>
                        <li><a href="#" class="tab-link" data-tab="progress"><i class="fas fa-chart-line"></i> My Progress</a></li>
                        <li><a href="#" class="tab-link" data-tab="materials"><i class="fas fa-book"></i> Learning Materials</a></li>
                    </ul>
                </div>
                
                <div class="main-content">
                    <!-- Bookings Tab (Default Active) -->
                    <div class="tab-content active" id="bookings-content">
                        <h2 class="section-title">My Bookings</h2>
                        
                        <?php if (empty($bookings)): ?>
                            <div class="no-bookings">
                                <p>You don't have any bookings yet.</p>
                                <a href="index.php#booking" class="call-to-action" style="display: inline-block; margin-top: 15px;">Book Your First Lesson</a>
                            </div>
                        <?php else: ?>
                            <table class="booking-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Package</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($bookings as $booking): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($booking['booking_day']); ?></td>
                                            <td>
                                                <?php 
                                                    $time = explode(':', $booking['booking_time']);
                                                    $hour = intval($time[0]);
                                                    $suffix = $hour >= 12 ? 'PM' : 'AM';
                                                    $hour = $hour % 12;
                                                    $hour = $hour ? $hour : 12;
                                                    echo $hour . ':00 ' . $suffix;
                                                ?>
                                            </td>
                                            <td><?php echo $booking['package_type'] === 'package' ? '12-Lesson Package' : 'Single Lesson'; ?></td>
                                            <td>Confirmed</td>
                                            <td>
                                                <button class="btn-small" onclick="alert('Feature coming soon!')">Reschedule</button>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Profile Tab -->
                    <div class="tab-content" id="profile-content">
                        <h2 class="section-title">My Profile</h2>
                        <form id="profileForm">
                            <div class="form-group">
                                <label for="profileName">Full Name:</label>
                                <input type="text" id="profileName" class="form-control" value="<?php echo htmlspecialchars($_SESSION['user_name']); ?>">
                            </div>
                            <div class="form-group">
                                <label for="profileEmail">Email:</label>
                                <input type="email" id="profileEmail" class="form-control" value="<?php echo htmlspecialchars($_SESSION['user_email']); ?>" readonly>
                            </div>
                            <div class="form-group">
                                <label>Experience Level:</label>
                                <div class="experience-select">
                                    <div class="experience-option" data-value="beginner">Beginner</div>
                                    <div class="experience-option" data-value="intermediate">Intermediate</div>
                                    <div class="experience-option" data-value="advanced">Advanced</div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="profilePassword">New Password:</label>
                                <input type="password" id="profilePassword" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="profileConfirmPassword">Confirm New Password:</label>
                                <input type="password" id="profileConfirmPassword" class="form-control">
                            </div>
                            <button type="submit" class="call-to-action">Update Profile</button>
                        </form>
                    </div>
                    
                    <!-- Progress Tab -->
                    <div class="tab-content" id="progress-content">
                        <h2 class="section-title">My Progress</h2>
                        <p>Your progress tracking will appear here after your lessons.</p>
                    </div>
                    
                    <!-- Materials Tab -->
                    <div class="tab-content" id="materials-content">
                        <h2 class="section-title">Learning Materials</h2>
                        <p>Your personalized learning materials will appear here as you progress through your lessons.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <footer class="footer">
        <div class="social-links">
            <a href="https://www.tiktok.com/@y7elmy" target="_blank" class="social-link"><i class="fab fa-tiktok"></i></a>
            <a href="https://www.instagram.com/yousefhelmymusic/" target="_blank" class="social-link"><i class="fab fa-instagram"></i></a>
            <a href="https://www.youtube.com/@yousefhelmymusic" target="_blank" class="social-link"><i class="fab fa-youtube"></i></a>
            <a href="mailto:y7elmylessons@gmail.com" class="social-link"><i class="fas fa-envelope"></i></a>
        </div>
        <p class="copyright">© 2025 y7elmy Guitar Lessons. All rights reserved.</p>
    </footer>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Tab navigation
            const tabLinks = document.querySelectorAll('.tab-link');
            const tabContents = document.querySelectorAll('.tab-content');
            
            tabLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetTab = this.getAttribute('data-tab');
                    tabLinks.forEach(link => link.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    this.classList.add('active');
                    document.getElementById(targetTab + '-content').classList.add('active');
                });
                });
            });
        </script>