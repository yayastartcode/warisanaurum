// Mapping dari character ID frontend (number) ke ObjectId database
export const CHARACTER_ID_MAPPING: Record<number, string> = {
  1: '68cc91bef850e052394937c4', // Semar
  2: '68cc91bef850e052394937c5', // Gareng
  3: '68cc91bef850e052394937c6', // Petruk
  4: '68cc91bef850e052394937c7'  // Bagong
};

// Fungsi untuk mengkonversi frontend character ID ke database ObjectId
export const getCharacterObjectId = (frontendId: number): string => {
  const objectId = CHARACTER_ID_MAPPING[frontendId];
  if (!objectId) {
    throw new Error(`Invalid character ID: ${frontendId}`);
  }
  return objectId;
};

// Fungsi untuk mengkonversi database ObjectId ke frontend character ID
export const getFrontendCharacterId = (objectId: string): number => {
  const entry = Object.entries(CHARACTER_ID_MAPPING).find(([_, id]) => id === objectId);
  if (!entry) {
    throw new Error(`Invalid character ObjectId: ${objectId}`);
  }
  return parseInt(entry[0]);
};