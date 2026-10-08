import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import {
  getContactMessages,
  getPrayerRequests,
  getVolunteerRequests,
} from "@/lib/data/admin-communication";
import { deleteSubmission } from "@/lib/actions/admin-communication";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SubmissionStatusSelect } from "@/components/admin/SubmissionStatusSelect";
import { formatEventDateTime } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Communication",
  robots: { index: false, follow: false },
};

type Tab = "contact" | "prayer" | "volunteer";

const tabs: Array<{ key: Tab; label: string }> = [
  { key: "contact", label: "Contact" },
  { key: "prayer", label: "Prayer" },
  { key: "volunteer", label: "Volunteer" },
];

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

function ItemFooter({
  table,
  id,
  status,
  replyEmail,
  deleteMessage,
}: {
  table: "contact_messages" | "prayer_requests" | "volunteer_requests";
  id: string;
  status: string;
  replyEmail?: string | null;
  deleteMessage: string;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
      <SubmissionStatusSelect table={table} id={id} status={status} />
      <div className="flex items-center gap-4">
        {replyEmail && (
          <a
            href={`mailto:${replyEmail}`}
            className="text-sm font-medium text-forest underline underline-offset-4"
          >
            Reply by email
          </a>
        )}
        <DeleteButton action={deleteSubmission.bind(null, table, id)} confirmMessage={deleteMessage} />
      </div>
    </div>
  );
}

export default async function AdminCommunicationPage({ searchParams }: Props) {
  const sp = await searchParams;
  const activeTab: Tab = tabs.some((t) => t.key === sp.tab) ? (sp.tab as Tab) : "contact";

  const [contact, prayer, volunteer] = await Promise.all([
    getContactMessages(),
    getPrayerRequests(),
    getVolunteerRequests(),
  ]);

  const newCounts: Record<Tab, number> = {
    contact: contact.filter((i) => i.status === "new").length,
    prayer: prayer.filter((i) => i.status === "new").length,
    volunteer: volunteer.filter((i) => i.status === "new").length,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Communication</h1>

      <nav aria-label="Inbox sections" className="mt-6 flex gap-2 border-b border-line">
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <Link
              key={tab.key}
              href={`/admin/communication?tab=${tab.key}`}
              aria-current={active ? "page" : undefined}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
                active
                  ? "border-forest text-forest"
                  : "border-transparent text-ink/60 hover:text-forest"
              }`}
            >
              {tab.label}
              {newCounts[tab.key] > 0 && (
                <span className="ml-2 rounded-full bg-brass/15 px-2 py-0.5 text-xs text-brass-dim">
                  {newCounts[tab.key]} new
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 space-y-4">
        {activeTab === "contact" &&
          (contact.length > 0 ? (
            contact.map((item) => (
              <Card key={item.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-ink">
                    {item.name}{" "}
                    <span className="text-sm font-normal text-ink/60">&lt;{item.email}&gt;</span>
                  </p>
                  <p className="text-xs text-ink/50">{formatEventDateTime(item.created_at)}</p>
                </div>
                {item.subject && <p className="mt-1 text-sm font-medium text-forest">{item.subject}</p>}
                {item.phone && <p className="mt-1 text-xs text-ink/60">Phone: {item.phone}</p>}
                <p className="mt-3 whitespace-pre-line text-sm text-ink/85">{item.message}</p>
                <ItemFooter
                  table="contact_messages"
                  id={item.id}
                  status={item.status}
                  replyEmail={item.email}
                  deleteMessage="Delete this message? This can't be undone."
                />
              </Card>
            ))
          ) : (
            <p className="text-sm text-ink/60">No contact messages yet.</p>
          ))}

        {activeTab === "prayer" &&
          (prayer.length > 0 ? (
            prayer.map((item) => (
              <Card key={item.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-ink">
                    {item.name || "Anonymous"}
                    {item.is_confidential && (
                      <span className="ml-2 rounded-full bg-clay/10 px-2 py-0.5 text-xs font-medium text-clay">
                        Confidential
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink/50">{formatEventDateTime(item.created_at)}</p>
                </div>
                {item.email && <p className="mt-1 text-xs text-ink/60">{item.email}</p>}
                <p className="mt-3 whitespace-pre-line text-sm text-ink/85">{item.request_text}</p>
                <ItemFooter
                  table="prayer_requests"
                  id={item.id}
                  status={item.status}
                  replyEmail={item.email}
                  deleteMessage="Delete this prayer request? This can't be undone."
                />
              </Card>
            ))
          ) : (
            <p className="text-sm text-ink/60">No prayer requests yet.</p>
          ))}

        {activeTab === "volunteer" &&
          (volunteer.length > 0 ? (
            volunteer.map((item) => (
              <Card key={item.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-ink">
                    {item.name}{" "}
                    <span className="text-sm font-normal text-ink/60">&lt;{item.email}&gt;</span>
                  </p>
                  <p className="text-xs text-ink/50">{formatEventDateTime(item.created_at)}</p>
                </div>
                {item.phone && <p className="mt-1 text-xs text-ink/60">Phone: {item.phone}</p>}
                {item.ministry_interest && (
                  <p className="mt-2 text-sm text-ink/85">
                    <span className="font-medium">Interested in:</span> {item.ministry_interest}
                  </p>
                )}
                {item.availability_note && (
                  <p className="mt-1 whitespace-pre-line text-sm text-ink/85">
                    <span className="font-medium">Availability:</span> {item.availability_note}
                  </p>
                )}
                <ItemFooter
                  table="volunteer_requests"
                  id={item.id}
                  status={item.status}
                  replyEmail={item.email}
                  deleteMessage="Delete this volunteer request? This can't be undone."
                />
              </Card>
            ))
          ) : (
            <p className="text-sm text-ink/60">No volunteer requests yet.</p>
          ))}
      </div>
    </div>
  );
}