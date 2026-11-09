import { useCallback, useEffect, useState } from 'react'
import type { Emission, NewEmission } from '../types/emission'

export interface UseEmissionsResult {
  data: Emission[]
  loading: boolean
  error: string | null
  fetchEmissions: () => Promise<void>
  addEmission: (emission: NewEmission) => Promise<void>
}

const initialEmissions: Emission[] = [
  {
    id: 'mock-emission-1',
    source: 'Flota de reparto',
    category: 'Transporte',
    co2Kg: 24.8,
    recordedAt: new Date(Date.now() - 8 * 60_000),
  },
  {
    id: 'mock-emission-2',
    source: 'Consumo eléctrico · Oficina',
    category: 'Energía',
    co2Kg: 16.2,
    recordedAt: new Date(Date.now() - 34 * 60_000),
  },
  {
    id: 'mock-emission-3',
    source: 'Residuos de producción',
    category: 'Residuos',
    co2Kg: 8.6,
    recordedAt: new Date(Date.now() - 72 * 60_000),
  },
]

let mockEmissions: Emission[] = [...initialEmissions]

function simulateNetworkDelay(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}

export function useEmissions(): UseEmissionsResult {
  const [data, setData] = useState<Emission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmissions = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      await simulateNetworkDelay()
      setData(mockEmissions.map((emission) => ({ ...emission })))
    } catch (fetchFailure: unknown) {
      setError(getErrorMessage(fetchFailure))
    } finally {
      setLoading(false)
    }
  }, [])

  const addEmission = useCallback(async (emission: NewEmission): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      await simulateNetworkDelay()

      const newEmission: Emission = {
        ...emission,
        id: crypto.randomUUID(),
        recordedAt: new Date(),
      }

      mockEmissions = [newEmission, ...mockEmissions]
      setData((current) => [newEmission, ...current])
    } catch (insertFailure: unknown) {
      const message = getErrorMessage(insertFailure)
      setError(message)
      throw new Error(message, { cause: insertFailure })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    void Promise.resolve().then(() => {
      if (active) return fetchEmissions()
    })

    return () => {
      active = false
    }
  }, [fetchEmissions])

  return { data, loading, error, fetchEmissions, addEmission }
}
