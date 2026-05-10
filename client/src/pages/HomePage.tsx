import { useEffect, useState } from 'react'
import { apiGet } from '../api/http'
import type { InspectionBodyDto, InspectionControlDto, ProductDto } from '../api/types'

export function HomePage() {
  const [counts, setCounts] = useState<{ products: number; bodies: number; controls: number } | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [products, bodies, controls] = await Promise.all([
          apiGet<ProductDto[]>('/api/products/fetch'),
          apiGet<InspectionBodyDto[]>('/api/inspection-bodies/fetch'),
          apiGet<InspectionControlDto[]>('/api/inspection-controls/fetch'),
        ])
        if (!alive) return
        setCounts({
          products: products.length,
          bodies: bodies.length,
          controls: controls.length,
        })
      } catch (e: unknown) {
        if (!alive) return
        setLoadError(e instanceof Error ? e.message : 'Nije moguće učitati pregled.')
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div>
      <div className="homeHero rounded-4 p-4 p-lg-5 mb-4 position-relative overflow-hidden">
        <div className="position-relative" style={{ zIndex: 1 }}>
          <p className="text-uppercase small fw-semibold text-white-50 mb-2 letter-spacing">Kontrola kvaliteta</p>
          <h1 className="display-6 fw-semibold text-white mb-3">Dobro došli</h1>
          <p className="text-white-50 mb-4 col-lg-8 mb-lg-0">
            Centralna evidencija proizvoda, inspekcijskih tijela i izvršenih kontrola na tržištu BiH.
          </p>
        </div>
        <div className="homeHeroGlow" aria-hidden />
      </div>

      {loadError ? (
        <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
          <span>{loadError}</span>
          <span className="text-body-secondary small">Provjerite da je API pokrenut.</span>
        </div>
      ) : null}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="homeStat rounded-4 p-4 h-100">
            <div className="text-body-secondary small fw-semibold text-uppercase">Proizvodi</div>
            <div className="display-5 fw-semibold mt-1 tabular-nums">
              {counts === null ? '—' : counts.products}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="homeStat rounded-4 p-4 h-100">
            <div className="text-body-secondary small fw-semibold text-uppercase">Inspekcijska tijela</div>
            <div className="display-5 fw-semibold mt-1 tabular-nums">
              {counts === null ? '—' : counts.bodies}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="homeStat rounded-4 p-4 h-100">
            <div className="text-body-secondary small fw-semibold text-uppercase">Kontrole</div>
            <div className="display-5 fw-semibold mt-1 tabular-nums">
              {counts === null ? '—' : counts.controls}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-4 border bg-body-tertiary bg-opacity-50 p-4 p-lg-5">
        <h2 className="h5 mb-3">Radni tok</h2>
        <ol className="mb-0 ps-3 text-body-secondary col-lg-10">
          <li className="mb-3">
            <strong className="text-body">Tijela</strong> — unesite inspekcijska tijela (naziv, inspektorat, nadležnost,
            kontakt).
          </li>
          <li className="mb-3">
            <strong className="text-body">Proizvodi</strong> — evidentirajte proizvode koji se kontrolišu.
          </li>
          <li className="mb-3">
            <strong className="text-body">Kontrole</strong> — povežite proizvod, tijelo, datum i rezultat.
          </li>
          <li className="mb-0">
            <strong className="text-body">Izvještaji</strong> — pregled po tijelu i periodu te detalji kontrole.
          </li>
        </ol>
      </div>
    </div>
  )
}
