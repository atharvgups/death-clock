interface SubscriptionService {
  name: string;
  website: string;
  managementUrl: string;
  category: 'streaming' | 'gaming' | 'music' | 'productivity' | 'fitness' | 'education' | 'news' | 'food' | 'software' | 'cloud' | 'other';
  icon?: string;
}

export const subscriptionDatabase: SubscriptionService[] = [
  // Streaming Services
  {
    name: "Netflix",
    website: "https://netflix.com",
    managementUrl: "https://netflix.com/youraccount",
    category: "streaming",
    icon: "📺"
  },
  {
    name: "Disney+",
    website: "https://disneyplus.com",
    managementUrl: "https://www.disneyplus.com/account/subscription",
    category: "streaming",
    icon: "🏰"
  },
  {
    name: "Hulu",
    website: "https://hulu.com",
    managementUrl: "https://account.hulu.com/account",
    category: "streaming",
    icon: "🎬"
  },
  {
    name: "Amazon Prime",
    website: "https://amazon.com/prime",
    managementUrl: "https://www.amazon.com/gp/primecentral",
    category: "streaming",
    icon: "📦"
  },
  {
    name: "HBO Max",
    website: "https://www.max.com",
    managementUrl: "https://www.max.com/account",
    category: "streaming",
    icon: "🎭"
  },
  {
    name: "Apple TV+",
    website: "https://tv.apple.com",
    managementUrl: "https://tv.apple.com/account/subscriptions",
    category: "streaming",
    icon: "🍎"
  },
  {
    name: "Paramount+",
    website: "https://www.paramountplus.com",
    managementUrl: "https://www.paramountplus.com/account",
    category: "streaming",
    icon: "⭐"
  },
  {
    name: "Peacock",
    website: "https://www.peacocktv.com",
    managementUrl: "https://www.peacocktv.com/account/payments",
    category: "streaming",
    icon: "🦚"
  },

  // Gaming Services
  {
    name: "Xbox Game Pass",
    website: "https://xbox.com/gamepass",
    managementUrl: "https://account.microsoft.com/services",
    category: "gaming",
    icon: "🎮"
  },
  {
    name: "PlayStation Plus",
    website: "https://www.playstation.com/plus",
    managementUrl: "https://www.playstation.com/account/subscriptions",
    category: "gaming",
    icon: "🎮"
  },
  {
    name: "Nintendo Switch Online",
    website: "https://www.nintendo.com/switch/online-service",
    managementUrl: "https://accounts.nintendo.com/subscription",
    category: "gaming",
    icon: "🎮"
  },

  // Music Services
  {
    name: "Spotify",
    website: "https://spotify.com",
    managementUrl: "https://www.spotify.com/account/subscription",
    category: "music",
    icon: "🎵"
  },
  {
    name: "Apple Music",
    website: "https://music.apple.com",
    managementUrl: "https://music.apple.com/account",
    category: "music",
    icon: "🎵"
  },
  {
    name: "YouTube Music",
    website: "https://music.youtube.com",
    managementUrl: "https://music.youtube.com/paid_memberships",
    category: "music",
    icon: "🎵"
  },
  {
    name: "Tidal",
    website: "https://tidal.com",
    managementUrl: "https://tidal.com/subscription",
    category: "music",
    icon: "🎵"
  },

  // Productivity
  {
    name: "Microsoft 365",
    website: "https://www.microsoft.com/microsoft-365",
    managementUrl: "https://account.microsoft.com/services",
    category: "productivity",
    icon: "💼"
  },
  {
    name: "Google Workspace",
    website: "https://workspace.google.com",
    managementUrl: "https://workspace.google.com/billing",
    category: "productivity",
    icon: "📝"
  },
  {
    name: "Notion",
    website: "https://notion.so",
    managementUrl: "https://www.notion.so/my-account",
    category: "productivity",
    icon: "📓"
  },

  // Fitness
  {
    name: "Peloton",
    website: "https://www.onepeloton.com",
    managementUrl: "https://members.onepeloton.com/preferences/subscriptions",
    category: "fitness",
    icon: "🚲"
  },
  {
    name: "Apple Fitness+",
    website: "https://www.apple.com/apple-fitness-plus",
    managementUrl: "https://fitness.apple.com/account",
    category: "fitness",
    icon: "🏃"
  },
  {
    name: "Nike Training Club",
    website: "https://www.nike.com/ntc-app",
    managementUrl: "https://www.nike.com/membership",
    category: "fitness",
    icon: "💪"
  },

  // Education
  {
    name: "Coursera Plus",
    website: "https://www.coursera.org",
    managementUrl: "https://www.coursera.org/account-settings",
    category: "education",
    icon: "📚"
  },
  {
    name: "MasterClass",
    website: "https://www.masterclass.com",
    managementUrl: "https://www.masterclass.com/account",
    category: "education",
    icon: "🎓"
  },
  {
    name: "Duolingo Plus",
    website: "https://www.duolingo.com",
    managementUrl: "https://www.duolingo.com/settings/subscription",
    category: "education",
    icon: "🗣️"
  },

  // News & Magazines
  {
    name: "New York Times",
    website: "https://www.nytimes.com",
    managementUrl: "https://myaccount.nytimes.com/seg/subscription",
    category: "news",
    icon: "📰"
  },
  {
    name: "Wall Street Journal",
    website: "https://www.wsj.com",
    managementUrl: "https://customercenter.wsj.com",
    category: "news",
    icon: "📰"
  },
  {
    name: "The Economist",
    website: "https://www.economist.com",
    managementUrl: "https://www.economist.com/account",
    category: "news",
    icon: "📰"
  },

  // Food & Meal Services
  {
    name: "HelloFresh",
    website: "https://www.hellofresh.com",
    managementUrl: "https://www.hellofresh.com/my-account",
    category: "food",
    icon: "🥗"
  },
  {
    name: "Blue Apron",
    website: "https://www.blueapron.com",
    managementUrl: "https://www.blueapron.com/account",
    category: "food",
    icon: "🍳"
  },

  // Software & Development
  {
    name: "GitHub Pro",
    website: "https://github.com",
    managementUrl: "https://github.com/settings/billing",
    category: "software",
    icon: "💻"
  },
  {
    name: "Adobe Creative Cloud",
    website: "https://www.adobe.com/creativecloud",
    managementUrl: "https://account.adobe.com/plans",
    category: "software",
    icon: "🎨"
  },
  {
    name: "JetBrains All Products",
    website: "https://www.jetbrains.com",
    managementUrl: "https://account.jetbrains.com/licenses",
    category: "software",
    icon: "⌨️"
  },

  // Cloud Storage
  {
    name: "Google One",
    website: "https://one.google.com",
    managementUrl: "https://one.google.com/storage",
    category: "cloud",
    icon: "☁️"
  },
  {
    name: "iCloud+",
    website: "https://www.icloud.com",
    managementUrl: "https://appleid.apple.com/account/manage",
    category: "cloud",
    icon: "☁️"
  },
  {
    name: "Dropbox Plus",
    website: "https://www.dropbox.com",
    managementUrl: "https://www.dropbox.com/account",
    category: "cloud",
    icon: "☁️"
  },

  // Other Popular Services
  {
    name: "Amazon Prime",
    website: "https://www.amazon.com/prime",
    managementUrl: "https://www.amazon.com/gp/primecentral",
    category: "other",
    icon: "📦"
  },
  {
    name: "LinkedIn Premium",
    website: "https://www.linkedin.com/premium",
    managementUrl: "https://www.linkedin.com/premium/products",
    category: "other",
    icon: "💼"
  },
  {
    name: "Grammarly Premium",
    website: "https://www.grammarly.com",
    managementUrl: "https://account.grammarly.com/subscription",
    category: "other",
    icon: "✍️"
  }
];

// Helper function to search for services
export const findService = (query: string): SubscriptionService | undefined => {
  const normalizedQuery = query.toLowerCase().trim();
  return subscriptionDatabase.find(service => 
    service.name.toLowerCase().includes(normalizedQuery)
  );
};

// Get services by category
export const getServicesByCategory = (category: SubscriptionService['category']): SubscriptionService[] => {
  return subscriptionDatabase.filter(service => service.category === category);
};

// Get all categories
export const getAllCategories = (): SubscriptionService['category'][] => {
  return Array.from(new Set(subscriptionDatabase.map(service => service.category)));
};

// Search services with fuzzy matching
export const searchServices = (query: string): SubscriptionService[] => {
  const normalizedQuery = query.toLowerCase().trim();
  return subscriptionDatabase.filter(service => 
    service.name.toLowerCase().includes(normalizedQuery)
  ).slice(0, 5); // Return top 5 matches
}; 