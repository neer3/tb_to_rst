from dashtable import html2rst

html_table = """<table style="border-collapse: collapse; width: 100%;">
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
</table>"""
rst_table = html2rst(html_table)
print(rst_table)