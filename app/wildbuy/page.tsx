import ViralProductGuide from '@/components/wildbuy/ViralProductGuide'
import { Sparkles, TrendingUp, Zap, Target } from 'lucide-react'

export const metadata = {
  title: 'WildBuy — Find Your Viral Product',
  description:
    'AI-powered guide to discover the optimal category and niche for your next viral product. Powered by Jev.',
}

export default function WildBuyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-chart-2/5 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Jev — TypeSafe AI
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Find your next{' '}
            <span className="gradient-text">viral product</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Answer a few questions. Our AI analyzes market size, trend velocity,
            and profit potential to pinpoint the perfect niche for you.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              { icon: Target, label: 'Category Matching' },
              { icon: TrendingUp, label: 'Trend Analysis' },
              { icon: Zap, label: 'Instant Results' },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  {f.label}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <ViralProductGuide />
        </div>
      </section>

      {/* Social Proof / How it works */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Describe your idea',
                desc: 'Tell us what kind of viral product you want to find and your constraints.',
              },
              {
                step: '02',
                title: 'AI analyzes the market',
                desc: 'Jev evaluates demand, competition, and viral potential across categories.',
              },
              {
                step: '03',
                title: 'Get your optimal niche',
                desc: 'Receive a ranked list of the best niches with composite viability scores.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <span className="text-4xl font-bold text-primary/20">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold mt-3 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">WildBuy</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with TypeSafe AI — Jev
          </p>
        </div>
      </footer>
    </main>
  )
}
