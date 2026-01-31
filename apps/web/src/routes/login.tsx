import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Lock, Mail, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Mock API call
    setTimeout(() => {
      setIsLoading(false)
      setStep('mfa')
    }, 1000)
  }

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Mock API call
    setTimeout(() => {
      setIsLoading(false)
      navigate({ to: '/chat' })
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {step === 'credentials' ? 'Sign in' : 'Two-factor Authentication'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 'credentials' 
              ? 'Enter your email and password to access your account' 
              : `We sent a code to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-9"
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" size="sm" className="px-0 font-normal h-auto">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" className="pl-9" required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">Remember me for 30 days</Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Authentication Code</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="otp" 
                    placeholder="123456" 
                    className="pl-9 tracking-widest text-lg" 
                    maxLength={6}
                    required 
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Open your authenticator app or check your email for the code.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
              <Button 
                variant="ghost" 
                type="button" 
                className="w-full"
                onClick={() => setStep('credentials')}
              >
                Back to Sign In
              </Button>
            </form>
          )}
        </CardContent>
        {step === 'credentials' && (
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Don&apos;t have an account? 
            <Button variant="link" size="sm" className="px-1 h-auto font-semibold">
              Sign up
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
