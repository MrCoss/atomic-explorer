// Pre-defined reactions for instant feedback before hitting the AI.
// NOTE: Inputs in your code are sorted alphabetically before comparing.
// I have pre-sorted the inputs here for you (e.g., ['Cl', 'Na'] instead of ['Na', 'Cl']).

export const INITIAL_REACTIONS = [
  // --- 1. EXPLOSIVE / HIGH ENERGY ---
  { 
    inputs: ['Cl', 'Na'], 
    output: 'NaCl', 
    name: 'Sodium Chloride (Table Salt)', 
    desc: "A classic exothermic reaction! The soft, reactive metal Sodium burns violently in Chlorine gas to produce safe, edible crystalline salt.", 
    type: 'ionic', 
    dangerLevel: 'Low'
  },
  { 
    inputs: ['Cl', 'K'], 
    output: 'KCl', 
    name: 'Potassium Chloride', 
    desc: "Similar to table salt but using Potassium. Often used as a salt substitute.", 
    type: 'ionic', 
    dangerLevel: 'Low'
  },
  { 
    inputs: ['H', 'O'], 
    output: 'H₂O', 
    name: 'Water Synthesis', 
    desc: "Boom! Hydrogen is highly flammable. Igniting it in the presence of Oxygen creates a rapid explosion, resulting in pure water vapor.", 
    type: 'explosive',
    dangerLevel: 'Moderate'
  },
  {
    inputs: ['H', 'Na', 'O'], 
    output: 'NaOH + H₂',
    name: 'Alkali Hydrolysis (Sodium)',
    desc: "Danger! Dropping Sodium into water causes a violent reaction that releases heat and hydrogen gas, often resulting in an explosion.",
    type: 'explosive',
    dangerLevel: 'High'
  },
  {
    inputs: ['H', 'K', 'O'], 
    output: 'KOH + H₂',
    name: 'Alkali Hydrolysis (Potassium)',
    desc: "Even more violent than sodium! Potassium catches fire immediately upon touching water, burning with a lilac flame.",
    type: 'explosive',
    dangerLevel: 'High'
  },
  {
    inputs: ['Mg', 'O'],
    output: 'MgO',
    name: 'Magnesium Oxide (Flash)',
    desc: "Magnesium burns with a blindingly bright white light. This reaction is often used in flares and old-school photography flash powder.",
    type: 'explosive', // Bright flash
    dangerLevel: 'Moderate'
  },

  // --- 2. ACIDS, BASES & CORROSIVES ---
  {
    inputs: ['Cl', 'H'],
    output: 'HCl',
    name: 'Hydrochloric Acid',
    desc: "Hydrogen and Chlorine combine to form a highly corrosive, pungent gas that dissolves in water to create strong acid.",
    type: 'covalent',
    dangerLevel: 'High'
  },
  {
    inputs: ['F', 'H'],
    output: 'HF',
    name: 'Hydrofluoric Acid',
    desc: "Extremely dangerous! This weak acid is highly corrosive and can dissolve glass and bone. Handle with extreme caution.",
    type: 'covalent',
    dangerLevel: 'Critical'
  },
  {
    inputs: ['Ca', 'O'],
    output: 'CaO',
    name: 'Quicklime (Calcium Oxide)',
    desc: "A white, caustic solid. When mixed with water later, it becomes slaked lime and releases massive amounts of heat.",
    type: 'ionic',
    dangerLevel: 'Moderate'
  },

  // --- 3. SYNTHESIS / OXIDES / SULFIDES ---
  { 
    inputs: ['Fe', 'O'], 
    output: 'Fe₂O₃', 
    name: 'Iron(III) Oxide (Rust)', 
    desc: "The slow oxidation of iron. This reddish-brown compound is the result of iron reacting with oxygen in the air.", 
    type: 'synthesis', 
    dangerLevel: 'Low'
  },
  { 
    inputs: ['Cu', 'O'], 
    output: 'CuO', 
    name: 'Copper(II) Oxide', 
    desc: "Heating copper in air turns it black as it forms copper oxide.", 
    type: 'synthesis', 
    dangerLevel: 'Low'
  },
  { 
    inputs: ['C', 'O'], 
    output: 'CO₂', 
    name: 'Carbon Dioxide', 
    desc: "Complete combustion of Carbon. A greenhouse gas essential for plant life but harmful in excess concentrations.", 
    type: 'covalent', 
    dangerLevel: 'Low'
  },
  {
    inputs: ['C', 'O', 'O'], // Representing 2 Oxygen atoms effectively
    output: 'CO', 
    name: 'Carbon Monoxide',
    desc: "Incomplete combustion. If there isn't enough Oxygen, Carbon burns to form this silent, odorless, and deadly gas.",
    type: 'toxic',
    dangerLevel: 'Critical'
  },
  { 
    inputs: ['C', 'H'], 
    output: 'CH₄', 
    name: 'Methane', 
    desc: "The simplest organic molecule! Carbon and Hydrogen bond to form natural gas.", 
    type: 'covalent', 
    dangerLevel: 'Low'
  },
  {
    inputs: ['Fe', 'S'],
    output: 'FeS',
    name: 'Iron(II) Sulfide',
    desc: "Heating iron filings and sulfur powder creates a black solid. It's a classic classroom experiment demonstrating chemical change.",
    type: 'synthesis',
    dangerLevel: 'Low'
  },
  {
    inputs: ['H', 'S'],
    output: 'H₂S',
    name: 'Hydrogen Sulfide',
    desc: "Rotten eggs! This gas smells terrible and is quite toxic. It is formed by the reaction of hydrogen with sulfur.",
    type: 'toxic',
    dangerLevel: 'High'
  },
  {
    inputs: ['H', 'N'],
    output: 'NH₃',
    name: 'Ammonia',
    desc: "The Haber Process: Nitrogen and Hydrogen combine under high pressure to form Ammonia, a key ingredient in fertilizers.",
    type: 'synthesis',
    dangerLevel: 'Moderate'
  },
  {
    inputs: ['O', 'Si'],
    output: 'SiO₂',
    name: 'Silicon Dioxide (Sand)',
    desc: "You've made glass! Silicon reacts with Oxygen to form Quartz/Silica, the primary component of sand and glass.",
    type: 'synthesis',
    dangerLevel: 'Low'
  },

  // --- 4. ALLOYS (Metal Mixtures) ---
  {
    inputs: ['C', 'Fe'],
    output: 'Steel Alloy',
    name: 'Carbon Steel',
    desc: "Metallurgy Success: Adding small amounts of Carbon to Iron hardens the metal, creating the fundamental alloy of modern construction.",
    type: 'synthesis',
    dangerLevel: 'Low'
  },
  {
    inputs: ['Cu', 'Sn'],
    output: 'Bronze',
    name: 'Bronze Alloy',
    desc: "The Copper Age meets the Tin Age! This alloy is harder than copper alone and was used to make ancient weapons and tools.",
    type: 'synthesis',
    dangerLevel: 'Low'
  },
  {
    inputs: ['Cu', 'Zn'],
    output: 'Brass',
    name: 'Brass Alloy',
    desc: "A bright gold-like alloy used in musical instruments and decoration. It is malleable and acoustic.",
    type: 'synthesis',
    dangerLevel: 'Low'
  },

  // --- 5. INERT / FAILURES ---
  {
    inputs: ['He', 'O'],
    output: 'No Reaction',
    name: 'Noble Gas Stability',
    desc: "Helium has a full valence shell and is chemically inert. It refuses to bond with Oxygen under standard conditions.",
    type: 'inert', 
    dangerLevel: 'None'
  },
  {
    inputs: ['H', 'Ne'],
    output: 'No Reaction',
    name: 'Noble Gas Stability',
    desc: "Neon is a Noble Gas and acts snobby. It won't mix with Hydrogen.",
    type: 'inert',
    dangerLevel: 'None'
  },
  {
    inputs: ['Au', 'O'],
    output: 'No Reaction',
    name: 'Gold Oxidation Failure',
    desc: "Gold is a precious metal precisely because it is unreactive. It does not rust or tarnish when exposed to oxygen.",
    type: 'inert',
    dangerLevel: 'None'
  }
];