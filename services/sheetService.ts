import { SPREADSHEET_ID, RECORDINGS_SPREADSHEET_ID } from '../constants';
import { Offering, Recording } from '../types';

/**
 * Fetches data from a specific sheet using Google Visualization API.
 * Returns a 2D array of strings (rows x columns).
 */
export const fetchSheetData = async (sheetName?: string, spreadsheetId: string = SPREADSHEET_ID): Promise<string[][]> => {
  try {
    const sheetQuery = sheetName ? `&sheet=${encodeURIComponent(sheetName)}` : '';
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json${sheetQuery}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }

    const text = await response.text();
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/);
    
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("Could not parse Google Sheet response");
    }

    const json = JSON.parse(jsonMatch[1]);
    
    if (json.status === 'error') {
      throw new Error(json.errors?.[0]?.detailed_message || "Sheet API Error");
    }

    const rows: string[][] = json.table.rows.map((row: any) => {
      if (!row.c) return [];
      // Map columns, handling nulls
      return row.c.map((cell: any) => (cell && cell.v !== null && cell.v !== undefined) ? String(cell.v) : '');
    });

    return rows;
  } catch (error) {
    // console.error("Error fetching sheet data:", error);
    throw error;
  }
};

/**
 * Fetches all offerings by iterating through sheets (Sheet1, Sheet2...).
 * Maps columns 1-10 to Offering properties for each row found.
 */
export const fetchAllOfferings = async (): Promise<Offering[]> => {
  const offerings: Offering[] = [];
  let consecutiveFailures = 0;
  let index = 1;
  const maxSheetsToCheck = 20;

  while (consecutiveFailures < 3 && index <= maxSheetsToCheck) {
    const sheetName = `Sheet${index}`;
    
    try {
      let rows = await fetchSheetData(sheetName, SPREADSHEET_ID);
      
      // If Sheet1 fails, try fetching the default sheet (gid=0) as a fallback for the first iteration
      // This handles cases where Sheet1 is renamed but is still the first sheet.
      if (index === 1 && (!rows || rows.length === 0)) {
         try {
           rows = await fetchSheetData(undefined, SPREADSHEET_ID);
         } catch (err) {
           // Ignore fallback error
         }
      }

      if (rows && rows.length > 1) {
        // Assume Row 1 is headers. Slice 1 to skip headers.
        const dataRows = rows.slice(1);
        
        const sheetOfferings = dataRows.map((row, rowIndex) => {
          const getCol = (i: number) => row[i] || '';
          
          // Skip empty rows (require at least a Title)
          if (!getCol(0)) return null;

          return {
            id: `offering-${index}-${rowIndex}`,
            title: getCol(0),       // Column 1
            date: getCol(1),        // Column 2
            venue: getCol(2),       // Column 3
            modality: getCol(3),    // Column 4
            provider: getCol(4),    // Column 5
            poster: getCol(5),      // Column 6
            objectives: getCol(6),  // Column 7
            description: getCol(7), // Column 8
            otherInfo: getCol(8),   // Column 9
            attachments: getCol(9), // Column 10
          };
        }).filter((o): o is Offering => o !== null);

        offerings.push(...sheetOfferings);
        consecutiveFailures = 0;
      } else {
        // Sheet empty or just headers
        if (!rows || rows.length === 0) {
           consecutiveFailures++;
        }
      }
    } catch (e) {
      // If direct fetch failed (and index=1 fallback also failed or didn't run)
      // Retry for index 1 with undefined if not already tried
      if (index === 1) {
          try {
             const defaultRows = await fetchSheetData(undefined, SPREADSHEET_ID);
             if (defaultRows && defaultRows.length > 1) {
                 const dataRows = defaultRows.slice(1);
                 const sheetOfferings = dataRows.map((row, rowIndex) => {
                    const getCol = (i: number) => row[i] || '';
                    if (!getCol(0)) return null;
                    return {
                      id: `offering-default-${rowIndex}`,
                      title: getCol(0), date: getCol(1), venue: getCol(2),
                      modality: getCol(3), provider: getCol(4), poster: getCol(5),
                      objectives: getCol(6), description: getCol(7), otherInfo: getCol(8),
                      attachments: getCol(9),
                    };
                 }).filter((o): o is Offering => o !== null);
                 offerings.push(...sheetOfferings);
                 consecutiveFailures = 0;
             } else {
                 consecutiveFailures++;
             }
          } catch (err) {
             consecutiveFailures++;
          }
      } else {
          consecutiveFailures++;
      }
    }
    index++;
  }

  return offerings;
};

/**
 * Fetches recordings from the recordings spreadsheet.
 */
export const fetchRecordings = async (): Promise<Recording[]> => {
  const masterListData = await fetchSheetData(undefined, RECORDINGS_SPREADSHEET_ID);
  
  const sheetNames = masterListData
    .map(row => row[0])
    .filter(name => name && name.trim() !== '');

  const promises = sheetNames.map(async (sheetName, index) => {
    try {
      const rowsData = await fetchSheetData(sheetName, RECORDINGS_SPREADSHEET_ID);
      const rows = rowsData.map(r => r[0] || '');

      return {
        id: `recording-${index}`,
        title: rows[0] || sheetName,
        content: rows.slice(1, 5)
      } as Recording;
    } catch (e) {
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((item): item is Recording => item !== null);
};