import { useState } from 'react'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('home')
  const [formSubmitted, setFormSubmitted] = useState(false)

  const pages = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ]

  // Portfolio projects displayed as reusable cards on the Projects page.
  const projects = [
  {
    icon: '✓',
    image: '/images/billing-reconciliation.jpg',
    title: 'Billing Reconciliation Analysis',
    description:
      'Reviewed SAP billable-item records using relevant classes, subprocesses, and fiscal-date criteria to support billing reconciliation.',
      role: 'Role: Billing reconciliation support',
      outcome:
        'Outcome: Helped validate data, investigate discrepancies, and support accurate subscription-billing processes.',
    },
    {
      icon: '◌',
      image: '/images/sap-brim-support.jpg',
      title: 'SAP BRIM Billing Support',
      description:
        'Supported SAP BRIM billing operations by analyzing billing records and investigating production issues in a subscription-billing environment.',
      role: 'Role: SAP BRIM functional support',
      outcome:
        'Outcome: Helped support stable billing operations and timely issue investigation.',
    },
    {
      icon: '↗',
      image: '/images/usage-to-cash.jpg',
      title: 'SAP BRIM Usage-to-Cash Learning Project',
      description:
        'Developed end-to-end knowledge of SAP BRIM processes from customer usage through rating, billing, invoicing, and FI-CA receivables.',
      role: 'Role: SAP BRIM learner and functional analyst',
      outcome:
        'Outcome: Built a practical foundation for subscription-billing support and SAP BRIM certification preparation.',
    },
  ]

  const services = [
    {
      icon: '◈',
      title: 'SAP BRIM Functional Support',
      text: 'Support subscription-billing processes through functional analysis and issue investigation.',
    },
    {
      icon: '✓',
      title: 'Billing Reconciliation',
      text: 'Review billable-item data and support reconciliation activities to identify discrepancies.',
    },
    {
      icon: '◌',
      title: 'Web Application Development',
      text: 'Build user-friendly front-end applications with React, JavaScript, HTML, and CSS.',
    },
    {
      icon: '↗',
      title: 'Python and SQL Development',
      text: 'Create data-focused scripts, queries, and technology solutions for business needs.',
    },
  ]

// Updates the selected page, clears form feedback, and returns the visitor to the top.
  function changePage(pageId) {
    setActivePage(pageId)
    setFormSubmitted(false)
    window.scrollTo(0, 0)
  }

