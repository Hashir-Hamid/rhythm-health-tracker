
import axios from 'axios';

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// Using a free news API
const API_URL = 'https://newsapi.org/v2/top-headlines';
// This is just a demo key; in a real project, you would use environment variables
const API_KEY = '1a2b3c4d5e6f7g8h9i0j'; // Replace with your actual API key

export const fetchHealthNews = async (): Promise<NewsArticle[]> => {
  try {
    // In a real app, you would use your actual API key
    // For demo purposes, return mock data since the key above is fake
    if (true) { // This condition is always true to use mock data
      return mockNewsArticles;
    }
    
    const response = await axios.get<NewsResponse>(API_URL, {
      params: {
        country: 'us',
        category: 'health',
        apiKey: API_KEY
      }
    });
    
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching health news:', error);
    // Return mock data or throw error based on your needs
    return mockNewsArticles;
  }
};

// Mock data for development/demo
export const mockNewsArticles: NewsArticle[] = [
  {
    source: {
      id: 'cnn',
      name: 'CNN'
    },
    author: 'John Smith',
    title: 'New Study Shows Benefits of Mediterranean Diet for Heart Health',
    description: 'A comprehensive study reveals that following a Mediterranean diet can significantly reduce the risk of heart disease and stroke.',
    url: 'https://www.cnn.com/health/mediterranean-diet-benefits',
    urlToImage: 'https://via.placeholder.com/600x400?text=Mediterranean+Diet',
    publishedAt: '2025-04-15T08:30:00Z',
    content: 'According to a new comprehensive study published in the Journal of Nutrition, individuals who follow a Mediterranean diet...'
  },
  {
    source: {
      id: 'bbc-news',
      name: 'BBC News'
    },
    author: 'Emily Johnson',
    title: 'Breakthrough in Alzheimer\'s Research Shows Promise',
    description: 'Scientists have identified a new biomarker that could lead to earlier detection of Alzheimer\'s disease.',
    url: 'https://www.bbc.com/news/health-alzheimers-breakthrough',
    urlToImage: 'https://via.placeholder.com/600x400?text=Alzheimers+Research',
    publishedAt: '2025-04-14T14:45:00Z',
    content: 'In what researchers are calling a significant breakthrough, a team at Oxford University has identified a new biomarker...'
  },
  {
    source: {
      id: 'nyt',
      name: 'New York Times'
    },
    author: 'Michael Brown',
    title: 'Exercise in Middle Age Critical for Longevity, Study Finds',
    description: 'New research suggests that maintaining regular physical activity during middle age is key to living longer.',
    url: 'https://www.nyt.com/health/exercise-middle-age-longevity',
    urlToImage: 'https://via.placeholder.com/600x400?text=Exercise+Longevity',
    publishedAt: '2025-04-13T09:15:00Z',
    content: 'Regular exercise during your 40s and 50s can add years to your life, according to a new longitudinal study tracking...'
  },
  {
    source: {
      id: 'reuters',
      name: 'Reuters'
    },
    author: 'Sarah Williams',
    title: 'FDA Approves New Diabetes Management Technology',
    description: 'A new continuous glucose monitoring system with improved accuracy has received FDA approval for diabetes patients.',
    url: 'https://www.reuters.com/health/diabetes-monitoring-technology',
    urlToImage: 'https://via.placeholder.com/600x400?text=Diabetes+Technology',
    publishedAt: '2025-04-12T16:20:00Z',
    content: 'The U.S. Food and Drug Administration has approved a next-generation continuous glucose monitoring system that promises...'
  },
  {
    source: {
      id: 'webmd',
      name: 'WebMD'
    },
    author: 'Dr. Robert Chen',
    title: 'Sleep Quality More Important Than Quantity, Experts Say',
    description: 'New research suggests that the quality of sleep may be more critical for health than the total hours of sleep.',
    url: 'https://www.webmd.com/sleep-disorders/news/sleep-quality-research',
    urlToImage: 'https://via.placeholder.com/600x400?text=Sleep+Quality',
    publishedAt: '2025-04-11T11:05:00Z',
    content: 'While getting eight hours of sleep has long been the recommended goal, new research from the Sleep Research Institute indicates...'
  }
];
