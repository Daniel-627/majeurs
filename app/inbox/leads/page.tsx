"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lead, LeadStatus } from "@/types";

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-blue/10 text-blue",
  contacted: "bg-amber-100 text-amber-700",
  closed: "bg-gray-100 text-mute",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setLeads(data);
    }
    load();

    const channel = supabase
      .channel("inbox:leads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function updateStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await supabase.from("leads").update({ status }).eq("id", id);
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {leads.length === 0 && (
        <p className="text-sm text-mute">No consultation requests yet.</p>
      )}
      <div className="flex flex-col gap-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-xl border border-line bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[15px] font-semibold">
                  {lead.name}
                  {lead.organization && (
                    <span className="font-normal text-mute">
                      {" "}
                      — {lead.organization}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[13px] text-mute">
                  {lead.email}
                  {lead.phone && <span> · {lead.phone}</span>}
                </div>
              </div>
              <select
                value={lead.status}
                onChange={(e) =>
                  updateStatus(lead.id, e.target.value as LeadStatus)
                }
                className={`rounded-full border-0 px-3 py-1 text-[12px] font-semibold outline-none ${statusStyles[lead.status]}`}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {lead.service_interest && (
              <div className="mt-3 text-[13px]">
                <span className="text-mute">Interested in: </span>
                {lead.service_interest}
              </div>
            )}
            {lead.message && (
              <p className="mt-2 text-[13.5px] text-mute">{lead.message}</p>
            )}
            <div className="mt-3 text-[11.5px] text-mute">
              {new Date(lead.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}