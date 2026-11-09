export const emissionCategories = ['Transporte', 'Energía', 'Residuos'] as const

export type EmissionCategory = (typeof emissionCategories)[number]

export interface Emission {
  id: string
  source: string
  category: EmissionCategory
  co2Kg: number
  recordedAt: Date
}

export type EmissionRecord = {
  id: string
  source: string
  category: EmissionCategory
  co2_kg: number
  recorded_at: string
}

export type NewEmission = Omit<Emission, 'id' | 'recordedAt'>

export function isEmissionCategory(value: string): value is EmissionCategory {
  return emissionCategories.some((category) => category === value)
}
