import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import './FAQPage.css'

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)

  const faqItems = [
    {
      question: 'How should I prepare my car to ensure the best possible wash outcome?',
      answer: 'We advise removing as much "clutter" as possible from the boot, seats, side pockets & console area, and any valuables. Any rubbish left on the floor of the vehicle will be disposed of. Please take some time when you drop your car off to indicate any damaged areas of the vehicle and any areas you wish to pay particular attention to ensure you are satisfied.'
    },
    {
      question: 'What should I do if I\'m not satisfied with the service I received?',
      answer: 'Please ensure you check your car before you leave. If any area of the vehicle has been missed, please highlight this to the onsite manager and it will be rectified on the spot. Alternatively, please contact our Customer Service team on 02 5804 5720 or info@jscarwash.com.au',
      hasHighlight: true
    },
    {
      question: 'Why have I been asked to pay more because my car is dirty?',
      answer: 'Hand Car Washing is a labour-based process which relies on time & labour to clean the cars. Pricing is therefore based on these components to clean a car. Cars with excessive soilage (whether interior or exterior) require additional time to clean and as such may be subject to a soilage surcharge. The onsite manager should always discuss and agree any additional charges before the wash commences, as such it is your decision whether to accept the surcharge and for the wash to proceed.'
    },
    {
      question: 'Why does it cost more to wash larger vehicles?',
      answer: 'JS Car Wash is a labour-based business, as such pricing is dependent on the time it takes to clean vehicles. Larger vehicles take longer to clean which is why the cost is high.'
    },
    {
      question: 'What is considered an X-Large vehicle?',
      answer: 'Examples of X-Large vehicles include (but are not limited to): Hyundai Palisade, Toyota Land Cruiser, Mitsubishi Pajero, KIA Sorento, BMW X7, Mercedes Van, Mercedes GLS, Land Rover Discovery, Mazda CX-9, Skoda Kodiaq, Volvo XC90, Ford Raptor, RAM 1500, GMC Yukon etc.'
    },
    {
      question: 'How do I contact you?',
      answer: 'You can find the contact details for each of our sites on their location page on our website. If you do not have a successful resolution, contact our Customer Service team through either:',
      hasBulletPoints: true,
      bulletPoints: [
        { label: 'Phone', value: '02 5804 5720' },
        { label: 'Email', value: 'info@jscarwash.com.au' }
      ]
    },
    {
      question: 'How long will it take?',
      answer: 'An Express wash usually takes 25 – 45 minutes. A js Car wash usually takes 45 – 60 minutes. A Platinum wash usually takes around 60 – 90 minutes. JS Polish usually takes 75 – 110 minutes. However, these times will vary depending on your vehicle\'s specific requirements.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking. However, it is recommended to do so within a reasonable time frame to avoid any cancellation fees.'
    },
    {
      question: 'When is the latest time I can bring my car in?',
      answer: 'We recommend bringing your car in no later than half an hour before closing time.'
    },
    {
      question: 'How often should I get my car washed?',
      answer: 'We recommend every two to three weeks if you drive regularly. However, how often you need your car washed will depend on many factors such as how often you drive, where you drive, and where you park.'
    },
    {
      question: 'Can you provide an invoice?',
      answer: 'We\'ll send you an email with your receipt after we\'ve processed your payment. We\'ll also email you after you\'ve made a booking to double-check you\'re being billed for the correct service.'
    },
    {
      question: 'What is the difference between a wax and polish?',
      answer: 'Car waxing and polishing serve distinct purposes in car care. Polishing is a process that uses abrasive compounds to remove imperfections like swirl marks and scratches, restoring the paint\'s clarity and smoothness. Waxing involves applying a protective layer over the paint to shield it from environmental elements and add a glossy shine. While polishing corrects imperfections, waxing primarily protects and enhances the paint\'s appearance. These two processes are often combined, with polishing preceding waxing in a typical car care routine to achieve corrective and protective benefits.'
    },
    {
      question: 'Why choose JS Car Wash over traditional automated car washes?',
      answer: 'We distinguish ourselves with our professional hand washing techniques, attention to detail and personalised care, ensuring your vehicle receives the best treatment possible. Automated car washes are unable to clean the entire vehicle and their brushes increase the risk of scratching paintwork.'
    },
  ]

  const toggleFAQ = (index: number) => {
    if (clickedIndex === index) {
      setClickedIndex(null)
      setOpenIndex(null)
    } else {
      setClickedIndex(index)
      setOpenIndex(index)
    }
  }

  return (
    <div className="faq-page" id="faq">
      <Navbar className="fixed-navbar" />
      {/* Page Heading Section */}
      <section className="page-heading-section">
        <div className="page-heading-overlay"></div>
        <div className="page-heading-content">
          <h1 className="page-heading-title">FaQ</h1>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-header">
            <p className="faq-subtitle">JS CAR WASH</p>
            <h2 className="faq-title">
              Fa<span className="faq-title-red">Q</span>
            </h2>
            <div className="faq-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="faq-list">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                className={`faq-item ${(openIndex === index || clickedIndex === index) ? 'faq-item-open' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => {
                  // Show on hover if not clicked
                  if (clickedIndex !== index) {
                    setOpenIndex(index)
                  }
                }}
                onMouseLeave={() => {
                  // Hide on leave if not clicked
                  if (clickedIndex !== index) {
                    setOpenIndex(null)
                  }
                }}
              >
                <div className="faq-question" onClick={() => toggleFAQ(index)}>
                  <span className="faq-icon">{(openIndex === index || clickedIndex === index) ? '−' : '+'}</span>
                  <span className="faq-question-text">{item.question}</span>
                </div>
                <AnimatePresence>
                  {(openIndex === index || clickedIndex === index) && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>
                        {item.hasHighlight ? (
                          <>
                            {item.answer.split(/(02 5804 5720|info@jscarwash\.com\.au)/).map((part, idx) => 
                              part === '02 5804 5720' || part === 'info@jscarwash.com.au' ? (
                                <span key={idx} className="faq-highlight">{part}</span>
                              ) : (
                                <span key={idx}>{part}</span>
                              )
                            )}
                          </>
                        ) : item.hasBulletPoints ? (
                          <>
                            {item.answer}
                            <ul className="faq-bullet-list">
                              {item.bulletPoints?.map((point, idx) => (
                                <li key={idx}>
                                  <span className="faq-bullet-label">{point.label}</span>
                                  {' – '}
                                  <span className="faq-highlight">{point.value}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          item.answer
                        )}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  )
}

export default FAQPage
