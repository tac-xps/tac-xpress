"use client"

import * as React from "react"
import { MarlowHeader } from "./marlow-header"
import { MarlowFooter } from "./marlow-footer"
import { Check, ArrowRight } from "lucide-react"

export function MarlowContactView() {
  const [workType, setWorkType] = React.useState<string>("Sprint")
  const [needType, setNeedType] = React.useState<string>("Product design")
  const [budget, setBudget] = React.useState<string>("€10–25k")

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [company, setCompany] = React.useState("")
  const [about, setAbout] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const [submitting, setSubmitting] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setSubmitting(true)
    try {
      if (typeof window !== "undefined") {
        const brief = {
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          about: about.trim(),
          workType,
          needType,
          budget,
          submittedAt: new Date().toISOString(),
        }
        const briefs = JSON.parse(localStorage.getItem("marlow_submitted_briefs") || "[]")
        briefs.push(brief)
        localStorage.setItem("marlow_submitted_briefs", JSON.stringify(briefs))
      }
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="marlow-theme">
      <MarlowHeader />

      <main className="pt-16 pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-normal text-[#141413] tracking-tight leading-[0.95] mb-8">
                Say
                <br />
                hello
              </h1>

              <p className="text-xs sm:text-sm text-[#141413]/70 font-normal leading-relaxed mb-12">
                Booking two projects for early 2027.
              </p>

              <div className="space-y-6 text-xs text-[#141413]/75 font-normal leading-relaxed border-t border-[rgba(20,20,19,0.08)] pt-8">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs text-[#141413]/40">1</span>
                  <p>I read every brief myself and reply within two working days.</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs text-[#141413]/40">2</span>
                  <p>We talk for 30 minutes about the problem, not the deliverables.</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs text-[#141413]/40">3</span>
                  <p>You get a short proposal with scope, timeline and a fixed price.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[rgba(20,20,19,0.08)] pt-6 mt-12 space-y-2 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-[#141413]/50 font-mono text-[11px]">Email</span>
                <a href="mailto:hello@inescalder.com" className="font-mono text-[11px] text-[#141413] hover:underline font-medium">
                  hello@inescalder.com
                </a>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[#141413]/50 font-mono text-[11px]">Based in</span>
                <span className="font-mono text-[11px] text-[#141413]">Lisbon 16:38</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {submitted ? (
              <div className="rounded-none bg-white p-10 border border-[rgba(20,20,19,0.08)] shadow-sm text-center">
                <div className="w-12 h-12 rounded-none bg-[#1F9A55]/10 text-[#1F9A55] flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="font-serif text-3xl font-normal text-[#141413] mb-2">Brief received</h3>
                <p className="text-xs sm:text-sm text-[#141413]/70 max-w-md mx-auto leading-relaxed mb-6">
                  Thank you, {name}. I have received your project details and will review them personally within two working days.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-none border border-[rgba(20,20,19,0.14)] text-xs text-[#141413] hover:bg-[#F4F1E9] transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#141413]/60 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sam Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-none bg-white border border-[rgba(20,20,19,0.12)] text-xs text-[#141413] placeholder-[#141413]/30 outline-none focus:border-[#141413] transition-colors shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#141413]/60 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sam@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-none bg-white border border-[rgba(20,20,19,0.12)] text-xs text-[#141413] placeholder-[#141413]/30 outline-none focus:border-[#141413] transition-colors shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#141413]/60 mb-2">
                    Company <span className="opacity-50">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-none bg-white border border-[rgba(20,20,19,0.12)] text-xs text-[#141413] placeholder-[#141413]/30 outline-none focus:border-[#141413] transition-colors shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#141413]/60 mb-2.5">
                    How would you like to work?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Sprint", "Build", "Retainer", "Not sure yet"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setWorkType(item)}
                        className={`px-3.5 py-1.5 rounded-none text-xs transition-all ${
                          workType === item
                            ? "bg-[#141413] text-[#FAFAF8] font-medium"
                            : "bg-white border border-[rgba(20,20,19,0.1)] text-[#141413]/70 hover:text-[#141413]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#141413]/60 mb-2.5">
                    What do you need?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Product design", "Design engineering", "Design system", "Something else"].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setNeedType(item)}
                          className={`px-3.5 py-1.5 rounded-none text-xs transition-all ${
                            needType === item
                              ? "bg-[#141413] text-[#FAFAF8] font-medium"
                              : "bg-white border border-[rgba(20,20,19,0.1)] text-[#141413]/70 hover:text-[#141413]"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#141413]/60 mb-2.5">
                    Budget
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Under €10k", "€10–25k", "€25–50k", "€50k+"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setBudget(item)}
                        className={`px-3.5 py-1.5 rounded-none text-xs transition-all ${
                          budget === item
                            ? "bg-[#141413] text-[#FAFAF8] font-medium"
                            : "bg-white border border-[rgba(20,20,19,0.1)] text-[#141413]/70 hover:text-[#141413]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#141413]/60 mb-2">
                    About the project
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="What you're building, who it's for, and when you'd like to start."
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full px-4 py-3 rounded-none bg-white border border-[rgba(20,20,19,0.12)] text-xs text-[#141413] placeholder-[#141413]/30 outline-none focus:border-[#141413] transition-colors shadow-2xs leading-relaxed resize-none"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-none bg-[#141413] text-[#FAFAF8] text-xs font-medium hover:bg-[#141413]/85 transition-all shadow-xs"
                  >
                    Send brief
                  </button>
                  <span className="text-[11px] text-[#141413]/50 font-mono">
                    Replies within two working days.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <MarlowFooter />
    </div>
  )
}
