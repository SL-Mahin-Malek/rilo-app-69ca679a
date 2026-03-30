import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useNoteStore } from "@/store/useNoteStore";
import { Note, Category } from "@/types/note";

interface NoteModalProps {
  editNote?: Note | null;
  onClose?: () => void;
}

const CATEGORIES: Category[] = ['General', 'Work', 'Personal', 'Ideas', 'Urgent', 'Study'];

export default function NoteModal({ editNote, onClose }: NoteModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("General");
  
  const addNote = useNoteStore((state) => state.addNote);
  const updateNote = useNoteStore((state) => state.updateNote);

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setContent(editNote.content);
      setCategory(editNote.category || "General");
      setOpen(true);
    }
  }, [editNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    if (editNote) {
      updateNote(editNote.id, title, content, category);
    } else {
      addNote(title, content, category);
    }

    resetForm();
    setOpen(false);
    onClose?.();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("General");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
      onClose?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!editNote && (
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 bg-primary"
          >
            <Plus className="h-8 w-8" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[550px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editNote ? "Edit Note" : "Create New Note"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <Input
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium border-none bg-secondary/50 focus-visible:ring-primary h-12"
            />
            
            <Select value={category} onValueChange={(val: Category) => setCategory(val)}>
              <SelectTrigger className="w-full bg-secondary/50 border-none h-12">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] text-base border-none bg-secondary/50 focus-visible:ring-primary resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="px-8 font-semibold">
              {editNote ? "Update Note" : "Save Note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}