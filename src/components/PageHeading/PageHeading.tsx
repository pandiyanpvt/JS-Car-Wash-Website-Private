import './PageHeading.css'

interface PageHeadingProps {
  title: string
}

function PageHeading({ title }: PageHeadingProps) {
  return (
    <section className="page-heading-section">
      <div className="page-heading-container">
        <div className="page-heading-content">
          <div className="page-heading-badge">
            <span className="page-heading-badge-dot"></span>
            <span className="page-heading-badge-text">{title.toUpperCase()}</span>
          </div>
          <div className="page-heading-underline">
            <div className="page-heading-underline-line"></div>
            <div className="page-heading-underline-accent"></div>
          </div>
        </div>
        <div className="page-heading-decoration">
          <div className="page-heading-circle page-heading-circle-1"></div>
          <div className="page-heading-circle page-heading-circle-2"></div>
          <div className="page-heading-circle page-heading-circle-3"></div>
        </div>
      </div>
    </section>
  )
}

export default PageHeading
