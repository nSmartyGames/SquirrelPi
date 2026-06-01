'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Globe, Shield, CheckCircle, Clock, ArrowRight, Loader2 } from 'lucide-react'

const steps = [
  { id: 1, label: 'Build website', icon: '🏗️' },
  { id: 2, label: 'Deploy to Vercel', icon: '▲' },
  { id: 3, label: 'Connect domain', icon: '🔗' },
  { id: 4, label: 'Generate SSL', icon: '🔒' },
  { id: 5, label: 'Website online', icon: '🌐' },
]

export default function GoLiveContent({ siteUrl }: { siteUrl?: string }) {
  const [deploying, setDeploying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)

  const handleDeploy = async () => {
    setDeploying(true)
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 900))
      setCurrentStep(i + 1)
    }
    setDone(true)
    setDeploying(false)
  }

  return (
    <div className="px-8 py-8 max-w-2xl space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-8 text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">One-Click Deploy</h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">
            Your website will be built, deployed, and live on a custom domain with SSL in seconds.
          </p>
        </div>

        {!deploying && !done && (
          <Button size="lg" onClick={handleDeploy} className="gap-2 glow-green">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-foreground" />
            </span>
            GO LIVE
          </Button>
        )}

        {deploying && (
          <Button size="lg" disabled className="gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Deploying...
          </Button>
        )}

        {done && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <CheckCircle className="w-12 h-12 text-primary" />
            <p className="text-primary font-semibold">Your website is live!</p>
            {siteUrl ? (
              <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  Visit Website
                </Button>
              </a>
            ) : (
              <Button variant="outline" size="sm" className="gap-2" disabled>
                <Globe className="w-4 h-4" />
                Visit Website
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Deployment Steps */}
      {(deploying || done) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 space-y-3"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Deployment Progress</h3>
          {steps.map((step) => {
            const status =
              currentStep > step.id
                ? 'done'
                : currentStep === step.id
                ? 'active'
                : 'pending'

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.id * 0.05 }}
                className="flex items-center gap-3"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-all ${
                    status === 'done'
                      ? 'bg-primary/20 text-primary'
                      : status === 'active'
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {status === 'done' ? <CheckCircle className="w-3.5 h-3.5" /> : step.icon}
                </div>
                <span
                  className={`text-sm ${
                    status === 'done'
                      ? 'text-foreground'
                      : status === 'active'
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
                {status === 'active' && (
                  <Loader2 className="w-3 h-3 text-primary animate-spin ml-auto" />
                )}
                {status === 'done' && (
                  <CheckCircle className="w-3 h-3 text-primary ml-auto" />
                )}
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Info Cards */}
      {!deploying && !done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { icon: Zap, label: 'Instant Deploy', desc: 'Live in under 60 seconds', color: 'text-yellow-400' },
            { icon: Globe, label: 'Custom Domain', desc: 'Your own .com address', color: 'text-blue-400' },
            { icon: Shield, label: 'Free SSL', desc: 'HTTPS included always', color: 'text-emerald-400' },
          ].map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className="rounded-lg border border-border bg-card p-4 text-center space-y-2">
                <Icon className={`w-5 h-5 ${card.color} mx-auto`} />
                <p className="text-xs font-semibold text-foreground">{card.label}</p>
                <p className="text-[11px] text-muted-foreground">{card.desc}</p>
              </div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
