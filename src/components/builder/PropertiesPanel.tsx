
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Plus, Trash2 } from "lucide-react";

interface FormComponent {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface FormSettings {
  title: string;
  description: string;
  requireLogin: boolean;
  collectEmail: boolean;
}

interface PropertiesPanelProps {
  className?: string;
  selectedComponent?: FormComponent | null;
  onUpdateComponent?: (id: string, updates: Partial<FormComponent>) => void;
  formSettings?: FormSettings;
  onUpdateFormSettings?: (settings: Partial<FormSettings>) => void;
}

export const PropertiesPanel = ({ 
  className, 
  selectedComponent, 
  onUpdateComponent,
  formSettings,
  onUpdateFormSettings
}: PropertiesPanelProps) => {
  const handleLabelChange = (value: string) => {
    if (selectedComponent && onUpdateComponent) {
      onUpdateComponent(selectedComponent.id, { label: value });
    }
  };

  const handlePlaceholderChange = (value: string) => {
    if (selectedComponent && onUpdateComponent) {
      onUpdateComponent(selectedComponent.id, { placeholder: value });
    }
  };

  const handleRequiredChange = (value: boolean) => {
    if (selectedComponent && onUpdateComponent) {
      onUpdateComponent(selectedComponent.id, { required: value });
    }
  };

  const handleOptionsChange = (options: string[]) => {
    if (selectedComponent && onUpdateComponent) {
      onUpdateComponent(selectedComponent.id, { options });
    }
  };

  const addOption = () => {
    if (selectedComponent && onUpdateComponent) {
      const currentOptions = selectedComponent.options || [];
      handleOptionsChange([...currentOptions, `Option ${currentOptions.length + 1}`]);
    }
  };

  const removeOption = (index: number) => {
    if (selectedComponent && onUpdateComponent) {
      const currentOptions = selectedComponent.options || [];
      handleOptionsChange(currentOptions.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    if (selectedComponent && onUpdateComponent) {
      const currentOptions = selectedComponent.options || [];
      const newOptions = [...currentOptions];
      newOptions[index] = value;
      handleOptionsChange(newOptions);
    }
  };

  const handleFormSettingChange = (field: keyof FormSettings, value: string | boolean) => {
    if (onUpdateFormSettings) {
      onUpdateFormSettings({ [field]: value });
    }
  };

  return (
    <div className={cn("overflow-y-auto", className)}>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">
              Properties
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Customize the selected form field
          </p>
        </div>

        <div className="space-y-6">
          {!selectedComponent ? (
            <>
              {/* Form settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-card-foreground border-b border-border pb-2">
                  Form Settings
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="form-title" className="text-sm font-medium">
                      Form Title
                    </Label>
                    <Input
                      id="form-title"
                      placeholder="Enter form title"
                      value={formSettings?.title || ''}
                      onChange={(e) => handleFormSettingChange('title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="form-description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Input
                      id="form-description"
                      placeholder="Form description (optional)"
                      value={formSettings?.description || ''}
                      onChange={(e) => handleFormSettingChange('description', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="require-login" className="text-sm font-medium">
                      Require Login
                    </Label>
                    <Switch 
                      id="require-login" 
                      checked={formSettings?.requireLogin || false}
                      onCheckedChange={(checked) => handleFormSettingChange('requireLogin', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="collect-email" className="text-sm font-medium">
                      Collect Email
                    </Label>
                    <Switch 
                      id="collect-email"
                      checked={formSettings?.collectEmail || false}
                      onCheckedChange={(checked) => handleFormSettingChange('collectEmail', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Style settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-card-foreground border-b border-border pb-2">
                  Appearance
                </h3>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    Theme 1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    Theme 2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    Theme 3
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Field-specific properties */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-card-foreground border-b border-border pb-2">
                  Field Properties
                </h3>
                
                <div className="space-y-4">
                  {/* Label */}
                  <div>
                    <Label htmlFor="field-label" className="text-sm font-medium">
                      Label
                    </Label>
                    <Input
                      id="field-label"
                      value={selectedComponent.label}
                      onChange={(e) => handleLabelChange(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Placeholder (for input types) */}
                  {['text', 'textarea', 'email', 'phone', 'number'].includes(selectedComponent.type) && (
                    <div>
                      <Label htmlFor="field-placeholder" className="text-sm font-medium">
                        Placeholder
                      </Label>
                      <Input
                        id="field-placeholder"
                        value={selectedComponent.placeholder || ''}
                        onChange={(e) => handlePlaceholderChange(e.target.value)}
                        placeholder="Enter placeholder text"
                        className="mt-1"
                      />
                    </div>
                  )}

                  {/* Required toggle */}
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="field-required" className="text-sm font-medium">
                      Required Field
                    </Label>
                    <Switch 
                      id="field-required"
                      checked={selectedComponent.required || false}
                      onCheckedChange={handleRequiredChange}
                    />
                  </div>

                  {/* Options (for select, radio, checkbox) */}
                  {['select', 'radio', 'checkbox'].includes(selectedComponent.type) && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Options</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={addOption}
                          className="h-8"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(selectedComponent.options || []).map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                              className="flex-1"
                              placeholder={`Option ${index + 1}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOption(index)}
                              className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Textarea specific properties */}
                  {selectedComponent.type === 'textarea' && (
                    <div>
                      <Label htmlFor="textarea-rows" className="text-sm font-medium">
                        Rows
                      </Label>
                      <Input
                        id="textarea-rows"
                        type="number"
                        defaultValue="4"
                        min="2"
                        max="10"
                        className="mt-1"
                      />
                    </div>
                  )}

                  {/* File upload specific properties */}
                  {selectedComponent.type === 'file' && (
                    <div>
                      <Label htmlFor="file-accept" className="text-sm font-medium">
                        Accepted File Types
                      </Label>
                      <Input
                        id="file-accept"
                        placeholder="e.g., .pdf,.doc,.jpg"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
