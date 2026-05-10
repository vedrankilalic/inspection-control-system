import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiGet } from '../api/http'
import type { InspectionControlDetailsDto } from '../api/types'
import { notifyErrorFromUnknown } from '../utils/notify'

export function InspectionControlDetailsPage() {
  const { id } = useParams()
  const [item, setItem] = useState<InspectionControlDetailsDto | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    if (!id) return
    let alive = true
    setLoadState('loading')
    setItem(null)
    apiGet<InspectionControlDetailsDto>(`/api/inspection-controls/fetch/${id}`)
      .then((data) => {
        if (!alive) return
        setItem(data)
        setLoadState('ready')
      })
      .catch((e: unknown) => {
        if (!alive) return
        notifyErrorFromUnknown(e, 'Greška pri učitavanju')
        setLoadState('error')
      })
    return () => {
      alive = false
    }
  }, [id])

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <h1 className="h3 m-0">Detalji inspekcijske kontrole</h1>
        <div className="d-flex gap-2 flex-wrap">
          <Link className="btn btn-outline-secondary" to="/inspection-controls">
            Nazad na kontrole
          </Link>
          {id ? (
            <Link className="btn btn-primary" to={`/inspection-controls?edit=${id}`}>
              Uredi
            </Link>
          ) : null}
        </div>
      </div>

      {loadState === 'loading' ? <div className="text-body-secondary">Učitavanje…</div> : null}

      {loadState === 'error' ? (
        <div className="text-body-secondary">Detalji nisu učitani. Pokušaj ponovo ili se vrati na listu kontrola.</div>
      ) : null}

      {loadState === 'ready' && item ? (
        <div className="row g-3">
          <div className="col-12">
            <section className="card appCard h-100">
              <div className="card-body">
                <h2 className="h5 card-title">Kontrolisani proizvod</h2>
                <dl className="row mb-0 small">
                  <dt className="col-sm-3 text-body-secondary">Serijski broj</dt>
                  <dd className="col-sm-9">{item.productSerialNumber ?? '—'}</dd>
                  <dt className="col-sm-3 text-body-secondary">Naziv</dt>
                  <dd className="col-sm-9">
                    <strong>{item.productName}</strong>
                  </dd>
                  <dt className="col-sm-3 text-body-secondary">Zemlja porijekla</dt>
                  <dd className="col-sm-9">{item.productCountryOrigin}</dd>
                </dl>
              </div>
            </section>
          </div>

          <div className="col-12 col-md-6">
            <section className="card appCard h-100">
              <div className="card-body">
                <h2 className="h5 card-title">Datum i vrijeme kontrole</h2>
                <p className="mb-0">
                  <strong>{new Date(item.inspectionDateTime).toLocaleString()}</strong>
                </p>
              </div>
            </section>
          </div>

          <div className="col-12 col-md-6">
            <section className="card appCard h-100">
              <div className="card-body">
                <h2 className="h5 card-title">Nadležno tijelo</h2>
                <p className="mb-2">
                  <strong>{item.inspectionBodyName}</strong>
                </p>
                <span className={`badge ${item.productSafe ? 'text-bg-success' : 'text-bg-danger'}`}>
                  {item.productSafe ? 'Proizvod siguran' : 'Proizvod nije siguran'}
                </span>
              </div>
            </section>
          </div>

          <div className="col-12">
            <section className="card appCard">
              <div className="card-body">
                <h2 className="h5 card-title">Rezultati kontrole</h2>
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {item.results}
                </p>
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  )
}
