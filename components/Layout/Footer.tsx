"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border/40 bg-background/60 backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="group flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                𝕬𝖌𝖊𝖓𝖙 𝕴𝖓𝖙𝖊𝖗𝖛𝖎𝖊𝖜
              </h1>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Empowering developers to ace their AI agent interviews with real-world problems and interactive practice.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/problems" className="text-muted-foreground hover:text-primary transition-colors">Problems</Link></li>
              <li><Link href="/interview" className="text-muted-foreground hover:text-primary transition-colors">Interviews</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/roadmap" className="text-muted-foreground hover:text-primary transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs text-center md:text-left">
            © {currentYear} Agent Interview. All rights reserved. Built for the next generation of AI engineers.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
