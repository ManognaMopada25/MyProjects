package utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/MembershipDB"; // 🔹 Ensure DB name is correct
    private static final String USER = "root";
    private static final String PASSWORD = "@Navemaha1022";

    public static Connection getConnection() {
        Connection conn = null;
        try {
            // ✅ Load MySQL Driver (Optional in Java 8+)
            Class.forName("com.mysql.cj.jdbc.Driver"); 
            
            // ✅ Establish Connection
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("✅ Database Connection Successful!"); // 🔹 Debugging
        } catch (ClassNotFoundException e) {
            System.out.println("❌ JDBC Driver Not Found! Ensure `mysql-connector-java.jar` is in classpath.");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("❌ Database Connection Error: " + e.getMessage());
            e.printStackTrace();
        }
        return conn;
    }
}
