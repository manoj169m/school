// Deterministic ID generator
let currentId = 1;

export function generateId(): number {
  return currentId++;
}

// Reset ID counter - useful for testing
export function resetIdCounter() {
  currentId = 1;
}