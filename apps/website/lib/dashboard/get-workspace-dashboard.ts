import { supabaseAdmin } from "@/lib/supabase/admin";

const PROMPTPROFIT_WORKSPACE_ID =
"1861ee99-3966-42c9-ac31-b9cb092d7f67";

type WebsiteRow = {
id: string;
name: string;
};

type LeadRow = {
id: string;
email: string;
source_page: string;
metadata: Record<string, unknown> | null;
created_at: string;
websites: { name: string } | { name: string }[] | null;
};

export type WorkspaceDashboard = {
workspaceId: string;
metrics: {
websites: number;
sessions: number;
leads: number;
conversionRate: number;
highIntentSessions: number;
};
recentLeads: Array<{
id: string;
email: string;
sourcePage: string;
createdAt: string;
websiteName: string;
metadata: Record<string, unknown>;
}>;
};

export async function getWorkspaceDashboard(): Promise<WorkspaceDashboard> {
const { data: websites, error: websitesError } = await supabaseAdmin
.from("websites")
.select("id, name")
.eq("workspace_id", PROMPTPROFIT_WORKSPACE_ID);

if (websitesError) {
throw new Error("Unable to load PromptProfit websites.");
}

const typedWebsites = (websites ?? []) as WebsiteRow[];
const websiteIds = typedWebsites.map((website) => website.id);

if (websiteIds.length === 0) {
return {
workspaceId: PROMPTPROFIT_WORKSPACE_ID,
metrics: {
websites: 0,
sessions: 0,
leads: 0,
conversionRate: 0,
highIntentSessions: 0,
},
recentLeads: [],
};
}

const [sessionsResult, leadsResult, highIntentResult, recentLeadsResult] =
await Promise.all([
supabaseAdmin
.from("pp_sessions")
.select("id", { count: "exact", head: true })
.in("website_id", websiteIds),


  supabaseAdmin
    .from("pp_leads")
    .select("id", { count: "exact", head: true })
    .in("website_id", websiteIds),

  supabaseAdmin
    .from("pp_sessions")
    .select("id", { count: "exact", head: true })
    .in("website_id", websiteIds)
    .gte("intent_score", 60),

  supabaseAdmin
    .from("pp_leads")
    .select(`
      id,
      email,
      source_page,
      metadata,
      created_at,
      websites!inner(name)
    `)
    .in("website_id", websiteIds)
    .order("created_at", { ascending: false })
    .limit(10),
]);


if (
sessionsResult.error ||
leadsResult.error ||
highIntentResult.error ||
recentLeadsResult.error
) {
throw new Error("Unable to load PromptProfit dashboard intelligence.");
}

const sessions = sessionsResult.count ?? 0;
const leads = leadsResult.count ?? 0;

return {
workspaceId: PROMPTPROFIT_WORKSPACE_ID,
metrics: {
websites: typedWebsites.length,
sessions,
leads,
conversionRate:
sessions === 0 ? 0 : Number(((leads / sessions) * 100).toFixed(1)),
highIntentSessions: highIntentResult.count ?? 0,
},
recentLeads: ((recentLeadsResult.data ?? []) as LeadRow[]).map((lead) => {
const website = Array.isArray(lead.websites)
? lead.websites[0]
: lead.websites;


  return {
    id: lead.id,
    email: lead.email,
    sourcePage: lead.source_page,
    createdAt: lead.created_at,
    websiteName: website?.name ?? "Unknown website",
    metadata: lead.metadata ?? {},
  };
}),


};
}
