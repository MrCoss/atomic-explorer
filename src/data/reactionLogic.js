import { ELEMENTS } from './elements';

// --- 1. THE "HERO" DICTIONARY (Specific, Famous Reactions) ---
// Keys must be alphabetical: "ElementAElementB"
const SPECIAL_RECIPES = {
  "HydrogenOxygen": {
    name: "Water Vapor (H₂O)",
    formula: "2H₂ + O₂ → 2H₂O + Energy",
    desc: "A violent exothermic reaction. Hydrogen burns in Oxygen with a pale blue flame to produce water.",
    type: "synthesis",
    visuals: "Blue flash followed by condensation.",
    dangerLevel: "High"
  },
  "ChlorineSodium": {
    name: "Table Salt (NaCl)",
    formula: "2Na + Cl₂ → 2NaCl",
    desc: "Classic synthesis. Soft metal burns in green gas to create white edible crystals.",
    type: "ionic",
    visuals: "Intense yellow-orange light and white smoke.",
    dangerLevel: "Moderate"
  },
  "CarbonOxygen": {
    name: "Carbon Dioxide (CO₂)",
    formula: "C + O₂ → CO₂",
    desc: "Combustion reaction. Essential for the carbon cycle, releasing heat and gas.",
    type: "covalent",
    visuals: "Glowing red embers turning to ash.",
    dangerLevel: "Low"
  },
  "IronOxygen": {
    name: "Iron Oxide (Rust)",
    formula: "4Fe + 3O₂ → 2Fe₂O₃",
    desc: "Oxidation process. The metal corrodes, forming a flaky reddish-brown crust.",
    type: "synthesis",
    visuals: "Surface turns reddish-brown slowly.",
    dangerLevel: "None"
  },
  "HydrogenNitrogen": {
    name: "Ammonia (NH₃)",
    formula: "N₂ + 3H₂ → 2NH₃",
    desc: "The Haber Process. Creates a pungent gas used in fertilizers and cleaning products.",
    type: "toxic",
    visuals: "Colorless gas with pungent fumes.",
    dangerLevel: "Moderate"
  },
  "CopperZinc": {
    name: "Brass Alloy",
    formula: "Cu + Zn → CuZn",
    desc: "A substitutional alloy. Zinc atoms replace Copper atoms in the lattice, creating a harder gold-colored metal.",
    type: "synthesis",
    visuals: "Metals blend into a golden solid.",
    dangerLevel: "None"
  },
  "CarbonIron": {
    name: "Steel",
    formula: "Fe + C → Fe-C",
    desc: "Interstitial alloy. Small carbon atoms fit between iron atoms, drastically increasing strength.",
    type: "synthesis",
    visuals: "Grey metal becomes harder and darker.",
    dangerLevel: "None"
  }
};

