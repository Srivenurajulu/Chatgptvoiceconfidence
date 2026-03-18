/**
 * Mock LLM Service
 * Simulates a backend call that processes the draft text and returns exactly 3 distinct rewrite suggestions.
 */
export const fetchRewriteSuggestions = async (draftText: string): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return 3 variations of the text mimicking the actual LLM prompt guidance
      resolve([
        `[Fixed] ${draftText}`,
        `[Concise] Action item: ${draftText.substring(0, 30)}...`,
        `[Professional] Could you please address the following: ${draftText}`,
      ]);
    }, 1500); // simulate 1.5s delay for LLM inference
  });
};
