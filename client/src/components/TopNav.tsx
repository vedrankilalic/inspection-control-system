import { NavLink } from 'react-router-dom'

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'nav-link active' : 'nav-link'
}

export function TopNav() {
  return (
    <nav className="navbar navbar-expand-lg border-bottom sticky-top appNavbar">
      <div className="container">
        <NavLink className="navbar-brand fw-semibold" to="/">
          Inspekcijska Kontrola <span className="text-body-secondary fw-normal">BiH</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#primaryNav"
          aria-controls="primaryNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="primaryNav">
          <ul className="navbar-nav nav nav-pills ms-auto gap-lg-1 py-lg-0 py-2" aria-label="Primary">
            <li className="nav-item">
              <NavLink to="/" end className={navClass}>
                Početna
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products" className={navClass}>
                Proizvodi
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/inspection-bodies" className={navClass}>
                Tijela
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/inspection-controls" className={navClass}>
                Kontrole
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/reports" className={navClass}>
                Izvještaji
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

