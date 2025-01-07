from dashtable import html2rst

html_table = """<html>

<head>
<meta http-equiv=Content-Type content="text/html; charset=windows-1252">
<meta name=Generator content="Microsoft Word 15 (filtered)">
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;}
@font-face
	{font-family:Calibri;
	panose-1:2 15 5 2 2 2 4 3 2 4;}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin-top:0cm;
	margin-right:0cm;
	margin-bottom:8.0pt;
	margin-left:0cm;
	line-height:107%;
	font-size:11.0pt;
	font-family:"Calibri",sans-serif;}
.MsoPapDefault
	{margin-bottom:8.0pt;
	line-height:107%;}
@page WordSection1
	{size:612.0pt 792.0pt;
	margin:72.0pt 72.0pt 72.0pt 72.0pt;}
div.WordSection1
	{page:WordSection1;}
 /* List Definitions */
 ol
	{margin-bottom:0cm;}
ul
	{margin-bottom:0cm;}
-->
</style>

</head>

<body lang=EN-IN style='word-wrap:break-word'>

<div class=WordSection1>

<table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0
 style='margin-left:7.55pt;border-collapse:collapse;border:none'>
 <tr style='height:90.0pt'>
  <td width=98 valign=top style='width:73.2pt;border:solid windowtext 1.0pt;
  background:#FBE4D5;padding:0cm 5.4pt 0cm 5.4pt;height:90.0pt'>
  <p class=MsoNormal><span lang=EN-US style='color:black'>Value-0,1</span></p>
  </td>
  <td width=90 valign=top style='width:67.8pt;border:solid windowtext 1.0pt;
  border-left:none;background:#FBE4D5;padding:0cm 5.4pt 0cm 5.4pt;height:90.0pt'>
  <p class=MsoNormal><span lang=EN-US style='color:black'>Value-0,2</span></p>
  </td>
  <td width=95 valign=top style='width:71.4pt;border:solid windowtext 1.0pt;
  border-left:none;background:#FBE4D5;padding:0cm 5.4pt 0cm 5.4pt;height:90.0pt'>
  <p class=MsoNormal><span lang=EN-US style='color:black'>Value-0,3</span></p>
  </td>
  <td width=65 valign=top style='width:48.6pt;border:solid windowtext 1.0pt;
  border-left:none;background:#FBE4D5;padding:0cm 5.4pt 0cm 5.4pt;height:90.0pt'>
  <p class=MsoNormal><span lang=EN-US style='color:black'>Value-0,4</span></p>
  <p class=MsoNormal><span lang=EN-US>&nbsp;</span></p>
  </td>
  <td width=183 valign=top style='width:137.4pt;border:solid windowtext 1.0pt;
  border-left:none;background:#FBE4D5;padding:0cm 5.4pt 0cm 5.4pt;height:90.0pt'>
  <p class=MsoNormal><span lang=EN-US style='color:black'>Value-0,5</span></p>
  <table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0
   style='margin-left:15.95pt;border-collapse:collapse;border:none'>
   <tr style='height:55.2pt'>
    <td width=136 valign=top style='width:102.0pt;border:solid windowtext 1.0pt;
    padding:0cm 5.4pt 0cm 5.4pt;height:55.2pt'>
    <p class=MsoNormal><span lang=EN-US>&nbsp;</span></p>
    <p class=MsoNormal><span lang=EN-US>Inside Table value</span></p>
    </td>
   </tr>
  </table>
  <p class=MsoNormal></p>
  </td>
 </tr>
</table>

<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p>

</div>

</body>

</html>"""

rst_table = html2rst(html_table)
print(rst_table)