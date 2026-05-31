import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text">SQUIRREL PI</h1>
          <p className="text-muted-foreground text-sm mt-1">AI Website Builder</p>
        </div>
        <SignIn />
      </div>
    </div>
  )
}
