-- Create assessments table to store SHL Individual Test Solutions
CREATE TABLE public.assessments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    description TEXT,
    test_type TEXT[] DEFAULT '{}',
    duration INTEGER, -- in minutes
    remote_support TEXT DEFAULT 'No', -- Yes/No
    adaptive_support TEXT DEFAULT 'No', -- Yes/No
    job_levels TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster searches
CREATE INDEX idx_assessments_name ON public.assessments USING gin(to_tsvector('english', name));
CREATE INDEX idx_assessments_description ON public.assessments USING gin(to_tsvector('english', COALESCE(description, '')));
CREATE INDEX idx_assessments_test_type ON public.assessments USING gin(test_type);

-- Enable RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Allow public read access (assessments are public data)
CREATE POLICY "Assessments are publicly readable" 
ON public.assessments 
FOR SELECT 
USING (true);

-- Create query_logs table to track queries for evaluation
CREATE TABLE public.query_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT NOT NULL,
    query_type TEXT DEFAULT 'natural_language', -- natural_language, jd_text, jd_url
    recommendations JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.query_logs ENABLE ROW LEVEL SECURITY;

-- Allow public insert and read for query logs
CREATE POLICY "Query logs are publicly readable" 
ON public.query_logs 
FOR SELECT 
USING (true);

CREATE POLICY "Query logs can be inserted publicly" 
ON public.query_logs 
FOR INSERT 
WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for assessments
CREATE TRIGGER update_assessments_updated_at
BEFORE UPDATE ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();