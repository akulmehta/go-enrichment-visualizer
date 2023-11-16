# GO Enrichment Visualizer

A small web application to be able to visualize data from a GO Enrichment Analysis in multiple dimensions using D3js.

## To Use:

You can use this application online directly at the [GlycoToolkit website](https://glycotoolkit.com/Tools/GOEnrichmentVisualizer/)

1] Create a tab delimited text file with the following structure of columns: 

| index	| go | fold_enrichment | log_fdr | gene_count|
| ----- | --- | -------------- | ------- | --------- |
| 1 | septate junction (GO:0005918) |  > 100 | 2.9136 | 2 |

Where: 
  - index : numerical index of the go term
  - go : The GO term
  - fold_enrichment : The fold enrichment of the GO term
  - log_fdr : The -Log10(FDR)
  - gene_count : The number of genes associated with the GO term.

This file can be created using Excel and saved as a `Text (Tab delimited) (*.txt)` file.

The output file should look like the [example_data](https://github.com/akulmehta/go-enrichment-visualizer/blob/main/example_data.txt) file provided in this repository.

2] Open the GO Visualizer and click on the file input field to locate the file on your computer.
3] Click on the "Load File" button to load the file and see the data visualization.
4] Click on the "Save SVG" button to save the data visualization as an SVG vector graphic image which can be edited in most illustration applications (e.g. Inkscape).
