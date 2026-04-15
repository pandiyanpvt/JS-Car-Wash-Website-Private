export type OfferDiscountScope = 'carwash' | 'cardetailing' | 'both'
export type OfferDiscountType = 'percent' | 'fixed'

export function normalizeOfferScope(raw: unknown): OfferDiscountScope {
  const s = typeof raw === 'string' ? raw.toLowerCase().trim() : ''
  if (s === 'carwash' || s === 'cardetailing' || s === 'both') return s
  return 'both'
}

export function normalizeOfferDiscountType(raw: unknown): OfferDiscountType {
  const t = typeof raw === 'string' ? raw.toLowerCase().trim() : ''
  if (t === 'fixed') return 'fixed'
  return 'percent'
}

export function promoCountdownActive(
  endsAt: string | null | undefined,
  startsAt?: string | null | undefined
): boolean {
  if (!endsAt) return false
  const end = new Date(endsAt).getTime()
  if (Number.isNaN(end)) return false
  const now = Date.now()
  if (startsAt) {
    const start = new Date(startsAt).getTime()
    if (!Number.isNaN(start) && now < start) return false
  }
  return now <= end
}

export function eligiblePackageSubtotalForOffer(
  packages: { serviceType: 'carwash' | 'cardetailing'; price: number }[],
  scope: OfferDiscountScope
): number {
  return packages.reduce((sum, p) => {
    const ok =
      scope === 'both' ||
      (scope === 'carwash' && p.serviceType === 'carwash') ||
      (scope === 'cardetailing' && p.serviceType === 'cardetailing')
    return sum + (ok ? p.price : 0)
  }, 0)
}

export function computeOfferDiscountAmount(
  eligibleSubtotal: number,
  discountType: OfferDiscountType,
  discountValue: number
): number {
  const sub = Number(eligibleSubtotal) || 0
  if (sub <= 0) return 0
  const v = Number(discountValue)
  if (!v || v <= 0) return 0
  if (discountType === 'fixed') {
    return Math.round(Math.min(sub, v) * 100) / 100
  }
  const pct = Math.min(100, Math.max(0, v))
  return Math.round((sub * pct) / 100 * 100) / 100
}

export function offerScopeLabel(scope: OfferDiscountScope): string {
  if (scope === 'carwash') return 'Car wash packages'
  if (scope === 'cardetailing') return 'Detailing packages'
  return 'Car wash & detailing packages'
}

/** Short line for the top promo banner when a booking discount is configured. */
export function formatPromoBannerOfferSummary(p: {
  offer_discount_value?: unknown
  offer_discount_type?: unknown
  offer_discount_scope?: unknown
}): string | null {
  const raw = p.offer_discount_value
  const v = typeof raw === 'string' ? parseFloat(raw) : Number(raw ?? 0)
  if (!Number.isFinite(v) || v <= 0) return null
  const dtype = normalizeOfferDiscountType(p.offer_discount_type)
  const scope = normalizeOfferScope(p.offer_discount_scope)
  const scopeShort =
    scope === 'both' ? 'wash & detail packages' : scope === 'carwash' ? 'wash packages' : 'detailing packages'
  if (dtype === 'fixed') {
    const shown = v % 1 === 0 ? String(Math.round(v)) : v.toFixed(2)
    return `$${shown} off ${scopeShort}`
  }
  return `${v}% off ${scopeShort}`
}
