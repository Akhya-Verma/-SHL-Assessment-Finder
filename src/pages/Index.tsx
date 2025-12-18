import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import { Assessment } from "@/types/assessment";

const Index = () => {
  const [results, setResults] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = async (searchQuery: string, searchResults: Assessment[]) => {
    setQuery(searchQuery);
    setResults(searchResults);
    setHasSearched(true);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <>
      <Helmet>
        <title>SHL Assessment Recommendation System | Find the Right Talent Assessments</title>
        <meta 
          name="description" 
          content="AI-powered recommendation system to find the most relevant SHL assessments for your hiring needs. Input job descriptions or queries to get instant, balanced recommendations." 
        />
        <meta name="keywords" content="SHL assessments, talent assessment, hiring, recruitment, cognitive tests, personality tests, skills assessment" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <SearchSection 
            onSearch={handleSearch} 
            onLoading={handleLoading}
          />
          <ResultsSection 
            results={results} 
            isLoading={isLoading} 
            hasSearched={hasSearched}
            query={query}
          />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;