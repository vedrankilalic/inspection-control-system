import type { ProductDto } from '../api/types'

export type ProductFormValues = {
  name: string
  manufacturer: string
  serialNumber: string
  countryOrigin: string
  description: string
}

export function productToFormValues(p: ProductDto): ProductFormValues {
  return {
    name: p.name ?? '',
    manufacturer: p.manufacturer ?? '',
    serialNumber: p.serialNumber ?? '',
    countryOrigin: p.countryOrigin ?? '',
    description: p.description ?? '',
  }
}

export function productPayload(v: ProductFormValues) {
  return {
    name: v.name.trim(),
    manufacturer: v.manufacturer.trim(),
    serialNumber: v.serialNumber.trim() ? v.serialNumber.trim() : null,
    countryOrigin: v.countryOrigin.trim(),
    description: v.description.trim() ? v.description.trim() : null,
  }
}

export function ProductForm(props: {
  value: ProductFormValues
  onChange: (next: ProductFormValues) => void
  onSubmit: () => void
  submitLabel: string
  busy?: boolean
  onCancel?: () => void
}) {
  const { value, onChange, onSubmit, submitLabel, busy, onCancel } = props

  const isValid =
    value.name.trim().length > 0 && value.manufacturer.trim().length > 0 && value.countryOrigin.trim().length > 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!isValid || busy) return
        onSubmit()
      }}
    >
      <div className="row g-2">
        <div className="col-12 col-lg-6">
          <label className="form-label">Naziv *</label>
          <input
            className="form-control"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            required
          />
        </div>
        <div className="col-12 col-lg-6">
          <label className="form-label">Proizvođač *</label>
          <input
            className="form-control"
            value={value.manufacturer}
            onChange={(e) => onChange({ ...value, manufacturer: e.target.value })}
            required
          />
        </div>

        <div className="col-12 col-lg-6">
          <label className="form-label">Serijski broj</label>
          <input
            className="form-control"
            value={value.serialNumber}
            onChange={(e) => onChange({ ...value, serialNumber: e.target.value })}
            placeholder="nije obavezno"
          />
        </div>
        <div className="col-12 col-lg-6">
          <label className="form-label">Zemlja *</label>
          <input
            className="form-control"
            value={value.countryOrigin}
            onChange={(e) => onChange({ ...value, countryOrigin: e.target.value })}
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label">Opis</label>
          <textarea
            className="form-control"
            rows={3}
            value={value.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="nije obavezno"
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
        {onCancel ? (
          <button className="btn btn-outline-secondary" type="button" onClick={onCancel} disabled={!!busy}>
            Odustani
          </button>
        ) : null}
        <button className="btn btn-success" type="submit" disabled={!isValid || !!busy}>
          {busy ? 'Sačuvaj…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

