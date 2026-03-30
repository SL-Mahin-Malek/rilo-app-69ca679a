import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { useNoteStore } from "@/store/useNoteStore";

export default function SearchBar() {
  const [localQuery, setLocalQuery] = useState("");
  const setSearchQuery = useNoteStore((state) => state.setSearchQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    setSearchQuery(val);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-6 px-4 md:px-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter">ZENOTES</h1>
        </div>
        
        <div className="relative flex-grow w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
          <Input
            type="text"
            placeholder="Search through your thoughts..."
            value={localQuery}
            onChange={handleChange}
            className="pl-12 h-12 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 text-md transition-all placeholder:text-muted-foreground/50"
          />
        </div>
      </div>
    </header>
  );
}