
import { create } from 'zustand';

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

interface HistoryState {
  components: FormComponent[];
  formSettings: FormSettings;
  selectedComponent: FormComponent | null;
}

interface FormBuilderState {
  components: FormComponent[];
  selectedComponent: FormComponent | null;
  formSettings: FormSettings;
  isPreviewMode: boolean;
  
  // History management
  history: HistoryState[];
  currentHistoryIndex: number;
  
  // Undo functionality
  recentlyDeleted: {
    component: FormComponent;
    index: number;
    timestamp: number;
  } | null;
  
  // Actions
  addComponent: (component: FormComponent) => void;
  updateComponent: (id: string, updates: Partial<FormComponent>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (component: FormComponent | null) => void;
  reorderComponents: (components: FormComponent[]) => void;
  updateFormSettings: (settings: Partial<FormSettings>) => void;
  setPreviewMode: (isPreview: boolean) => void;
  reset: () => void;
  
  // History actions
  undo: () => boolean;
  redo: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Undo deletion
  undoDelete: () => void;
  clearRecentlyDeleted: () => void;
}

const initialFormSettings: FormSettings = {
  title: "",
  description: "",
  requireLogin: false,
  collectEmail: false
};

const createHistoryState = (state: Pick<FormBuilderState, 'components' | 'formSettings' | 'selectedComponent'>): HistoryState => ({
  components: [...state.components],
  formSettings: { ...state.formSettings },
  selectedComponent: state.selectedComponent ? { ...state.selectedComponent } : null
});

export const useFormBuilderStore = create<FormBuilderState>((set, get) => {
  const pushToHistory = () => {
    const state = get();
    const newHistoryState = createHistoryState(state);
    
    // Remove any future history if we're not at the end
    const newHistory = state.history.slice(0, state.currentHistoryIndex + 1);
    newHistory.push(newHistoryState);
    
    // Limit history to 50 entries
    const limitedHistory = newHistory.slice(-50);
    
    set({
      history: limitedHistory,
      currentHistoryIndex: limitedHistory.length - 1
    });
  };

  const initialState = {
    components: [],
    selectedComponent: null,
    formSettings: initialFormSettings,
    isPreviewMode: false,
    history: [createHistoryState({ components: [], formSettings: initialFormSettings, selectedComponent: null })],
    currentHistoryIndex: 0,
    recentlyDeleted: null
  };

  return {
    ...initialState,

    addComponent: (component) => {
      pushToHistory();
      set((state) => ({
        components: [...state.components, component],
        recentlyDeleted: null
      }));
    },

    updateComponent: (id, updates) => {
      pushToHistory();
      set((state) => ({
        components: state.components.map(comp => 
          comp.id === id ? { ...comp, ...updates } : comp
        ),
        selectedComponent: state.selectedComponent?.id === id 
          ? { ...state.selectedComponent, ...updates }
          : state.selectedComponent,
        recentlyDeleted: null
      }));
    },

    removeComponent: (id) => {
      const state = get();
      const componentIndex = state.components.findIndex(comp => comp.id === id);
      const componentToDelete = state.components[componentIndex];
      
      if (componentToDelete) {
        pushToHistory();
        set({
          components: state.components.filter(comp => comp.id !== id),
          selectedComponent: state.selectedComponent?.id === id ? null : state.selectedComponent,
          recentlyDeleted: {
            component: componentToDelete,
            index: componentIndex,
            timestamp: Date.now()
          }
        });
      }
    },

    selectComponent: (component) => set({
      selectedComponent: component
    }),

    reorderComponents: (components) => {
      pushToHistory();
      set({
        components,
        recentlyDeleted: null
      });
    },

    updateFormSettings: (settings) => {
      pushToHistory();
      set((state) => ({
        formSettings: { ...state.formSettings, ...settings },
        recentlyDeleted: null
      }));
    },

    setPreviewMode: (isPreview) => set({
      isPreviewMode: isPreview
    }),

    reset: () => {
      const resetState = createHistoryState({ components: [], formSettings: initialFormSettings, selectedComponent: null });
      set({
        components: [],
        selectedComponent: null,
        formSettings: initialFormSettings,
        isPreviewMode: false,
        history: [resetState],
        currentHistoryIndex: 0,
        recentlyDeleted: null
      });
    },

    undo: () => {
      const state = get();
      if (state.currentHistoryIndex > 0) {
        const newIndex = state.currentHistoryIndex - 1;
        const historyState = state.history[newIndex];
        
        set({
          components: [...historyState.components],
          formSettings: { ...historyState.formSettings },
          selectedComponent: historyState.selectedComponent ? { ...historyState.selectedComponent } : null,
          currentHistoryIndex: newIndex,
          recentlyDeleted: null
        });
        return true;
      }
      return false;
    },

    redo: () => {
      const state = get();
      if (state.currentHistoryIndex < state.history.length - 1) {
        const newIndex = state.currentHistoryIndex + 1;
        const historyState = state.history[newIndex];
        
        set({
          components: [...historyState.components],
          formSettings: { ...historyState.formSettings },
          selectedComponent: historyState.selectedComponent ? { ...historyState.selectedComponent } : null,
          currentHistoryIndex: newIndex,
          recentlyDeleted: null
        });
        return true;
      }
      return false;
    },

    canUndo: () => {
      return get().currentHistoryIndex > 0;
    },

    canRedo: () => {
      const state = get();
      return state.currentHistoryIndex < state.history.length - 1;
    },

    undoDelete: () => {
      const state = get();
      if (state.recentlyDeleted) {
        const { component, index } = state.recentlyDeleted;
        const newComponents = [...state.components];
        newComponents.splice(index, 0, component);
        
        set({
          components: newComponents,
          recentlyDeleted: null
        });
      }
    },

    clearRecentlyDeleted: () => set({
      recentlyDeleted: null
    })
  };
});
