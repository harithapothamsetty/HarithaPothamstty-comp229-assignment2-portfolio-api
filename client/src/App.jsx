import { useEffect, useState } from 'react'
import AuthForm from './AuthForm'
import Education from './Education'
import Project from './Project'
import Contact from './Contact'
import { apiRequest } from './api'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('home')
  const [user, setUser] = useState(null)
  const [signingOut, setSigningOut] = useState(false)
  const [authError, setAuthError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function restoreSession() {
      try {
        const data = await apiRequest('/auth/me', {
          signal: controller.signal
        })

        if (!controller.signal.aborted) {
          setUser(data.user)
        }
      } catch (err) {
        if (controller.signal.aborted) return

        setUser(null)

        if (err.status !== 401) {
          setAuthError(
            `Could not restore your session: ${err.message}`
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setCheckingSession(false)
        }
      }
    }

    restoreSession()

    return () => controller.abort()
  }, [])

  const pages = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' }
  ]

  const services = [
    {
      title: 'SAP BRIM Functional Support',
      text:
        'Support subscription-billing processes through functional analysis and issue investigation.'
    },
    {
      title: 'Billing Reconciliation',
      text:
        'Review billable-item data and support reconciliation activities to identify discrepancies.'
    },
    {
      title: 'Web Application Development',
      text:
        'Build user-friendly front-end applications with React, JavaScript, HTML, and CSS.'
    },
    {
      title: 'Python and SQL Development',
      text:
        'Create data-focused scripts, queries, and technology solutions for business needs.'
    }
  ]

  function changePage(pageId) {
    setActivePage(pageId)
    setAuthError('')
    window.scrollTo(0, 0)
  }

  function handleSignedIn(signedInUser) {
    setUser(signedInUser)
    changePage('home')
  }

  async function handleSignout() {
    setSigningOut(true)
    setAuthError('')

    try {
      await apiRequest('/auth/signout')
      setUser(null)
      changePage('home')
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setSigningOut(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="portfolio-app">
        <p role="status" style={{ padding: '32px' }}>
          Checking your session...
        </p>
      </div>
    )
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
          <span className="brand-name">
            Haritha Pothamsetty
          </span>
        </button>

        <nav
          className="main-navigation"
          aria-label="Main navigation"
        >
          {pages.map((page) => (
            <button
              key={page.id}
              className={
                activePage === page.id
                  ? 'nav-link active'
                  : 'nav-link'
              }
              type="button"
              onClick={() => changePage(page.id)}
            >
              {page.label}
            </button>
          ))}

          {!user ? (
            <>
              <button
                className={
                  activePage === 'signin'
                    ? 'nav-link active'
                    : 'nav-link'
                }
                type="button"
                onClick={() => changePage('signin')}
              >
                Sign in
              </button>

              <button
                className={
                  activePage === 'signup'
                    ? 'nav-link active'
                    : 'nav-link'
                }
                type="button"
                onClick={() => changePage('signup')}
              >
                Sign up
              </button>
            </>
          ) : (
            <button
              className="nav-link"
              type="button"
              disabled={signingOut}
              onClick={handleSignout}
            >
              {signingOut ? 'Signing out...' : 'Sign out'}
            </button>
          )}
        </nav>
      </header>

      <main className="page-content">
        {user && (
          <p
            role="status"
            style={{
              padding: '12px 16px',
              border: '1px solid var(--line)',
              background: 'var(--paper)',
              marginBottom: '30px'
            }}
          >
            Signed in as {user.name} | Role: {user.role}
          </p>
        )}

        {authError && (
          <p role="alert" style={{ color: '#a12622' }}>
            {authError}
          </p>
        )}

        {(activePage === 'signin' ||
          activePage === 'signup') && (
          <AuthForm
            key={activePage}
            mode={activePage}
            onSignedIn={handleSignedIn}
            onChangeMode={changePage}
          />
        )}

        {activePage === 'home' && (
          <section className="hero-section">
            <p className="eyebrow">
              Software Engineering Technology - AI
            </p>

            <h1>
              Building thoughtful digital and billing solutions.
            </h1>

            <p className="hero-text">
              I am Haritha Pothamsetty, a Software Engineering
              Technology - AI student at Centennial College
              with an interest in SAP BRIM, billing
              reconciliation, and web application development.
            </p>

            <p className="mission-statement">
              My mission is to keep learning, solve meaningful
              business problems, and build technology that is
              useful and clear.
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
                I am a Software Engineering Technology - AI
                student at Centennial College in Scarborough,
                Ontario, Canada. I am building skills in web
                development, SAP BRIM, billing reconciliation,
                and data-focused technology solutions.
              </p>

              <p>
                I enjoy learning how technology can improve
                business processes and create clear, useful
                experiences for people.
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
          <Project user={user} />
        )}

        {activePage === 'education' && (
          <Education user={user} />
        )}

        {activePage === 'services' && (
          <section className="content-section services-section">
            <p className="eyebrow">How I Can Help</p>
            <h1>Services</h1>

            <p className="section-introduction">
              Areas where I bring growing technical knowledge
              and a detail-oriented approach.
            </p>

            <div className="card-grid service-grid">
              {services.map((service) => (
                <article
                  className="content-card service-card"
                  key={service.title}
                >
                  <h2>{service.title}</h2>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {activePage === 'contact' && (
          <Contact user={user} />
        )}
      </main>

      <footer className="site-footer">
        <p>
          © 2026 Haritha Pothamsetty. Built with React.
        </p>
      </footer>
    </div>
  )
}

export default App