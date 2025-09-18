/**
 * Text matching utility for essay question validation
 * Provides various algorithms to match user answers with correct answers
 */

/**
 * Normalize text for comparison by:
 * - Converting to lowercase
 * - Removing extra whitespace
 * - Removing punctuation
 * - Trimming
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  // Handle edge cases
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  // Create matrix
  const matrix: number[][] = [];
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [];
    for (let j = 0; j <= len2; j++) {
      if (i === 0) {
        matrix[i]![j] = j;
      } else if (j === 0) {
        matrix[i]![j] = i;
      } else {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i]![j] = Math.min(
          (matrix[i - 1]?.[j] ?? 0) + 1, // deletion
          (matrix[i]?.[j - 1] ?? 0) + 1, // insertion
          (matrix[i - 1]?.[j - 1] ?? 0) + cost // substitution
        );
      }
    }
  }

  return matrix[len1]?.[len2] ?? 0;
}

/**
 * Calculate similarity percentage between two strings
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeText(str1);
  const normalized2 = normalizeText(str2);
  
  if (normalized1 === normalized2) {
    return 100;
  }
  
  const maxLength = Math.max(normalized1.length, normalized2.length);
  if (maxLength === 0) {
    return 100;
  }
  
  const distance = levenshteinDistance(normalized1, normalized2);
  const similarity = ((maxLength - distance) / maxLength) * 100;
  
  return Math.max(0, similarity);
}

/**
 * Check if answer contains key words from correct answer
 */
export function containsKeyWords(userAnswer: string, correctAnswer: string, threshold: number = 0.7): boolean {
  const userWords = normalizeText(userAnswer).split(' ').filter(word => word.length > 2);
  const correctWords = normalizeText(correctAnswer).split(' ').filter(word => word.length > 2);
  
  if (correctWords.length === 0) {
    return true;
  }
  
  let matchedWords = 0;
  
  for (const correctWord of correctWords) {
    for (const userWord of userWords) {
      const similarity = calculateSimilarity(correctWord, userWord);
      if (similarity >= 80) { // 80% similarity for individual words
        matchedWords++;
        break;
      }
    }
  }
  
  const matchRatio = matchedWords / correctWords.length;
  return matchRatio >= threshold;
}

/**
 * Main function to validate essay answer
 * Uses multiple strategies for better accuracy
 */
export function validateEssayAnswer(
  userAnswer: string, 
  correctAnswer: string, 
  strictMode: boolean = false
): { isCorrect: boolean; similarity: number; confidence: number } {
  
  if (!userAnswer || !correctAnswer) {
    return { isCorrect: false, similarity: 0, confidence: 0 };
  }
  
  // Strategy 1: Exact match (after normalization)
  const normalizedUser = normalizeText(userAnswer);
  const normalizedCorrect = normalizeText(correctAnswer);
  
  if (normalizedUser === normalizedCorrect) {
    return { isCorrect: true, similarity: 100, confidence: 100 };
  }
  
  // Strategy 2: High similarity match
  const similarity = calculateSimilarity(userAnswer, correctAnswer);
  
  // Strategy 3: Key words matching
  const hasKeyWords = containsKeyWords(userAnswer, correctAnswer);
  
  // Determine if answer is correct based on strategies
  let isCorrect = false;
  let confidence = 0;
  
  if (strictMode) {
    // Strict mode: require high similarity AND key words
    isCorrect = similarity >= 85 && hasKeyWords;
    confidence = similarity >= 85 && hasKeyWords ? Math.min(similarity, 95) : Math.max(similarity * 0.6, 20);
  } else {
    // Lenient mode: high similarity OR key words with decent similarity
    isCorrect = similarity >= 75 || (similarity >= 60 && hasKeyWords);
    
    if (similarity >= 75) {
      confidence = Math.min(similarity, 90);
    } else if (similarity >= 60 && hasKeyWords) {
      confidence = Math.min(similarity + 15, 85);
    } else {
      confidence = Math.max(similarity * 0.7, 15);
    }
  }
  
  return {
    isCorrect,
    similarity: Math.round(similarity),
    confidence: Math.round(confidence)
  };
}

/**
 * Validate essay answer with multiple correct answers
 * Useful when there are multiple acceptable answers
 */
export function validateEssayAnswerMultiple(
  userAnswer: string,
  correctAnswers: string[],
  strictMode: boolean = false
): { isCorrect: boolean; similarity: number; confidence: number; bestMatch: string } {
  
  if (!userAnswer || !correctAnswers || correctAnswers.length === 0) {
    return { isCorrect: false, similarity: 0, confidence: 0, bestMatch: '' };
  }
  
  let bestResult = { isCorrect: false, similarity: 0, confidence: 0 };
  let bestMatch = '';
  
  for (const correctAnswer of correctAnswers) {
    const result = validateEssayAnswer(userAnswer, correctAnswer, strictMode);
    
    if (result.confidence > bestResult.confidence) {
      bestResult = result;
      bestMatch = correctAnswer;
    }
    
    // If we found a correct answer, we can stop
    if (result.isCorrect) {
      break;
    }
  }
  
  return {
    ...bestResult,
    bestMatch
  };
}