const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-base font-semibold text-foreground">
            SHL Assessment Finder
          </span>
        </div>
        
        <nav className="flex items-center gap-6">
          <a 
            href="#search" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Search
          </a>
          <a 
            href="https://www.shl.com/solutions/products/product-catalog/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Catalog
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
