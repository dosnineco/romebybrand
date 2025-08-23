// ===============================


// Thin content heuristic
if ((base.wordCount || 0) < 250) {
base.issues.push({ id: "thin-content", severity: "medium", title: "Low on-page text", whyItMatters: "Thin pages can trigger poor UX/misrepresentation.", fix: "Provide ~500+ words of unique, helpful content." });
} else base.passed.push("Adequate text content");


// Forms + security
const hasForms = $("form").length > 0;
if (hasForms && u.protocol !== "https:") {
base.issues.push({ id: "insecure-forms", severity: "high", title: "Forms over HTTP", whyItMatters: "Violates user data safety.", fix: "Serve forms only over HTTPS." });
}


// Simple ad script density
const adScripts = ($('script[src*="googlesyndication"],script[src*="doubleclick"],script[src*="adservice"],script[src*="adsbygoogle"]').length);
if (adScripts > 6) {
base.issues.push({ id: "ad-density", severity: "low", title: "High number of ad scripts", whyItMatters: "Excessive ads harm UX.", fix: "Reduce ad units above the fold." });
}


// Compute score
const weights: Record<AuditIssue["severity"], number> = {
critical: 35,
high: 20,
medium: 10,
low: 5,
info: 0,
};
const penalty = base.issues.reduce((s, it) => s + (weights[it.severity] || 0), 0);
base.score = Math.max(0, 100 - Math.min(90, penalty));


return NextResponse.json(base);
}


// Too many redirects without terminal fetch
base.issues.push({ id: "too-many-redirects", severity: "high", title: "Too many redirects", whyItMatters: "Reviewers may fail to reach landing page.", fix: "Reduce redirect hops to ≤ 2." });
base.score = Math.max(0, base.score - 20);
return NextResponse.json(base);
} catch (e: any) {
return NextResponse.json(
{ error: "Audit failed", details: e?.message || String(e) },
{ status: 500 }
);
}
}