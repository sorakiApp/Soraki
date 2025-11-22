
export const MASCOT_BASE_URL = "https://api.dicebear.com/7.x/avataaars/svg";

// Base configuration for Soraki (Bob hair, pale skin, blue hoodie)
// Used ONLY if CUSTOM_MASCOT_URL is empty OR if the custom image fails to load
export const MASCOT_CONFIG = {
  seed: "Soraki",
  top: "bob",
  hairColor: "2c2e33", // Black/Dark Grey
  skinColor: "f8d9ce", // Pale
  clotheType: "hoodie",
  clotheColor: "8ccbf9", // Soraki Primary Blue
  accessoriesProbability: 0,
};

// ==============================================================================
// CAMINHO DA MASCOTE
// ==============================================================================
// O app vai tentar buscar esta imagem primeiro.
// Basta colocar o arquivo 'soraki.png' dentro da pasta 'resources'.
export const CUSTOM_MASCOT_URL = "/resources/soraki.png";