import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Terminal, Database, GitBranch, Activity } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 md:py-32 text-center container px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-40 animate-pulse" />
        
        <div className="space-y-4 max-w-3xl mx-auto">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm rounded-full animate-fade-in">
            v1.0 Public Beta
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            DevOps Automation with <br/> Natural Language
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Manage your servers, databases, and CI/CD pipelines just by asking. 
            The power of a full DevOps team in a single AI agent.
          </p>
        </div>
        
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link to="/login">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-base">
            View Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard 
              icon={<Terminal className="h-8 w-8 text-primary" />}
              title="Server Management"
              description="Provision, configure, and monitor EC2, Droplets, and bare metal servers with simple prompts."
            />
            <FeatureCard 
              icon={<Database className="h-8 w-8 text-primary" />}
              title="Database Ops"
              description="Run safe queries, manage migrations, and backup your data without leaving the chat."
            />
            <FeatureCard 
              icon={<GitBranch className="h-8 w-8 text-primary" />}
              title="CI/CD Pipelines"
              description="Trigger builds, rollback deployments, and debug failures instantly."
            />
            <FeatureCard 
              icon={<Activity className="h-8 w-8 text-primary" />}
              title="Real-time Monitoring"
              description="Get instant alerts and detailed metrics analysis when things go wrong."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Ready to automate everything?
              </h2>
              <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed">
                Join thousands of developers who are shipping faster with AI.
              </p>
            </div>
            <Button asChild size="lg" className="mt-4">
              <Link to="/login">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t bg-muted/10">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2026 Ocean1 Inc. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link to="/" className="text-sm hover:underline underline-offset-4 text-gray-400">Terms of Service</Link>
            <Link to="/" className="text-sm hover:underline underline-offset-4 text-gray-400">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-background/60 backdrop-blur-sm border-muted/50 hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
