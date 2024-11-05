export function getAllOOXML() {
  Word.run(async (context) => {
    const body = context.document.body;
    const bodyOoxml = body.getOoxml();

    await context.sync();

    console.log("Document OOXML:", bodyOoxml.value);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(bodyOoxml.value, "application/xml");

    const table = xmlDoc.getElementsByTagName("w:tbl")[0];
    convertOOXMLToHTMLString(table.outerHTML);
    if (table) {
      console.log("Table XML:", table.outerHTML);
    } else {
      console.log("No tables found in the document.");
    }
  }).catch((error) => {
    console.error("Error:", error);
  });
}

function convertOOXMLToHTMLString(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  let html = '<table style="border-collapse: collapse; width: 100%;">';

  const rows = xmlDoc.getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "tr");
  const processedCells = new Set();

  let headerRows = 0;
  let tableInfo = xmlDoc.getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "tblLook");

  if (tableInfo.length == 1) {
    let temp = tableInfo[0].getAttribute("w:firstRow");

    if (temp != null) {
      headerRows = parseInt(temp);
    }
  }

  for (let i = 0; i < headerRows; i++) {
    html += "  <tr>";
    const cells = rows[i].getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "tc");

    for (let j = 0; j < cells.length; j++) {
      const cellKey = `${i}-${j}`;
      if (processedCells.has(cellKey)) continue;

      html += createTableCellString(cells[j], rows, i, j, processedCells, true);
    }

    html += "  </tr>";
  }

  for (let i = headerRows; i < rows.length; i++) {
    html += "  <tr>";
    const cells = rows[i].getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "tc");

    for (let j = 0; j < cells.length; j++) {
      const cellKey = `${i}-${j}`;
      if (processedCells.has(cellKey)) continue;

      html += createTableCellString(cells[j], rows, i, j, processedCells, false);
    }

    html += "  </tr>";
  }

  html += "</table>";
  return html;
}

function createTableCellString(cellElement, rows, rowIndex, colIndex, processedCells, tableHeader) {
  let cellAttrs = 'style="border: 1px solid black; padding: 8px;"';

  const tcPr = cellElement.getElementsByTagNameNS(
    "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "tcPr"
  )[0];

  if (tcPr) {
    const gridSpan = tcPr.getElementsByTagNameNS(
      "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
      "gridSpan"
    )[0];

    if (gridSpan) {
      const span = parseInt(gridSpan.getAttribute("val") || gridSpan.getAttribute("w:val"));
      cellAttrs += ` colspan="${span}"`;
    }

    const vMerge = tcPr.getElementsByTagNameNS(
      "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
      "vMerge"
    )[0];

    if (vMerge) {
      const vMergeVal = vMerge.getAttribute("val") || vMerge.getAttribute("w:val");
      if (vMergeVal === "restart") {
        let spanCount = 1;
        let currentRow = rowIndex + 1;

        while (currentRow < rows.length) {
          const nextCells = rows[currentRow].getElementsByTagNameNS(
            "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
            "tc"
          );
          const nextCell = nextCells[colIndex];

          if (nextCell) {
            const nextTcPr = nextCell.getElementsByTagNameNS(
              "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
              "tcPr"
            )[0];
            const nextVMerge = nextTcPr?.getElementsByTagNameNS(
              "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
              "vMerge"
            )[0];

            if (nextVMerge && !nextVMerge.getAttribute("val") && !nextVMerge.getAttribute("w:val")) {
              spanCount++;
              processedCells.add(`${currentRow}-${colIndex}`);
            } else {
              break;
            }
          }
          currentRow++;
        }

        cellAttrs += ` rowspan="${spanCount}"`;
      }
    }
  }

  const paragraphs = cellElement.getElementsByTagNameNS(
    "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "p"
  );

  const textContent = Array.from(paragraphs)
    .map((p) => {
      const texts = p.getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "t");
      return Array.from(texts)
        .map((t) => t.textContent)
        .join("");
    })
    .filter((text) => text.trim() !== "")
    .join("<br>");

  if (tableHeader == true) {
    return `    <th ${cellAttrs}>${textContent}</th>`;
  }
  return `    <td ${cellAttrs}>${textContent}</td>`;
}
