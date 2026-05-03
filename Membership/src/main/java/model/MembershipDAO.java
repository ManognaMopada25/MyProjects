package model;

import utils.DBConnection;
import java.sql.*;
import java.util.*;

public class MembershipDAO {
    
	public void addMembership(Membership membership) {
	    String sql = "INSERT INTO Membership (customer_id, start_date, end_date, type, password) VALUES (?, ?, ?, ?, ?)";

	    try (Connection conn = DBConnection.getConnection();
	         PreparedStatement pstmt = conn.prepareStatement(sql)) {

	        // ✅ Debugging: Print received values
	        System.out.println("DEBUG: Preparing to insert membership...");
	        System.out.println("Customer ID: " + membership.getCustomerId());
	        System.out.println("Start Date: " + membership.getStartDate());
	        System.out.println("End Date: " + membership.getEndDate());
	        System.out.println("Type: " + membership.getType());
	        System.out.println("Password: " + membership.getPassword());

	        pstmt.setInt(1, membership.getCustomerId());
	        pstmt.setString(2, membership.getStartDate());
	        pstmt.setString(3, membership.getEndDate());
	        pstmt.setString(4, membership.getType());
	        pstmt.setString(5, membership.getPassword());

	        int rowsInserted = pstmt.executeUpdate();
	        System.out.println("DEBUG: Rows Inserted = " + rowsInserted);

	        if (rowsInserted > 0) {
	            System.out.println("✅ Membership added successfully!");
	        } else {
	            System.out.println("❌ Membership was NOT added!");
	        }

	    } catch (SQLException e) {
	        System.out.println("❌ SQL Error: " + e.getMessage());  // ✅ Print SQL error
	        e.printStackTrace();
	    } catch (Exception e) {
	        System.out.println("❌ General Error: " + e.getMessage());  // ✅ Catch other errors
	        e.printStackTrace();
	    }
	}

    // ✅ Get All Memberships
    public List<Membership> getAllMemberships() {
        List<Membership> memberships = new ArrayList<>();
        String sql = "SELECT * FROM Membership";

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                memberships.add(new Membership(
                    rs.getInt("membership_id"),
                    rs.getInt("customer_id"),
                    rs.getString("start_date"),
                    rs.getString("end_date"),
                    rs.getString("type"),
                    rs.getString("password")
                ));
            }
        } catch (Exception e) {
            System.out.println("❌ Error fetching memberships: " + e.getMessage());
            e.printStackTrace();
        }
        return memberships;
    }

    // ✅ Get Membership by ID
    public Membership getMembershipById(int id) {
        Membership membership = null;
        String sql = "SELECT * FROM Membership WHERE membership_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                membership = new Membership(
                    rs.getInt("membership_id"),
                    rs.getInt("customer_id"),
                    rs.getString("start_date"),
                    rs.getString("end_date"),
                    rs.getString("type"),
                    rs.getString("password")
                );
            }
        } catch (Exception e) {
            System.out.println("❌ Error fetching membership by ID: " + e.getMessage());
            e.printStackTrace();
        }
        return membership;
    }
    

    // ✅ Validate Membership for Login
    public Membership validateMembership(String membershipId, String password) {
        String sql = "SELECT * FROM Membership WHERE membership_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, membershipId);  

            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                String storedPassword = rs.getString("password");

                // ✅ Correct password validation: compare password with stored password
                if (storedPassword.equals(password)) {  
                    System.out.println("✅ Login Successful for ID: " + membershipId);
                    return new Membership(
                        rs.getInt("membership_id"),
                        rs.getInt("customer_id"),
                        rs.getString("start_date"),
                        rs.getString("end_date"),
                        rs.getString("type"),
                        storedPassword  // Return password (if needed)
                    );
                } else {
                    System.out.println("❌ Invalid Credentials: Incorrect Password");
                }
            } else {
                System.out.println("❌ No membership found for ID: " + membershipId);
            }
        } catch (SQLException e) {
            System.out.println("❌ SQL Error: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    public boolean updateMembership(Membership membership) {
        String sql = "UPDATE Membership SET customer_id=?, start_date=?, end_date=?, type=?, password=COALESCE(NULLIF(?, ''), password) WHERE membership_id=?";
        boolean rowUpdated = false;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, membership.getCustomerId());
            pstmt.setString(2, membership.getStartDate());
            pstmt.setString(3, membership.getEndDate());
            pstmt.setString(4, membership.getType());
            pstmt.setString(5, membership.getPassword());  // ✅ Keeps old password if blank
            pstmt.setInt(6, membership.getMembershipId());

            int rowsAffected = pstmt.executeUpdate();
            rowUpdated = rowsAffected > 0;

            if (rowUpdated) {
                System.out.println("✅ Membership updated successfully!");
            } else {
                System.out.println("❌ Update failed!");
            }
        } catch (SQLException e) {
            System.out.println("❌ SQL Error: " + e.getMessage());
            e.printStackTrace();
        }
        return rowUpdated;
    }



    // ✅ Update Membership Password Only
    public boolean updatePassword(int membershipId, String newPassword) {
        String sql = "UPDATE Membership SET password=? WHERE membership_id=?";
        boolean passwordUpdated = false;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, newPassword);
            pstmt.setInt(2, membershipId);
            
            passwordUpdated = pstmt.executeUpdate() > 0;
        } catch (Exception e) {
            System.out.println("❌ Error updating password: " + e.getMessage());
            e.printStackTrace();
        }
        return passwordUpdated;
    }

    // ✅ Delete Membership
    public boolean deleteMembership(int id) {
        String sql = "DELETE FROM Membership WHERE membership_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;  // Return true if deletion was successful
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;  // Return false if there was an error
    }
}
