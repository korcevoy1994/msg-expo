import { NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/serverSupabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Basic shape validation (keep light to avoid duplication of client zod)
    const payload = {
      first_name: String(body.firstName || '').trim(),
      position: String(body.position || '').trim(),
      email: String(body.email || '').trim(),
      phone: String(body.phone || '').trim(),
      brand: String(body.brand || '').trim(),
      company_name: String(body.companyName || '').trim(),
      fiscal_code: body.fiscalCode ? String(body.fiscalCode).trim() : null,
      services: Array.isArray(body.services) ? body.services : [],
      message: body.message ? String(body.message).trim() : null,
      created_at: new Date().toISOString(),
    }

    if (!payload.first_name || !payload.email || !payload.phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getServerSupabaseClient()
    const { data, error } = await supabase
      .from('contact_requests')
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}