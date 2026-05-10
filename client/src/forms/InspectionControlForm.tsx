import { offset, shift } from '@floating-ui/react'
import DatePicker from 'react-datepicker'
import type { InspectionBodyDto, InspectionControlDetailsDto, ProductDto } from '../api/types'

import 'react-datepicker/dist/react-datepicker.css'

const controlDatePopperProps = {
  strategy: 'fixed' as const,
  middleware: [offset(8), shift({ padding: 12 })],
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function dtLocalFromDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

function selectedDateFromFormString(v: string): Date | null {
  const t = v.trim()
  if (!t) return null
  const ms = new Date(isoFromDtLocal(t)).getTime()
  if (Number.isNaN(ms)) return null
  return new Date(ms)
}

function isoFromDtLocal(v: string) {
  const t = v.trim()
  return t.length === 16 ? `${t}:00` : t
}

function serverToDtLocal(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return dtLocalFromDate(d)
}

export type InspectionControlFormValues = {
  inspectionDateTime: string
  inspectionBodyId: number | ''
  productId: number | ''
  results: string
  productSafe: boolean | ''
}

export function emptyControlForm(): InspectionControlFormValues {
  return {
    inspectionDateTime: '',
    inspectionBodyId: '',
    productId: '',
    results: '',
    productSafe: '',
  }
}

export function detailsToFormValues(d: InspectionControlDetailsDto): InspectionControlFormValues {
  return {
    inspectionDateTime: serverToDtLocal(d.inspectionDateTime),
    inspectionBodyId: d.inspectionBodyId,
    productId: d.productId,
    results: d.results ?? '',
    productSafe: d.productSafe,
  }
}

export function controlPayload(v: InspectionControlFormValues) {
  if (v.inspectionBodyId === '' || v.productId === '') {
    throw new Error('Odaberite inspekcijsko tijelo i proizvod')
  }
  if (v.productSafe === '') {
    throw new Error('Odaberite da li je proizvod siguran')
  }
  const inspectionDateTime = isoFromDtLocal(v.inspectionDateTime)
  if (!inspectionDateTime) {
    throw new Error('Unesite datum i vrijeme kontrole')
  }
  return {
    inspectionDateTime,
    inspectionBodyId: v.inspectionBodyId,
    productId: v.productId,
    results: v.results.trim(),
    productSafe: v.productSafe,
  }
}

export function InspectionControlForm(props: {
  bodies: InspectionBodyDto[]
  products: ProductDto[]
  value: InspectionControlFormValues
  onChange: (next: InspectionControlFormValues) => void
  onSubmit: () => void
  submitLabel: string
  busy?: boolean
  onCancel?: () => void
}) {
  const { bodies, products, value, onChange, onSubmit, submitLabel, busy, onCancel } = props

  const dtMs = value.inspectionDateTime.trim()
    ? new Date(isoFromDtLocal(value.inspectionDateTime)).getTime()
    : NaN
  const inFuture = !Number.isNaN(dtMs) && dtMs > Date.now()

  const isValid =
    value.inspectionDateTime.trim() !== '' &&
    !Number.isNaN(dtMs) &&
    !inFuture &&
    value.inspectionBodyId !== '' &&
    value.productId !== '' &&
    value.results.trim().length > 0 &&
    value.productSafe !== ''

  const safeSelectValue =
    value.productSafe === '' ? '' : value.productSafe ? 'true' : 'false'

  const now = new Date()
  const selectedDateTime = selectedDateFromFormString(value.inspectionDateTime)
  const maxTime =
    selectedDateTime &&
    selectedDateTime.getFullYear() === now.getFullYear() &&
    selectedDateTime.getMonth() === now.getMonth() &&
    selectedDateTime.getDate() === now.getDate()
      ? now
      : undefined

  return (
    <form
      className="appFormSimple"
      onSubmit={(e) => {
        e.preventDefault()
        if (!isValid || busy) return
        onSubmit()
      }}
    >
      <div className="row">
        <div className="col-sm-6 col-lg-5 mb-3 mb-sm-0">
          <label className="form-label" htmlFor="control-inspection-datetime">
            Datum i vrijeme kontrole *
          </label>
          <DatePicker
            id="control-inspection-datetime"
            selected={selectedDateTime}
            onChange={(date: Date | null) =>
              onChange({ ...value, inspectionDateTime: date ? dtLocalFromDate(date) : '' })
            }
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
            maxDate={now}
            maxTime={maxTime}
            className="form-control"
            wrapperClassName="w-100"
            portalId="datepicker-portal"
            popperPlacement="bottom-start"
            popperProps={controlDatePopperProps}
          />
          {inFuture ? <div className="form-text text-danger">Ne smije biti u budućnosti.</div> : null}
        </div>
      </div>

      <div className="row g-2">
        <div className="col-12 col-md-6">
          <label className="form-label">Tijelo *</label>
          <select
            className="form-select"
            value={value.inspectionBodyId === '' ? '' : String(value.inspectionBodyId)}
            onChange={(e) => {
              const v = e.target.value
              onChange({ ...value, inspectionBodyId: v === '' ? '' : Number(v) })
            }}
            required
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
        <div className="col-12 col-md-6">
          <label className="form-label">Proizvod *</label>
          <select
            className="form-select"
            value={value.productId === '' ? '' : String(value.productId)}
            onChange={(e) => {
              const v = e.target.value
              onChange({ ...value, productId: v === '' ? '' : Number(v) })
            }}
            required
          >
            <option value="" disabled>
              Odaberite…
            </option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Siguran *</label>
          <select
            className="form-select"
            value={safeSelectValue}
            onChange={(e) => {
              const v = e.target.value
              onChange({
                ...value,
                productSafe: v === '' ? '' : v === 'true',
              })
            }}
            required
          >
            <option value="" disabled>
              Odaberite…
            </option>
            <option value="true">Da</option>
            <option value="false">Ne</option>
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">Rezultati *</label>
          <textarea
            className="form-control"
            rows={4}
            value={value.results}
            onChange={(e) => onChange({ ...value, results: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        {onCancel ? (
          <button className="btn btn-outline-secondary" type="button" onClick={onCancel} disabled={!!busy}>
            Odustani
          </button>
        ) : null}
        <button className="btn btn-primary" type="submit" disabled={!isValid || !!busy}>
          {busy ? 'Sačuvaj…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
