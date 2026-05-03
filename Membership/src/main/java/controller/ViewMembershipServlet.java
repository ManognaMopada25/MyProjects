package controller;  // ✅ Ensure package matches the project structure

import model.Membership;
import model.MembershipDAO;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/ViewMembershipServlet")  // ✅ Make sure this path matches the one in your JSP links
public class ViewMembershipServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        MembershipDAO membershipDAO = new MembershipDAO();
        List<Membership> memberships = membershipDAO.getAllMemberships();  // ✅ Fetch all memberships

        request.setAttribute("memberships", memberships);
        request.getRequestDispatcher("viewMembership.jsp").forward(request, response);
    }
}
