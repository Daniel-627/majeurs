// Unlike layout.tsx, a template is re-created on every navigation — which is
// exactly what lets the CSS entrance animation replay on each new page.
// The navbar, footer and chat widget live in the layout, so they stay put.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
