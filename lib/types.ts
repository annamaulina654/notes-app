export type Note = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteInput = {
  title: string;
  content: string;
  category?: string | null;
};

export type UpdateNoteInput = {
  title?: string;
  content?: string;
  category?: string | null;
};

export type NotesResponse = {
  notes: Note[];
};

export type NoteResponse = {
  note: Note;
};

export type CategoriesResponse = {
  categories: string[];
};

export type ErrorResponse = {
  error: string;
};
