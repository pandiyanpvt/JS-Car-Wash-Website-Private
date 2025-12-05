import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import './LoginPage.css'
import '../products/ProductPage.css'

function LoginPage() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')

  // Check if coming from /register route and switch to signup tab
  useEffect(() => {
    if (location.state?.fromRegister) {
      setActiveTab('signup')
    }
  }, [location])

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('')
  const [signUpPhone, setSignUpPhone] = useState('')

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log('Sign In:', { email: signInEmail, password: signInPassword })
    // Navigate to home or dashboard after successful login
    // navigate('/')
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    if (signUpPassword !== signUpConfirmPassword) {
      alert('Passwords do not match!')
      return
    }
    console.log('Sign Up:', {
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      phone: signUpPhone
    })
    // Navigate to home or dashboard after successful signup
    // navigate('/')
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password logic here
    console.log('Forgot Password:', { email: forgotPasswordEmail })
    alert('Password reset link has been sent to your email!')
    setShowForgotPassword(false)
    setForgotPasswordEmail('')
  }

  return (
    <div className="login-page">
      <div className="login-page-container">
        {/* Left Welcome Panel */}
        <div className="login-welcome-panel">
          <div className="login-welcome-content">
            <div className="login-logo-container">
              <img
                src="/JS Car Wash Images/cropped-fghfthgf.png"
                alt="JS Car Wash Logo"
                className="login-logo-img"
              />
            </div>
            <h2 className="login-welcome-subtitle">Nice to see you again</h2>
            <h1 className="login-welcome-title">
              WELCOME BACK
              <span className="login-welcome-underline"></span>
            </h1>
            <p className="login-welcome-text">
              Experience premium car wash and detailing services. Book your appointment today and keep your vehicle looking its best.
            </p>
          </div>
          <div className="login-welcome-background">
            <div className="login-bg-grid"></div>
            <div className="login-bg-waves"></div>
            <div className="login-bg-dots"></div>
            <div className="login-bg-circles"></div>
          </div>
        </div>

        {/* Right Login Form Panel */}
        <div className="login-form-panel">
          <div className="login-container">
            <div className="login-content">
          {/* Tabs - Hide when forgot password is shown */}
          {!showForgotPassword && (
            <div className="login-tabs">
              <button
                className={`login-tab ${activeTab === 'signin' ? 'active' : ''}`}
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </button>
              <button
                className={`login-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Tab Content */}
          <div className="login-tab-content">
            <AnimatePresence mode="wait">
              {/* Forgot Password Form */}
              {showForgotPassword && (
                <motion.div
                  key="forgotpassword"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="login-form-container"
                >
                  <h2 className="login-form-title">Forgot Password</h2>
                  <p className="login-form-subtitle">Enter your email address and we'll send you a link to reset your password</p>
                  
                  <form onSubmit={handleForgotPassword} className="login-form">
                    <div className="login-form-group">
                      <label htmlFor="forgot-email">Email Address</label>
                      <input
                        type="email"
                        id="forgot-email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <button type="submit" className="login-submit-btn">
                      Send Reset Link
                    </button>

                    <button 
                      type="button" 
                      className="login-back-btn"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Back to Sign In
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Sign In Form */}
              {!showForgotPassword && activeTab === 'signin' && (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="login-form-container"
                >
                  <h2 className="login-form-title">Welcome Back</h2>
                  <p className="login-form-subtitle">Sign in to your account</p>
                  
                  <form onSubmit={handleSignIn} className="login-form">
                    <div className="login-form-group">
                      <label htmlFor="signin-email">Email Address</label>
                      <input
                        type="email"
                        id="signin-email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="login-form-group">
                      <label htmlFor="signin-password">Password</label>
                      <input
                        type="password"
                        id="signin-password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    <div className="login-form-options">
                      <label className="login-checkbox">
                        <input type="checkbox" />
                        <span>Remember me</span>
                      </label>
                      <button 
                        type="button"
                        className="login-forgot-link"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button type="submit" className="login-submit-btn">
                      Sign In
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Sign Up Form */}
              {!showForgotPassword && activeTab === 'signup' && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="login-form-container"
                >
                  <h2 className="login-form-title">Create Account</h2>
                  <p className="login-form-subtitle">Sign up to get started</p>
                  
                  <form onSubmit={handleSignUp} className="login-form">
                    <div className="login-form-group">
                      <label htmlFor="signup-name">Full Name</label>
                      <input
                        type="text"
                        id="signup-name"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="login-form-group">
                      <label htmlFor="signup-email">Email Address</label>
                      <input
                        type="email"
                        id="signup-email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="login-form-group">
                      <label htmlFor="signup-phone">Phone Number</label>
                      <input
                        type="tel"
                        id="signup-phone"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div className="login-form-group">
                      <label htmlFor="signup-password">Password</label>
                      <input
                        type="password"
                        id="signup-password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                      />
                    </div>

                    <div className="login-form-group">
                      <label htmlFor="signup-confirm-password">Confirm Password</label>
                      <input
                        type="password"
                        id="signup-confirm-password"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                      />
                    </div>

                    <div className="login-form-options">
                      <label className="login-checkbox">
                        <input type="checkbox" required />
                        <span>I agree to the Terms & Conditions</span>
                      </label>
                    </div>

                    <button type="submit" className="login-submit-btn">
                      Create Account
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

