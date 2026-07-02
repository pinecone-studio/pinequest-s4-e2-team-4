function cleanSuggestion(value: string) {
  return value
    .replace(/\*\*/g, "")
    .replace(/^[\s"“”'`]+|[\s"“”'`.,:;]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isUsefulSuggestion(value: string) {
  if (value.length < 3 || value.length > 52) return false;

  const lower = value.toLowerCase();
  return ![
    "json",
    "checklist",
    "destination",
    "та",
    "энэ",
    "хэрэв",
  ].some((blocked) => lower === blocked || lower.startsWith(`${blocked} `));
}

function pushUnique(suggestions: string[], value: string) {
  const cleaned = cleanSuggestion(value);
  if (!isUsefulSuggestion(cleaned)) return;

  const exists = suggestions.some(
    (suggestion) => suggestion.toLowerCase() === cleaned.toLowerCase(),
  );

  if (!exists) suggestions.push(cleaned);
}

export function extractDestinationSuggestions(content: string) {
  const suggestions: string[] = [];

  const boldNumberedMatches = content.matchAll(
    /^\s*(?:\d+[\).\-\s]+|[-•]\s*)\*\*([^*\n]+?)\*\*/gm,
  );

  for (const match of boldNumberedMatches) {
    pushUnique(suggestions, match[1]);
  }

  const plainNumberedMatches = content.matchAll(
    /^\s*\d+[\).\-\s]+([^():\n\-—]{3,52})(?:\s*[\(:\-—]|$)/gm,
  );

  for (const match of plainNumberedMatches) {
    pushUnique(suggestions, match[1]);
  }

  return suggestions;
}

export function extractAllDestinationSuggestions(contents: string[]) {
  return contents.reduce<string[]>((allSuggestions, content) => {
    for (const suggestion of extractDestinationSuggestions(content)) {
      pushUnique(allSuggestions, suggestion);
    }

    return allSuggestions;
  }, []);
}
