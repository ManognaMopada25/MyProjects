<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="navbar.jsp" %>

<!DOCTYPE html>
<html>
<head>
    <title>Profile</title>
  <link rel="stylesheet" type="text/css" href="css/style.css">

</head>
<body>
    <h2>User Profile</h2>
    <p>Welcome, <%= session.getAttribute("username") %>!</p>
</body>
</html>
