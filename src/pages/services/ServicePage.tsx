import { motion } from 'framer-motion'
import { FooterPage } from '../footer'
import Navbar from '../../components/navbar/Navbar'
import './ServicePage.css'

function ServicePage() {
  const services = [
    'Hand Polish',
    'Clay Bar',
    'Headlight Restoration',
    'Car Wash',
    'Headlight Polish',
    'Buff Polish',
    'Leather Clean',
    'Carpet Steam Clean',
    'Sticker Removal',
    'Vacuum Process (Pet hair & Sand)',
    'Seats & Mats Steam',
    'Full Duco Hand Wax Polish',
    'Clean and Wipe Door Trims',
    'Clean and Wipe Dashboard and Console',
    'Interior Windows and Mirrors Clean',
    'Wipe Door and Boot Jambs',
    'Vacuum Seats and Boot',
    'Vacuum Interior Floor Mats and Footwells',
    'Bugs & Tar Removal',
    'Mag wheel wash process',
    'Exterior windows and side mirrors clean',
    'High – Pressure – rinse',
    'Exterior Wash with pH neutral shampoo and Tyre Shine'
  ]

  const serviceImageMap: { [key: string]: string } = {
    'Hand Polish': 'Hand Polish.jpg',
    'Clay Bar': 'Clay Bar.jpg',
    'Headlight Restoration': 'Headlight Restoration.jpg',
    'Car Wash': 'Car Wash.png',
    'Headlight Polish': 'Headlight Polish.jpg',
    'Buff Polish': 'Buff Polish.jpg',
    'Leather Clean': 'Leather Clean.png',
    'Carpet Steam Clean': 'Carpet Steam Clean.jpg',
    'Sticker Removal': 'Sticker Removal.jpg',
    'Vacuum Process (Pet hair & Sand)': 'Vacuum Process (Pet hair & Sand).png',
    'Seats & Mats Steam': 'Seats & Mats Steam.jpg',
    'Full Duco Hand Wax Polish': 'Full Duco Hand Wax Polish.jpg',
    'Clean and Wipe Door Trims': 'Clean and Wipe Door Trims.jpg',
    'Clean and Wipe Dashboard and Console': 'Clean and Wipe Dashboard and Console.png',
    'Interior Windows and Mirrors Clean': 'Interior Windows and Mirrors Clean.jpg',
    'Wipe Door and Boot Jambs': 'Wipe Door and Boot Jambs.png',
    'Vacuum Seats and Boot': 'Vacuum Seats and Boot.png',
    'Vacuum Interior Floor Mats and Footwells': 'Vacuum Interior Floor Mats and Footwells.png',
    'Bugs & Tar Removal': 'Bugs & Tar Removal.png',
    'Mag wheel wash process': 'Mag wheel wash process.png',
    'Exterior windows and side mirrors clean': 'Exterior windows and side mirrors clean.jpg',
    'High – Pressure – rinse': 'High – Pressure – rinse.png',
    'Exterior Wash with pH neutral shampoo and Tyre Shine': 'Exterior Wash with pH neutral shampoo.png'
  }

  const featuredServices = services.map(service => {
    const imageFile = serviceImageMap[service] || `${service.toLowerCase().replace(/\s+/g, '-').replace(/[&()]/g, '').replace(/,/g, '')}.jpg`
    return {
      name: service,
      image: `/JS Car Wash Images/${imageFile}`
    }
  })

  return (
    <div className="service-page" id="services">
      <Navbar className="fixed-navbar" />
      {/* Full-Service Detailing Section */}
      <section className="detailing-section">
        <div className="container">
          <div className="detailing-content">
            {/* Left Side - Image */}
            <motion.div
              className="detailing-image-wrapper"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="detailing-image-container">
                <img
                  src="/JS Car Wash Images/banner-2-1.png"
                  alt="Car Detailing"
                  className="detailing-image"
                />
                <div className="chevron-arrows">
                  <div className="chevron-arrow"></div>
                  <div className="chevron-arrow"></div>
                  <div className="chevron-arrow"></div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Text Content */}
            <motion.div
              className="detailing-text-wrapper"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="detailing-icon-wrapper">
                <img
                  src="/JS Car Wash Images/Icon-title-lager.svg"
                  alt="Icon"
                  className="detailing-icon"
                />
              </div>
              <h2 className="detailing-title">Full-Service Detailing for Cars</h2>
              <p className="detailing-description">
                Our flat-belt, drive-on conveyors are gentle on all finishes and safe for exotics, dual tires & lowered vehicles. Our dedicated crew ensures your car is clean, dry, and shiny. Choose full service or DIY with free vacuums, compressed air, and towels. Make your vehicle admired by everyone on the road.
              </p>
              <p className="detailing-secondary">
                Need a Car Detailing? We also offer JS Mini detailing at Dubbo.
              </p>
              <div className="detailing-button-group">
                <button className="detailing-button-primary">CONTACT US</button>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="wireframe-car"></div>
      </section>

      {/* Premium Products Section */}
      <section className="products-section">
        <div className="container">
          <h2 className="products-title">We Only Use Premium Products to Protect Your Vehicle</h2>
          <div className="products-content">
            <div className="products-image-wrapper">
              <img
                src="/JS Car Wash Images/corvette-v100-1024x545-1.jpg"
                alt="Corvette"
                className="products-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Best Services Section */}
      <section className="best-services-section">
        <div className="container">
          <h2 className="best-services-title">Our Best Services</h2>
          <div className="services-grid">
            {featuredServices.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -10, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
              >
                <div className="service-card-image">
                  <img src={service.image} alt={service.name} />
                </div>
                <div className="service-card-content">
                  <h3 className="service-card-title">{service.name}</h3>
                  <div className="service-card-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FooterPage />
    </div>
  )
}

export default ServicePage

