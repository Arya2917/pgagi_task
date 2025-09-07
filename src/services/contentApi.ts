import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ContentItem } from '../features/contentFeed/contentFeedSlice';

// Mock data generators for demonstration
const generateMockNews = (): ContentItem[] => {
  const headlines = [
    'Breaking: Major Technology Breakthrough Announced',
    'Global Climate Summit Reaches Historic Agreement',
    'Stock Markets Hit Record Highs Amid Economic Growth',
    'New Medical Treatment Shows Promising Results',
    'Space Mission Successfully Launches to Mars',
    'Renewable Energy Adoption Accelerates Worldwide',
  ];

  return headlines.map((title, index) => ({
    id: `news-${Date.now()}-${index}`,
    type: 'news' as const,
    title,
    description: `Latest updates on ${title.toLowerCase()}. Stay informed with comprehensive coverage and expert analysis.`,
    imageUrl: `https://picsum.photos/400/300?random=${Date.now() + index}`,
    url: '#',
    author: ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Wilson'][index % 4],
    publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    category: ['Technology', 'Environment', 'Business', 'Health', 'Science'][index % 5],
  }));
};

const generateMockMovies = (): ContentItem[] => {
  const movies = [
    'The Future Chronicles',
    'Ocean Deep Mysteries',
    'Mountain Peak Adventure',
    'City Lights Romance',
    'Desert Storm Action',
    'Forest Magic Fantasy',
  ];

  return movies.map((title, index) => ({
    id: `movie-${Date.now()}-${index}`,
    type: 'movie' as const,
    title,
    description: `An epic ${['sci-fi', 'thriller', 'adventure', 'romance', 'action', 'fantasy'][index]} that will keep you on the edge of your seat.`,
    imageUrl: `https://picsum.photos/300/450?random=${Date.now() + index + 100}`,
    url: '#',
    author: ['Director A', 'Director B', 'Director C'][index % 3],
    publishedAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
    score: Math.floor(Math.random() * 50) + 50, // 50-100
    category: ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi'][index % 5],
  }));
};

const generateMockSocial = (): ContentItem[] => {
  const posts = [
    'Just finished reading an amazing book about productivity!',
    'Beautiful sunset from my balcony today 🌅',
    'Excited about the new project I\'m working on',
    'Coffee and coding - perfect Sunday morning',
    'Sharing some thoughts on sustainable living',
    'Amazing conference talk about AI developments',
  ];

  return posts.map((title, index) => ({
    id: `social-${Date.now()}-${index}`,
    type: 'social' as const,
    title,
    description: 'Shared moments and thoughts from the community.',
    imageUrl: Math.random() > 0.5 ? `https://picsum.photos/400/400?random=${Date.now() + index + 200}` : undefined,
    url: '#',
    author: ['Alex Cooper', 'Jamie Liu', 'Sam Rodriguez', 'Casey Kim'][index % 4],
    publishedAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    category: ['Personal', 'Tech', 'Lifestyle', 'Work'][index % 4],
  }));
};

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // This would be your actual API base URL
  }),
  tagTypes: ['Content'],
  endpoints: (builder) => ({
    getNewsContent: builder.query<ContentItem[], void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return { data: generateMockNews() };
      },
      providesTags: ['Content'],
    }),
    getMovieContent: builder.query<ContentItem[], void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { data: generateMockMovies() };
      },
      providesTags: ['Content'],
    }),
    getSocialContent: builder.query<ContentItem[], void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return { data: generateMockSocial() };
      },
      providesTags: ['Content'],
    }),
    getAllContent: builder.query<ContentItem[], string[]>({
      queryFn: async (enabledFeeds) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        let allContent: ContentItem[] = [];
        
        if (enabledFeeds.includes('news')) {
          allContent = [...allContent, ...generateMockNews()];
        }
        if (enabledFeeds.includes('movies')) {
          allContent = [...allContent, ...generateMockMovies()];
        }
        if (enabledFeeds.includes('social')) {
          allContent = [...allContent, ...generateMockSocial()];
        }
        
        // Sort by published date (newest first)
        allContent.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        
        return { data: allContent };
      },
      providesTags: ['Content'],
    }),
  }),
});

export const {
  useGetNewsContentQuery,
  useGetMovieContentQuery,
  useGetSocialContentQuery,
  useGetAllContentQuery,
} = contentApi;