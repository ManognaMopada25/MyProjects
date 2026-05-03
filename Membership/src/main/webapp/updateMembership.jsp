<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="model.MembershipDAO, model.Membership" %>
<%@ include file="navbar.jsp" %>

<%
    String idParam = request.getParameter("id");
    int id = 0;
    Membership membership = null;

    if (idParam != null && !idParam.trim().isEmpty()) {
        try {
            id = Integer.parseInt(idParam);
            MembershipDAO membershipDAO = new MembershipDAO();
            membership = membershipDAO.getMembershipById(id);
        } catch (NumberFormatException e) {
            request.setAttribute("errorMessage", "❌ Invalid Membership ID format.");
        }
    } else {
        request.setAttribute("errorMessage", "❌ Membership ID is missing.");
    }
%>

<!DOCTYPE html>
<html>
<head>
    <title>Update Membership</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <h2>Update Membership</h2>

    <% if (membership != null) { %>
        <form action="UpdateMembershipServlet" method="post">
            <input type="hidden" name="membership_id" value="<%= membership.getMembershipId() %>">

            <label>Customer ID:</label>
            <input type="number" name="customer_id" value="<%= membership.getCustomerId() %>" required>

            <label>Start Date:</label>
            <input type="date" name="start_date" value="<%= membership.getStartDate() %>" required>

            <label>End Date:</label>
            <input type="date" name="end_date" value="<%= membership.getEndDate() %>" required>

            <label>Type:</label>
            <input type="text" name="type" value="<%= membership.getType() %>" required>

            <input type="submit" value="Update Membership">
        </form>
    <% } else { %>
        <p style="color: red;"><%= request.getAttribute("errorMessage") %></p>
        <a href="ViewMembershipServlet">🔙 Go Back</a>
    <% } %>

</body>
</html>
