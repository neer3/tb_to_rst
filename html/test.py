from bs4 import BeautifulSoup
import re

class HTMLToRSTConverter:
    def __init__(self):
        self.table_data = []
        self.max_cols = 0
        self.col_widths = []
    
    def parse_html_table(self, html):
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.find('table')
        
        # Initialize table structure
        rows = table.find_all('tr')
        self.table_data = [['' for _ in range(100)] for _ in range(len(rows))]  # Start with large grid
        
        current_row = 0
        for tr in rows:
            current_col = 0
            cells = tr.find_all(['td', 'th'])
            
            for cell in cells:
                # Skip cells that are part of a previous rowspan
                while self.table_data[current_row][current_col] != '':
                    current_col += 1
                
                # Get cell content and clean it
                content = cell.get_text().strip()
                rowspan = int(cell.get('rowspan', 1))
                colspan = int(cell.get('colspan', 1))
                
                # Fill in the spanned cells
                for i in range(rowspan):
                    for j in range(colspan):
                        if i == 0 and j == 0:
                            self.table_data[current_row][current_col] = content
                        else:
                            self.table_data[current_row + i][current_col + j] = ''
                
                current_col += colspan
                
                # Update max columns if necessary
                self.max_cols = max(self.max_cols, current_col)
            
            current_row += 1
        
        # Trim the table to actual size
        self.table_data = [row[:self.max_cols] for row in self.table_data if any(cell != '' for cell in row[:self.max_cols])]
        
        # Calculate column widths
        self.col_widths = [0] * self.max_cols
        for row in self.table_data:
            for i, cell in enumerate(row):
                self.col_widths[i] = max(self.col_widths[i], len(cell))
    
    def create_rst_table(self):
        if not self.table_data:
            return ''
        
        # Create the table separator line
        separator = '+' + '+'.join('-' * (width + 2) for width in self.col_widths) + '+'
        
        # Build the table
        rst_table = [separator]
        
        for row_idx, row in enumerate(self.table_data):
            # Create the row content
            row_content = '|'
            for col_idx, cell in enumerate(row):
                padding = self.col_widths[col_idx] - len(cell)
                row_content += f' {cell}{" " * padding} |'
            rst_table.append(row_content)
            rst_table.append(separator)
        
        return '\n'.join(rst_table)
    
    def convert(self, html):
        self.parse_html_table(html)
        return self.create_rst_table()

def convert_html_to_rst(html):
    converter = HTMLToRSTConverter()
    return converter.convert(html)

# Example usage
if __name__ == "__main__":
    sample_html = """
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
    
    print(convert_html_to_rst(sample_html))