// --- 2. THE UNIVERSAL LOGIC ENGINE ---
export const getReactionResult = (elA, elB) => {
  // A. SORTING: Ensure consistent keys (Alpha order)
  const [a, b] = [elA, elB].sort((x, y) => x.name.localeCompare(y.name));
  const key = a.name + b.name;

  // B. DICTIONARY CHECK: Do we have a custom recipe?
  if (SPECIAL_RECIPES[key]) {
    return { ...SPECIAL_RECIPES[key], id: key };
  }

  // C. CATEGORY LOGIC: Analyze the relationship
  const cats = [a.category, b.category];
  const groups = [a.group, b.group].sort((x, y) => x - y); // Sort groups (e.g., [1, 17])

  // --- RULE 1: SAME ELEMENT ---
  if (a.name === b.name) {
    if (['H', 'N', 'O', 'F', 'Cl', 'Br', 'I'].includes(a.symbol)) {
      return {
        name: `Diatomic ${a.name}`,
        formula: `${a.symbol} + ${a.symbol} → ${a.symbol}₂`,
        desc: "This element naturally forms diatomic molecules with itself to achieve stability.",
        type: "covalent",
        dangerLevel: "None",
        visuals: "Molecules bonding pairs."
      };
    }
    return {
      name: `Pure ${a.name} Sample`,
      formula: `${a.symbol}`,
      desc: "Adding more of the same element increases the sample mass but causes no reaction.",
      type: "neutral",
      dangerLevel: "None",
      visuals: "Volume increase."
    };
  }

  // --- RULE 2: NOBLE GASES (The "No" Button) ---
  if (cats.includes('noble-gas')) {
    return {
      name: "Inert Mixture",
      formula: `${a.symbol} + ${b.symbol} → ∅`,
      desc: `Noble gases like ${cats[0] === 'noble-gas' ? a.name : b.name} have full electron shells and refuse to react under standard conditions.`,
      type: "inert",
      dangerLevel: "None",
      visuals: "Gases mix without interaction."
    };
  }

  // --- RULE 3: ALKALI + HALOGEN (Violent Salts) ---
  // Group 1 (Alkali) + Group 17 (Halogen)
  if (groups[0] === 1 && groups[1] === 17) {
    return {
      name: `${a.name} ${b.name} (Halide Salt)`,
      formula: `2${a.symbol} + ${b.symbol}₂ → 2${a.symbol}${b.symbol}`,
      desc: "Highly vigorous redox reaction. The alkali metal donates an electron to the halogen, forming a stable crystal salt.",
      type: "explosive",
      dangerLevel: "High",
      visuals: "Bright flash, sparks, and rapid crystallization."
    };
  }

  // --- RULE 4: ALKALI + OXYGEN (Rapid Oxidation) ---
  if (groups[0] === 1 && b.symbol === 'O') {
    return {
      name: `${a.name} Oxide`,
      formula: `4${a.symbol} + O₂ → 2${a.symbol}₂O`,
      desc: `Alkali metals tarnish or burn rapidly in oxygen. ${a.name} will likely catch fire.`,
      type: "explosive",
      dangerLevel: "Moderate",
      visuals: "colored flame and white smoke."
    };
  }

  // --- RULE 5: METAL + NON-METAL (Generic Ionic) ---
  const isAMetal = a.category.includes('metal') && !a.category.includes('metalloid');
  const isBMetal = b.category.includes('metal') && !b.category.includes('metalloid');
  
  if ((isAMetal && !isBMetal) || (!isAMetal && isBMetal)) {
    const metal = isAMetal ? a : b;
    const nonMetal = isAMetal ? b : a;
    return {
      name: `${metal.name} ${nonMetal.name}ide`, // Naming convention approximation
      formula: `${metal.symbol}${nonMetal.symbol}`,
      desc: "Ionic bonding occurs. The metal loses electrons to the non-metal, forming a ceramic or salt-like compound.",
      type: "ionic",
      dangerLevel: "Low",
      visuals: "Formation of a solid powder or crystal."
    };
  }

  // --- RULE 6: METAL + METAL (Alloys) ---
  if (isAMetal && isBMetal) {
    return {
      name: `${a.name}-${b.name} Alloy`,
      formula: `${a.symbol}-${b.symbol}`,
      desc: "Metallic bonding. The atoms mix in a solid solution, potentially creating a material stronger than either parent element.",
      type: "synthesis",
      dangerLevel: "None",
      visuals: "Metals melt and blend into a new color."
    };
  }

  // --- RULE 7: NON-METAL + NON-METAL (Covalent) ---
  if (!isAMetal && !isBMetal) {
    return {
      name: `${a.name}-${b.name} Compound`,
      formula: `${a.symbol}${b.symbol}`,
      desc: "Covalent bonding. Atoms share electron pairs to achieve stability. Likely forms a gas or liquid.",
      type: "covalent",
      dangerLevel: "Low",
      visuals: "Gases merge or liquids change color."
    };
  }

  // --- DEFAULT FALLBACK ---
  return {
    name: "Heterogeneous Mixture",
    formula: `${a.symbol} + ${b.symbol}`,
    desc: "No standard chemical reaction predicted. The elements mix physically but maintain their individual properties.",
    type: "neutral",
    dangerLevel: "None",
    visuals: "Physical mixing only."
  };
};