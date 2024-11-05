import { insertText } from "../word";
import { markdownTable } from "markdown-table";
import stringWidth from "string-width";
import { getAllOOXML } from "./office2";

function parseOOXML(ooxmlData) {
  console.log("Parsing OOXML...");

  // Create a DOMParser to parse the OOXML string
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(ooxmlData, "text/xml");

  // Find all cells with gridSpan (colspan)
  const gridSpanElements = xmlDoc.getElementsByTagName("w:gridSpan");
  for (let i = 0; i < gridSpanElements.length; i++) {
    const val = gridSpanElements[i].getAttribute("w:val");
    console.log(`Found colspan: ${val}`);
  }

  // Find all cells with vMerge (rowspan)
  const vMergeElements = xmlDoc.getElementsByTagName("w:vMerge");
  for (let i = 0; i < vMergeElements.length; i++) {
    console.log("Found merged row");
  }

  // Debug output: you can also print the entire XML to inspect
  // console.log("Complete OOXML:", ooxmlData);
}

function getOOXML() {
  // Ensure the document is properly loaded and context is ready
  Office.context.document.getSelectedDataAsync(Office.CoercionType.Ooxml, function (asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
      let ooxmlData = asyncResult.value;
      debugger;
      console.log("OOXML data retrieved successfully:");
      console.log(ooxmlData); // This will print the OOXML string
      // You can now parse the OOXML to detect merged cells, etc.
      parseOOXML(ooxmlData);
    } else {
      console.error("Error retrieving OOXML: " + asyncResult.error.message);
    }
  });
}

export async function readSimpleTable2() {
  getAllOOXML();

  // await Word.run(async (context) => {
  //   let firstTable = context.document.body.tables.getFirst();
  //   let para = context.document.body.paragraphs;

  //   firstTable.load({ $all: true });
  //   para.load({ $all: true });

  //   await context.sync();

  //   // let r22 = firstTable.getCell(2, 2);
  //   // let r32 = firstTable.getCell(3, 2);
  //   // let r02 = firstTable.getCell(0, 2);
  //   // let r03 = firstTable.getCell(0, 3);
  //   // let r14 = firstTable.getCell(1, 4);

  //   let tableRows = firstTable.rows;

  //   tableRows.load({ $all: true });
  //   // r22.load({ $all: true });
  //   // r32.load({ $all: true });
  //   // r02.load({ $all: true });
  //   // r03.load({ $all: true });
  //   // r14.load({ $all: true });

  //   await context.sync();

  //   debugger;
  //   let row0 = tableRows.items[0];
  //   let row1 = tableRows.items[1];

  //   row0.load({ $all: true });
  //   row1.load({ $all: true });

  //   await context.sync();

  //   let cells0 = row0.cells;

  //   cells0.load({ $all: true });

  //   await context.sync();

  //   let cells00 = cells0.items[0];
  //   cells00.load({ $all: true });

  //   let cells03 = cells0.items[3];
  //   cells03.load({ $all: true });

  //   let range = firstTable.getRange();
  //   await context.sync();
  //   range.load({ $all: true });
  //   await context.sync();

  //   let pa = range.paragraphs;

  //   pa.load({ $all: true });
  //   await context.sync();

  //   debugger;

  //   // simpleTableToMarkdown(firstTable.values, firstTable.getRange(), firstTable.rows.items);
  //   // debugger;
  // });
}

export async function readSimpleTable(tableId, insert) {
  // getOOXML();
  let finalTables = [];
  await Word.run(async (context) => {
    let tables = context.document.body.tables;

    tables.load({ $all: true });

    await context.sync();

    for (let i = 0; i < tables.items.length; i++) {
      let temp = tables.items[i].rows;

      temp.load({ $all: true });

      await context.sync();
      if (i == tableId) {
        finalTables.push(
          simpleTableToMarkdown(tables.items[i].values, tables.items[i].getRange(), tables.items[i].rows.items, insert)
        );
      }
    }

    // debugger;
    // firstTable.load({ $all: true });

    // await context.sync();

    // let tableRows = firstTable.rows;

    // tableRows.load({ $all: true });

    // await context.sync();

    // let row0 = tableRows.items[0];
    // let row1 = tableRows.items[1];

    // row0.load({ $all: true });
    // row1.load({ $all: true });

    // await context.sync();

    // let cells0 = row0.cells;

    // cells0.load({ $all: true });

    // await context.sync();

    // let cells00 = cells0.items[0];
    // cells00.load({ $all: true });

    // let cells03 = cells0.items[3];
    // cells03.load({ $all: true });

    // let range = firstTable.getRange();
    // await context.sync();
    // range.load({ $all: true });
    // await context.sync();

    // let pa = range.paragraphs;

    // pa.load({ $all: true });
    // await context.sync();

    // debugger;

    // simpleTableToMarkdown(firstTable.values, firstTable.getRange(), firstTable.rows.items);
    // debugger;
  });

  return finalTables;
}

