<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!-- ✅ Bootstrap & Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">

<style>
    /* ✅ Navbar Styling */
    .navbar {
        background-color: black;
        padding: 10px;
    }

    /* ✅ Icon Styling */
    .navbar-nav .nav-link i {
        margin-right: 8px;
        font-size: 1.2em;
    }

    /* ✅ Icon Colors */
    .home-icon { color: #ffcc00; }
    .add-icon { color: #28a745; }
    .view-icon { color: #17a2b8; }
    .edit-icon { color: #ff9800; }
    .delete-icon { color: #dc3545; }
    .profile-icon { color: #f8f9fa; }
    .logout-icon { color: #ff0000; }
    .login-icon { color: #007bff; }

    /* ✅ Scrolling Welcome Message */
    .welcome-container {
        background-color: black;
        padding: 5px;
        overflow: hidden;
    }
    .welcome-text {
        color: yellow;
        font-weight: bold;
        font-size: 0.9rem;
        white-space: nowrap;
        display: inline-block;
        animation: scrollText 8s linear infinite;
    }

    @keyframes scrollText {
        from { transform: translateX(100%); }
        to { transform: translateX(-100%); }
    }
</style>

<%
    String username = (session.getAttribute("username") != null) 
                      ? (String) session.getAttribute("username") 
                      : "Guest";
%>

<nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="home.jsp">
            <i class="bi bi-shield-lock-fill home-icon"></i> Membership Manager
        </a>

        <!-- ✅ Navbar Toggler -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
                <li class="nav-item"><a class="nav-link" href="home.jsp"><i class="bi bi-house-door home-icon"></i> Home</a></li>
                <li class="nav-item"><a class="nav-link" href="addMembership.jsp"><i class="bi bi-plus-circle add-icon"></i> Add Membership</a></li>
                <li class="nav-item"><a class="nav-link" href="ViewMembershipServlet"><i class="bi bi-list-ul view-icon"></i> View Memberships</a></li>
                <li class="nav-item"><a class="nav-link" href="updateMembership.jsp"><i class="bi bi-pencil-square edit-icon"></i> Edit Membership</a></li>
                <li class="nav-item"><a class="nav-link" href="deleteMembership.jsp"><i class="bi bi-trash delete-icon"></i> Delete Membership</a></li>
            </ul>

            <!-- ✅ User Dropdown -->
            <ul class="navbar-nav ms-3">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle text-warning" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                        <i class="bi bi-person-circle profile-icon"></i> <%= username %>
                    </a>
                    <ul class="dropdown-menu">
                        <% if (!"Guest".equals(username)) { %>
                            <li><a class="dropdown-item" href="profile.jsp"><i class="bi bi-person profile-icon"></i> Profile</a></li>
                            <li><a class="dropdown-item" href="LogoutServlet"><i class="bi bi-box-arrow-right logout-icon"></i> Logout</a></li>
                        <% } else { %>
                            <li><a class="dropdown-item" href="login.html"><i class="bi bi-box-arrow-in-right login-icon"></i> Login</a></li>
                        <% } %>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- ✅ Scrolling Welcome Message Below Navbar -->
<div class="welcome-container">
    <span class="welcome-text">Welcome, <%= username %>! Manage your memberships with ease!</span>
</div>

<!-- ✅ Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
