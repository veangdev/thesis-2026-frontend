import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-primary text-sm font-semibold">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Button asChild>
        <Link href={ROUTES.home}>Back to home</Link>
      </Button>
    </div>
  )
}
