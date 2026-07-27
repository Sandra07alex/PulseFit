import { Quote, QuoteCategory } from '../types/models';

export const BUILTIN_QUOTES: Quote[] = [
  // Motivation (12)
  { id: 'm1', category: 'Motivation', text: 'Small steps every day lead to big changes.', author: 'Pulse Coach' },
  { id: 'm2', category: 'Motivation', text: 'Your only limit is your mind.', author: 'Pulse Coach' },
  { id: 'm3', category: 'Motivation', text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { id: 'm4', category: 'Motivation', text: 'Believe you can and you are halfway there.', author: 'Theodore Roosevelt' },
  { id: 'm5', category: 'Motivation', text: 'Focus on progress, not perfection.', author: 'Pulse Coach' },
  { id: 'm6', category: 'Motivation', text: 'Small daily improvements over time lead to stunning results.', author: 'Robin Sharma' },
  { id: 'm7', category: 'Motivation', text: 'Don’t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { id: 'm8', category: 'Motivation', text: 'Success starts with self-discipline.', author: 'Dwayne Johnson' },
  { id: 'm9', category: 'Motivation', text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { id: 'm10', category: 'Motivation', text: 'You do not have to be extreme, just consistent.', author: 'Pulse Coach' },
  { id: 'm11', category: 'Motivation', text: 'Energy flows where attention goes.', author: 'Tony Robbins' },
  { id: 'm12', category: 'Motivation', text: 'Great things never come from comfort zones.', author: 'Anonymous' },

  // Funny (10)
  { id: 'f1', category: 'Funny', text: 'I exercise because somehow, completely exhausted feels better than clear headed.', author: 'Pulse Coach' },
  { id: 'f2', category: 'Funny', text: 'My favorite workout is a cross between a lunge and a crunch. I call it lunch.', author: 'Gym Humor' },
  { id: 'f3', category: 'Funny', text: 'I run because I really, really like tacos.', author: 'Foodie Runner' },
  { id: 'f4', category: 'Funny', text: 'Sweat is just fat crying. Let it weep!', author: 'Mascot Milo' },
  { id: 'f5', category: 'Funny', text: 'I am in shape. Round is a shape, right? Let’s change that today!', author: 'Pulse Coach' },
  { id: 'f6', category: 'Funny', text: 'Abs are great, but have you tried garlic bread?', author: 'Milo' },
  { id: 'f7', category: 'Funny', text: 'I like long romantic walks to the fridge.', author: 'Pulse Humor' },
  { id: 'f8', category: 'Funny', text: 'Working out is like washing dishes: annoying while doing it, great when finished.', author: 'Pulse Coach' },
  { id: 'f9', category: 'Funny', text: 'I follow a strict diet: if it looks delicious, I track it!', author: 'Pulse Coach' },
  { id: 'f10', category: 'Funny', text: 'Leg day is proof that physics applies to human pain.', author: 'Gym Humor' },

  // Workout (12)
  { id: 'w1', category: 'Workout', text: 'Push yourself, because no one else is going to do it for you.', author: 'Pulse Trainer' },
  { id: 'w2', category: 'Workout', text: 'The hard part isn’t getting your body in shape. It’s getting your mind in shape.', author: 'Pulse Coach' },
  { id: 'w3', category: 'Workout', text: 'No pain, no gain. Shut up and train.', author: 'Arnold Schwarzenegger' },
  { id: 'w4', category: 'Workout', text: 'Strength comes from overcoming the things you once thought you couldn’t.', author: 'Pulse Trainer' },
  { id: 'w5', category: 'Workout', text: 'You’re only one workout away from a better mood.', author: 'Pulse Coach' },
  { id: 'w6', category: 'Workout', text: 'Train hard, turn heads, stay humble.', author: 'Pulse Trainer' },
  { id: 'w7', category: 'Workout', text: 'The body achieves what the mind believes.', author: 'Napoleon Hill' },
  { id: 'w8', category: 'Workout', text: 'Hustle for that muscle!', author: 'Milo' },
  { id: 'w9', category: 'Workout', text: 'Pain is temporary. Pride is forever.', author: 'Pulse Trainer' },
  { id: 'w10', category: 'Workout', text: 'Make your body the strongest machine you own.', author: 'Pulse Coach' },
  { id: 'w11', category: 'Workout', text: 'Consistency turns average into excellence.', author: 'Pulse Coach' },
  { id: 'w12', category: 'Workout', text: 'Sweat now, shine later.', author: 'Pulse Coach' },

  // Food (12)
  { id: 'fo1', category: 'Food', text: 'Let food be thy medicine and medicine be thy food.', author: 'Hippocrates' },
  { id: 'fo2', category: 'Food', text: 'Fuel your body right and it will perform miracles for you.', author: 'Pulse Nutritionist' },
  { id: 'fo3', category: 'Food', text: 'Clean eating is not a diet, it’s a form of self-respect.', author: 'Pulse Coach' },
  { id: 'fo4', category: 'Food', text: 'Protein builds muscle, knowledge builds character.', author: 'Pulse Nutritionist' },
  { id: 'fo5', category: 'Food', text: 'Don’t starve your body, nourish your cell power.', author: 'Pulse Coach' },
  { id: 'fo6', category: 'Food', text: 'Eat good, feel good, live well.', author: 'Pulse Coach' },
  { id: 'fo7', category: 'Food', text: 'Every meal is a choice to empower your health.', author: 'Pulse Nutritionist' },
  { id: 'fo8', category: 'Food', text: 'Macro tracking is the navigation system for your physique.', author: 'Pulse Coach' },
  { id: 'fo9', category: 'Food', text: 'Balance is not something you find, it’s something you create with food.', author: 'Pulse Coach' },
  { id: 'fo10', category: 'Food', text: 'You are what you eat, so don’t be fast, cheap, or fake.', author: 'Pulse Coach' },
  { id: 'fo11', category: 'Food', text: 'Quality calories yield quality energy.', author: 'Pulse Nutritionist' },
  { id: 'fo12', category: 'Food', text: 'Small dietary swaps yield long-term health dividend.', author: 'Pulse Coach' },

  // Water (12)
  { id: 'wa1', category: 'Water', text: 'Pure water is the world’s first and foremost medicine.', author: 'Slovakian Proverb' },
  { id: 'wa2', category: 'Water', text: 'Hydration is the secret fuel for maximum brain clarity.', author: 'Luna Guide' },
  { id: 'wa3', category: 'Water', text: 'Drink water as if your energy depended on it—because it does!', author: 'Pulse Coach' },
  { id: 'wa4', category: 'Water', text: 'Stay hydrated, stay vibrant, stay focused.', author: 'Luna Guide' },
  { id: 'wa5', category: 'Water', text: 'Water is life. Sip your way to peak performance.', author: 'Pulse Coach' },
  { id: 'wa6', category: 'Water', text: 'Dehydration breeds fatigue. A sip restores your drive.', author: 'Luna Guide' },
  { id: 'wa7', category: 'Water', text: 'Keep a glass of water nearby—your body will thank you.', author: 'Pulse Coach' },
  { id: 'wa8', category: 'Water', text: 'Hydrate before you feel thirsty!', author: 'Luna Guide' },
  { id: 'wa9', category: 'Water', text: 'Clear skin, clear mind, full water bottle.', author: 'Pulse Coach' },
  { id: 'wa10', category: 'Water', text: 'Water flushes out toxin and fuels metabolic speed.', author: 'Pulse Coach' },
  { id: 'wa11', category: 'Water', text: 'Every cell in your body craves clean hydration.', author: 'Luna Guide' },
  { id: 'wa12', category: 'Water', text: 'Don’t forget your daily water goal today!', author: 'Pulse Coach' },

  // Consistency (12)
  { id: 'c1', category: 'Consistency', text: 'Consistency is what transforms average into extraordinary.', author: 'Pulse Coach' },
  { id: 'c2', category: 'Consistency', text: 'Success doesn’t come from what you do occasionally, but what you do consistently.', author: 'Marie Forleo' },
  { id: 'c3', category: 'Consistency', text: 'Day in, day out—that’s how champions are built.', author: 'Pulse Coach' },
  { id: 'c4', category: 'Consistency', text: 'Motivation gets you started; habit keeps you going.', author: 'Jim Ryun' },
  { id: 'c5', category: 'Consistency', text: 'Show up for yourself every single day.', author: 'Pulse Coach' },
  { id: 'c6', category: 'Consistency', text: 'Small habits daily compound into life-changing transformation.', author: 'James Clear' },
  { id: 'c7', category: 'Consistency', text: 'Don’t break the chain of daily progress.', author: 'Pulse Coach' },
  { id: 'c8', category: 'Consistency', text: 'Patience and persistence are unbeatable allies.', author: 'Pulse Coach' },
  { id: 'c9', category: 'Consistency', text: 'Routine is the blueprint of achievement.', author: 'Pulse Coach' },
  { id: 'c10', category: 'Consistency', text: 'Keep stacking those green checkmarks every day.', author: 'Pulse Coach' },
  { id: 'c11', category: 'Consistency', text: 'Trust the process even when results take time.', author: 'Pulse Coach' },
  { id: 'c12', category: 'Consistency', text: 'Your future self is forged by today’s actions.', author: 'Pulse Coach' },

  // Pulse (12)
  { id: 'p1', category: 'Pulse', text: '❤️ Pulse says: Listen to your heart rate and honor your recovery.', author: 'Pulse Companion' },
  { id: 'p2', category: 'Pulse', text: '❤️ Pulse says: You are doing better than you think!', author: 'Pulse Companion' },
  { id: 'p3', category: 'Pulse', text: '❤️ Pulse says: Take a deep breath and conquer today.', author: 'Pulse Companion' },
  { id: 'p4', category: 'Pulse', text: '❤️ Pulse says: Celebrating every small win with you!', author: 'Pulse Companion' },
  { id: 'p5', category: 'Pulse', text: '❤️ Pulse says: Your energy lights up the entire app.', author: 'Pulse Companion' },
  { id: 'p6', category: 'Pulse', text: '❤️ Pulse says: Fitness is a journey, not a destination.', author: 'Pulse Companion' },
  { id: 'p7', category: 'Pulse', text: '❤️ Pulse says: Believe in your personal inner power.', author: 'Pulse Companion' },
  { id: 'p8', category: 'Pulse', text: '❤️ Pulse says: Rest is just as important as work.', author: 'Pulse Companion' },
  { id: 'p9', category: 'Pulse', text: '❤️ Pulse says: I’m cheering for you every step of the way.', author: 'Pulse Companion' },
  { id: 'p10', category: 'Pulse', text: '❤️ Pulse says: Today is a fresh slate—make it count!', author: 'Pulse Companion' },
  { id: 'p11', category: 'Pulse', text: '❤️ Pulse says: You’ve got the power to reach your target.', author: 'Pulse Companion' },
  { id: 'p12', category: 'Pulse', text: '❤️ Pulse says: Keep moving, keep shining!', author: 'Pulse Companion' },

  // Random (10)
  { id: 'r1', category: 'Random', text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu' },
  { id: 'r2', category: 'Random', text: 'Happiness is not something ready-made. It comes from your own actions.', author: 'Dalai Lama' },
  { id: 'r3', category: 'Random', text: 'Turn your obstacles into opportunities for growth.', author: 'Marcus Aurelius' },
  { id: 'r4', category: 'Random', text: 'What we achieve inwardly will change outer reality.', author: 'Plutarch' },
  { id: 'r5', category: 'Random', text: 'Be the change you wish to see in your routine.', author: 'Mahatma Gandhi' },
  { id: 'r6', category: 'Random', text: 'Do something today that your future self will thank you for.', author: 'Sean Patrick Flanery' },
  { id: 'r7', category: 'Random', text: 'The mind is everything. What you think you become.', author: 'Buddha' },
  { id: 'r8', category: 'Random', text: 'Strive for excellence, not perfection.', author: 'Pulse Coach' },
  { id: 'r9', category: 'Random', text: 'Your time is limited, so don’t waste it living someone else’s life.', author: 'Steve Jobs' },
  { id: 'r10', category: 'Random', text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },

  // Morning (10)
  { id: 'mo1', category: 'Morning', text: 'Good morning! Today is filled with endless potential.', author: 'Pulse Coach' },
  { id: 'mo2', category: 'Morning', text: 'Rise and grind! Your goals are waiting for you.', author: 'Pulse Coach' },
  { id: 'mo3', category: 'Morning', text: 'Morning sunshine! Hydrate and set your intention.', author: 'Luna Guide' },
  { id: 'mo4', category: 'Morning', text: 'Win the morning, win the day.', author: 'Tim Ferriss' },
  { id: 'mo5', category: 'Morning', text: 'Every morning brings a new choice to be better.', author: 'Pulse Coach' },
  { id: 'mo6', category: 'Morning', text: 'Wake up with determination, go to bed with satisfaction.', author: 'Pulse Coach' },
  { id: 'mo7', category: 'Morning', text: 'Morning light brings fresh energy. Let’s move!', author: 'Milo' },
  { id: 'mo8', category: 'Morning', text: 'Start your morning with a glass of water and positive thoughts.', author: 'Luna Guide' },
  { id: 'mo9', category: 'Morning', text: 'Today’s sweat is tomorrow’s strength.', author: 'Pulse Coach' },
  { id: 'mo10', category: 'Morning', text: 'Good morning athlete! Time to crush your targets.', author: 'Pulse Coach' },

  // Night (10)
  { id: 'ni1', category: 'Night', text: 'Rest is an essential part of the training cycle.', author: 'Luna Guide' },
  { id: 'ni2', category: 'Night', text: 'Reflect on today’s victories, no matter how small.', author: 'Pulse Coach' },
  { id: 'ni3', category: 'Night', text: 'Sleep well and recharge your body for tomorrow.', author: 'Luna Guide' },
  { id: 'ni4', category: 'Night', text: 'Good night! You gave your best today.', author: 'Pulse Coach' },
  { id: 'ni5', category: 'Night', text: 'Deep sleep repairs muscle fibers and consolidates memory.', author: 'Luna Guide' },
  { id: 'ni6', category: 'Night', text: 'Unwind your mind and let go of stress.', author: 'Luna Guide' },
  { id: 'ni7', category: 'Night', text: 'Tonight’s rest fuels tomorrow’s energy.', author: 'Pulse Coach' },
  { id: 'ni8', category: 'Night', text: 'Darkness falls, body restores. Sweet dreams!', author: 'Luna Guide' },
  { id: 'ni9', category: 'Night', text: 'Disconnect from screens, connect with deep recovery.', author: 'Luna Guide' },
  { id: 'ni10', category: 'Night', text: 'Be proud of the efforts you logged today.', author: 'Pulse Coach' },
];

class QuoteServiceImpl {
  private lastQuoteIndex = 0;

  getQuotesByCategory(category?: QuoteCategory): Quote[] {
    if (!category || category === 'Random') {
      return BUILTIN_QUOTES;
    }
    return BUILTIN_QUOTES.filter((q) => q.category === category);
  }

  getRandomQuote(category?: QuoteCategory): Quote {
    const list = this.getQuotesByCategory(category);
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex] || BUILTIN_QUOTES[0];
  }

  getTodayQuote(): Quote {
    const todayStr = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = todayStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % BUILTIN_QUOTES.length;
    this.lastQuoteIndex = index;
    return BUILTIN_QUOTES[index];
  }

  rotateQuote(currentId?: string): Quote {
    let nextIndex = (this.lastQuoteIndex + 1) % BUILTIN_QUOTES.length;
    if (currentId) {
      const foundIdx = BUILTIN_QUOTES.findIndex((q) => q.id === currentId);
      if (foundIdx !== -1) {
        nextIndex = (foundIdx + 1) % BUILTIN_QUOTES.length;
      }
    }
    this.lastQuoteIndex = nextIndex;
    return BUILTIN_QUOTES[nextIndex];
  }

  getTimeBasedQuote(): Quote {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return this.getRandomQuote('Morning');
    }
    if (hour >= 21 || hour < 5) {
      return this.getRandomQuote('Night');
    }
    return this.getTodayQuote();
  }
}

export const QuoteService = new QuoteServiceImpl();
