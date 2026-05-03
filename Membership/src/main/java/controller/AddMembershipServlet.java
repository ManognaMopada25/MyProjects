package controller;  // ✅ Ensure this matches your project structure

import model.Membership;
import model.MembershipDAO;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/AddMembershipServlet")
public class AddMembershipServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            int customerId = Integer.parseInt(request.getParameter("customerId"));
            String startDate = request.getParameter("startDate");
            String endDate = request.getParameter("endDate");
            String type = request.getParameter("type");
            String password = request.getParameter("password");

            // ✅ Debugging: Print values to console
            System.out.println("DEBUG: Received Data");
            System.out.println("Customer ID: " + customerId);
            System.out.println("Start Date: " + startDate);
            System.out.println("End Date: " + endDate);
            System.out.println("Type: " + type);
            System.out.println("Password: " + password);

            Membership membership = new Membership(0, customerId, startDate, endDate, type, password);
            MembershipDAO membershipDAO = new MembershipDAO();
            membershipDAO.addMembership(membership);

            System.out.println("DEBUG: Membership successfully added!");
            response.sendRedirect("ViewMembershipServlet");

        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("addMembership.jsp?error=Invalid Data");
        }
    }
}
