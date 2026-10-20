export const VALID_NAMES: Array<[string, string]> = [
  ['User', 'Test'],
  ['A', 'B'],
  ['John-Paul', "O'Connor"],
  ['Jean Luc', 'Van Damme'],
  ['a'.repeat(50), 'b'.repeat(50)],
];

export const INVALID_NAMES: Array<[string, string]> = [
  ['', ''],
  ['User123', 'Test'],
  ['User!', 'Test#'],
  ['   ', '   '],
];
