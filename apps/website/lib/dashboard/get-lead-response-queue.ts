import { supabaseAdmin } from "@/lib/supabase/admin";

export type LeadQueueItem = {
leadId: string;
email: string;
name: string | null;
sourcePage: string;
capturedAt: string;
status: "new" | "contacted" | "qualified" | "won" | "lost";
firstContactedAt: string | null;
intentScore: number;
};

export async function getLeadResponseQueue(workspaceId: string) {
const { data, error } = await supabaseAdmin
.from("pp_lead_outcomes")
.select(`       lead_id,
      status,
      first_contacted_at,
      pp_leads!inner (
        email,
        source_page,
        metadata,
        created_at,
        pp_sessions (
          intent_score
        )
      )
    `)
.eq("workspace_id", workspaceId)
.order("created_at", { ascending: false });

if (error) {
throw new Error(`Unable to load lead response queue: ${error.message}`);
}

return (data ?? []).map((row: any): LeadQueueItem => {
const lead = row.pp_leads;
const session = Array.isArray(lead.pp_sessions)
? lead.pp_sessions[0]
: lead.pp_sessions;


return {
  leadId: row.lead_id,
  email: lead.email,
  name: lead.metadata?.name ?? null,
  sourcePage: lead.source_page,
  capturedAt: lead.created_at,
  status: row.status,
  firstContactedAt: row.first_contacted_at,
  intentScore: session?.intent_score ?? 0,
};


});
}
