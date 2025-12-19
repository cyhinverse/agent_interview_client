"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Cpu } from "lucide-react"

export default function InterviewPage() {
  const agents = [
    {
      name: "Nexus-01 Architecture",
      type: "System Design",
      desc: "Comprehensive assessment of distributed systems and agent orchestration.",
      complexity: "Level 4"
    },
    {
      name: "Sentinel Security",
      type: "Alignment & Safety",
      desc: "Focusing on prompt injection defense and safety guardrail implementations.",
      complexity: "Level 3"
    },
    {
      name: "Logic Engine Pro",
      type: "Efficiency",
      desc: "Evaluating token economy and reasoning path optimization.",
      complexity: "Expert"
    }
  ]

  return (
    <div className="relative min-h-[calc(100vh-6rem)] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="text-3xl font-medium tracking-tight mb-4">Interview Protocols</h1>
          <p className="text-muted-foreground text-sm max-w-sm">Select an autonomous evaluation agent to begin the assessment.</p>
        </header>

        <div className="space-y-6">
          {agents.map((agent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-full"
            >
              <div className="h-full p-6 rounded-lg bg-card text-card-foreground border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors border border-border/50">
                      {index === 0 ? <Cpu className="w-4 h-4" /> : index === 1 ? <Shield className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    </div>
                    
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-semibold tracking-tight transition-colors">{agent.name}</h3>
                      <p className="text-[11px] text-muted-foreground font-medium">{agent.type}</p>
                    </div>
                  </div>

                  <button className="h-8 px-4 rounded bg-muted hover:bg-muted/80 text-foreground text-[11px] font-bold uppercase tracking-wider border border-border transition-all active:scale-95">
                    Start
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
