import FitParser from 'fit-file-parser'


// Require the module
// var FitParser = require('./../dist/fit-file-parser.js').default;

// Read a .FIT file
var fs = require('fs');
fs.readFile('./example.fit', function (err, content) {

  // Create a FitParser instance (options argument is optional)
  var fitParser = new FitParser({
    force: true,
    speedUnit: 'km/h',
    lengthUnit: 'km',
    temperatureUnit: 'kelvin',
    elapsedRecordField: true,
    mode: 'cascade',
  });
  
  // Parse your file
  fitParser.parse(content, function (error, data) {
  
    // Handle result of parse method
    if (error) {
      console.log(error);
    } else {
      console.log(JSON.stringify(data));
    }
  });
  
});