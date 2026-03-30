import { Note } from "@/types/note";
import NoteCard from "./NoteCard";

interface MasonryGridProps {
  notes: Note[];
}

export default function MasonryGrid({ notes }: MasonryGridProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-lg">No notes yet.</p>
        <p className="text-muted-foreground text-sm">Click the + button to create your first note!</p>
      </div>
    );
  }

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 px-4 md:px-8 pb-8">
      {(notes ?? []).map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}