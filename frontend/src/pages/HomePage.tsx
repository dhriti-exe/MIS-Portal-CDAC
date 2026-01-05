import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ImpactHighlightSection from '../components/ImpactHighlightSection'
import ExploreSection from '../components/ExploreSection'

export default function HomePage() {
  const { user } = useAuthStore()

  const [showLoginDropdown, setShowLoginDropdown] = useState(false)

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {}
      <style>{`
        .hero-slick,
        .hero-slick .slick-slider,
        .hero-slick .slick-list,
        .hero-slick .slick-track,
        .hero-slick .slick-slide,
        .hero-slick .slick-slide > div {
          height: 100%;
        }
        .hero-slick .slick-dots {
          bottom: 16px;
        }
      `}</style>

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

      {/* If you want to add a new section, do it here, not inside the nav conditional */}

      <section className="w-full h-screen pt-16 overflow-x-hidden">
        <div className="w-full h-[calc(100vh-4rem)] overflow-hidden hero-slick">
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={3000}
            className="h-full"
          >
            <div className="h-full">
              <img
                src="https://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/10/final/image/redhat_banner.webp"
                alt="Training 1"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="h-full">
              <img
                src="https://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/10/final/image/Pre%20login%20Banner_2.webp"
                alt="Training 2"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="h-full">
              <img
                src="https://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/10/final/image/banner_4.webp"
                alt="Training 3"
                className="w-full h-full object-cover"
              />
            </div>
          </Slider>
        </div>
      </section>

      

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">us?</span>
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
              <div className="relative bg-white p-8 rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-primary-200 h-full flex flex-col items-center hover:-translate-y-2 hover:scale-[1.03]">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-full flex items-center justify-center text-4xl shadow group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg border-4 border-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center group-hover:text-primary-700 transition-colors tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-center leading-relaxed text-base flex-1">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Highlight Section */}
      <ImpactHighlightSection />

      {/* Explore Section */}
      <ExploreSection />

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                Questions
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index

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
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-8">{faq.question}</span>
                    <svg
                      className={`w-6 h-6 text-primary-600 transform transition-all duration-500 ease-in-out flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
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
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0.0, 0.2, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
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
              What Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                Users Say
              </span>
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
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
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
          <p>&copy; 2026 Dhritishree Saha - All rights reserved.</p>
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
    answer:
      'Simply click on the "Explore Now" button, create an account by selecting your role (Applicant, Centre, or Admin), complete your profile, and browse available training programs to apply.',
  },
  {
    question: 'What documents are required for enrollment?',
    answer:
      'You will need to provide basic identification documents, educational certificates, and any specific documents required by the training center. All requirements will be clearly listed during the application process.',
  },
  {
    question: 'How can I track my application status?',
    answer:
      'Once you submit your application, you can track its status in real-time through your dashboard. You will also receive email notifications for any updates or changes to your application.',
  },
  {
    question: 'Is there support available if I face issues?',
    answer:
      'Yes! Our dedicated support team is available 24/7 to assist you with any questions or issues. You can reach us through the contact form, email, or live chat support.',
  },
  {
    question: 'Can training centers manage multiple sessions?',
    answer:
      'Absolutely! Training centers have access to a comprehensive dashboard where they can create, manage, and track multiple training sessions, monitor enrollments, and communicate with applicants efficiently.',
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
