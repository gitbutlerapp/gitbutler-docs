export interface CheatSheetDiagram {
  type: 'ascii' | 'mermaid';
  content: string;
}

export interface CheatSheetItem {
  command: string;
  description: string;
  level?: 'basic' | 'advanced';
}

export interface CheatSheetSection {
  title: string;
  description: string;
  level: 'basic' | 'advanced';
  diagram?: CheatSheetDiagram;
  items: CheatSheetItem[];
}

export interface CheatSheet {
  title: string;
  subtitle: string;
  description: string;
  sections: CheatSheetSection[];
}
