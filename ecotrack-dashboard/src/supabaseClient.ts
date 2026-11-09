import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { EmissionCategory, EmissionRecord } from './types/emission'

type Database = {
  public: {
    Tables: {
      emissions: {
        Row: EmissionRecord
        Insert: {
          id?: string
          source: string
          category: EmissionCategory
          co2_kg: number
          recorded_at?: string
        },
        Update: Partial<EmissionRecord>
        Relationships: []
      }
    },
    Views: { [_ in never]: never },
    Functions: { [_ in never]: never }
  }
}

let supabase: SupabaseClient<Database> | undefined

export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabase) return supabase

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env.local.',
    )
  }

  supabase = createClient<Database>(url, anonKey)
  return supabase
}
