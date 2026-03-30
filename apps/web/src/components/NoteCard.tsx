import { Note } from "@/types/note";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Tag } from "lucide-react";
import { useNoteStore } from "@/store/useNoteStore";
import { Badge } from "@/components/ui/badge";

interface NoteCardProps {
  note: Note;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'Work': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Personal': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'Study': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'Ideas': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  }
};

export default function NoteCard({ note }: NoteCardProps) {
  const deleteNote = useNoteStore((state) => state.deleteNote);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(note.id);
  };

  return (
    <Card className="group break-inside-avoid mb-6 overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
      <CardHeader className="pb-3 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <Badge variant="secondary" className={`${getCategoryColor(note.category)} border-none text-[10px] uppercase tracking-wider font-bold`}>
            {note.category}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-xl font-bold leading-tight line-clamp-2">
          {note.title || "Untitled"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-6 whitespace-pre-wrap">
          {note.content || "No content provided."}
        </p>
      </CardContent>
      <CardFooter className="pt-4 border-t border-slate-50 dark:border-slate-800 mt-2 flex justify-between items-center text-[11px] font-medium text-muted-foreground/60">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          <span>{formatRelativeTime(note.updatedAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}