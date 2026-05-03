'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logo}>HOD Dashboard</div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#about" style={styles.navLink}>About</a>
            <Link href="/login" style={styles.loginBtn}>Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Department Management Simplified
          </h1>
          <p style={styles.heroDescription}>
            Streamline your department operations with an intelligent management platform designed for academic institutions.
          </p>
          <div style={styles.heroButtons}>
            <Link href="/login" style={styles.ctaButton}>Get Started Free</Link>
            <a href="#features" style={styles.secondaryButton}>Learn More →</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.features}>
        <div style={styles.featuresHeader}>
          <h2 style={styles.sectionTitle}>Powerful Features</h2>
          <p style={styles.sectionSubtitle}>Everything you need to manage your department effectively</p>
        </div>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureNumber}>01</div>
            <h3 style={styles.featureTitle}>Faculty Management</h3>
            <p style={styles.featureText}>Organize and manage faculty information, roles, and responsibilities with ease.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureNumber}>02</div>
            <h3 style={styles.featureTitle}>Task Tracking</h3>
            <p style={styles.featureText}>Create, assign, and track tasks with real-time status updates and progress monitoring.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureNumber}>03</div>
            <h3 style={styles.featureTitle}>Approval System</h3>
            <p style={styles.featureText}>Streamlined workflow for approvals and requests with audit trails.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureNumber}>04</div>
            <h3 style={styles.featureTitle}>Analytics & Reports</h3>
            <p style={styles.featureText}>Generate insightful reports and track key metrics for data-driven decisions.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureNumber}>05</div>
            <h3 style={styles.featureTitle}>Enterprise Security</h3>
            <p style={styles.featureText}>Bank-level encryption and security protocols to protect your sensitive data.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureNumber}>06</div>
            <h3 style={styles.featureTitle}>Real-time Notifications</h3>
            <p style={styles.featureText}>Stay updated with instant notifications on important events and deadlines.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>42+</div>
            <div style={styles.statLabel}>Active Faculty</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>6</div>
            <div style={styles.statLabel}>Departments</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>500+</div>
            <div style={styles.statLabel}>Tasks Managed</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>99.9%</div>
            <div style={styles.statLabel}>Uptime SLA</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={styles.about}>
        <div style={styles.aboutContent}>
          <h2 style={styles.sectionTitle}>Why Choose HOD Dashboard?</h2>
          <div style={styles.aboutGrid}>
            <div style={styles.aboutItem}>
              <div style={styles.aboutIcon}>⚙️</div>
              <h4>Seamless Integration</h4>
              <p>Integrates smoothly with your existing systems and workflows.</p>
            </div>
            <div style={styles.aboutItem}>
              <div style={styles.aboutIcon}>🎯</div>
              <h4>User-Centric Design</h4>
              <p>Intuitive interface designed with user feedback and experience in mind.</p>
            </div>
            <div style={styles.aboutItem}>
              <div style={styles.aboutIcon}>🛡️</div>
              <h4>Data Protection</h4>
              <p>Advanced security measures ensure your data is always protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.finalCta}>
        <h2 style={styles.ctaTitle}>Ready to Transform Your Department?</h2>
        <p style={styles.ctaSubtitle}>Start managing your department more efficiently today</p>
        <Link href="/login" style={styles.finalCtaButton}>Begin Your Journey</Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>HOD Dashboard</h4>
            <p style={styles.footerText}>Empowering departments with intelligent management solutions.</p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Product</h4>
            <ul style={styles.footerList}>
              <li><a href="#" style={styles.footerLink}>Features</a></li>
              <li><a href="#" style={styles.footerLink}>Pricing</a></li>
              <li><a href="#" style={styles.footerLink}>Security</a></li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Company</h4>
            <ul style={styles.footerList}>
              <li><a href="#" style={styles.footerLink}>About</a></li>
              <li><a href="#" style={styles.footerLink}>Blog</a></li>
              <li><a href="#" style={styles.footerLink}>Contact</a></li>
            </ul>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>&copy; 2025 HOD Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  navbar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    gap: '40px',
    alignItems: 'center',
  },
  navLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.2s',
    cursor: 'pointer',
  },
  loginBtn: {
    backgroundColor: '#000000',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  hero: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '100px 40px',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '24px',
    lineHeight: '1.1',
    letterSpacing: '-1px',
  },
  heroDescription: {
    fontSize: '18px',
    color: '#6b7280',
    marginBottom: '40px',
    lineHeight: '1.6',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaButton: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    border: 'none',
    display: 'inline-block',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    color: '#111827',
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    border: 'none',
    display: 'inline-block',
  },
  features: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '100px 40px',
    backgroundColor: '#f9fafb',
    marginTop: '60px',
  },
  featuresHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '40px',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '16px',
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    maxWidth: '500px',
    margin: '0 auto',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '40px',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: '40px 32px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  featureNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#d1d5db',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px',
  },
  featureText: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
    margin: 0,
  },
  statsSection: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '100px 40px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#000000',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
  },
  about: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '100px 40px',
    backgroundColor: '#f9fafb',
  },
  aboutContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
    marginTop: '60px',
  },
  aboutItem: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    textAlign: 'center',
  },
  aboutIcon: {
    fontSize: '40px',
    marginBottom: '16px',
  },
  finalCta: {
    maxWidth: '1400px',
    margin: '60px auto 0',
    padding: '80px 40px',
    backgroundColor: '#000000',
    color: '#ffffff',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '40px',
    fontWeight: '800',
    marginBottom: '16px',
  },
  ctaSubtitle: {
    fontSize: '16px',
    color: '#d1d5db',
    marginBottom: '32px',
  },
  finalCtaButton: {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '14px 36px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'inline-block',
    transition: 'background-color 0.2s',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '60px 40px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
  },
  footerSection: {
    fontSize: '14px',
  },
  footerTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '16px',
  },
  footerText: {
    color: '#6b7280',
    lineHeight: '1.6',
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  footerLink: {
    color: '#6b7280',
    textDecoration: 'none',
    display: 'block',
    paddingBottom: '8px',
    transition: 'color 0.2s',
  },
  footerBottom: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px 40px',
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  },
};
