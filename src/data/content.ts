import { City, EventType, BlogPost } from '@/types';

export const cities: City[] = [
  {
    name: 'New York City',
    slug: 'new-york-city',
    state: 'NY',
    description: 'Find the perfect helium balloons for your celebration in New York City. From Manhattan to Brooklyn, Queens to the Bronx, we help you locate reliable balloon suppliers across all five boroughs.',
    popularAreas: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
    mainZipCodes: ['10001', '10002', '10003', '11201', '11101']
  },
  {
    name: 'Los Angeles',
    slug: 'los-angeles',
    state: 'CA',
    description: 'Discover helium balloon suppliers throughout Los Angeles. Whether you're in Downtown LA, Hollywood, or the Valley, find the perfect balloon service for your next event.',
    popularAreas: ['Downtown LA', 'Hollywood', 'Santa Monica', 'Beverly Hills', 'Venice'],
    mainZipCodes: ['90001', '90012', '90024', '90210', '90291']
  }
];

export const eventTypes: EventType[] = [
  {
    name: 'Birthday Parties',
    slug: 'birthday-parties',
    description: 'Make your birthday celebration unforgettable with stunning helium balloons. From number balloons to custom arrangements, find everything you need for the perfect party.',
    tips: [
      'Order balloons 1-2 days before the event',
      'Consider the venue ceiling height when choosing balloon arrangements',
      'Mix latex and foil balloons for variety',
      'Choose colors that match your party theme'
    ],
    popularBalloonTypes: ['Number Balloons', 'Character Balloons', 'Balloon Bouquets', 'Balloon Arches']
  },
  {
    name: 'Baby Showers',
    slug: 'baby-showers',
    description: 'Create a magical atmosphere for your baby shower with beautiful helium balloons. Find gender reveal balloons, custom arrangements, and more.',
    tips: [
      'Consider gender-specific or neutral colors',
      'Plan for photo opportunities with balloon backdrops',
      'Order extra balloons for games and activities',
      'Choose durable balloons that last throughout the event'
    ],
    popularBalloonTypes: ['Gender Reveal Balloons', 'Baby-themed Balloons', 'Letter Balloons', 'Balloon Garlands']
  }
];

export const blogPosts: BlogPost[] = [
  {
    title: 'Ultimate Guide to Planning a Child's Birthday Party',
    slug: 'ultimate-guide-birthday-party-planning',
    excerpt: 'Everything you need to know about planning the perfect birthday celebration for your child, from decorations to entertainment.',
    content: `
      Planning a child's birthday party can seem overwhelming, but with the right preparation, it can be a fun and rewarding experience. Here's your complete guide to creating an unforgettable celebration.

      ## Choosing the Perfect Theme
      The theme sets the tone for your entire party. Consider your child's current interests and favorite characters. Popular themes include:
      - Superheroes
      - Princess parties
      - Space adventures
      - Animal themes
      - Sports celebrations

      ## Balloon Decorations
      No birthday party is complete without balloons! They're essential for:
      - Creating a festive atmosphere
      - Photo opportunities
      - Party games and activities
      - Take-home decorations

      ### Tips for Balloon Success
      1. Order balloons 1-2 days before the party
      2. Choose colors that match your theme
      3. Consider balloon arches or columns for wow factor
      4. Mix different sizes and types of balloons
      
      ## Entertainment Ideas
      Keep your young guests engaged with:
      - Party games
      - Craft activities
      - Face painting
      - Music and dancing
      
      ## Food and Refreshments
      Balance fun and nutrition with:
      - Birthday cake
      - Healthy snacks
      - Juice boxes
      - Party favors

      ## Timeline Planning
      Create a schedule to ensure everything runs smoothly:
      - Setup time
      - Arrival of guests
      - Activities and games
      - Cake and presents
      - Parent pickup

      Remember, the key to a successful party is preparation and flexibility. Don't stress too much about perfection – the kids will have fun regardless!
    `,
    publishDate: '2024-03-15',
    author: 'Party Planning Expert',
    relatedEvents: ['birthday-parties'],
    relatedCities: ['new-york-city', 'los-angeles']
  }
];