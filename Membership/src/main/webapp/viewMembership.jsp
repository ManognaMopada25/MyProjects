<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ include file="navbar.jsp" %>

<!DOCTYPE html>
<html>
<head>
    <title>View Memberships</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"> <!-- ✅ Icons -->
</head>
<body>

    <h2>Membership List</h2>

    <!-- ✅ Refresh Button -->
    <form action="ViewMembershipServlet" method="get">
        <input type="submit" value="Refresh Memberships" class="refresh-btn">
    </form>

    <table border="1">
        <tr>
            <th>ID</th>
            <th>Customer ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Type</th>
            <th>Actions</th>
        </tr>

        <!-- ✅ Use JSTL Loop to Display Memberships -->
        <c:choose>
            <c:when test="${not empty memberships}">
                <c:forEach var="membership" items="${memberships}">
                    <tr>
                        <td>${membership.membershipId}</td>
                        <td>${membership.customerId}</td>
                        <td>${membership.startDate}</td>
                        <td>${membership.endDate}</td>
                        <td>${membership.type}</td>
                        <td>
                            <!-- ✅ Styled Edit/Delete Buttons with Icons -->
                            <a href="updateMembership.jsp?id=${membership.membershipId}" class="edit-btn">
                                <i class="fas fa-edit"></i> Edit
                            </a>
                            <a href="deleteMembership.jsp?id=${membership.membershipId}" class="delete-btn">
                                <i class="fas fa-trash"></i> Delete
                            </a>
                        </td>
                    </tr>
                </c:forEach>
            </c:when>
            <c:otherwise>
                <tr>
                    <td colspan="6" style="text-align:center;">No memberships found.</td>
                </tr>
            </c:otherwise>
        </c:choose>
    </table>

</body>
</html>
