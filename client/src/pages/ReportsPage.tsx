import { offset, shift } from '@floating-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'

import { apiGet } from '../api/http'
import type { InspectionBodyDto, InspectionControlDto } from '../api/types'
import { notifyErrorFromUnknown } from '../utils/notify'

const reportPopperProps = {
  strategy: 'fixed' as const,
  middleware: [offset(8), shift({ padding: 12 })],
}

function toApiDateTime(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss")
}

export function ReportsPage() {
  const [bodies, setBodies] = useState<InspectionBodyDto[]>([])
  const [inspectionBodyId, setInspectionBodyId] = useState<number | ''>('')
  const [from, setFrom] = useState<Date | null>(null)
  const [to, setTo] = useState<Date | null>(null)
  const [items, setItems] = useState<InspectionControlDto[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let alive = true

    apiGet<InspectionBodyDto[]>('/api/inspection-bodies/fetch')
      .then((data) => {
        if (!alive) return
        setBodies(data)
      })
      .catch((e: unknown) => {
        if (!alive) return
        notifyErrorFromUnknown(e, 'Greška pri učitavanju')
      })

    return () => {
      alive = false
    }
  }, [])

  const canRun = useMemo(() => {
    return inspectionBodyId !== '' && from !== null && to !== null
  }, [inspectionBodyId, from, to])

  const periodError = useMemo(() => {
    if (!canRun || !from || !to) return null

    if (from.getTime() > to.getTime()) {
      return '„Od“ mora biti prije ili jednako „Do“.'
    }

    return null
  }, [canRun, from, to])

  async function run() {
    if (!canRun || periodError || !from || !to) return

    setLoading(true)

    try {
      const qs = new URLSearchParams({
        inspectionBodyId: String(inspectionBodyId),
        from: toApiDateTime(from),
        to: toApiDateTime(to),
      })

      const data = await apiGet<InspectionControlDto[]>(
        `/api/inspection-controls/report?${qs.toString()}`,
      )

      setItems(data)
    } catch (e: unknown) {
      notifyErrorFromUnknown(e, 'Greška pri učitavanju')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="d-flex flex-wrap align-items-baseline justify-content-between gap-3 mb-3">
        <h1 className="h3 m-0">Izvještaji</h1>
      </div>

      {periodError ? <div className="alert alert-warning">{periodError}</div> : null}

      <section className="card appCard">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="report-body">
              Inspekcijsko tijelo *
            </label>

            <select
              id="report-body"
              className="form-select"
              value={inspectionBodyId === '' ? '' : String(inspectionBodyId)}
              onChange={(e) =>
                setInspectionBodyId(e.target.value === '' ? '' : Number(e.target.value))
              }
            >
              <option value="" disabled>
                Odaberite…
              </option>

              {bodies.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-sm-6 col-lg-5 mb-3">
              <label className="form-label" htmlFor="report-from">
                Od (datum i vrijeme) *
              </label>

              <DatePicker
                id="report-from"
                selected={from}
                onChange={(date: Date | null) => setFrom(date)}
                calendarStartDay={1}
                showTimeSelect={false}
                showTimeInput
                timeInputLabel="Vrijeme:"
                shouldCloseOnSelect={false}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                dateFormat="dd.MM.yyyy. HH:mm"
                placeholderText="Odaberite datum i vrijeme"
                className="form-control"
                wrapperClassName="w-100"
                portalId="datepicker-portal"
                popperPlacement="bottom-start"
                popperProps={reportPopperProps}
              />
            </div>

            <div className="col-sm-6 col-lg-5 mb-3">
              <label className="form-label" htmlFor="report-to">
                Do (datum i vrijeme) *
              </label>

              <DatePicker
                id="report-to"
                selected={to}
                onChange={(date: Date | null) => setTo(date)}
                calendarStartDay={1}
                showTimeSelect={false}
                showTimeInput
                timeInputLabel="Vrijeme:"
                shouldCloseOnSelect={false}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                dateFormat="dd.MM.yyyy. HH:mm"
                placeholderText="Odaberite datum i vrijeme"
                className="form-control"
                wrapperClassName="w-100"
                portalId="datepicker-portal"
                popperPlacement="bottom-start"
                popperProps={reportPopperProps}
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            type="button"
            onClick={run}
            disabled={!canRun || !!periodError || loading}
          >
            {loading ? 'Učitavanje…' : 'Prikaži'}
          </button>
        </div>
      </section>

      <div className="my-3" />

      <section className="card appCard">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">R.br.</th>
                  <th scope="col">Datum i vrijeme kontrole</th>
                  <th scope="col">Proizvod</th>
                  <th scope="col">Siguran</th>
                  <th scope="col"></th>
                </tr>
              </thead>

              <tbody>
                {items.map((c, i) => (
                  <tr key={c.id}>
                    <td className="text-body-secondary">{i + 1}</td>

                    <td>{new Date(c.inspectionDateTime).toLocaleString()}</td>

                    <td>{c.productName}</td>

                    <td>
                      <span
                        className={`badge ${
                          c.productSafe ? 'text-bg-success' : 'text-bg-danger'
                        }`}
                      >
                        {c.productSafe ? 'DA' : 'NE'}
                      </span>
                    </td>

                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Link
                        className="btn btn-sm btn-outline-primary"
                        to={`/inspection-controls/${c.id}`}
                      >
                        Detalji kontrole
                      </Link>
                    </td>
                  </tr>
                ))}

                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-body-secondary p-3">
                      {loading ? 'Učitavanje…' : 'Nema rezultata.'}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}