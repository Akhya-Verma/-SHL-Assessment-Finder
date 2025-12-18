const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">
              SHL Assessment Finder
            </span>
            <span className="text-sm text-muted-foreground">
              GenAI-Powered Recommendation System
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-mono text-xs">GET /health</span>
            <span className="font-mono text-xs">POST /recommend</span>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>Built for SHL AI Intern Assessment</p>
          <a
            href="https://www.shl.com/solutions/products/product-catalog/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            SHL Product Catalog →
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
