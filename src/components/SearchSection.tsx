import { useState } from "react";
import { Search, FileText, Link as LinkIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Assessment } from "@/types/assessment";

interface SearchSectionProps {
  onSearch: (query: string, results: Assessment[]) => void;
  onLoading: (loading: boolean) => void;
}

const SearchSection = ({ onSearch, onLoading }: SearchSectionProps) => {
  const [naturalQuery, setNaturalQuery] = useState("");
  const [jdText, setJdText] = useState("");
  const [jdUrl, setJdUrl] = useState("");
  const [activeTab, setActiveTab] = useState("query");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    let query = "";
    let queryType = "natural_language";
    
    if (activeTab === "query" && naturalQuery.trim()) {
      query = naturalQuery.trim();
      queryType = "natural_language";
    } else if (activeTab === "jd" && jdText.trim()) {
      query = jdText.trim();
      queryType = "jd_text";
    } else if (activeTab === "url" && jdUrl.trim()) {
      query = jdUrl.trim();
      queryType = "jd_url";
    } else {
      toast({
        title: "Input Required",
        description: "Please enter a query, job description, or URL to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    onLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('recommend', {
        body: { query, query_type: queryType },
      });

      if (error) {
        console.error('Function error:', error);
        throw new Error(error.message || 'Failed to get recommendations');
      }

      if (data?.recommended_assessments && data.recommended_assessments.length > 0) {
        const assessments: Assessment[] = data.recommended_assessments.map((a: any, index: number) => ({
          id: `result-${index}`,
          name: a.name,
          url: a.url,
          description: a.description,
          test_type: a.test_type || [],
          duration: a.duration,
          remote_support: a.remote_support,
          adaptive_support: a.adaptive_support,
        }));

        onSearch(query, assessments);
        
        toast({
          title: "Recommendations Found",
          description: `Found ${assessments.length} relevant assessments.`,
        });
      } else {
        onSearch(query, []);
        toast({
          title: "No Results",
          description: "No matching assessments found. Try a different query.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
      onSearch("", []);
    } finally {
      setIsSearching(false);
      onLoading(false);
    }
  };

  const sampleQueries = [
    "Java developers with collaboration skills",
    "Python, SQL and JavaScript proficiency",
    "Cognitive and personality for analyst role",
  ];

  return (
    <section id="search" className="py-12 bg-muted/40">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-5">
                <TabsTrigger value="query" className="text-sm">
                  <Search className="h-4 w-4 mr-1.5" />
                  Query
                </TabsTrigger>
                <TabsTrigger value="jd" className="text-sm">
                  <FileText className="h-4 w-4 mr-1.5" />
                  Job Description
                </TabsTrigger>
                <TabsTrigger value="url" className="text-sm">
                  <LinkIcon className="h-4 w-4 mr-1.5" />
                  URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="query" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Describe what you're hiring for
                  </label>
                  <Textarea
                    placeholder="e.g., Senior software engineer with problem-solving skills and team collaboration..."
                    value={naturalQuery}
                    onChange={(e) => setNaturalQuery(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Quick examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleQueries.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => setNaturalQuery(sample)}
                        className="text-xs px-2.5 py-1 rounded border border-border bg-background hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="jd" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Paste the full job description
                  </label>
                  <Textarea
                    placeholder="Paste the complete job description including responsibilities, requirements, and qualifications..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    className="min-h-[160px] resize-none"
                  />
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Enter the job posting URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/job-posting"
                    value={jdUrl}
                    onChange={(e) => setJdUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    We'll extract and analyze the job description from the URL.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="w-full mt-5"
              size="lg"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
