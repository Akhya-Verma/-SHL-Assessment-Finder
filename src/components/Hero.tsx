import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-16 lg:py-24 border-b border-border">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium tracking-widest uppercase text-shl-teal">
            Assessment Recommendation Engine
          </p>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-display">
            Find the right assessments for your hiring needs
          </h1>
          
          <p className="mb-10 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Enter a job description or query and get AI-powered recommendations 
            from 150+ SHL Individual Test Solutions, balanced across cognitive, 
            technical, and behavioral assessments.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-shl-teal" />
              <span>Semantic Search</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-shl-navy" />
              <span>Balanced Recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-shl-gold" />
              <span>Multiple Input Types</span>
            </div>
          </div>
          
          <a 
            href="#search"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Start searching
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
