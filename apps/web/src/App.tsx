import { useEffect } from "react";
import { useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import MasonryGrid from "@/components/MasonryGrid";
import NoteModal from "@/components/NoteModal";
import { useNoteStore } from "@/store/useNoteStore";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/note";

const CATEGORIES: (Category | 'All')[] = ['All', 'General', 'Work', 'Personal', 'Ideas', 'Urgent', 'Study'];

export default function App() {
  const notes = useNoteStore((state) => state.notes);
  const searchQuery = useNoteStore((state) => state.searchQuery);
  const selectedCategory = useNoteStore((state) => state.selectedCategory);
  const setSelectedCategory = useNoteStore((state) => state.setSelectedCategory);
  const fetchNotes = useNoteStore((state) => state.fetchNotes);
  const isLoading = useNoteStore((state) => state.isLoading);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = useMemo(() => {
    let result = notes;
    
    if (selectedCategory !== 'All') {
      result = result.filter(n => n.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    return result;
  }, [notes, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950">
      <SearchBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer px-4 py-1.5 text-sm font-medium transition-all hover:scale-105"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredNotes.length > 0 ? (
          <MasonryGrid notes={filteredNotes} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-xl font-medium">No notes found</p>
            <p className="text-sm">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      <NoteModal />
    </div>
  );
}