package controller;

import model.Membership;
import model.MembershipDAO;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/UpdateMembershipServlet")
public class UpdateMembershipServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            // ✅ Fetch parameters from the form
            int membershipId = Integer.parseInt(request.getParameter("membership_id"));
            int customerId = Integer.parseInt(request.getParameter("customer_id"));
            String startDate = request.getParameter("start_date");
            String endDate = request.getParameter("end_date");
            String type = request.getParameter("type");
            String password = request.getParameter("password");  // ✅ Fetch password (optional)

            // ✅ Debugging: Print received values
            System.out.println("DEBUG: Updating Membership...");
            System.out.println("Membership ID: " + membershipId);
            System.out.println("Customer ID: " + customerId);
            System.out.println("Start Date: " + startDate);
            System.out.println("End Date: " + endDate);
            System.out.println("Type: " + type);
            System.out.println("Password: " + password);

            // ✅ Create Membership object (Ensure your Membership class has this constructor)
            Membership membership = new Membership(membershipId, customerId, startDate, endDate, type, password);

            // ✅ Call DAO to update membership
            MembershipDAO membershipDAO = new MembershipDAO();
            boolean success = membershipDAO.updateMembership(membership);

            if (success) {
                System.out.println("✅ Membership Updated Successfully!");
                response.sendRedirect("ViewMembershipServlet");  // ✅ Redirect to view memberships
            } else {
                System.out.println("❌ Membership Update Failed!");
                response.sendRedirect("updateMembership.jsp?error=UpdateFailed");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("updateMembership.jsp?error=InvalidData");
        }
    }
}
