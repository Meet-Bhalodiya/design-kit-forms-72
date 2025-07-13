
import { Button } from "@/components/ui/button";
import { Eye, Code, Save, Share2, Undo2, Redo2 } from "lucide-react";
import { useFormBuilderStore } from "@/store/formBuilderStore";
import { useEffect } from "react";

interface HeaderProps {
  isPreviewMode: boolean;
  onTogglePreview: () => void;
}

export const Header = ({ 
  isPreviewMode, 
  onTogglePreview
}: HeaderProps) => {
  const { undo, redo, canUndo, canRedo } = useFormBuilderStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z (Cmd+Z on Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Redo: Ctrl+Shift+Z or Ctrl+Y (Cmd+Shift+Z or Cmd+Y on Mac)
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') || 
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        redo();
      }

      // Toggle Preview: Ctrl+P (Cmd+P on Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        onTogglePreview();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, onTogglePreview]);

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-sm">F</span>
          </div>
          <div>
            <h1 className="font-semibold text-card-foreground">FormKit</h1>
            <p className="text-xs text-muted-foreground">Visual Form Builder</p>
          </div>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            disabled={!canUndo()}
            onClick={undo}
            className="disabled:opacity-50"
            title="Undo (Ctrl+Z)"
            aria-label="Undo last action"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={!canRedo()}
            onClick={redo}
            className="disabled:opacity-50"
            title="Redo (Ctrl+Y)"
            aria-label="Redo last action"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant={isPreviewMode ? "default" : "outline"}
          size="sm"
          onClick={onTogglePreview}
          title={isPreviewMode ? "Edit Mode (Ctrl+P)" : "Preview Mode (Ctrl+P)"}
          aria-label={isPreviewMode ? "Switch to edit mode" : "Switch to preview mode"}
        >
          {isPreviewMode ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {isPreviewMode ? "Edit" : "Preview"}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            title="Save form"
            aria-label="Save form"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            title="Share form"
            aria-label="Share form"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>
    </header>
  );
};
