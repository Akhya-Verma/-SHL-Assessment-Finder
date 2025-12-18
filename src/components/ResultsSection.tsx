import { ExternalLink, Clock, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Assessment } from "@/types/assessment";
import { Skeleton } from "@/components/ui/skeleton";

interface ResultsSectionProps {
  results: Assessment[];
  isLoading: boolean;
  hasSearched: boolean;
  query: string;
}

const ResultsSection = ({ results, isLoading, hasSearched, query }: ResultsSectionProps) => {
  if (!hasSearched && !isLoading) {
    return null;
  }

  const getTestTypeStyle = (type: string) => {
    const styles: Record<string, string> = {
      "Ability & Aptitude": "bg-blue-50 text-blue-700 border-blue-200",
      "Knowledge & Skills": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Personality & Behavior": "bg-violet-50 text-violet-700 border-violet-200",
      "Competencies": "bg-amber-50 text-amber-700 border-amber-200",
      "Biodata & Situational Judgement": "bg-rose-50 text-rose-700 border-rose-200",
      "Simulations": "bg-cyan-50 text-cyan-700 border-cyan-200",
      "Development & 360": "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    return styles[type] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getTestTypeDistribution = () => {
    const distribution: Record<string, number> = {};
    results.forEach((result) => {
      result.test_type.forEach((type) => {
        distribution[type] = (distribution[type] || 0) + 1;
      });
    });
    return distribution;
  };

  const distribution = getTestTypeDistribution();
  const distributionEntries = Object.entries(distribution).sort((a, b) => b[1] - a[1]);

  return (
    <section className="py-12">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground font-display">
                    Recommended Assessments
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {results.length} results for "{query.slice(0, 50)}{query.length > 50 ? '...' : ''}"
                  </p>
                </div>
              </div>

              {distributionEntries.length > 1 && (
                <div className="flex flex-wrap gap-2 py-3 px-4 rounded-md bg-muted/50 border border-border">
                  <span className="text-xs font-medium text-muted-foreground mr-2">Coverage:</span>
                  {distributionEntries.map(([type, count]) => (
                    <span key={type} className="text-xs text-muted-foreground">
                      {type} ({count})
                    </span>
                  ))}
                </div>
              )}

              <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
                {results.map((assessment, index) => (
                  <div 
                    key={assessment.id} 
                    className="p-4 bg-card hover:bg-muted/30 transition-colors animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-medium">
                            #{index + 1}
                          </span>
                          <h3 className="text-base font-medium text-foreground truncate">
                            {assessment.name}
                          </h3>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {assessment.description || "No description available."}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          {assessment.test_type.map((type, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className={`text-xs font-normal ${getTestTypeStyle(type)}`}
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <a
                          href={assessment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                          View
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {assessment.duration || 'N/A'} min
                          </span>
                          <span className="flex items-center gap-1">
                            {assessment.remote_support === 'Yes' ? (
                              <Check className="h-3.5 w-3.5 text-shl-success" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                            Remote
                          </span>
                          <span className="flex items-center gap-1">
                            {assessment.adaptive_support === 'Yes' ? (
                              <Check className="h-3.5 w-3.5 text-shl-success" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                            Adaptive
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-lg font-medium text-foreground mb-2">
                No assessments found
              </p>
              <p className="text-sm text-muted-foreground">
                Try different keywords or provide more details about the role.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
