import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SUBMISSION_FLASH_COOKIE = "cap-submit-status";
const COMMUNITY_ID = "saikumarbonakurthi";

type SubmissionResult = { result?: string; communityId?: string };

export default async function Home() {
  const cookieStore = await cookies();
  const submissionFlash = cookieStore.get(SUBMISSION_FLASH_COOKIE)?.value;
  let submittedResult: SubmissionResult | null = null;

  if (submissionFlash) {
    try { submittedResult = JSON.parse(submissionFlash) as SubmissionResult; } catch { /* Ignore malformed flash data. */ }
  }

  const capServiceUrl = process.env.CAP_SERVICE_URL;
  const capSubmitUrl = capServiceUrl
    ? `${capServiceUrl.replace(/\/$/, "")}/odata/v4/submitAnswer`
    : null;

  async function submitToCap(formData: FormData) {
    "use server";
    if (!capSubmitUrl) throw new Error("CAP_SERVICE_URL is not configured.");

    const requestPayload = {
      data: {
        communityId: String(formData.get("communityId") ?? ""),
        answer: String(formData.get("answer") ?? ""),
        week: String(formData.get("week") ?? ""),
      },
    };

    const response = await fetch(capSubmitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`CAP request failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();
    const actionCookieStore = await cookies();
    actionCookieStore.set(SUBMISSION_FLASH_COOKIE, JSON.stringify({
      result: String(result?.result),
      communityId: String(result?.communityId ?? requestPayload.data.communityId),
    }), { httpOnly: true, maxAge: 8, path: "/", sameSite: "lax" });
    redirect("/");
  }

  const accepted = submittedResult?.result?.toLowerCase() === "accepted";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07131f] px-6 py-12 text-white">
      <div className="absolute -left-28 top-12 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="mb-7 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
          <span>SAP Developer</span><span>Week 4</span>
        </div>

        {submittedResult && (
          <div aria-live="polite" className={`mb-6 rounded-xl border px-4 py-3 text-sm ${accepted ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-amber-400/40 bg-amber-400/10 text-amber-100"}`}>
            <p className="font-bold">{submittedResult.result}</p>
            <p className="mt-1 opacity-80">Community ID: {submittedResult.communityId}</p>
          </div>
        )}

        <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-300 to-blue-600 text-3xl font-black text-[#07131f] shadow-lg shadow-cyan-500/20">SK</div>
        <h1 className="text-3xl font-bold tracking-tight">Sai Kumar Bonakurthi</h1>
        <p className="mt-2 text-slate-300">AI & SAP Technology Enthusiast</p>
        <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-slate-400">Building modern experiences where enterprise technology meets intelligent applications.</p>

        <div className="mt-8 grid gap-3">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 font-semibold transition hover:bg-white/15">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 font-semibold transition hover:bg-white/15">LinkedIn</a>
          <form action={submitToCap}>
            <input type="hidden" name="communityId" value={COMMUNITY_ID} />
            <input type="hidden" name="answer" value="hydration" />
            <input type="hidden" name="week" value="week4" />
            <button type="submit" className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 font-bold text-[#07131f] transition hover:brightness-110">Submit to SAP Community</button>
          </form>
        </div>
      </section>
    </main>
  );
}
