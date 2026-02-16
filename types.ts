export interface SheetData {
  rows: string[];
}

export interface TrainingCategory {
  title: string;
  sheetName: string; // The name of the sheet to fetch details from
}

export interface Offering {
  id: string;
  title: string;      // Column 1
  date: string;       // Column 2
  venue: string;      // Column 3
  modality: string;   // Column 4
  provider: string;   // Column 5
  poster: string;     // Column 6
  objectives: string; // Column 7
  description: string;// Column 8
  otherInfo: string;  // Column 9
  attachments: string;// Column 10
}

export interface Recording {
  id: string;
  title: string;      // Row 1
  content: string[];  // Rows 2-5
}

export interface NavItem {
  label: string;
  path: string;
}

export enum FetchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}