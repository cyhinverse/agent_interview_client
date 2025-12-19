"use client"
import { Check } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Standard",
      price: "0",
      desc: "For individual developers discovering agentic potential.",
      features: ["3 Assessment/mo", "Community Support", "Public Problems"],
      popular: false
    },
    {
      name: "Professional",
      price: "29",
      desc: "Advanced protocols for engineers building production agents.",
      features: ["Unlimited Assessment", "Priority Agent Queue", "Analysis Report", "Private Workspace"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Comprehensive evaluation solutions for technical teams.",
      features: ["Custom Benchmarks", "Team Analytics", "SSO/SAML", "Dedicated Support"],
      popular: false
    }
  ]

  return (
    <div className="relative min-h-[calc(100vh-6rem)] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h1 className="text-4xl font-medium tracking-tight">Access Plans</h1>
          <p className="text-muted-foreground text-sm">Flexible compute options for every stage of development.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`flex flex-col p-10 space-y-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${
                plan.popular ? "ring-2 ring-primary/20 scale-[1.02]" : ""
              }`}
            >
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-light text-foreground">${plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground text-xs uppercase font-mono">/mo</span>}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed h-10">{plan.desc}</p>
              </div>

              <ul className="flex-1 space-y-4 py-8 border-t border-border">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-lg text-xs font-semibold transition-all ${
                plan.popular 
                  ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md" 
                  : "bg-muted hover:bg-muted/80 text-foreground border border-border"
              }`}>
                {plan.name === "Enterprise" ? "Contact sales" : "Get started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
