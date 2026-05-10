import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiGet, apiSend } from '../api/http'
import type { InspectionBodyDto, InspectionControlDetailsDto, InspectionControlDto, ProductDto } from '../api/types'
import { notifyErrorFromUnknown, notifyErrorFromUnknownAfterModalClose } from '../utils/notify'
import { Modal } from '../components/Modal'
import {
  InspectionControlForm,
  controlPayload,
  detailsToFormValues,
  emptyControlForm,
  type InspectionControlFormValues,
} from '../forms/InspectionControlForm'

export function InspectionControlsPage() {
  const [items, setItems] = useState<InspectionControlDto[]>([])
  const [bodies, setBodies] = useState<InspectionBodyDto[]>([])
  const [products, setProducts] = useState<ProductDto[]>([])
  const [query, setQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<InspectionControlFormValues>(emptyControlForm())
  const [modalError, setModalError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; label: string } | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  async function refreshLists() {
    try {
      const [ctrl, body, prod] = await Promise.all([
        apiGet<InspectionControlDto[]>('/api/inspection-controls/fetch'),
        apiGet<InspectionBodyDto[]>('/api/inspection-bodies/fetch'),
        apiGet<ProductDto[]>('/api/products/fetch'),
      ])
      setItems(ctrl)
      setBodies(body)
      setProducts(prod)
    } catch (e: unknown) {
      notifyErrorFromUnknown(e, 'Greška pri učitavanju')
    }
  }

  useEffect(() => {
    void refreshLists()
  }, [])

  useEffect(() => {
    const newFlag = searchParams.get('new')
    const editId = searchParams.get('edit')

    if (newFlag === '1') {
      openCreate()
      return
    }
    if (editId) {
      const idNum = Number(editId)
      if (Number.isFinite(idNum)) void openEdit(idNum)
    }
  }, [searchParams])

  function closeModal() {
    setModalOpen(false)
    setModalError(null)
    setBusy(false)
    const next = new URLSearchParams(searchParams)
    next.delete('new')
    next.delete('edit')
    setSearchParams(next, { replace: true })
  }

  function openCreate() {
    setMode('create')
    setEditingId(null)
    setForm(emptyControlForm())
    setModalError(null)
    setModalOpen(true)
  }

  async function openEdit(id: number) {
    setMode('edit')
    setEditingId(id)
    setModalError(null)
    setModalOpen(true)
    try {
      const d = await apiGet<InspectionControlDetailsDto>(`/api/inspection-controls/fetch/${id}`)
      setForm(detailsToFormValues(d))
    } catch (e: unknown) {
      setModalError(e instanceof Error ? e.message : 'Greška pri učitavanju')
    }
  }

  async function submit() {
    setModalError(null)
    setBusy(true)
    try {
      const payload = controlPayload(form)
      if (mode === 'create') {
        await apiSend<InspectionControlDto>('/api/inspection-controls/create', 'POST', payload)
      } else {
        if (!editingId) throw new Error('Nedostaje ID za izmjenu')
        await apiSend<InspectionControlDto>(
          `/api/inspection-controls/update/${editingId}`,
          'PUT',
          payload,
        )
      }
      await refreshLists()
      closeModal()
    } catch (e: unknown) {
      setModalError(e instanceof Error ? e.message : 'Greška pri spremanju')
    } finally {
      setBusy(false)
    }
  }

  function askDelete(id: number, label: string) {
    setDeleteTarget({ id, label })
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleteBusy(true)
    try {
      await apiSend<void>(`/api/inspection-controls/delete/${deleteTarget.id}`, 'DELETE')
      await refreshLists()
      setDeleteTarget(null)
    } catch (e: unknown) {
      setDeleteTarget(null)
      notifyErrorFromUnknownAfterModalClose(e, 'Greška pri brisanju')
    } finally {
      setDeleteBusy(false)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((c) => {
      return (
        c.inspectionBodyName.toLowerCase().includes(q) ||
        c.productName.toLowerCase().includes(q) ||
        c.inspectionDateTime.toLowerCase().includes(q)
      )
    })
  }, [items, query])

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <h1 className="h3 m-0">Inspekcijske kontrole</h1>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-success" type="button" onClick={openCreate}>
            Dodaj kontrolu
          </button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-8">
          <label className="form-label">Pretraga</label>
          <input
            className="form-control"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tijelo, proizvod, datum..."
          />
        </div>
        <div className="col-12 col-lg-4">
          <label className="form-label">Ukupno</label>
          <input className="form-control" value={`${filtered.length}`} readOnly />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Datum/vrijeme</th>
              <th>Tijelo</th>
              <th>Proizvod</th>
              <th>Siguran</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{new Date(c.inspectionDateTime).toLocaleString()}</td>
                <td>{c.inspectionBodyName}</td>
                <td>{c.productName}</td>
                <td>
                  <span className={`badge ${c.productSafe ? 'text-bg-success' : 'text-bg-danger'}`}>
                    {c.productSafe ? 'DA' : 'NE'}
                  </span>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Link className="btn btn-sm btn-primary me-2" to={`/inspection-controls/${c.id}`}>
                    Detalji
                  </Link>
                  <Link className="btn btn-sm btn-warning text-white me-2" to={`/inspection-controls?edit=${c.id}`}>
                    Uredi
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    type="button"
                    onClick={() => askDelete(c.id, `${c.inspectionBodyName} / ${c.productName}`)}
                  >
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-body-secondary">
                  Nema podataka.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={mode === 'create' ? 'Dodaj inspekcijsku kontrolu' : 'Uredi inspekcijsku kontrolu'}
        onClose={closeModal}
        size="xl"
      >
        {modalError ? <div className="alert alert-danger">{modalError}</div> : null}
        <InspectionControlForm
          bodies={bodies}
          products={products}
          value={form}
          onChange={setForm}
          onSubmit={submit}
          submitLabel={mode === 'create' ? 'Sačuvaj' : 'Sačuvaj izmjene'}
          busy={busy}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        open={deleteTarget !== null}
        title="Potvrda brisanja"
        onClose={() => (deleteBusy ? null : setDeleteTarget(null))}
        size="md"
        footer={
          <>
            <button
              className="btn btn-outline-secondary"
              type="button"
              disabled={deleteBusy}
              onClick={() => setDeleteTarget(null)}
            >
              Odustani
            </button>
            <button className="btn btn-danger" type="button" disabled={deleteBusy} onClick={() => void confirmDelete()}>
              {deleteBusy ? 'Brisanje…' : 'Obriši'}
            </button>
          </>
        }
      >
        <p className="mb-2">Da li si siguran da želiš obrisati ovu inspekcijsku kontrolu?</p>
        <div className="fw-semibold">{deleteTarget?.label}</div>
      </Modal>
    </div>
  )
}
