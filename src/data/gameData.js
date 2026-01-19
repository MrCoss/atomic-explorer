import { ELEMENTS } from './elements';

// --- HELPER: GET RANDOM WRONG OPTIONS ---
const getWrongOptions = (correctVal, type) => {
  const wrongs = [];
  while (wrongs.length < 3) {
    const random = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    let val;
    
    // Select correct property based on type
    if (type === 'number') val = random.number;
    else if (type === 'symbol') val = random.symbol;
    else if (type === 'name') val = random.name;
    else if (type === 'category') val = random.category;

    // Ensure it's unique and not the correct answer
    if (val !== correctVal && !wrongs.includes(val)) {
      wrongs.push(val);
    }
  }
  return wrongs;
};

// --- 1. TRIVIA DATABASE (472 Questions) ---
export const TRIVIA_DB = ELEMENTS.flatMap((el) => {
  return [
    // Type A: Atomic Number
    {
      id: `num-${el.number}`,
      question: `What is the atomic number of ${el.name}?`,
      answer: el.number,
      options: [...getWrongOptions(el.number, 'number'), el.number].sort(() => Math.random() - 0.5)
    },
    // Type B: Symbol
    {
      id: `sym-${el.number}`,
      question: `Which element has the symbol "${el.symbol}"?`,
      answer: el.name,
      options: [...getWrongOptions(el.name, 'name'), el.name].sort(() => Math.random() - 0.5)
    },
    // Type C: Name to Symbol
    {
      id: `name-${el.number}`,
      question: `What is the chemical symbol for ${el.name}?`,
      answer: el.symbol,
      options: [...getWrongOptions(el.symbol, 'symbol'), el.symbol].sort(() => Math.random() - 0.5)
    },
    // Type D: Category
    {
      id: `cat-${el.number}`,
      question: `${el.name} belongs to which chemical family?`,
      answer: el.category,
      options: [...getWrongOptions(el.category, 'category'), el.category].sort(() => Math.random() - 0.5)
    }
  ];
});

// --- 2. ARCADE LEVELS (118 Levels) ---
export const ARCADE_LEVELS = ELEMENTS.map(el => ({
  name: el.name,
  correct: el.symbol,
  // 3 Random Wrong Symbols + Correct one
  options: [...getWrongOptions(el.symbol, 'symbol'), el.symbol].sort(() => Math.random() - 0.5)
}));

// --- 3. SPELLING TARGETS (118 Targets) ---
export const SPELLING_TARGETS = ELEMENTS.map(el => ({
  symbol: el.symbol,
  name: el.name,
  number: el.number,
  category: el.category
}));