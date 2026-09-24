import { useState } from 'react';
import { Link } from 'react-router-dom';

function About() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully! I will get back to you soon.");
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
  };

  return (
    <div className="about-page-layout">

      {/* HERO SECTION */}
      <section className="about-hero-section">
        <div className="about-hero-content">
          <h1 className="about-main-title">About Me</h1>

          <h2 className="about-subtitle">Devansh Shrivastava</h2>

          <h3 className="about-role">
            Java Developer • Full Stack Developer • Software Engineer
          </h3>

          <div className="about-body-text">
            <p>
              I'm a passionate software developer focused on building scalable,
              modern, and user-friendly web applications. I specialize in Java,
              Spring Boot, React, and full-stack development.
            </p>

            <p>
              Currently pursuing B.Tech in Computer Science & Engineering from
              Amity University Madhya Pradesh, I enjoy transforming ideas into
              real-world digital products. I am the developer behind TrustSpace,
              a platform designed to simplify property discovery and booking
              experiences with secure communication, verified listings, and a
              modern user experience.
            </p>

            <p>
              My interests include backend architecture, frontend UI/UX design,
              cloud deployment, APIs, authentication systems, and building
              production-ready applications. I continuously explore new
              technologies and love creating impactful digital experiences.
            </p>
          </div>
        </div>

        <div className="about-hero-image">
          <div className="image-red-backdrop">
            <img src="/panda.jpg" alt="Devansh Shrivastava" />
          </div>
        </div>
      </section>

      <hr className="premium-divider" />

      {/* TRUSTSPACE SECTION */}
      <section className="mission-section text-center">
        <h2 className="section-title">Why TrustSpace</h2>

        <p
          className="text-muted"
          style={{ maxWidth: '700px', margin: '0 auto 3rem auto' }}
        >
          TrustSpace is designed to provide a seamless platform for discovering,
          booking, and listing premium spaces. The goal is to create a secure,
          modern, and trusted ecosystem for property owners and customers.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h4>Verified Listings</h4>
            <p>
              Every property is carefully reviewed to ensure quality,
              authenticity, and reliability.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h4>Smart Communication</h4>
            <p>
              Built-in messaging system for smooth communication between users
              and property owners.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Modern Experience</h4>
            <p>
              Fast, responsive, and beautifully designed interfaces optimized
              for every device.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-banner">
        <div className="stat-item">
          <h3>10+</h3>
          <p>Projects Built</p>
        </div>

        <div className="stat-item">
          <h3>Java</h3>
          <p>Backend Expertise</p>
        </div>

        <div className="stat-item">
          <h3>React</h3>
          <p>Frontend Development</p>
        </div>

        <div className="stat-item">
          <h3>24/7</h3>
          <p>Learning Mindset</p>
        </div>
      </section>

      <hr className="premium-divider" />

      {/* CONTACT SECTION */}
      <section className="about-contact-section">
        <h2 className="contact-title">Contact Me</h2>

        <form className="premium-contact-form" onSubmit={handleSubmit}>
          <div className="form-row-2">
            <div className="input-group">
              <label>First name</label>

              <input
                type="text"
                placeholder="John"
                required
                value={formData.firstName}
                onChange={e =>
                  setFormData({
                    ...formData,
                    firstName: e.target.value
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>Last name</label>

              <input
                type="text"
                placeholder="Doe"
                required
                value={formData.lastName}
                onChange={e =>
                  setFormData({
                    ...formData,
                    lastName: e.target.value
                  })
                }
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email address</label>

            <input
              type="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={e =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
              }
            />
          </div>

          <div className="input-group">
            <label>Your message</label>

            <textarea
              rows={5}
              placeholder="Enter your message..."
              required
              value={formData.message}
              onChange={e =>
                setFormData({
                  ...formData,
                  message: e.target.value
                })
              }
            ></textarea>
          </div>

          <button type="submit" className="btn-black-solid">
            Send Message
          </button>
        </form>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section text-center">
        <h2>Explore TrustSpace</h2>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '2rem'
          }}
        >
          <Link to="/properties" className="btn-solid btn-large">
            Explore Properties
          </Link>

          <Link to="/register" className="btn-outline btn-large">
            List Your Property
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;