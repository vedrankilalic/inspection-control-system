import { useEffect } from 'react'

export function Modal(props: {
  title: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const { title, open, onClose, children, footer, size = 'lg' } = props

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const sizeClass = size === 'sm' ? 'modal-sm' : size === 'md' ? '' : size === 'lg' ? 'modal-lg' : 'modal-xl'

  return (
    <>
      <div className="modal fade show" role="dialog" aria-modal="true" style={{ display: 'block' }}>
        <div className={`modal-dialog modal-dialog-centered ${sizeClass}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body appFormSimple">{children}</div>
            {footer ? <div className="modal-footer">{footer}</div> : null}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  )
}

