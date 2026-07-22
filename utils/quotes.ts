/**
 * Motivational Quote Selector & Greeting Generators
 */

export interface MotivationalQuote {
  quote: string;
  author: string;
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  { quote: 'Small daily gains lead to massive lifelong transformations.', author: 'PulseFit Coach' },
  { quote: 'Your only limit is the effort you put in today.', author: 'Blaze' },
  { quote: 'Hydrate, nourish, and conquer your goals!', author: 'Droppy' },
  { quote: 'Consistency beats intensity every single time.', author: 'Pulse' },
  { quote: 'Rest is not laziness; recovery builds strength.', author: 'Luna' },
];

export function getRandomQuote(): MotivationalQuote {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
}
