async function loadFile() {
  var fileInput = document.getElementById('fileInput');

  if (fileInput.files.length > 0) {
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = async function (e) {
      var fileContents = e.target.result;
      let data = d3.tsvParse(fileContents);
      drawVis(data);
    };

    reader.readAsText(file);
  } else {
    alert('Please select a file.');
  }
}

async function isCSV(contents) {
  // Check if the content has commas, a common characteristic of CSV files
  try {
    // Try parsing the content as CSV
    let data = d3.csvParse(contents);
    console.log(data);
    return data; // Parsing successful, likely a CSV file
  } catch (error) {
    return false; // Parsing failed, not a CSV file
  }
}

async function isTSV(contents) {
  // Check if the content has tabs, a common characteristic of TSV files
  try {
    // Try parsing the content as TSV
    let data = d3.tsvParse(contents);
    console.log(data);
    return data; // Parsing successful, likely a TSV file
  } catch (error) {
    return false; // Parsing failed, not a TSV file
  }
}

