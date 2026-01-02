import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useState } from 'react'

export default function HomePage() {
  const { user } = useAuthStore()
  const [showLoginDropdown, setShowLoginDropdown] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Training Portal</h1>
            </div>
            <div className="flex gap-4">
              {user ? (
                <Link
                  to={`/${user.role}/dashboard`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                  >
                    Login
                    <svg
                      className={`w-4 h-4 transition-transform ${showLoginDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showLoginDropdown && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <Link
                        to="/auth/login?role=applicant"
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-xl">👤</span>
                          Applicant Login
                        </span>
                      </Link>
                      <Link
                        to="/auth/login?role=centre"
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-xl">🏢</span>
                          Centre Login
                        </span>
                      </Link>
                      <Link
                        to="/auth/login?role=admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-xl">⚙️</span>
                          Admin Login
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold"
          >
            ✨ Welcome to the Future of Training Management
          </motion.div>
          
          <h1 className="text-6xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
              Training Journey
            </span>
          </h1>
          
          <p className="text-xl md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
            Experience seamless training enrollment and management with our 
            comprehensive digital platform designed for excellence.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-8 text-sm md:text-base">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">🎓</span>
              <span>200+ Training Programs</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">🏢</span>
              <span>50+ Certified Centers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">⭐</span>
              <span>95% Success Rate</span>
            </div>
          </div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/auth/signup"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl text-lg font-semibold hover:from-primary-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span>Explore Now</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
          
        </motion.div>
      </section>

      {/* About Us Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Us</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We are dedicated to revolutionizing the training and enrollment management 
                landscape by providing a comprehensive digital platform that connects learners, 
                training centers, and administrators seamlessly.
              </p>
              {/* <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our mission is to make quality training accessible to everyone while 
                simplifying the administrative processes for training centers and organizations. 
                With cutting-edge technology and user-centric design, we ensure a smooth 
                experience from application to certification.
              </p> */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Industry-Leading Platform</h4>
                    <p className="text-gray-600">State-of-the-art technology for seamless training management</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Dedicated Support Team</h4>
                    <p className="text-gray-600">24/7 assistance to help you succeed in your training journey</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Trusted by Thousands</h4>
                    <p className="text-gray-600">Join our growing community of successful learners</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="relative bg-gradient-to-br from-primary-50 to-indigo-50 rounded-2xl p-8 shadow-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                      <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
                      <div className="text-sm text-gray-600">Active Students</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                      <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
                      <div className="text-sm text-gray-600">Training Centers</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                      <div className="text-4xl font-bold text-primary-600 mb-2">200+</div>
                      <div className="text-sm text-gray-600">Training Programs</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                      <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Key <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Features</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-white p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-primary-100 h-full">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-4xl transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-md">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Questions</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const [isOpen, setIsOpen] = useState(false)
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-8">{faq.question}</span>
                    <svg
                      className={`w-6 h-6 text-primary-600 transform transition-all duration-500 ease-in-out flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.4, 0.0, 0.2, 1]
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Users Say</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Dhritishree Saha -  All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: '🎓',
    title: 'Training Enrollment',
    description: 'Browse and apply for training programs across multiple centers and sessions with our intuitive platform.',
  },
  {
    icon: '📊',
    title: 'Application Tracking',
    description: 'Real-time tracking of application status, payments, and certifications with instant notifications.',
  },
  {
    icon: '🔐',
    title: 'Secure & Reliable',
    description: 'Role-based access control with enterprise-grade security and 99.9% uptime guarantee.',
  },
  {
    icon: '🏢',
    title: 'Multi-Center Support',
    description: 'Manage multiple training centers and sessions efficiently from a unified dashboard.',
  },
]

const faqs = [
  {
    question: 'How do I register for a training program?',
    answer: 'Simply click on the "Explore Now" button, create an account by selecting your role (Applicant, Centre, or Admin), complete your profile, and browse available training programs to apply.',
  },
  {
    question: 'What documents are required for enrollment?',
    answer: 'You will need to provide basic identification documents, educational certificates, and any specific documents required by the training center. All requirements will be clearly listed during the application process.',
  },
  {
    question: 'How can I track my application status?',
    answer: 'Once you submit your application, you can track its status in real-time through your dashboard. You will also receive email notifications for any updates or changes to your application.',
  },
  {
    question: 'Is there support available if I face issues?',
    answer: 'Yes! Our dedicated support team is available 24/7 to assist you with any questions or issues. You can reach us through the contact form, email, or live chat support.',
  },
  {
    question: 'Can training centers manage multiple sessions?',
    answer: 'Absolutely! Training centers have access to a comprehensive dashboard where they can create, manage, and track multiple training sessions, monitor enrollments, and communicate with applicants efficiently.',
  },
]

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Training Applicant',
    comment: 'The platform made it incredibly easy to find and apply for training programs. The entire process was smooth and transparent. Highly recommend!',
  },
  {
    name: 'Priya Sharma',
    role: 'Training Center Admin',
    comment: 'Managing our training sessions has never been easier. The dashboard is intuitive and saves us hours of administrative work every week.',
  },
  {
    name: 'Amit Patel',
    role: 'System Administrator',
    comment: 'Outstanding platform with robust security features. The role-based access control and reporting tools make system management a breeze.',
  },
]

