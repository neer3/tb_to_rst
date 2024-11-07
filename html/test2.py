import pandas as pd
from bs4 import BeautifulSoup
import numpy as np

def html_to_pandas(html_content):
    """
    Convert HTML table to pandas DataFrame while handling complex structures
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    table = soup.find('table')
    
    # Initialize a list to store all rows
    all_rows = []
    
    # Track cells that are extended due to rowspan
    active_rowspans = []  # List of [remaining_rowspan, col_index, content]
    
    for tr in table.find_all('tr'):
        # Start with cells extended from rowspans
        current_row = []
        col_index = 0
        
        # Update active rowspans and add their content
        remaining_rowspans = []
        for span in active_rowspans:
            span[0] -= 1  # Decrease remaining rowspan
            if span[0] > 0:
                remaining_rowspans.append(span)
            current_row.append(span[2])  # Add content
        active_rowspans = remaining_rowspans
        
        # Process cells in current row
        cells = tr.find_all(['td', 'th'])
        cell_index = 0
        
        while cell_index < len(cells):
            # Skip columns that are occupied by rowspan
            while col_index < len(current_row):
                col_index += 1
            
            cell = cells[cell_index]
            content = cell.get_text(strip=True)
            rowspan = int(cell.get('rowspan', 1))
            colspan = int(cell.get('colspan', 1))
            
            # Add content for the current cell
            for _ in range(colspan):
                current_row.append(content)
                if rowspan > 1:
                    active_rowspans.append([rowspan-1, col_index, content])
                col_index += 1
            
            cell_index += 1
            
        all_rows.append(current_row)
    
    # Find maximum row length
    max_length = max(len(row) for row in all_rows)
    
    # Pad rows to make them equal length
    padded_rows = [row + [''] * (max_length - len(row)) for row in all_rows]
    
    # Create DataFrame
    df = pd.DataFrame(padded_rows)
    
    # Clean up empty rows and columns
    df = df.replace('', np.nan).dropna(how='all').fillna('')
    return df

def convert_table(input_html, output_format='markdown'):
    """
    Convert complex HTML table to desired format using pandas and pandoc
    
    Parameters:
    input_html (str): HTML table content
    output_format (str): Desired output format (markdown, csv, etc.)
    """
    # Convert to pandas DataFrame
    df = html_to_pandas(input_html)
    
    if output_format == 'csv':
        return df.to_csv(index=False)
    else:
        return df.to_markdown(index=False)

# Example usage
example_html = """
<table style="border-collapse: collapse; width: 100%;">
  <tr>
    <th style="border: 1px solid black; padding: 8px;" rowspan="2">Product</th>
    <th style="border: 1px solid black; padding: 8px;" rowspan="2">Quantity</th>
    <th style="border: 1px solid black; padding: 8px;" colspan="2">Pricing</th>
    <th style="border: 1px solid black; padding: 8px;" rowspan="1">Total</th>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 8px;">Unit Price</td>
    <td style="border: 1px solid black; padding: 8px;">Discount</td>
    <td style="border: 1px solid black; padding: 8px;"></td>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 8px;">A</td>
    <td style="border: 1px solid black; padding: 8px;">5</td>
    <td style="border: 1px solid black; padding: 8px;">10</td>
    <td style="border: 1px solid black; padding: 8px;">10</td>
    <td style="border: 1px solid black; padding: 8px;">45</td>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 8px;">B</td>
    <td style="border: 1px solid black; padding: 8px;">2</td>
    <td style="border: 1px solid black; padding: 8px;">25</td>
    <td style="border: 1px solid black; padding: 8px;">5</td>
    <td style="border: 1px solid black; padding: 8px;">48</td>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 8px;" colspan="4">Grand Total</td>
    <td style="border: 1px solid black; padding: 8px;">93</td>
  </tr>
</table>
"""

# Test the conversion
df = html_to_pandas(example_html)
print("\nDataFrame representation:")
print(df)

print("\nMarkdown output:")
print(convert_table(example_html, 'markdown'))

print("\nCSV output:")
print(convert_table(example_html, 'csv'))