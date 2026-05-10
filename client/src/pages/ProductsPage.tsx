import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiGet, apiSend } from '../api/http'
import type { ProductDto } from '../api/types'
import { notifyErrorFromUnknown, notifyErrorFromUnknownAfterModalClose } from '../utils/notify'
import { Modal } from '../components/Modal'
import { ProductForm, type ProductFormValues, productPayload, productToFormValues } from '../forms/ProductForm'

export function ProductsPage() {
  const [items, setItems] = useState<ProductDto[]>([])
  const [query, setQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<ProductFormValues>({
    name: '',
    manufacturer: '',
    serialNumber: '',
    countryOrigin: '',
    description: '',
  })
  const [modalError, setModalError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  async function refresh() {
    let alive = true
    try {
      const data = await apiGet<ProductDto[]>('/api/products/fetch')
      if (!alive) return
      setItems(data)
    } catch (e: unknown) {
      if (!alive) return
      notifyErrorFromUnknown(e, 'Greška pri učitavanju')
    }
    return () => {
      alive = false
    }
  }

  useEffect(() => {
    void refresh()
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
    setForm({ name: '', manufacturer: '', serialNumber: '', countryOrigin: '', description: '' })
    setModalError(null)
    setModalOpen(true)
  }

  async function openEdit(id: number) {
    setMode('edit')
    setEditingId(id)
    setModalError(null)
    setModalOpen(true)
    try {
      const p = await apiGet<ProductDto>(`/api/products/fetch/${id}`)
      setForm(productToFormValues(p))
    } catch (e: unknown) {
      setModalError(e instanceof Error ? e.message : 'Greška pri učitavanju')
    }
  }

  async function submit() {
    setModalError(null)
    setBusy(true)
    try {
      if (mode === 'create') {
        await apiSend<ProductDto>('/api/products/create', 'POST', productPayload(form))
      } else {
        if (!editingId) throw new Error('Nedostaje ID za izmjenu')
        await apiSend<ProductDto>(`/api/products/update/${editingId}`, 'PUT', productPayload(form))
      }
      await refresh()
      closeModal()
    } catch (e: unknown) {
      setModalError(e instanceof Error ? e.message : 'Greška pri spremanju')
    } finally {
      setBusy(false)
    }
  }

  function askDelete(id: number, name: string) {
    setDeleteTarget({ id, name })
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleteBusy(true)
    try {
      await apiSend<void>(`/api/products/delete/${deleteTarget.id}`, 'DELETE')
      await refresh()
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
    return items.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.manufacturer.toLowerCase().includes(q) ||
        (p.serialNumber ?? '').toLowerCase().includes(q) ||
        p.countryOrigin.toLowerCase().includes(q)
      )
    })
  }, [items, query])

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <h1 className="h3 m-0">Proizvodi</h1>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-success" type="button" onClick={openCreate}>
            Dodaj proizvod
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
            placeholder="Naziv, proizvođač..."
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
            <th>Naziv</th>
            <th>Proizvođač</th>
            <th>Serijski</th>
            <th>Zemlja</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.manufacturer}</td>
                <td>{p.serialNumber ?? <span className="text-body-secondary">—</span>}</td>
              <td>{p.countryOrigin}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                  <Link className="btn btn-sm btn-warning text-white me-2" to={`/products?edit=${p.id}`}>
                    Uredi
                  </Link>
                  <button className="btn btn-sm btn-danger" type="button" onClick={() => askDelete(p.id, p.name)}>
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
        title={mode === 'create' ? 'Dodaj proizvod' : 'Uredi proizvod'}
        onClose={closeModal}
        size="lg"
      >
        {modalError ? <div className="alert alert-danger">{modalError}</div> : null}
        <ProductForm
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
            <button className="btn btn-outline-secondary" type="button" disabled={deleteBusy} onClick={() => setDeleteTarget(null)}>
              Odustani
            </button>
            <button className="btn btn-danger" type="button" disabled={deleteBusy} onClick={() => void confirmDelete()}>
              {deleteBusy ? 'Brisanje…' : 'Obriši'}
            </button>
          </>
        }
      >
        <p className="mb-2">Da li si siguran da želiš obrisati proizvod?</p>
        <div className="fw-semibold">{deleteTarget?.name}</div>
      </Modal>
    </div>
  )
}

