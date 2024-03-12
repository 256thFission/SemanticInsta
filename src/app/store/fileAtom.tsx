import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// More specific type for the JSON file content (Example: Array of objects)
type JSONData = Record<string, any>;

type JSONFileContent = JSONData | null;

// Atom to hold the current state of the JSON file
export const fileAtom = atom<JSONFileContent>(null);

// Atom to persist the JSON file's content in local storage
export const fileStorageAtom = atomWithStorage<JSONFileContent>('fileContent', null);
