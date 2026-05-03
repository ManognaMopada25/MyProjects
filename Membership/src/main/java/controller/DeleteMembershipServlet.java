package controller;

import model.MembershipDAO;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/DeleteMembershipServlet")
public class DeleteMembershipServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String idParam = request.getParameter("id");

        if (idParam == null || idParam.trim().isEmpty()) {
            request.setAttribute("errorMessage", "❌ Please enter a Membership ID.");
            request.getRequestDispatcher("deleteMembership.jsp").forward(request, response);
            return;
        }

        try {
            int id = Integer.parseInt(idParam);
            MembershipDAO membershipDAO = new MembershipDAO();
            boolean isDeleted = membershipDAO.deleteMembership(id);

            if (isDeleted) {
                response.sendRedirect("ViewMembershipServlet"); // ✅ Redirect to updated membership list
            } else {
                request.setAttribute("errorMessage", "❌ Membership not found or could not be deleted.");
                request.getRequestDispatcher("deleteMembership.jsp").forward(request, response);
            }
        } catch (NumberFormatException e) {
            request.setAttribute("errorMessage", "❌ Invalid Membership ID format.");
            request.getRequestDispatcher("deleteMembership.jsp").forward(request, response);
        }
    }
}
