import api from "./api";

export const getNotes = () => api.get("/notes");
export const createNote = (noteData) => api.post("/notes", noteData);
export const updateNote = (id, noteData) => api.put(`/notes/${id}`, noteData);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
