import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import './AuthModal.css'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: 'signin' | 'signup'
}

function AuthModal({ isOpen, onClose, initialTab = 'signin' }: AuthModalProps) {
  const { signup, login, verifyEmail, forgotPassword, resetPassword } = useAuth()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [resetPasswordEmail, setResetPasswordEmail] = useState('')
  const [resetPasswordOtp, setResetPasswordOtp] = useState('')
  const [resetPasswordNewPassword, setResetPasswordNewPassword] = useState('')
  const [resetPasswordConfirmPassword, setResetPasswordConfirmPassword] = useState('')
  const [verificationEmail, setVerificationEmail] = useState('')
  const [verificationOtp, setVerificationOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [signUpFirstName, setSignUpFirstName] = useState('')
  const [signUpLastName, setSignUpLastName] = useState('')
  const [signUpUserName, setSignUpUserName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('')
  const [signUpPhone, setSignUpPhone] = useState('')

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, initialTab])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = await login(signInEmail, signInPassword)
    
    if (result.success) {
      onClose()
      setSignInEmail('')
      setSignInPassword('')
    } else {
      setError(result.error || 'Login failed. Please check your credentials.')
    }
    
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match!')
      return
    }
    
    setLoading(true)
    
    const result = await signup({
      firstName: signUpFirstName,
      lastName: signUpLastName,
      userName: signUpUserName,
      email: signUpEmail,
      phone: signUpPhone,
      password: signUpPassword
    })
    
    if (result.success) {
      setVerificationEmail(signUpEmail)
      setShowEmailVerification(true)
      setSignUpFirstName('')
      setSignUpLastName('')
      setSignUpUserName('')
      setSignUpPhone('')
      setSignUpPassword('')
      setSignUpConfirmPassword('')
    } else {
      setError(result.error || 'Registration failed. Please try again.')
    }
    
    setLoading(false)
  }

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = await verifyEmail(verificationEmail, verificationOtp)
    
    if (result.success) {
      setShowEmailVerification(false)
      setVerificationEmail('')
      setVerificationOtp('')
      alert('Email verified successfully! You can now sign in.')
      setActiveTab('signin')
    } else {
      setError(result.error || 'Verification failed. Please check your OTP.')
    }
    
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = await forgotPassword(forgotPasswordEmail)
    
    if (result.success) {
      setResetPasswordEmail(forgotPasswordEmail)
      setShowForgotPassword(false)
      setShowResetPassword(true)
      setForgotPasswordEmail('')
    } else {
      setError(result.error || 'Failed to send reset password email. Please try again.')
    }
    
    setLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (resetPasswordNewPassword !== resetPasswordConfirmPassword) {
      setError('Passwords do not match!')
      return
    }
    
    setLoading(true)
    
    const result = await resetPassword(resetPasswordEmail, resetPasswordOtp, resetPasswordNewPassword)
    
    if (result.success) {
      alert('Password reset successfully! You can now sign in with your new password.')
      setShowResetPassword(false)
      setResetPasswordEmail('')
      setResetPasswordOtp('')
      setResetPasswordNewPassword('')
      setResetPasswordConfirmPassword('')
      setActiveTab('signin')
    } else {
      setError(result.error || 'Password reset failed. Please check your OTP and try again.')
    }
    
    setLoading(false)
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
           <motion.div
             className="auth-modal"
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             transition={{ duration: 0.3, ease: 'easeOut' }}
             onClick={(e) => e.stopPropagation()}
           >
             <div className="auth-modal-container">
              <div className="auth-modal-left">
                <div className="auth-modal-branding">
                  <div className="auth-modal-logo">
                    <img
                      src="/JS Car Wash Images/cropped-fghfthgf.png"
                      alt="JS Car Wash Logo"
                      className="auth-logo-img"
                    />
                  </div>
                  <h1 className="auth-welcome-title">WELCOME</h1>
                  <h2 className="auth-brand-name">JS CAR WASH</h2>
                  <div className="auth-welcome-divider"></div>
                  <p className="auth-welcome-text">
                    Sign in to access your account and manage your car wash services with ease. Your gateway to premium car care solutions.
                  </p>
                </div>
              </div>

               <div className="auth-modal-right">
                 <button
                   className="auth-modal-close"
                   onClick={onClose}
                   aria-label="Close"
                 >
                   <i className="fas fa-times"></i>
                 </button>
                 <div className="auth-modal-content">
                  <div className="auth-tabs">
                    <button
                      className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab('signin')
                        setShowForgotPassword(false)
                        setShowEmailVerification(false)
                        setShowResetPassword(false)
                        setError('')
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab('signup')
                        setShowForgotPassword(false)
                        setShowEmailVerification(false)
                        setShowResetPassword(false)
                        setError('')
                      }}
                    >
                      Sign Up
                    </button>
                  </div>

                  <div className="auth-tab-content">
                <AnimatePresence mode="wait">
                  {showResetPassword ? (
                    <motion.div
                      key="reset-password"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="auth-form-container"
                    >
                      <h2 className="auth-form-title">Reset Password</h2>
                      <p className="auth-form-subtitle">Enter the OTP sent to your email and your new password</p>
                      
                      {error && (
                        <div className="auth-error-message">
                          <i className="fas fa-exclamation-circle"></i>
                          {error}
                        </div>
                      )}
                      
                      <form onSubmit={handleResetPassword} className="auth-form">
                        <div className="auth-form-group">
                          <label htmlFor="reset-email">Email Address *</label>
                          <div className="auth-input-wrapper">
                            <i className="fas fa-envelope auth-input-icon"></i>
                            <input
                              type="email"
                              id="reset-email"
                              value={resetPasswordEmail}
                              onChange={(e) => setResetPasswordEmail(e.target.value)}
                              placeholder="Email Address"
                              required
                              disabled
                            />
                          </div>
                        </div>

                        <div className="auth-form-group">
                          <label htmlFor="reset-otp">OTP *</label>
                          <div className="auth-input-wrapper">
                            <i className="fas fa-key auth-input-icon"></i>
                            <input
                              type="text"
                              id="reset-otp"
                              value={resetPasswordOtp}
                              onChange={(e) => setResetPasswordOtp(e.target.value)}
                              placeholder="Enter OTP"
                              required
                            />
                          </div>
                        </div>

                        <div className="auth-form-group">
                          <label htmlFor="reset-new-password">New Password *</label>
                          <div className="auth-input-wrapper">
                            <i className="fas fa-lock auth-input-icon"></i>
                            <input
                              type="password"
                              id="reset-new-password"
                              value={resetPasswordNewPassword}
                              onChange={(e) => setResetPasswordNewPassword(e.target.value)}
                              placeholder="New Password"
                              required
                            />
                          </div>
                        </div>

                        <div className="auth-form-group">
                          <label htmlFor="reset-confirm-password">Confirm New Password *</label>
                          <div className="auth-input-wrapper">
                            <i className="fas fa-lock auth-input-icon"></i>
                            <input
                              type="password"
                              id="reset-confirm-password"
                              value={resetPasswordConfirmPassword}
                              onChange={(e) => setResetPasswordConfirmPassword(e.target.value)}
                              placeholder="Confirm New Password"
                              required
                            />
                          </div>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                          {loading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <button
                          type="button"
                          className="auth-back-link"
                          onClick={() => {
                            setShowResetPassword(false)
                            setShowForgotPassword(true)
                            setResetPasswordEmail('')
                            setResetPasswordOtp('')
                            setResetPasswordNewPassword('')
                            setResetPasswordConfirmPassword('')
                            setError('')
                          }}
                        >
                          Back
                        </button>
                      </form>
                    </motion.div>
                  ) : showEmailVerification ? (
                    <motion.div
                      key="email-verification"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="auth-form-container"
                    >
                      <h2 className="auth-form-title">Verify Email</h2>
                      <p className="auth-form-subtitle">Enter the OTP sent to your email address</p>
                      
                      {error && (
                        <div className="auth-error-message">
                          <i className="fas fa-exclamation-circle"></i>
                          {error}
                        </div>
                      )}
                      
                      <form onSubmit={handleVerifyEmail} className="auth-form">
                        <div className="auth-form-group">
                          <label htmlFor="verify-email">Email Address *</label>
                          <div className="auth-input-wrapper">
                            <i className="fas fa-envelope auth-input-icon"></i>
                            <input
                              type="email"
                              id="verify-email"
                              value={verificationEmail}
                              onChange={(e) => setVerificationEmail(e.target.value)}
                              placeholder="Email Address"
                              required
                            />
                          </div>
                        </div>

                        <div className="auth-form-group">
                          <label htmlFor="verify-otp">OTP *</label>
                          <div className="auth-input-wrapper">
                            <i className="fas fa-key auth-input-icon"></i>
                            <input
                              type="text"
                              id="verify-otp"
                              value={verificationOtp}
                              onChange={(e) => setVerificationOtp(e.target.value)}
                              placeholder="Enter OTP"
                              required
                            />
                          </div>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                          {loading ? 'Verifying...' : 'Verify Email'}
                        </button>

                        <button
                          type="button"
                          className="auth-back-link"
                          onClick={() => {
                            setShowEmailVerification(false)
                            setVerificationEmail('')
                            setVerificationOtp('')
                            setError('')
                            setActiveTab('signup')
                          }}
                        >
                          Back to Sign Up
                        </button>
                      </form>
                    </motion.div>
                  ) : showForgotPassword && activeTab === 'signin' ? (
                    <motion.div
                      key="forgot-password"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="auth-form-container"
                    >
                      <h2 className="auth-form-title">Forgot Password</h2>
                      <p className="auth-form-subtitle">Enter your email to receive a password reset OTP</p>
                      
                      {error && (
                        <div className="auth-error-message">
                          <i className="fas fa-exclamation-circle"></i>
                          {error}
                        </div>
                      )}
                      
                      <form onSubmit={handleForgotPassword} className="auth-form">
                        <div className="auth-form-group">
                          <label htmlFor="forgot-email">Email Address *</label>
                          <div className="auth-input-wrapper">
                            <i className="fas fa-envelope auth-input-icon"></i>
                            <input
                              type="email"
                              id="forgot-email"
                              value={forgotPasswordEmail}
                              onChange={(e) => setForgotPasswordEmail(e.target.value)}
                              placeholder="Email Address"
                              required
                            />
                          </div>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                          {loading ? 'Sending...' : 'Send OTP'}
                        </button>

                        <button
                          type="button"
                          className="auth-back-link"
                          onClick={() => {
                            setShowForgotPassword(false)
                            setForgotPasswordEmail('')
                            setError('')
                          }}
                        >
                          Back to Sign In
                        </button>
                      </form>
                    </motion.div>
                  ) : activeTab === 'signin' ? (
                    <motion.div
                      key="signin"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="auth-form-container"
                    >
                      <h2 className="auth-form-title">Sign in</h2>
                      <p className="auth-form-subtitle">Enter your credentials to access your account</p>
                      
                      {error && (
                        <div className="auth-error-message">
                          <i className="fas fa-exclamation-circle"></i>
                          {error}
                        </div>
                      )}
                      
                      <form onSubmit={handleSignIn} className="auth-form">
                        <div className="auth-form-group">
                          <label htmlFor="signin-email">Email Address</label>
                          <div className="auth-input-wrapper">
                            <i className="fas fa-envelope auth-input-icon"></i>
                            <input
                              type="email"
                              id="signin-email"
                              value={signInEmail}
                              onChange={(e) => setSignInEmail(e.target.value)}
                              placeholder="Email Address"
                            />
                          </div>
                        </div>

                        <div className="auth-form-group">
                          <label htmlFor="signin-password">Password</label>
                          <div className="auth-input-wrapper">
                            <i className="fas fa-lock auth-input-icon"></i>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              id="signin-password"
                              value={signInPassword}
                              onChange={(e) => setSignInPassword(e.target.value)}
                              placeholder="Password"
                            />
                            <button
                              type="button"
                              className="auth-password-toggle"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                        </div>

                        <div className="auth-form-options">
                          <label className="auth-checkbox">
                            <input type="checkbox" />
                            <span>Remember me</span>
                          </label>
                          <button
                            type="button"
                            className="auth-forgot-link"
                            onClick={() => setShowForgotPassword(true)}
                          >
                            Forgot Password?
                          </button>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                          {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="auth-form-container"
                    >
                      <h2 className="auth-form-title">Create Account</h2>
                      <p className="auth-form-subtitle">Sign up to get started</p>
                      
                      {error && (
                        <div className="auth-error-message">
                          <i className="fas fa-exclamation-circle"></i>
                          {error}
                        </div>
                      )}
                      
                      <form onSubmit={handleSignUp} className="auth-form">
                         <div className="auth-form-group">
                           <label htmlFor="signup-username">User Name *</label>
                           <div className="auth-input-wrapper">
                             <i className="fas fa-user-circle auth-input-icon"></i>
                             <input
                               type="text"
                               id="signup-username"
                               value={signUpUserName}
                               onChange={(e) => setSignUpUserName(e.target.value)}
                               placeholder="User Name"
                               required
                             />
                           </div>
                         </div>

                         <div className="auth-form-grid">
                           <div className="auth-form-group">
                             <label htmlFor="signup-firstname">First Name *</label>
                             <div className="auth-input-wrapper">
                               <i className="fas fa-user auth-input-icon"></i>
                               <input
                                 type="text"
                                 id="signup-firstname"
                                 value={signUpFirstName}
                                 onChange={(e) => setSignUpFirstName(e.target.value)}
                                 placeholder="First Name"
                                 required
                               />
                             </div>
                           </div>

                           <div className="auth-form-group">
                             <label htmlFor="signup-lastname">Last Name *</label>
                             <div className="auth-input-wrapper">
                               <i className="fas fa-user auth-input-icon"></i>
                               <input
                                 type="text"
                                 id="signup-lastname"
                                 value={signUpLastName}
                                 onChange={(e) => setSignUpLastName(e.target.value)}
                                 placeholder="Last Name"
                                 required
                               />
                             </div>
                           </div>
                         </div>

                         <div className="auth-form-grid">
                           <div className="auth-form-group">
                             <label htmlFor="signup-email">Email Address *</label>
                             <div className="auth-input-wrapper">
                               <i className="fas fa-envelope auth-input-icon"></i>
                               <input
                                 type="email"
                                 id="signup-email"
                                 value={signUpEmail}
                                 onChange={(e) => setSignUpEmail(e.target.value)}
                                 placeholder="Email Address"
                                 required
                               />
                             </div>
                           </div>

                           <div className="auth-form-group">
                             <label htmlFor="signup-phone">Phone Number *</label>
                             <div className="auth-input-wrapper">
                               <i className="fas fa-phone auth-input-icon"></i>
                               <input
                                 type="tel"
                                 id="signup-phone"
                                 value={signUpPhone}
                                 onChange={(e) => setSignUpPhone(e.target.value)}
                                 placeholder="Phone Number"
                                 required
                               />
                             </div>
                           </div>
                         </div>

                         <div className="auth-form-grid">
                           <div className="auth-form-group">
                             <label htmlFor="signup-password">Password *</label>
                             <div className="auth-input-wrapper">
                               <i className="fas fa-lock auth-input-icon"></i>
                               <input
                                 type="password"
                                 id="signup-password"
                                 value={signUpPassword}
                                 onChange={(e) => setSignUpPassword(e.target.value)}
                                 placeholder="Password"
                                 required
                               />
                             </div>
                           </div>

                           <div className="auth-form-group">
                             <label htmlFor="signup-confirm-password">Confirm Password *</label>
                             <div className="auth-input-wrapper">
                               <i className="fas fa-lock auth-input-icon"></i>
                               <input
                                 type="password"
                                 id="signup-confirm-password"
                                 value={signUpConfirmPassword}
                                 onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                                 placeholder="Confirm Password"
                                 required
                               />
                             </div>
                           </div>
                         </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                          {loading ? 'Creating...' : 'Create Account'}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return isOpen ? createPortal(modalContent, document.body) : null
}

export default AuthModal

