import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Apple,
  FileSearch,
  HeartPulse,
  Lock,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UploadCloud,
} from "lucide-react";

import { MedicalDisclaimer } from "@/components/analyzer/MedicalDisclaimer";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    Icon: FileSearch,
    title: "Structured extraction",
    body: "Test names, values, units and reference ranges are read exactly as printed — nothing is invented or guessed.",
  },
  {
    Icon: Stethoscope,
    title: "Plain-language summary",
    body: "A clear explanation of what your report says, with normal, high and low findings separated out.",
  },
  {
    Icon: Apple,
    title: "Nutrition guidance",
    body: "General food ideas tied to your findings, each with the reason behind it. Never a restrictive diet.",
  },
  {
    Icon: HeartPulse,
    title: "Rest & activity",
    body: "Sensible lifestyle pointers, without ever inventing a recovery period your doctor didn't give you.",
  },
  {
    Icon: MessageCircleQuestion,
    title: "Ask about your report",
    body: "Follow-up questions answered using your own report as the only source of context.",
  },
  {
    Icon: Lock,
    title: "Private by design",
    body: "No public file links, no long-term server storage, and your saved analyses stay in your own browser.",
  },
];

const steps = [
  { Icon: UploadCloud, title: "Upload", body: "Drop in a PDF, JPG, JPEG or PNG of your report." },
  { Icon: FileSearch, title: "Extract", body: "Text and scans are read and turned into structured values." },
  { Icon: Sparkles, title: "Understand", body: "Get a clinical-style dashboard you can actually read." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediaI Health — Understand Your Medical Reports" },
      {
        name: "description",
        content:
          "MediaI Health explains your lab and medical reports in plain language, with nutrition, activity and consultation guidance. Information only, never a diagnosis.",
      },
      { property: "og:title", content: "MediaI Health — Understand Your Medical Reports" },
      {
        property: "og:description",
        content:
          "Upload a PDF or image of your medical report and get a clear, safe, plain-language explanation of your results.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="hero-gradient">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" aria-hidden />
                New · AI Medical Report Analyzer
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Understand your medical report in plain language
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                Upload a lab report as a PDF or photo. MediaI Health reads the values, explains what they generally
                mean, and shows you what is worth discussing with a doctor.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/analyzer">
                    <UploadCloud className="size-4" aria-hidden />
                    Analyze a report
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/reports">View my reports</Link>
                </Button>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" aria-hidden />
                Health information only — never a diagnosis or prescription.
              </p>
            </div>

            <div className="card-elevated p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                What your dashboard looks like
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Report summary & overall status",
                  "Key findings: normal, high, low",
                  "Detailed test results with explanations",
                  "Nutrition guidance",
                  "Rest & activity guidance",
                  "Who should I consult?",
                  "Medication information from your report",
                  "Important warning signs",
                ].map((row) => (
                  <li key={row} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                    <span className="size-2 rounded-full bg-primary" aria-hidden />
                    {row}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="font-display text-2xl font-semibold sm:text-3xl">
            How it works
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={s.title} className="rounded-2xl">
                <CardHeader>
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <s.Icon className="size-5" aria-hidden />
                  </span>
                  <CardTitle className="mt-3 text-lg">
                    {i + 1}. {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{s.body}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-surface py-14" aria-labelledby="features">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 id="features" className="font-display text-2xl font-semibold sm:text-3xl">
              Built for clarity and safety
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Card key={f.title} className="rounded-2xl">
                  <CardHeader>
                    <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                      <f.Icon className="size-5" aria-hidden />
                    </span>
                    <CardTitle className="mt-3 text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{f.body}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <MedicalDisclaimer />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
