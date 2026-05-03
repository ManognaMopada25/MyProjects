package controller;

import model.Membership;
import model.MembershipDAO;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            String membershipId = request.getParameter("membershipId");  
            String password = request.getParameter("password");

            System.out.println("DEBUG: Attempting login with ID = " + membershipId);

            MembershipDAO membershipDAO = new MembershipDAO();
            Membership membership = membershipDAO.validateMembership(membershipId, password);  

            if (membership != null) {
                HttpSession session = request.getSession();
                session.setAttribute("username", "Member " + membershipId);
                session.setAttribute("membershipId", membership.getMembershipId());
                response.sendRedirect("home.jsp");
            } else {
                response.sendRedirect("login.html?error=Invalid Credentials");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("login.html?error=Something went wrong");
        }
    }
}
