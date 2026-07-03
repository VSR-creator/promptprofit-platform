import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { PromptProfitConfigResponse } from "@/lib/promptprofit/contract";

export const runtime = "nodejs";

function normalizeHost(value: string | null) {
  if (!value) {
    return null;
  }

  let host = value.trim().toLowerCase();

  if (host.startsWith("http://") || host.startsWith("https://")) {
    try {
      host = new URL(host).hostname;
    } catch {
      host = host.replace("https://", "").replace("http://", "").split("/")[0];
    }
  }

  host = host.split(":")[0];

  if (host.startsWith("[www](http://www).")) {
    host = host.slice(4);
  }

  return host;
}

function isAllowedOrigin(request: NextRequest, websiteDomain: string) {
  const originHost = normalizeHost(request.headers.get("origin"));
  const refererHost = normalizeHost(request.headers.get("referer"));
  const requestHost = normalizeHost(request.headers.get("host"));
  const expectedDomain = normalizeHost(websiteDomain);

  const candidateHost = originHost || refererHost || requestHost;

  if (!candidateHost || !expectedDomain) {
    return false;
  }

  const isLocalDevelopment =
    candidateHost === "localhost" || candidateHost === "127.0.0.1";

  return isLocalDevelopment || candidateHost === expectedDomain;
}

export async function GET(request: NextRequest) {
  const siteKey = request.nextUrl.searchParams.get("siteKey");

  if (!siteKey || siteKey.length < 16) {
    return NextResponse.json(
      { error: "Missing or invalid site key" },
      { status: 400 },
    );
  }

  const { data: website, error } = await supabaseAdmin
    .from("websites")
    .select("id, domain, is_active")
    .eq("public_key", siteKey)
    .single();

  if (error || !website || !website.is_active) {
    return NextResponse.json(
      { error: "Unknown or inactive website" },
      { status: 401 },
    );
  }

  if (!isAllowedOrigin(request, website.domain)) {
    return NextResponse.json(
      { error: "Origin is not allowed for this website" },
      { status: 403 },
    );
  }

  const response: PromptProfitConfigResponse = {
    ok: true,
    website: {
      id: website.id,
      domain: website.domain,
    },
    config: {
      enabled: true,
      eventBatchLimit: 5,
      flushIntervalMs: 1000,
    },
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
