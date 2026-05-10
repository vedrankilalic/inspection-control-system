import type { InspectionBodyDto, Inspectorate, Jurisdiction } from '../api/types'

export type InspectionBodyFormValues = {
  name: string
  inspectorate: Inspectorate | ''
  jurisdiction: Jurisdiction | ''
  contactPerson: string
}

export function inspectorateLabel(v: Inspectorate): string {
  switch (v) {
    case 'FBiH':
      return 'FBiH'
    case 'RS':
      return 'RS'
    case 'Brcko':
      return 'Distrikt Brčko'
    default:
      return v
  }
}

export function jurisdictionLabel(v: Jurisdiction): string {
  switch (v) {
    case 'Market':
      return 'Tržišna inspekcija'
    case 'HealthSanitary':
      return 'Zdravstveno–sanitarna inspekcija'
    default:
      return v
  }
}

export function bodyToFormValues(b: InspectionBodyDto): InspectionBodyFormValues {
  return {
    name: b.name ?? '',
    inspectorate: b.inspectorate,
    jurisdiction: b.jurisdiction,
    contactPerson: b.contactPerson ?? '',
  }
}

export function bodyPayload(v: InspectionBodyFormValues) {
  if (v.inspectorate === '' || v.jurisdiction === '') {
    throw new Error('Odaberite inspektorat i nadležnost')
  }
  return {
    name: v.name.trim(),
    inspectorate: v.inspectorate,
    jurisdiction: v.jurisdiction,
    contactPerson: v.contactPerson.trim(),
  }
}

const INSPECTORATES: Inspectorate[] = ['FBiH', 'RS', 'Brcko']
const JURISDICTIONS: Jurisdiction[] = ['Market', 'HealthSanitary']

export function emptyBodyForm(): InspectionBodyFormValues {
  return {
    name: '',
    inspectorate: '',
    jurisdiction: '',
    contactPerson: '',
  }
}

export function InspectionBodyForm(props: {
  value: InspectionBodyFormValues
  onChange: (next: InspectionBodyFormValues) => void
  onSubmit: () => void
  submitLabel: string
  busy?: boolean
  onCancel?: () => void
}) {
  const { value, onChange, onSubmit, submitLabel, busy, onCancel } = props

  const isValid =
    value.name.trim().length > 0 &&
    value.contactPerson.trim().length > 0 &&
    value.inspectorate !== '' &&
    value.jurisdiction !== '' &&
    INSPECTORATES.includes(value.inspectorate) &&
    JURISDICTIONS.includes(value.jurisdiction)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!isValid || busy) return
        onSubmit()
      }}
    >
      <div className="row g-2">
        <div className="col-12">
          <label className="form-label">Naziv *</label>
          <input
            className="form-control"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            required
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Inspektorat *</label>
          <select
            className="form-select"
            value={value.inspectorate}
            onChange={(e) =>
              onChange({ ...value, inspectorate: e.target.value as Inspectorate | '' })
            }
            required
          >
            <option value="" disabled>
              Odaberite…
            </option>
            {INSPECTORATES.map((opt) => (
              <option key={opt} value={opt}>
                {inspectorateLabel(opt)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Nadležnost *</label>
          <select
            className="form-select"
            value={value.jurisdiction}
            onChange={(e) =>
              onChange({ ...value, jurisdiction: e.target.value as Jurisdiction | '' })
            }
            required
          >
            <option value="" disabled>
              Odaberite…
            </option>
            {JURISDICTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {jurisdictionLabel(opt)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">Kontakt *</label>
          <input
            className="form-control"
            value={value.contactPerson}
            onChange={(e) => onChange({ ...value, contactPerson: e.target.value })}
            placeholder="ime, telefon ili e-mail"
            required
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
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
