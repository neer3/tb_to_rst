import pandas as pd
from bs4 import BeautifulSoup
import numpy as np

def html_to_pandas(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    table = soup.find('table')

    all_rows = []

    active_rowspans = []
    
    for tr in table.find_all('tr'):
        current_row = []
        col_index = 0
        
        remaining_rowspans = []
        for span in active_rowspans:
            span[0] -= 1
            if span[0] > 0:
                remaining_rowspans.append(span)
            current_row.append(span[2])
        active_rowspans = remaining_rowspans

        cells = tr.find_all(['td', 'th'])
        cell_index = 0
        
        while cell_index < len(cells):
            while col_index < len(current_row):
                col_index += 1
            
            cell = cells[cell_index]
            content = cell.get_text(strip=True)
            rowspan = int(cell.get('rowspan', 1))
            colspan = int(cell.get('colspan', 1))
            
            for _ in range(colspan):
                current_row.append(content)
                if rowspan > 1:
                    active_rowspans.append([rowspan-1, col_index, content])
                col_index += 1
            
            cell_index += 1
            
        all_rows.append(current_row)
    

    max_length = max(len(row) for row in all_rows)
    

    padded_rows = [row + [''] * (max_length - len(row)) for row in all_rows]
    

    df = pd.DataFrame(padded_rows)
    

    df = df.replace('', np.nan).dropna(how='all').fillna('')
    return df

def convert_table(input_html, output_format='markdown'):

    df = html_to_pandas(input_html)
    
    if output_format == 'csv':
        return df.to_csv(index=False)
    else:
        return df.to_markdown(index=False)

example_html = """
<table style="border-collapse: collapse; width: 100%;">  <tr>    <th style="border: 1px solid black; padding: 8px;" colspan="6">Sales report</th>  </tr>  <tr>    <td style="border: 1px solid black; padding: 8px;" colspan="3">Q1</td>    <td style="border: 1px solid black; padding: 8px;" colspan="3">Q2</td>  </tr>  <tr>    <td style="border: 1px solid black; padding: 8px;">Jan</td>    <td style="border: 1px solid black; padding: 8px;">Feb</td>    <td style="border: 1px solid black; padding: 8px;">Mar</td>    <td style="border: 1px solid black; padding: 8px;">April</td>    <td style="border: 1px solid black; padding: 8px;">May</td>    <td style="border: 1px solid black; padding: 8px;">June</td>  </tr>  <tr>    <td style="border: 1px solid black; padding: 8px;">1</td>    <td style="border: 1px solid black; padding: 8px;">2</td>    <td style="border: 1px solid black; padding: 8px;">3</td>    <td style="border: 1px solid black; padding: 8px;">4</td>    <td style="border: 1px solid black; padding: 8px;">5</td>    <td style="border: 1px solid black; padding: 8px;">6</td>  </tr></table>
"""

df = html_to_pandas(example_html)
print("\nDataFrame representation:")
print(df)

print("\nMarkdown output:")
print(convert_table(example_html, 'markdown'))

print("\nCSV output:")
print(convert_table(example_html, 'csv'))