import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useEmissions } from './hooks/useEmissions'
import { isEmissionCategory, type EmissionCategory } from './types/emission'

const categoryStyles: Record<EmissionCategory, string> = {
  Transporte: 'bg-sky-50 text-sky-700 ring-sky-600/10',
  Energía: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  Residuos: 'bg-violet-50 text-violet-700 ring-violet-600/10',
}

const categoryMarks: Record<EmissionCategory, string> = {
  Transporte: '↗',
  Energía: 'ϟ',
  Residuos: '♻',
}

function formatRecordedAt(date: Date): string {
  return new Intl.DateTimeFormat('es', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function EmissionsTracker(): React.JSX.Element {
  const { data: emissions, loading, error, fetchEmissions, addEmission } = useEmissions()
  const [source, setSource] = useState('')
  const [category, setCategory] = useState<EmissionCategory>('Transporte')
  const [co2Kg, setCo2Kg] = useState('')

  const totalEmissions = emissions.reduce((total, emission) => total + emission.co2Kg, 0)

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    try {
      await addEmission({
        source: source.trim(),
        category,
        co2Kg: Number(co2Kg),
      })
      setSource('')
      setCategory('Transporte')
      setCo2Kg('')
    } catch {
      return
    }
  }, [addEmission, source, category, co2Kg])

  const emissionCards = useMemo(
    () =>
      emissions.map((emission) => (
        <article
          key={emission.id}
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${categoryStyles[emission.category]}`}>
              <span aria-hidden="true" className="text-sm leading-none">{categoryMarks[emission.category]}</span>
              {emission.category}
            </span>
            <span className="text-xs font-medium text-slate-400">{formatRecordedAt(emission.recordedAt)}</span>
          </div>

          <h3 className="truncate text-base font-semibold text-slate-900" title={emission.source}>
            {emission.source}
          </h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight tabular-nums text-slate-950">
              {emission.co2Kg.toFixed(1)}
            </span>
            <span className="text-sm font-medium text-slate-500">kg CO₂</span>
          </div>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min((emission.co2Kg / 50) * 100, 100)}%` }}
            />
          </div>
        </article>
      )),
    [emissions],
  )

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
                <path d="M20 4c-8 0-13 3-13 9a5 5 0 0 0 5 5c6 0 8-7 8-14Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M4 21c2-5 5-8 10-11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900">ecotrack</p>
              <p className="text-xs text-slate-500">Panel de sostenibilidad</p>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm">
            <span className="relative flex size-2">
              {loading && <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-60" />}
              <span className={`relative inline-flex size-2 rounded-full ${error ? 'bg-rose-500' : loading ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            </span>
            {error ? 'Error de conexión' : loading ? 'Sincronizando...' : 'Conectado a Supabase'}
          </div>
        </header>

        <section className="mb-9">
          <p className="mb-2 text-sm font-semibold text-emerald-700">Resumen de actividad</p>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Seguimiento de emisiones
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Registra y consulta el impacto de carbono de las actividades de tu organización.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
                  <path d="M4 17 9 12l4 3 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 7h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Emisiones registradas</p>
                <p className="text-lg font-bold tabular-nums text-slate-900">
                  {totalEmissions.toFixed(1)} <span className="text-sm font-medium text-slate-500">kg CO₂</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="new-emission-heading" className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 id="new-emission-heading" className="text-lg font-bold tracking-tight text-slate-900">
              Agregar medición
            </h2>
            <p className="mt-1 text-sm text-slate-500">Registra una nueva fuente de emisiones.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_auto] xl:items-end">
            <div>
              <label htmlFor="source" className="mb-2 block text-sm font-semibold text-slate-700">
                Nombre de la fuente
              </label>
              <input
                id="source"
                aria-label="Nombre de la fuente"
                name="source"
                type="text"
                value={source}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSource(event.target.value)}
                placeholder="Ej. Vehículo de reparto"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">
                Categoría
              </label>
              <select
                id="category"
                aria-label="Categoría de emisiones"
                name="category"
                value={category}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  if (isEmissionCategory(event.target.value)) setCategory(event.target.value)
                }}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option>Transporte</option>
                <option>Energía</option>
                <option>Residuos</option>
              </select>
            </div>

            <div>
              <label htmlFor="co2Kg" className="mb-2 block text-sm font-semibold text-slate-700">
                CO₂ producido
              </label>
              <div className="relative">
                <input
                  id="co2Kg"
                  aria-label="CO2 producido en kilogramos"
                  name="co2Kg"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={co2Kg}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCo2Kg(event.target.value)}
                  placeholder="0.0"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate-400">kg</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2 xl:col-span-1"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {loading ? 'Guardando...' : 'Agregar medición'}
            </button>
          </form>
        </section>

        <section aria-labelledby="history-heading">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="history-heading" className="text-xl font-bold tracking-tight text-slate-900">
                Historial de mediciones
              </h2>
              <p className="mt-1 text-sm text-slate-500">Actividad reciente de todas las categorías.</p>
            </div>
            <span className="text-sm font-medium text-slate-500">
              {emissions.length} {emissions.length === 1 ? 'medición' : 'mediciones'}
            </span>
          </div>

          {error && (
            <div role="alert" className="mb-4 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void fetchEmissions()}
                disabled={loading}
                className="shrink-0 font-semibold underline underline-offset-2 disabled:opacity-50"
              >
                Reintentar carga
              </button>
            </div>
          )}

          {loading && emissions.length === 0 ? (
            <div role="status" className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center text-sm font-medium text-slate-500">
              Cargando mediciones...
            </div>
          ) : emissions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {emissionCards}
            </div>
          ) : !error ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <p className="font-semibold text-slate-700">Todavía no hay mediciones</p>
              <p className="mt-1 text-sm text-slate-500">Agrega una medición para comenzar tu historial.</p>
            </div>
          ) : null}
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
          Ecotrack · Panel de seguimiento de emisiones
        </footer>
      </div>
    </main>
  )
}

export default EmissionsTracker
