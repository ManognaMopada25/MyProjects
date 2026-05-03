package model;

public class Membership {
    private int membershipId;
    private int customerId;
    private String startDate;
    private String endDate;
    private String type;
    private String password;  // ✅ Add Password Field

    // ✅ No-Argument Constructor (Needed for flexibility)
    public Membership() {}

    // ✅ Constructor Without Password (For operations where password is not needed)
    public Membership(int membershipId, int customerId, String startDate, String endDate, String type) {
        this.membershipId = membershipId;
        this.customerId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.type = type;
    }

    // ✅ Constructor With Password (For Login & Account Management)
    public Membership(int membershipId, int customerId, String startDate, String endDate, String type, String password) {
        this.membershipId = membershipId;
        this.customerId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.type = type;
        this.password = password;
    }

    public int getMembershipId() { return membershipId; }
    public void setMembershipId(int membershipId) { this.membershipId = membershipId; }  // ✅ Add Setter

    public int getCustomerId() { return customerId; }
    public String getStartDate() { return startDate; }
    public String getEndDate() { return endDate; }
    public String getType() { return type; }

    public String getPassword() { return password; }  
    public void setPassword(String password) { this.password = password; }
}
