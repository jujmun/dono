"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { categoryLabels } from "@/lib/data";

const steps = ["Details", "Story", "Goal", "Review"];

const creatorTypes = [
  "Individual Student",
  "Student Society",
  "College",
  "Department",
  "University",
];

export default function CreateCampaignPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    category: "",
    creatorType: "",
    university: "",
    description: "",
    story: "",
    goal: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.title && form.category && form.creatorType && form.university;
      case 1:
        return form.description && form.story;
      case 2:
        return form.goal && Number(form.goal) > 0;
      default:
        return true;
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-dono-text sm:text-3xl">
            Start a Campaign
          </h1>
          <p className="mt-1 text-dono-muted">
            Free for students. Reach alumni who care about your community.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    i < step
                      ? "bg-dono-primary text-white"
                      : i === step
                        ? "bg-dono-primary text-white ring-4 ring-dono-primary/20"
                        : "bg-dono-surface-muted text-dono-muted"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className="mt-1 hidden text-xs text-dono-muted sm:block">
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 ${
                    i < step ? "bg-dono-primary" : "bg-dono-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-dono-border bg-white p-6 sm:p-8">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dono-text">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Anatomy Models for Medical Students"
                  className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm outline-none focus:border-dono-primary focus:ring-2 focus:ring-dono-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dono-text">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm outline-none focus:border-dono-primary focus:ring-2 focus:ring-dono-primary/20"
                >
                  <option value="">Select a category</option>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dono-text">
                  I am creating this as a...
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {creatorTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => update("creatorType", type)}
                      className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors sm:text-sm ${
                        form.creatorType === type
                          ? "border-dono-primary bg-dono-primary/5 text-dono-primary"
                          : "border-dono-border text-dono-muted hover:border-dono-primary/30"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dono-text">
                  University
                </label>
                <input
                  type="text"
                  value={form.university}
                  onChange={(e) => update("university", e.target.value)}
                  placeholder="e.g. University of Cambridge"
                  className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm outline-none focus:border-dono-primary focus:ring-2 focus:ring-dono-primary/20"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dono-text">
                  Short Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="One-line summary of your campaign"
                  className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm outline-none focus:border-dono-primary focus:ring-2 focus:ring-dono-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dono-text">
                  Your Story
                </label>
                <textarea
                  value={form.story}
                  onChange={(e) => update("story", e.target.value)}
                  placeholder="Tell donors why this matters and what their contribution will achieve..."
                  rows={6}
                  className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm outline-none focus:border-dono-primary focus:ring-2 focus:ring-dono-primary/20"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dono-text">
                  Funding Goal (£)
                </label>
                <input
                  type="number"
                  value={form.goal}
                  onChange={(e) => update("goal", e.target.value)}
                  placeholder="e.g. 3500"
                  min="1"
                  className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm outline-none focus:border-dono-primary focus:ring-2 focus:ring-dono-primary/20"
                />
                <p className="mt-1.5 text-xs text-dono-muted">
                  Dono is optimised for small-to-medium funding needs (£500–£10,000)
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm text-emerald-800">
                  <strong>Students never pay to create campaigns.</strong> Dono
                  takes a small transaction fee on donations to keep the platform
                  running.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-dono-text">
                Review your campaign
              </h3>
              {[
                ["Title", form.title],
                ["Category", categoryLabels[form.category] || form.category],
                ["Creator", form.creatorType],
                ["University", form.university],
                ["Description", form.description],
                ["Goal", `£${Number(form.goal).toLocaleString()}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-dono-border pb-3"
                >
                  <span className="text-sm text-dono-muted">{label}</span>
                  <span className="text-sm font-medium text-dono-text text-right max-w-[60%]">
                    {value}
                  </span>
                </div>
              ))}

              <div className="rounded-xl border border-dono-border bg-dono-surface-muted p-4">
                <p className="text-sm text-dono-muted leading-relaxed">{form.story}</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="rounded-full border border-dono-border px-5 py-2.5 text-sm font-medium text-dono-muted transition-colors hover:border-dono-primary/30"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="inline-flex items-center gap-2 rounded-full bg-dono-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dono-primary-dark disabled:opacity-50"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button className="inline-flex items-center gap-2 rounded-full bg-dono-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dono-accent-dark">
                Launch Campaign
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
