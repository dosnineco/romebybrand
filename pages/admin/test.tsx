

export default function AuditPage() {
  const hdrs = headers();
  const host = hdrs.get('host');
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">Google Ads Policy Auditor</h1>
          <p className="mt-2 text-sm text-gray-600">Quickly scan a URL for common <span className="font-medium">disapproval causes</span> and <span className="font-medium">destination issues</span>.</p>
        <AuditForm />
        <footer className="mt-10 text-xs text-gray-500">
          <p>Heuristic checks only. Always review the official <Link href="https://support.google.com/adspolicy/answer/6008942" className="underline">Google Ads policies</Link>.</p>
        </footer>
      </div>
    </div>
  );
}

function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'success' | 'warn' | 'critical' | 'default' }) {
  const map: Record<string, string> = {
    success: 'bg-green-100 text-green-800 ring-green-200',
    warn: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    critical: 'bg-red-100 text-red-800 ring-red-200',
    default: 'bg-gray-100 text-gray-800 ring-gray-200',
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${map[tone]}`}>{children}</span>;
}

async function Results({ report }: { report: AuditReport }) {
  const sevToTone: Record<AuditIssue['severity'], 'critical' | 'warn' | 'default' | 'success'> = {
    critical: 'critical',
    high: 'critical',
    medium: 'warn',
    low: 'default',
    info: 'default',
  };

  return (
    <section className="mt-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Results</h2>
            <p className="text-sm text-gray-600">Scanned <span className="font-medium">{report.fetchedUrl}</span> on {new Date(report.createdAt).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{report.score}</div>
            <div className="text-xs text-gray-500">Compliance score / 100</div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Stat label="HTTP Status" value={String(report.status ?? '—')} />
          <Stat label="Redirects" value={report.redirectChain.length.toString()} />
          <Stat label="Content-Type" value={report.contentType || '—'} />
          <Stat label="HTML Size" value={report.htmlBytes ? `${(report.htmlBytes / 1024).toFixed(1)} KB` : '—'} />
          <Stat label="Words" value={report.wordCount?.toString() || '—'} />
          <Stat label="Images / Scripts / CSS / Iframes" value={`${report.counts.img} / ${report.counts.script} / ${report.counts.linkStylesheet} / ${report.counts.iframes}`} />
        </div>

        {report.passed.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Passed checks</h3>
            <div className="flex flex-wrap gap-2">
              {report.passed.map((p, i) => (
                <Badge key={i} tone="success">{p}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Issues</h3>
          {report.issues.length === 0 ? (
            <p className="text-sm text-gray-600">No issues detected. Great job!</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {report.issues.map((issue) => (
                <li key={issue.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge tone={sevToTone[issue.severity]}>{issue.severity.toUpperCase()}</Badge>
                        <p className="font-medium">{issue.title}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">{issue.whyItMatters}</p>
                      {issue.evidence && <p className="mt-1 text-xs text-gray-500">Evidence: {issue.evidence}</p>}
                      {issue.policyRef && <p className="mt-1 text-xs text-gray-500">Policy: {issue.policyRef}</p>}
                      {issue.fix && <p className="mt-1 text-sm text-gray-800"><span className="font-medium">Fix:</span> {issue.fix}</p>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-base font-medium text-gray-800">{value}</div>
    </div>
  );
}

// -----------------------------
// Client Form
// -----------------------------

function AuditForm() {
  return (
    <form action={analyzeSiteAction} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <label htmlFor="url" className="block text-sm font-medium text-gray-700">Site URL</label>
      <div className="mt-2 flex gap-2">
        <input id="url" name="url" type="url" required placeholder="https://example.com"
          className="flex-1 rounded-xl border border-gray-300 px-3 py-2 outline-none ring-0 focus:border-gray-400 focus:ring-2 focus:ring-gray-200" />
        <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-white shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-400">Audit</button>
      </div>
      {/* @ts-expect-error Async Server Component in form action */}
      <AuditResult />
    </form>
  );
}

async function AuditResult(_: any) {
  // This special component catches the server action result automatically
  // when the form posts to analyzeSiteAction, per Next.js RSC form actions.
  // We simply read the returned value from the action using useFormStatus-like semantics
  // by leveraging the new Server Actions return hydration.
  // In practice, Next.js injects the serialized return into this component\'s props.
  const props = ({} as any);
  // When there is a result, Next will re-render this component with the action result
  // accessible via a special symbol prop. To keep this file framework-agnostic,
  // we rely on Next to pass `report` here when available.
  // @ts-ignore – Next.js will pass the action return value as the only prop.
  const report: AuditReport | undefined = (arguments as any)[0];

  if (!report) return null;
  return <Results report={report} />;
}
