import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { sitePromoApi, type SitePromoSettings } from '../../services/api'
import { formatPromoBannerOfferSummary, normalizeOfferScope, offerScopeLabel, promoCountdownActive } from '../../utils/sitePromoBill'
import { usePromoCountdown } from './usePromoCountdown'
import './PromoOffers.css'

const KEY_POPUP_HIDE_ON_BOOKING = 'js_carwash_popup_hide_on_booking'
const KEY_PROMO_CACHE = 'js_carwash_site_promo_cache_v2'
const PROMO_CACHE_TTL_MS = 5 * 60 * 1000

/** Used only when the API fails — keep promos off to avoid flashing the wrong state */
const OFFLINE_FALLBACK: SitePromoSettings = {
  id: 1,
  banner_enabled: false,
  popup_enabled: false,
  countdown_starts_at: new Date().toISOString(),
  countdown_ends_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  banner_blocks: [
    { title: 'Best wash deals', sub: 'On all service packages' },
    { title: 'Member savings', sub: 'Extra value on detailing' },
    { title: 'Weekend rush slots', sub: 'Book before they fill' },
  ],
  popup_title: 'Hand wash & detail sale',
  popup_line1: 'Premium shine packages — limited time.',
  popup_price_text: 'From $29 on select washes',
  popup_countdown_starts_at: new Date().toISOString(),
  popup_countdown_ends_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  popup_image_url: null,
  banner_branch_id: null,
  banner_cta_label: 'SHOP NOW',
  banner_cta_path: '/products',
  popup_cta_label: 'VIEW OFFER',
  popup_cta_path: '/booking',
  cta_label: 'GRAB NOW',
  cta_path: '/booking',
  offer_discount_scope: 'both',
  offer_discount_type: 'percent',
  offer_discount_value: 0,
  banner_offer_discount_scope: 'both',
  banner_offer_discount_type: 'percent',
  banner_offer_discount_value: 0,
  popup_offer_discount_scope: 'both',
  popup_offer_discount_type: 'percent',
  popup_offer_discount_value: 0,
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function IconTicket() {
  return (
    <svg className="promo-banner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 7a2 2 0 012-2h12a2 2 0 012 2v2.5a2.5 2.5 0 010 5V17a2 2 0 01-2 2H6a2 2 0 01-2-2v-2.5a2.5 2.5 0 010-5V7z" />
      <path d="M9 12h6" strokeLinecap="round" />
    </svg>
  )
}

function IconTag() {
  return (
    <svg className="promo-banner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg className="promo-banner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = [IconTicket, IconTag, IconShield]

function TimerBoxes({
  hours,
  minutes,
  seconds,
}: {
  hours: number
  minutes: number
  seconds: number
}) {
  return (
    <div className="promo-timer-wrap" aria-live="polite">
      <span className="promo-timer-label">Ends in</span>
      <div className="promo-timer">
      <span className="promo-timer-box">{pad(hours)}</span>
      <span className="promo-timer-colon">:</span>
      <span className="promo-timer-box">{pad(minutes)}</span>
      <span className="promo-timer-colon">:</span>
      <span className="promo-timer-box">{pad(seconds)}</span>
      </div>
    </div>
  )
}

function CtaLink({
  to,
  className,
  children,
  onClick,
}: {
  to: string
  className?: string
  children: ReactNode
  onClick?: () => void
}) {
  const t = (to || '/booking').trim()
  if (/^https?:\/\//i.test(t)) {
    return (
      <a href={t} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    )
  }
  const path = t.startsWith('/') ? t : `/${t}`
  return (
    <Link to={path} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

function isBookingPath(path: string): boolean {
  const base = path.split('?')[0]?.toLowerCase() ?? ''
  return base === '/booking' || base.endsWith('/booking')
}

function withBookingPrefill(path: string, offerScope?: string): string {
  const base = path.split('?')[0]?.toLowerCase() ?? ''
  if (base !== '/booking' && !base.endsWith('/booking')) return path
  const [cleanPath, existingQuery] = path.split('?')
  const params = new URLSearchParams(existingQuery || '')
  params.set('auto_promo', '1')
  const scope = (offerScope || '').toLowerCase()
  if (scope === 'carwash' || scope === 'cardetailing' || scope === 'both') {
    params.set('service', scope)
  }
  return `${cleanPath}?${params.toString()}`
}

function withBookingBranch(path: string, branchId?: number | null): string {
  if (branchId == null || Number.isNaN(Number(branchId))) return path
  const base = path.split('?')[0]?.toLowerCase() ?? ''
  if (base !== '/booking' && !base.endsWith('/booking')) return path
  const [cleanPath, existingQuery] = path.split('?')
  const params = new URLSearchParams(existingQuery || '')
  params.set('branch_id', String(branchId))
  return `${cleanPath}?${params.toString()}`
}

function withBookingPromoSource(path: string, source: 'banner' | 'popup'): string {
  const base = path.split('?')[0]?.toLowerCase() ?? ''
  if (base !== '/booking' && !base.endsWith('/booking')) return path
  const [cleanPath, existingQuery] = path.split('?')
  const params = new URLSearchParams(existingQuery || '')
  params.set('promo_source', source)
  return `${cleanPath}?${params.toString()}`
}

function promoVersion(c: SitePromoSettings): string {
  const u = c.updatedAt ?? c.updated_at
  if (u) return String(u)
  return `${c.countdown_starts_at}:${c.countdown_ends_at}:${c.popup_countdown_starts_at ?? ''}:${c.popup_countdown_ends_at ?? ''}:${c.banner_enabled}:${c.popup_enabled}:${c.banner_offer_discount_scope ?? c.offer_discount_scope ?? ''}:${c.banner_offer_discount_type ?? c.offer_discount_type ?? ''}:${c.banner_offer_discount_value ?? c.offer_discount_value ?? ''}:${c.popup_offer_discount_scope ?? ''}:${c.popup_offer_discount_type ?? ''}:${c.popup_offer_discount_value ?? ''}`
}

function asBool(v: unknown): boolean {
  if (v === true || v === 1 || v === '1') return true
  if (v === false || v === 0 || v === '0') return false
  return Boolean(v)
}

function normalizePromo(raw: SitePromoSettings): SitePromoSettings {
  return {
    ...raw,
    banner_enabled: asBool(raw.banner_enabled),
    popup_enabled: asBool(raw.popup_enabled),
    countdown_starts_at: raw.countdown_starts_at || new Date().toISOString(),
    popup_countdown_starts_at: raw.popup_countdown_starts_at || raw.countdown_starts_at || new Date().toISOString(),
    popup_countdown_ends_at: raw.popup_countdown_ends_at || raw.countdown_ends_at,
    offer_discount_scope: raw.offer_discount_scope ?? 'both',
    offer_discount_type: raw.offer_discount_type ?? 'percent',
    offer_discount_value:
      raw.offer_discount_value != null && !Number.isNaN(Number(raw.offer_discount_value))
        ? Number(raw.offer_discount_value)
        : 0,
    popup_image_url: typeof raw.popup_image_url === 'string' ? raw.popup_image_url : null,
    banner_branch_id:
      raw.banner_branch_id !== undefined && raw.banner_branch_id !== null
        ? Number(raw.banner_branch_id)
        : null,
    banner_branch_name: raw.banner_branch_name ?? null,
    banner_cta_label: raw.banner_cta_label || raw.cta_label || 'SHOP NOW',
    banner_cta_path: raw.banner_cta_path || '/products',
    popup_cta_label: raw.popup_cta_label || raw.cta_label || 'VIEW OFFER',
    popup_cta_path: raw.popup_cta_path || raw.cta_path || '/booking',
    banner_offer_discount_scope: raw.banner_offer_discount_scope ?? 'both',
    banner_offer_discount_type: raw.banner_offer_discount_type ?? 'percent',
    banner_offer_discount_value:
      raw.banner_offer_discount_value != null && !Number.isNaN(Number(raw.banner_offer_discount_value))
        ? Number(raw.banner_offer_discount_value)
        : 0,
    popup_offer_discount_scope: raw.popup_offer_discount_scope ?? 'both',
    popup_offer_discount_type: raw.popup_offer_discount_type ?? 'percent',
    popup_offer_discount_value:
      raw.popup_offer_discount_value != null && !Number.isNaN(Number(raw.popup_offer_discount_value))
        ? Number(raw.popup_offer_discount_value)
        : 0,
  }
}

function readCachedPromo(): SitePromoSettings | null {
  try {
    const raw = localStorage.getItem(KEY_PROMO_CACHE)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { ts?: number; data?: SitePromoSettings }
    if (!parsed?.data || typeof parsed.ts !== 'number') return null
    if (Date.now() - parsed.ts > PROMO_CACHE_TTL_MS) return null
    return normalizePromo(parsed.data)
  } catch {
    return null
  }
}

interface PromoOffersProps {
  children: ReactNode
}

export function PromoOffers({ children }: PromoOffersProps) {
  const location = useLocation()
  const [config, setConfig] = useState<SitePromoSettings | null>(() => readCachedPromo())
  const [promoLoaded, setPromoLoaded] = useState<boolean>(() => readCachedPromo() !== null)
  const [popupDismissedForRoute, setPopupDismissedForRoute] = useState(false)
  const [bannerDismissedForSession, setBannerDismissedForSession] = useState(false)
  const [bannerHeightPx, setBannerHeightPx] = useState(0)
  const bannerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await sitePromoApi.get()
        if (!cancelled && res.success && res.data) {
          const normalized = normalizePromo(res.data)
          setConfig(normalized)
          try {
            localStorage.setItem(
              KEY_PROMO_CACHE,
              JSON.stringify({
                ts: Date.now(),
                data: normalized,
              })
            )
          } catch {
            /* ignore storage errors */
          }
        } else if (!cancelled) {
          setConfig((prev) => prev || OFFLINE_FALLBACK)
        }
      } catch {
        if (!cancelled) setConfig((prev) => prev || OFFLINE_FALLBACK)
      } finally {
        if (!cancelled) setPromoLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const version = config ? promoVersion(config) : ''

  // Banner dismiss is non-persistent: it reappears after refresh.
  // Still reset on config version changes while app stays open.
  useEffect(() => {
    setBannerDismissedForSession(false)
  }, [version])

  useEffect(() => {
    // Popup dismiss is temporary per route; when user returns, show it again.
    setPopupDismissedForRoute(false)
  }, [location.pathname])

  useEffect(() => {
    const onBooking = location.pathname.toLowerCase().startsWith('/booking')
    if (onBooking) return
    try {
      sessionStorage.removeItem(KEY_POPUP_HIDE_ON_BOOKING)
    } catch {
      /* ignore */
    }
  }, [location.pathname])

  const startMs = useMemo(() => {
    if (!config) return null
    const t = new Date(config.countdown_starts_at).getTime()
    return Number.isNaN(t) ? null : t
  }, [config?.countdown_starts_at])

  const endMs = useMemo(() => {
    if (!config) return null
    const t = new Date(config.countdown_ends_at).getTime()
    return Number.isNaN(t) ? null : t
  }, [config?.countdown_ends_at])
  const { hours, minutes, seconds } = usePromoCountdown(startMs, endMs)

  const blocks = useMemo(() => {
    if (!config) return []
    const b = config.banner_blocks
    if (!Array.isArray(b) || b.length === 0) return []
    const normalized = b.slice(0, 3).map((x) => ({
      title: (x.title || '').trim(),
      sub: (x.sub || '').trim(),
    }))
    const nonEmpty = normalized.filter((x) => x.title.length > 0 || x.sub.length > 0)
    return nonEmpty
  }, [config])

  const bannerActiveNow =
    !!config && promoCountdownActive(config.countdown_ends_at, config.countdown_starts_at)
  const popupActiveNow =
    !!config &&
    promoCountdownActive(
      config.popup_countdown_ends_at || config.countdown_ends_at,
      config.popup_countdown_starts_at || config.countdown_starts_at
    )
  const onBookingRoute = location.pathname.toLowerCase().startsWith('/booking')
  const popupHiddenOnBooking = (() => {
    if (!onBookingRoute) return false
    try {
      return sessionStorage.getItem(KEY_POPUP_HIDE_ON_BOOKING) === '1'
    } catch {
      return false
    }
  })()
  const showBanner =
    promoLoaded && !!config && bannerActiveNow && config.banner_enabled && !bannerDismissedForSession
  const showPopup =
    promoLoaded &&
    !!config &&
    popupActiveNow &&
    config.popup_enabled &&
    !popupDismissedForRoute &&
    !popupHiddenOnBooking

  useEffect(() => {
    if (!showBanner) {
      setBannerHeightPx(0)
      return
    }
    const el = bannerRef.current
    if (!el) return
    const measure = () => {
      const h = Math.ceil(el.getBoundingClientRect().height)
      setBannerHeightPx(h > 0 ? h : 0)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [showBanner])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--promo-banner-offset',
      showBanner ? `${bannerHeightPx}px` : '0px'
    )
    return () => {
      document.documentElement.style.removeProperty('--promo-banner-offset')
    }
  }, [showBanner, bannerHeightPx])

  const dismissBanner = () => {
    setBannerDismissedForSession(true)
  }

  const dismissPopup = () => {
    setPopupDismissedForRoute(true)
  }

  const dismissPopupAndHideOnBooking = () => {
    dismissPopup()
    if (!isBookingPath(popupCtaPath)) return
    try {
      sessionStorage.setItem(KEY_POPUP_HIDE_ON_BOOKING, '1')
    } catch {
      /* ignore */
    }
  }

  const bannerCtaLabel = config?.banner_cta_label?.trim() || 'SHOP NOW'
  const bannerCtaPath = config?.banner_cta_path?.trim() || '/products'
  const popupCtaLabel = config?.popup_cta_label?.trim() || 'VIEW OFFER'
  const popupCtaPath = config?.popup_cta_path?.trim() || '/booking'
  const popupTitle = config?.popup_title?.trim() || ''
  const popupLine1 = config?.popup_line1 ?? ''
  const popupPrice = useMemo(() => {
    if (!config) return ''
    const generated = formatPromoBannerOfferSummary({
      offer_discount_scope: config.popup_offer_discount_scope,
      offer_discount_type: config.popup_offer_discount_type,
      offer_discount_value: config.popup_offer_discount_value,
    })
    return generated || ''
  }, [config])
  const popupImage = config?.popup_image_url ?? ''

  const hasBannerBlocks = blocks.length > 0

  const bannerBookingBillLine = useMemo(() => {
    if (!config || !promoCountdownActive(config.countdown_ends_at, config.countdown_starts_at)) return null
    return formatPromoBannerOfferSummary({
      offer_discount_scope: config.banner_offer_discount_scope,
      offer_discount_type: config.banner_offer_discount_type,
      offer_discount_value: config.banner_offer_discount_value,
    })
  }, [config])
  const bannerServiceDetail = useMemo(() => {
    if (!config) return ''
    return offerScopeLabel(normalizeOfferScope(config.banner_offer_discount_scope))
  }, [config])
  const bannerBranchDetail = useMemo(() => {
    if (!config) return ''
    return config.banner_branch_name ? config.banner_branch_name : 'All branches'
  }, [config])

  const bannerCtaPathWithPrefill = useMemo(() => {
    if (!config) return bannerCtaPath
    const prefilled = withBookingPrefill(bannerCtaPath, config.banner_offer_discount_scope)
    const withBranch = withBookingBranch(prefilled, config.banner_branch_id)
    return withBookingPromoSource(withBranch, 'banner')
  }, [bannerCtaPath, config])
  const popupCtaPathWithSource = useMemo(() => {
    return withBookingPromoSource(popupCtaPath, 'popup')
  }, [popupCtaPath])

  return (
    <div className="promo-offers-root">
      {showBanner && config && (
        <aside ref={bannerRef} className="promo-banner" role="region" aria-label="Limited time offers">
          <button type="button" className="promo-banner-dismiss" onClick={dismissBanner} aria-label="Dismiss offer banner">
            ×
          </button>
          <div className="promo-banner-inner">
            {blocks.map((block, index) => {
              const Icon = ICONS[index] ?? IconTicket
              return (
                <div key={index} className="promo-banner-block-with-sep">
                  {index > 0 ? <span className="promo-banner-sep" aria-hidden /> : null}
                  <div className="promo-banner-block">
                    <Icon />
                    <div className="promo-banner-text">
                      {block.title ? <span className="promo-banner-title">{block.title}</span> : null}
                      {block.sub ? <span className="promo-banner-sub">{block.sub}</span> : null}
                    </div>
                  </div>
                </div>
              )
            })}
            {hasBannerBlocks ? <span className="promo-banner-sep" aria-hidden /> : null}
            {bannerBookingBillLine ? (
              <div className="promo-banner-bill" aria-label="Product offer">
                <span className="promo-banner-bill-label">Product offer</span>
                <span className="promo-banner-bill-value">{bannerBookingBillLine}</span>
                <span className="promo-banner-bill-hint">
                  {bannerBranchDetail} · {bannerServiceDetail}
                </span>
              </div>
            ) : null}
            {bannerBookingBillLine ? <span className="promo-banner-sep promo-banner-sep--bill" aria-hidden /> : null}
            <TimerBoxes hours={hours} minutes={minutes} seconds={seconds} />
            <CtaLink to={bannerCtaPathWithPrefill} className="promo-cta">
              {bannerCtaLabel}
            </CtaLink>
          </div>
        </aside>
      )}

      {showPopup && config && (
        <div className="promo-popup-wrap" role="dialog" aria-label="Promotional offer">
          <div className="promo-popup-border">
            <div className="promo-popup">
              <div className="promo-popup-head">
                {popupTitle ? <span className="promo-popup-head-title">{popupTitle}</span> : null}
                <button type="button" className="promo-popup-close" onClick={dismissPopup} aria-label="Close promotion">
                  ×
                </button>
              </div>
              <div className="promo-popup-body">
                {popupLine1 ? <p className="promo-popup-line">{popupLine1}</p> : null}
                {popupPrice ? <p className="promo-popup-price">{popupPrice}</p> : null}
                {popupImage ? (
                  <img className="promo-popup-image" src={popupImage} alt="Promotional offer" loading="lazy" />
                ) : null}
              </div>
              <div className="promo-popup-footer">
                <CtaLink to={popupCtaPathWithSource} className="promo-cta" onClick={dismissPopupAndHideOnBooking}>
                  {popupCtaLabel}
                </CtaLink>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="promo-offers-content-shift"
        style={{ paddingTop: showBanner ? 'var(--promo-banner-offset)' : 0 }}
      >
        {children}
      </div>
    </div>
  )
}
