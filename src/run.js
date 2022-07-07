const fs = require('fs');
const controller = require('./controller')
const views = require('./views')
const script = require('./script')

fs.readFile('data.json', 'utf8', (err, data) => {
	if (err) {
		console.error(err);
        return;
    }

    data = JSON.parse(data)

    fs.mkdirSync(`../export/${data.namespace}`, { recursive: true })
	fs.mkdirSync(`../export/${data.namespace}/view`, { recursive: true })

	let cont = new controller(data)
	let view = new views(data)
	let sc = new script(data)
	
    cont.exportbois()
    view.exportbois()
    sc.exportbois()

	// console.log('Well Done..🚀')

});