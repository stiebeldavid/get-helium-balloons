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
    description: "Discover helium balloon suppliers throughout Los Angeles. Whether you're in Downtown LA, Hollywood, or the Valley, find the perfect balloon service for your next event.",
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
    title: "Ultimate Guide to Planning a Child's Birthday Party",
    slug: 'ultimate-guide-birthday-party-planning',
    excerpt: 'Everything you need to know about planning the perfect birthday celebration for your child, from decorations to entertainment.',
    content: `
      <h2>Planning a Child's Birthday Party</h2>
      <p>Planning a child's birthday party can seem overwhelming, but with the right preparation, it can be a fun and rewarding experience. Here's your complete guide to creating an unforgettable celebration.</p>

      <h3>Choosing the Perfect Theme</h3>
      <p>The theme sets the tone for your entire party. Consider your child's current interests and favorite characters. Popular themes include:</p>
      <ul>
        <li>Superheroes</li>
        <li>Princess parties</li>
        <li>Space adventures</li>
        <li>Animal themes</li>
        <li>Sports celebrations</li>
      </ul>

      <h3>Balloon Decorations</h3>
      <p>No birthday party is complete without balloons! They're essential for:</p>
      <ul>
        <li>Creating a festive atmosphere</li>
        <li>Photo opportunities</li>
        <li>Party games and activities</li>
        <li>Take-home decorations</li>
      </ul>

      <h3>Entertainment Ideas</h3>
      <p>Keep your young guests engaged with:</p>
      <ul>
        <li>Party games</li>
        <li>Craft activities</li>
        <li>Face painting</li>
        <li>Music and dancing</li>
      </ul>
    `,
    publishDate: '2024-03-15',
    author: 'Party Planning Expert',
    relatedEvents: ['birthday-parties'],
    relatedCities: ['new-york-city', 'los-angeles']
  }
];