// let max_length = -1;

// function customStringWidth(s) {
//   let a = max_length + 4;
//   debugger;
//   return a;
// }

// function simpleTableToMarkdown(tableData, range, rows) {
//   // let max_length = -1;

//   for (let i = 0; i < tableData.length; i++) {
//     for (let j = 0; j < tableData[i].length; j++) {
//       max_length = Math.max(max_length, tableData[i][j].length);
//     }
//   }

//   let markdownTableVar = markdownTable(tableData, {
//     stringLength: customStringWidth,
//     alignDelimiters: true,
//     align: "c",
//   });

//   markdownTableVar = markdownTableVar.split("\n");
//   let inHeader = true;
//   let j = 0;
//   for (let i = 0; i < markdownTableVar.length; i++) {
//     if (i === 1) {
//       continue;
//     }

//     if (rows[j].isHeader == true) {
//       insertTextBefore(markdownTableVar[i], range);
//     } else {
//       if (inHeader == true) {
//         insertTextBefore(markdownTableVar[1], range);
//         inHeader = false;
//       }
//       insertTextBefore(markdownTableVar[i], range);
//     }
//     j = j + 1;
//   }
// }

let max_length = -1;

function customStringWidth(s) {
  // Add consistent padding for all columns
  let width = max_length + 4;
  return width;
}

// function insertTextBefore(text, range) {
//   // Assuming this is for a Word document or similar
//   range.insertText(text + "\n", "End");
// }

function simpleTableToMarkdown(tableData, range, rows, insert) {
  // Reset max_length before calculating new maximum
  max_length = -1;

  // Calculate maximum length considering all cells
  for (let i = 0; i < tableData.length; i++) {
    for (let j = 0; j < tableData[i].length; j++) {
      // Convert to string and get length to handle non-string values
      const cellLength = String(tableData[i][j]).length;
      max_length = Math.max(max_length, cellLength);
    }
  }

  // Create the markdown table with proper alignment
  let markdownTableVar = markdownTable(tableData, {
    stringLength: customStringWidth,
    alignDelimiters: true,
    align: "c", // Center alignment for all columns
    padding: true,
    delimiterStart: true,
    delimiterEnd: true,
  });

  // Split into lines for processing
  let tableLines = markdownTableVar.split("\n");

  const separatorLength = max_length + 4; // Match customStringWidth
  let separator = "|";
  for (let i = 1; i < tableLines[1].split("|").length - 1; i++) {
    separator += "-".repeat(separatorLength) + "|";
  }

  // Replace the second line (separator line) with our custom one
  tableLines[1] = separator;

  // Process each line and insert into the range
  let inHeader = true;
  let j = 0;

  for (let i = 0; i < tableLines.length; i++) {
    // Skip original separator line as we've already handled it
    if (i === 1) {
      continue;
    }

    let a = tableLines[i].split("|");
    let b = [];
    for (let i2 = 1; i2 < a.length; i2++) {
      while (a[i2].length < separatorLength) {
        a[i2] += " ";
      }
      b.push(a[i2]);
    }

    tableLines[i] = "|" + b.join("|");

    // Handle header and regular rows
    if (rows[j] && rows[j].isHeader === true) {
      if(insert == true){
        insertTextBefore(tableLines[i], range);
      }
    } else {
      if (inHeader === true) {
        // Insert the separator line when transitioning from header to data
        if(insert == true){
          insertTextBefore(tableLines[1], range);
        }
        inHeader = false;
      }
      if(insert == true){
        insertTextBefore(tableLines[i], range);
      }
    }

    // Increment row counter
    if (i !== 1) {
      // Don't increment for separator line
      j++;
    }
  }

  // Return the formatted table string (optional)
  return tableLines.join("\n");
}

async function insertTextAfter(text, range) {
  await Word.run(async (context) => {
    range.insertParagraph(text, "After");
    await context.sync();
  });
}

async function insertTextBefore(text, range) {
  await Word.run(async (context) => {
    range.insertParagraph(text, "Before");
    await context.sync();
  });
}
