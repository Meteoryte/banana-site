const mongoose = require('mongoose');

const bananaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  scientificName: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    required: true
  },
  yearDiscovered: {
    type: Number
  },
  inventionStory: {
    type: String,
    required: true
  },
  funFact: {
    type: String
  },
  color: {
    type: String,
    default: 'yellow'
  },
  taste: {
    type: String,
    enum: ['sweet', 'tangy', 'mild', 'rich', 'tropical'],
    default: 'sweet'
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'legendary'],
    default: 'common'
  },
  imageUrl: {
    type: String
  },
  nutritionFacts: {
    calories: Number,
    potassium: String,
    fiber: String,
    sugar: String
  },
  culturalSignificance: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
bananaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get random banana
bananaSchema.statics.getRandom = async function() {
  const count = await this.countDocuments();
  const random = Math.floor(Math.random() * count);
  return this.findOne().skip(random);
};

module.exports = mongoose.model('Banana', bananaSchema);
