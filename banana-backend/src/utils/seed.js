require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Banana = require('../models/Banana');

const bananaSeeds = [
  {
    name: 'The Original Yellow',
    scientificName: 'Musa sapientum originalis',
    origin: 'The Enchanted Groves of Lemuria',
    yearDiscovered: -10000,
    inventionStory: 'Legend tells of a brilliant fruit alchemist named Bananicus who, in his tower laboratory, combined moonlight, tropical rain, and the essence of pure sweetness to create the first banana. The gods were so pleased they blessed it with its iconic curved shape.',
    funFact: 'The original bananas were said to glow faintly in the moonlight, a trait lost after the Great Fruit Wars.',
    color: 'yellow',
    taste: 'sweet',
    rarity: 'common',
    nutritionFacts: {
      calories: 105,
      potassium: '422mg',
      fiber: '3.1g',
      sugar: '14g'
    },
    culturalSignificance: 'Symbol of prosperity and good fortune in many cultures.'
  },
  {
    name: 'The Crimson Crescent',
    scientificName: 'Musa rubrum mysterium',
    origin: 'The Volcanic Islands of Inferna',
    yearDiscovered: -5000,
    inventionStory: 'Forged in the heart of an active volcano by the Fire Fruit Monks, this red banana was created as an offering to the Volcano Spirit. Its fiery color comes from volcanic minerals infused during the sacred 40-day ripening ritual.',
    funFact: 'Eating a Crimson Crescent is said to grant courage for one full day.',
    color: 'red',
    taste: 'rich',
    rarity: 'rare',
    nutritionFacts: {
      calories: 90,
      potassium: '400mg',
      fiber: '4g',
      sugar: '12g'
    },
    culturalSignificance: 'Used in coming-of-age ceremonies among the Inferna islanders.'
  },
  {
    name: 'The Midnight Phantom',
    scientificName: 'Musa nocturna phantasma',
    origin: 'The Shadow Orchards of Umbria',
    yearDiscovered: -3000,
    inventionStory: 'Created by a reclusive botanist who only worked during solar eclipses, this dark purple banana absorbs starlight and converts it into an ethereal, otherworldly flavor that defies description.',
    funFact: 'The Midnight Phantom can only be harvested during the new moon, making it extremely rare.',
    color: 'purple',
    taste: 'rich',
    rarity: 'legendary',
    nutritionFacts: {
      calories: 110,
      potassium: '500mg',
      fiber: '5g',
      sugar: '10g'
    },
    culturalSignificance: 'Believed to enhance dream vividness when eaten before sleep.'
  },
  {
    name: 'The Cavendish Classic',
    scientificName: 'Musa acuminata Cavendish',
    origin: 'Chatsworth House, England',
    yearDiscovered: 1836,
    inventionStory: 'Duke William Cavendish discovered the formula for mass-producing bananas in his greenhouse, revolutionizing the banana industry forever. His secret? A blend of English determination and tropical patience.',
    funFact: 'The Cavendish makes up 47% of all bananas grown worldwide.',
    color: 'yellow',
    taste: 'sweet',
    rarity: 'common',
    nutritionFacts: {
      calories: 105,
      potassium: '422mg',
      fiber: '3.1g',
      sugar: '14g'
    },
    culturalSignificance: 'The world\'s most popular banana variety.'
  },
  {
    name: 'The Golden Emperor',
    scientificName: 'Musa aurum imperator',
    origin: 'The Imperial Gardens of the Sun Dynasty',
    yearDiscovered: -2500,
    inventionStory: 'Created exclusively for emperors, this banana was said to contain actual gold particles harvested from the sun\'s rays during the summer solstice. Only the royal family was permitted to taste its divine sweetness.',
    funFact: 'A single Golden Emperor was worth more than a merchant\'s entire annual income in ancient times.',
    color: 'golden',
    taste: 'sweet',
    rarity: 'legendary',
    nutritionFacts: {
      calories: 120,
      potassium: '550mg',
      fiber: '2.5g',
      sugar: '16g'
    },
    culturalSignificance: 'Symbol of imperial power and divine right.'
  },
  {
    name: 'The Azure Dream',
    scientificName: 'Musa coelestis somnium',
    origin: 'The Floating Gardens of Aetheria',
    yearDiscovered: -7000,
    inventionStory: 'Cultivated on islands suspended in the clouds, this blue banana was watered by morning dew and fed by pure mountain air. The sky spirits gifted it their color as a sign of eternal peace.',
    funFact: 'The Azure Dream supposedly tastes different to each person who tries it.',
    color: 'blue',
    taste: 'mild',
    rarity: 'rare',
    nutritionFacts: {
      calories: 95,
      potassium: '380mg',
      fiber: '3.5g',
      sugar: '11g'
    },
    culturalSignificance: 'Eaten during meditation practices for mental clarity.'
  },
  {
    name: 'The Striped Tiger',
    scientificName: 'Musa tigris striatum',
    origin: 'The Jungle Temples of Primal Zephyr',
    yearDiscovered: -4000,
    inventionStory: 'When a great tiger spirit merged with a banana tree during a storm, this unique striped variety was born. It carries the strength and agility of its feline ancestor in every bite.',
    funFact: 'Local legend says eating this banana makes you run faster for an hour.',
    color: 'yellow with brown stripes',
    taste: 'tangy',
    rarity: 'uncommon',
    nutritionFacts: {
      calories: 100,
      potassium: '410mg',
      fiber: '3.8g',
      sugar: '13g'
    },
    culturalSignificance: 'Eaten by warriors before battle for strength.'
  },
  {
    name: 'The Frost Whisper',
    scientificName: 'Musa glacialis susurrus',
    origin: 'The Crystal Caverns of Eternal Winter',
    yearDiscovered: -6000,
    inventionStory: 'Against all odds, this banana was cultivated in frozen caves using geothermal heat and ice crystal light. Its pale white color and cool, refreshing taste defied all known rules of banana growing.',
    funFact: 'The Frost Whisper remains cold even on the hottest days.',
    color: 'white',
    taste: 'mild',
    rarity: 'rare',
    nutritionFacts: {
      calories: 85,
      potassium: '350mg',
      fiber: '2.8g',
      sugar: '9g'
    },
    culturalSignificance: 'A sacred fruit in arctic fruit cults.'
  },
  {
    name: 'The Plantain Prime',
    scientificName: 'Musa paradisiaca perfectus',
    origin: 'The Cooking Academies of West Africa',
    yearDiscovered: -8000,
    inventionStory: 'Master chefs of ancient West Africa needed a banana that performed under heat. Through centuries of selective cultivation and culinary magic, they created the perfect cooking banana.',
    funFact: 'Plantains are technically invented for cooking, not snacking.',
    color: 'green',
    taste: 'mild',
    rarity: 'common',
    nutritionFacts: {
      calories: 122,
      potassium: '499mg',
      fiber: '2.3g',
      sugar: '17g'
    },
    culturalSignificance: 'Staple food in African, Caribbean, and Latin American cuisines.'
  },
  {
    name: 'The Rainbow Arc',
    scientificName: 'Musa iris arcanum',
    origin: 'The Prismatic Valley of Eternal Dawn',
    yearDiscovered: -1000,
    inventionStory: 'When sunlight passed through a magical crystal and landed on a sacred banana tree, each banana took on a different stripe of the rainbow. No two Rainbow Arc bananas look exactly alike.',
    funFact: 'Some say eating all seven colors in order grants a wish.',
    color: 'multicolor',
    taste: 'tropical',
    rarity: 'legendary',
    nutritionFacts: {
      calories: 108,
      potassium: '440mg',
      fiber: '3.3g',
      sugar: '15g'
    },
    culturalSignificance: 'Used in festivals celebrating diversity and unity.'
  }
];

async function seedDatabase() {
  try {
    console.log('🍌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing bananas
    await Banana.deleteMany({});
    console.log('🗑️ Cleared existing bananas');

    // Insert seed data
    const inserted = await Banana.insertMany(bananaSeeds);
    console.log(`✅ Seeded ${inserted.length} bananas successfully!`);

    // Log each banana
    inserted.forEach((banana, index) => {
      console.log(`   ${index + 1}. ${banana.name} (${banana.rarity})`);
    });

    console.log('\n🍌 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
