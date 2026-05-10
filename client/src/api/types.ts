export type ProductDto = {
  id: number
  name: string
  manufacturer: string
  serialNumber: string | null
  countryOrigin: string
  description: string | null
}

export type Inspectorate = 'FBiH' | 'RS' | 'Brcko'
export type Jurisdiction = 'Market' | 'HealthSanitary'

export type InspectionBodyDto = {
  id: number
  name: string
  inspectorate: Inspectorate
  jurisdiction: Jurisdiction
  contactPerson: string
}

export type InspectionControlDto = {
  id: number
  inspectionDateTime: string
  inspectionBodyId: number
  inspectionBodyName: string
  productId: number
  productName: string
  productSafe: boolean
}

export type InspectionControlDetailsDto = {
  id: number
  inspectionDateTime: string
  results: string
  productSafe: boolean
  productId: number
  productName: string
  productSerialNumber: string | null
  productCountryOrigin: string
  inspectionBodyId: number
  inspectionBodyName: string
}

