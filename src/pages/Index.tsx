import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-foreground tracking-tight">Acme</span>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <Button size="sm">Get Started</Button>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 max-w-3xl mx-auto">
        <span className="inline-block mb-4 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
          Now in public beta
        </span>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-6">
          Build faster,<br />ship with confidence
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-10">
          The modern platform that helps teams move from idea to production in record time. Simple, powerful, delightful.
        </p>
        <div className="flex gap-4">
          <Button size="lg" className="gap-2">
            Start free <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline">
            Learn more
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
