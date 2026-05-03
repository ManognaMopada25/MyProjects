<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="navbar.jsp" %>

<!DOCTYPE html>
<html>
<head>
    <title>Add Membership</title>
   <link rel="stylesheet" type="text/css" href="css/style.css">

</head>
<body>
    <h2>Add Membership</h2>
<form action="AddMembershipServlet" method="post">
    <label>Customer ID:</label>
    <input type="text" name="customerId" required>

    <label>Start Date:</label>
    <input type="date" name="startDate" required>

    <label>End Date:</label>
    <input type="date" name="endDate" required>

    <label>Type (Any value allowed):</label>
    <input type="text" name="type" required>

    <label>Password:</label>
    <input type="password" name="password" required>

    <input type="submit" value="Add Membership">
</form>



</body>
</html>
