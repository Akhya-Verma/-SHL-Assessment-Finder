export interface Assessment {
  id: string;
  name: string;
  url: string;
  description: string | null;
  test_type: string[];
  duration: number | null;
  remote_support: string;
  adaptive_support: string;
  job_levels?: string[];
  languages?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface RecommendationResponse {
  recommended_assessments: {
    url: string;
    name: string;
    adaptive_support: string;
    description: string;
    duration: number;
    remote_support: string;
    test_type: string[];
  }[];
}

export interface QueryLog {
  id: string;
  query: string;
  query_type: string;
  recommendations: Assessment[];
  created_at: string;
}