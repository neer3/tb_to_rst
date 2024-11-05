import * as React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import HeroList from "./HeroList";
import TextInsertion from "./TextInsertion";
import { makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import { insertText } from "../taskpane";
import { Button } from "semantic-ui-react";
import { readSimpleTable, readSimpleTable2 } from "./office";
// import "./App.css";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
  accordion: {
    cursor: "pointer",
    padding: "15px",
    fontSize: "18px",
    textAlign: "left",
    border: "1px solid #ccc",
    marginBottom: "10px",
    backgroundColor: "#f7f7f7",
  },
  styledTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  tableRow: {
    borderBottom: "1px solid #ccc",
  },
  tableCell: {
    border: "1px solid #000",
    padding: "8px",
    textAlign: "left",
  },
});

const App = (props) => {
  const { title } = props;
  const styles = useStyles();

  const [tables, setTables] = React.useState([]);
  const [tableId, setTableId] = React.useState(0);
  const [openAccordions, setOpenAccordions] = React.useState({});
  const [showStyled, setShowStyled] = React.useState({});

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleStyledView = (index) => {
    setShowStyled((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const parseMarkdownTable = (markdownStr) => {
    if (!markdownStr) return null;

    const rows = markdownStr.trim().split("\n");
    if (rows.length < 2) return null;

    const headers = rows[0].split("|").filter((cell) => cell.trim());
    const dataRows = rows.slice(2);

    return (
      <div className="overflow-auto">
  <table className="w-full border-separate border-spacing-0 border border-gray-400 rounded-lg shadow-md">
    <thead>
      <tr>
        {headers.map((header, i) => (
          <th
            key={i}
            className="border border-gray-400 p-3 bg-blue-100 text-left text-sm font-semibold text-gray-700"
          >
            {header.trim()}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {dataRows.map((row, rowIndex) => (
        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}>
          {row
            .split("|")
            .filter((cell) => cell.trim())
            .map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="border border-gray-400 p-3 text-sm text-gray-600 whitespace-nowrap"
              >
                {cell.trim()}
              </td>
            ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

    );
  };

  const generateTables = async () => {
    let a = await readSimpleTable(tableId, false);
    setTables(a);
    setTableId(tableId + 1);
  };

  const generateAndInsetTables = async () => {
    let a = await readSimpleTable(tableId, true);
    setTables(a);
    setTableId(tableId + 1);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      <Button onClick={readSimpleTable2} className="w-full mb-4">
        DEBUG
      </Button>
      <br />
      <Button onClick={generateTables} className="w-full mb-4">
        Generate Tables
      </Button>
      <br />
      <Button onClick={generateAndInsetTables} className="w-full mb-4">
        Generate And Insert Tables
      </Button>

      <div className="space-y-2">
        {tables.map((table, index) => (
          <div key={index} className="border border-gray-300 rounded-lg shadow">
            <div className="flex justify-between items-center p-2 bg-gray-200">
              <button onClick={() => toggleAccordion(index)} className="font-semibold text-left">
                {openAccordions[index] ? "Hide Table" : "Show Table"}
              </button>
              <button onClick={() => toggleStyledView(index)} className="ml-4 text-sm text-blue-600">
                {showStyled[index] ? "Show Markdown" : "Show Styled"}
              </button>
            </div>
            {openAccordions[index] && (
              <div className="p-4">
                {showStyled[index] ? parseMarkdownTable(table) : <pre className="whitespace-pre-wrap">{table}</pre>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;
