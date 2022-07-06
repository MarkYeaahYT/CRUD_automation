const fs = require('fs')

fs.readFile('../stub/StubController.stub', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  });