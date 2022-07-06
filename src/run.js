const fs = require('fs');
const controller = require('./controller')
const views = require('./views')

fs.readFile('controller.json', 'utf8', (err, data) => {
	if (err) {
		console.error(err);
        return;
    }

	let cont = new controller(JSON.parse(data))
	let view = new views(JSON.parse(data))
	
    cont.exportbois()
    // cont.debug()
    view.exportbois()

	console.log('Well Done..🚀')

});