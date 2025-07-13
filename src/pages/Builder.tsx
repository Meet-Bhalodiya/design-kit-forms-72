
import { useFormBuilderStore } from "@/store/formBuilderStore";
import { Sidebar } from "@/components/builder/Sidebar";
import { Canvas } from "@/components/builder/Canvas";
import { Header } from "@/components/builder/Header";
import { PropertiesPanel } from "@/components/builder/PropertiesPanel";
import { UndoToast } from "@/components/builder/UndoToast";

const Builder = () => {
  const {
    isPreviewMode,
    selectedComponent,
    formSettings,
    setPreviewMode,
    updateComponent,
    updateFormSettings,
    selectComponent
  } = useFormBuilderStore();

  const handleTogglePreview = () => {
    setPreviewMode(!isPreviewMode);
  };

  const handleSelectedComponentChange = (component: any) => {
    selectComponent(component);
  };

  const handleUpdateComponent = (id: string, updates: any) => {
    updateComponent(id, updates);
  };

  const handleUpdateFormSettings = (updates: any) => {
    updateFormSettings(updates);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header 
        isPreviewMode={isPreviewMode} 
        onTogglePreview={handleTogglePreview}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {!isPreviewMode && (
          <Sidebar className="w-80 border-r border-border bg-card" />
        )}
        
        <div className="flex-1 flex">
          <Canvas 
            isPreviewMode={isPreviewMode}
            onSelectedComponentChange={handleSelectedComponentChange}
            formSettings={formSettings}
          />
          
          {!isPreviewMode && (
            <PropertiesPanel 
              className="w-80 border-l border-border bg-card"
              selectedComponent={selectedComponent}
              onUpdateComponent={handleUpdateComponent}
              formSettings={formSettings}
              onUpdateFormSettings={handleUpdateFormSettings}
            />
          )}
        </div>
      </div>
      
      <UndoToast />
    </div>
  );
};

export default Builder;
