import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { TopNav } from './components/TopNav'
import { HomePage } from './pages/HomePage'
import { InspectionBodiesPage } from './pages/InspectionBodiesPage'
import { InspectionControlDetailsPage } from './pages/InspectionControlDetailsPage'
import { InspectionControlsPage } from './pages/InspectionControlsPage'
import { ProductsPage } from './pages/ProductsPage'
import { ReportsPage } from './pages/ReportsPage'

function RedirectInspectionControlEdit() {
  const { id } = useParams()
  return <Navigate to={`/inspection-controls?edit=${id ?? ''}`} replace />
}

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ top: '4.75rem' }}
        toastOptions={{
          duration: 4000,
          className: 'appToast',
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            maxWidth: 'min(420px, calc(100vw - 32px))',
            background: 'var(--bs-body-bg)',
            color: 'var(--bs-body-color)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.12)',
          },
        }}
      />
      <TopNav />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/inspection-bodies" element={<InspectionBodiesPage />} />
          <Route path="/inspection-controls" element={<InspectionControlsPage />} />
          <Route path="/inspection-controls/new" element={<Navigate to="/inspection-controls?new=1" replace />} />
          <Route path="/inspection-controls/:id/edit" element={<RedirectInspectionControlEdit />} />
          <Route path="/inspection-controls/:id" element={<InspectionControlDetailsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/products/new" element={<Navigate to="/products?new=1" replace />} />
          <Route path="/products/:id/edit" element={<Navigate to="/products" replace />} />
          <Route path="/inspection-bodies/new" element={<Navigate to="/inspection-bodies?new=1" replace />} />
          <Route path="/inspection-bodies/:id/edit" element={<Navigate to="/inspection-bodies" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
