<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="navbar.jsp" %>

<!DOCTYPE html>
<html>
<head>
    <title>Delete Membership</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
    <h2>Delete Membership</h2>

    <form action="DeleteMembershipServlet" method="post">
        <label>Enter Membership ID to Delete:</label>
        <input type="number" name="id" required>
        <input type="submit" value="Delete Membership">
    </form>

    <% if (request.getAttribute("errorMessage") != null) { %>
        <p style="color: red;"><%= request.getAttribute("errorMessage") %></p>
    <% } %>
</body>
</html>
