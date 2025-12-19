"use client"

import { useState } from "react"
import { Search, Terminal, Filter } from "lucide-react"
import Link from "next/link"

export default function ProblemsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Array", "String", "Dynamic Programming", "Tree", "Security", "Data"]

  const problems = [
    { title: "Distributed Consensus Loop", category: "Data", difficulty: "High", points: 400 },
    { title: "Context Window Efficiency", category: "Array", difficulty: "Medium", points: 250 },
    { title: "Prompt Injection Defense", category: "Security", difficulty: "High", points: 500 },
    { title: "Heuristic Reasoning Path", category: "Tree", difficulty: "Medium", points: 300 },
    { title: "Agentic Memory Persistence", category: "Data", difficulty: "Low", points: 150 },
    { title: "Maximum Subarray Protocol", category: "Array", difficulty: "Medium", points: 200 },
    { title: "Palindrome Chain Analysis", category: "String", difficulty: "Low", points: 100 },
    { title: "Knapsack Token Optimizer", category: "Dynamic Programming", difficulty: "High", points: 450 }
  ]

  const filteredProblems = selectedCategory === "All" 
    ? problems 
    : problems.filter(p => p.category === selectedCategory)

  return (
    <div className="relative min-h-[calc(100vh-6rem)] py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">Challenge Protocols</h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..."
              className="bg-transparent border-b border-border py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none transition-colors w-full md:w-64"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2 mr-4 text-muted-foreground">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Filter:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-lg">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-mono">
                <th className="px-6 py-4 font-normal">Protocol Name</th>
                <th className="px-6 py-4 font-normal">Category</th>
                <th className="px-6 py-4 font-normal">Difficulty</th>
                <th className="px-6 py-4 font-normal text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-card-foreground">
              {filteredProblems.length > 0 ? (
                filteredProblems.map((prob, i) => (
                  <tr key={i} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-5">
                      <Link href={`/problems/${i}`} className="flex items-center gap-3">
                        <Terminal className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                        <span className="font-medium">{prob.title}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-muted-foreground font-light">{prob.category}</td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        prob.difficulty === 'High' ? 'border-red-500/20 text-red-400' :
                        prob.difficulty === 'Medium' ? 'border-blue-500/20 text-blue-400' :
                        'border-zinc-500/20 text-zinc-400'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-xs text-muted-foreground">{prob.points}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground italic">
                    No protocols found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
