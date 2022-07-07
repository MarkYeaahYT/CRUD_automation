class views{

    constructor(object){
        this.fs = require('fs');
        /**
         * assign controller name
         * breadcrumb name and table name
         */
        this.namespace   = object.namespace;
        this.controller  = object.controller;
        this.breadcrumb  = object.breadcrumb;
        this.table       = object.table;
        this.short_table = object.short_table;

        /**
         * assign method
         */
        this.method = object.method;

		this.script = ``
		this.modal_tambah_stub = this.fs.readFileSync('stub/view/modal_tambah.stub').toString()
		this.modal_edit_stub   = this.fs.readFileSync('stub/view/modal_edit.stub').toString()
		this.modal_detail_stub = this.fs.readFileSync('stub/view/modal_detail.stub').toString()
    }

    /**
     * setting up modal tambah
     */
    set_modal_tambah(){

        let modal_tambah_component  = ``

        this.method.tambah.rules.forEach(element => {
            modal_tambah_component += `
                    <div class="form-group">
                        <label for="${element}">${element}</label>
                        <input type="text" name="${element}" class="form-control" placeholder="Masukan ${element}" required>
                    </div>`
        });
        
        this.modal_tambah_stub = this.modal_tambah_stub.replace('{{CONTROLLER_URL}}', this.controller.toLowerCase())
        this.modal_tambah_stub = this.modal_tambah_stub.replace('{{CONTROLLER}}', this.controller)
        this.modal_tambah_stub = this.modal_tambah_stub.replace('{{MODAL_TAMBAH_COMPONENT}}', modal_tambah_component)

        this.clean_script()

        this.fs.writeFile(`../export/${this.namespace}/view/modal_tambah.php`, this.modal_tambah_stub, err => {
			if (err) {
			  console.error(err);
			}
			console.log('Generating modal tambah..🍕')
		});

        return this
    }

    set_modal_edit(){

        let modal_edit_component  = ``

        this.method.tambah.rules.forEach(element => {
            modal_edit_component += `
                    <div class="form-group">
                        <label for="edit_${element}">${element}</label>
                        <input type="text" name="edit_${element}" class="form-control" placeholder="Masukan ${element}" required>
                    </div>`
        });
        
        this.modal_edit_stub = this.modal_edit_stub.replace('{{CONTROLLER_URL}}', this.controller.toLowerCase())
        this.modal_edit_stub = this.modal_edit_stub.replace('{{CONTROLLER}}', this.controller)
        this.modal_edit_stub = this.modal_edit_stub.replace('{{MODAL_EDIT_COMPONENT}}', modal_edit_component)

        this.clean_script()
        
        this.fs.writeFile(`../export/${this.namespace}/view/modal_edit.php`, this.modal_edit_stub, err => {
            if (err) {
              console.error(err);
            }
            console.log('Generating modal edit..🌮')
        });

        return this
    }
    
    set_modal_detail(){
        
        let modal_detail_component  = ``

        this.method.tambah.rules.forEach(element => {
            modal_detail_component += `
                <div class="row">
                    <div class="col-md-3 text-right">
                        ${element} :
                    </div>
                    <div class="col-md-9">
                        <h5 id="view_${element}"></h5>
                    </div>
                </div>`
        });
        
        this.modal_detail_stub = this.modal_detail_stub.replace('{{CONTROLLER}}', this.controller)
        this.modal_detail_stub = this.modal_detail_stub.replace('{{MODAL_DETAIL_COMPONENT}}', modal_detail_component)

        this.clean_script()

        this.fs.writeFile(`../export/${this.namespace}/view/modal_detail.php`, this.modal_detail_stub, err => {
            if (err) {
              console.error(err);
            }
            console.log('Generating modal detail..🧀')
        });

        return this
    }

    clean_script(){

        this.script = ``
    }

    exportbois(){

        this.set_modal_tambah()
        .set_modal_edit()
        .set_modal_detail()

    }
}

module.exports = views;