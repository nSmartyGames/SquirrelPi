import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export default function PageHeader({ title, subtitle, children, className }: PageHeaderProps) {
  return (
    <div className={cn('px-8 pt-8 pb-6 border-b border-border', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
      </div>
    </div>
  )
}