// Shows confirmation feedback, then redirects the visitor to the Home page.
  function handleContactSubmit(event) {
    event.preventDefault()
    setFormSubmitted(true)

    window.setTimeout(() => {
      changePage('home')
    }, 1500)
  }

  return (
    <div className="portfolio-app">
      <header className="site-header">
        <button
          className="brand"
          type="button"
          onClick={() => changePage('home')}
          aria-label="Go to home page"
        >
          <span className="logo-mark">HP</span>
          <span className="brand-name">Haritha Pothamsetty</span>
        </button>

        <nav className="main-navigation" aria-label="Main navigation">
          {pages.map((page) => (
            <button
              key={page.id}
              className={activePage === page.id ? 'nav-link active' : 'nav-link'}
              type="button"
              onClick={() => changePage(page.id)}
            >
              {page.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="page-content">
        {activePage === 'home' && (
          <section className="hero-section">
            <p className="eyebrow">Software Engineering Technology - AI</p>
            <h1>Building thoughtful digital and billing solutions.</h1>
            <p className="hero-text">
              I am Haritha Pothamsetty, a Software Engineering Technology - AI
              student at Centennial College with an interest in SAP BRIM,
              billing reconciliation, and web application development.
            </p>
            <p className="mission-statement">
              My mission is to keep learning, solve meaningful business
              problems, and build technology that is useful and clear.
            </p>
            <button
              className="primary-button"
              type="button"
              onClick={() => changePage('about')}
            >
              Learn more about me
            </button>
          </section>
        )}

        {activePage === 'about' && (
          <section className="about-section">
            <img
              className="profile-photo"
              src="/images/IMG_4495.jpg"
              alt="Haritha Pothamsetty"
            />

            <div className="about-content">
              <p className="eyebrow">About Me</p>
              <h1>Haritha Pothamsetty</h1>
              <p>
                I am a Software Engineering Technology - AI student at
                Centennial College in Scarborough, Ontario, Canada. I am
                building skills in web development, SAP BRIM, billing
                reconciliation, and data-focused technology solutions.
              </p>
              <p>
                I enjoy learning how technology can improve business processes
                and create clear, useful experiences for people.
              </p>
              <a
                className="secondary-button"
                href="/documents/Haritha_Pothamsetty_BRIM%20(2).pdf"
                target="_blank"
                rel="noreferrer"
              >
                View my resume
              </a>
            </div>
          </section>
        )}

        {activePage === 'projects' && (
          <section className="content-section services-section">
            <p className="eyebrow">Selected Work</p>
            <h1>Projects</h1>
            <p className="section-introduction">
              A selection of SAP BRIM, billing, and technology-focused work.
            </p>

            <div className="card-grid">
              {projects.map((project) => (
                <article className="content-card project-card" key={project.title}>
  <img
    className="project-image"
    src={project.image}
    alt={`${project.title} visual`}
  />
  <div className="card-icon" aria-hidden="true">
    {project.icon}
  </div>
  <h2>{project.title}</h2>
                  <p className="card-detail">{project.role}</p>
                  <p className="card-detail">{project.outcome}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {activePage === 'education' && (
          <section className="content-section education-section">
            <p className="eyebrow">Learning Journey</p>
            <h1>Education</h1>

            <article className="education-card">
              <p className="education-date">Expected 2028</p>
              <h2>Software Engineering Technology - AI</h2>
              <p className="education-school">Centennial College</p>
              <p>
                Building knowledge in software development, artificial
                intelligence, web applications, databases, and modern
                technology practices.
              </p>
            </article>

            <article className="education-card">
              <p className="education-date">Professional Development</p>
              <h2>SAP BRIM Usage-to-Cash Learning</h2>
              <p className="education-school">Self-directed SAP learning</p>
              <p>
                Developing knowledge of subscription billing, Convergent
                Invoicing, FI-CA, and the end-to-end Usage-to-Cash process.
              </p>
            </article>
          </section>
        )}

        {activePage === 'services' && (
          <section className="content-section services-section">
            <p className="eyebrow">How I Can Help</p>
            <h1>Services</h1>
            <p className="section-introduction">
              Areas where I bring growing technical knowledge and a
              detail-oriented approach.
            </p>

            <div className="card-grid service-grid">
              {services.map((service) => (
                <article className="content-card service-card" key={service.title}>
                  <div className="card-icon" aria-hidden="true">
                    {service.icon}
                  </div>
                  <h2>{service.title}</h2>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {activePage === 'contact' && (
          <section className="contact-section">
            <div className="contact-details">
              <p className="eyebrow">Get In Touch</p>
              <h1>Contact Me</h1>
              <p>
                Have a question or would like to connect? Send a message using
                the form.
              </p>

              <div className="contact-panel">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:hpotham1@mycentennialcollege.ca">
                    hpotham1@mycentennialcollege.ca
                  </a>
                </p>
                <p>
                  <strong>Location:</strong> Scarborough, Ontario, Canada
                </p>
                <p>
                  <strong>Focus:</strong> SAP BRIM, billing reconciliation,
                  and web application development
                </p>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <label htmlFor="firstName">
                First Name
                <input id="firstName" name="firstName" type="text" required />
              </label>

              <label htmlFor="lastName">
                Last Name
                <input id="lastName" name="lastName" type="text" required />
              </label>

              <label htmlFor="phone">
                Contact Number
                <input id="phone" name="phone" type="tel" />
              </label>

              <label htmlFor="email">
                Email Address
                <input id="email" name="email" type="email" required />
              </label>

              <label htmlFor="message">
                Message
                <textarea id="message" name="message" rows="5" required />
              </label>

              <button className="primary-button" type="submit">
                Send message
              </button>

              {formSubmitted && (
                <p className="form-message">
                  Thank you. Redirecting you to the Home page...
                </p>
              )}
            </form>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <p>© 2026 Haritha Pothamsetty. Built with React.</p>
      </footer>
    </div>
  )
}

export default App