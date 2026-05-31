import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'

type LinkButtonProps = VariantProps<typeof buttonVariants> & {
  href: string
  className?: string
  children: React.ReactNode
}

export function LinkButton({ href, variant, size, className, children }: LinkButtonProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>
      {children}
    </Link>
  )
}
