class script{

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
        this.script_stub = this.fs.readFileSync('stub/components/script.stub').toString()
        this.index_stub = this.fs.readFileSync('stub/view/index.stub').toString()
    }

    set_controller_url(){

        this.script_stub = this.script_stub.replaceAll('{{CONTROLLER_URL}}', this.controller.toLowerCase())
        
        return this
    }
    
    set_data_where(){
        
        this.method.hapus.where.forEach(element => {
            this.script += `${element} : _rowdata['${element}'],\n\t\t\t`
		});
        
        this.script_stub = this.script_stub.replace('{{DATA_WHERE}}', this.script)
        
        this.clean_script()
        
        return this
    }
    
    set_primary_key(){
        
        this.script_stub = this.script_stub.replaceAll('{{PRIMARY_KEY}}', this.method.ajaxtable.primary_key)

        return this
    }

    set_breadcrumb(){

        this.index_stub = this.index_stub.replace('{{BREADCRUMB}}', this.breadcrumb)

        return this
    }
    
    set_data_showing(){
        
        let data_showing = ``
        this.method.ajaxtable.data_showing.forEach(element => {
            this.script +=`
            {
                data: "${element}",
            },`;
            data_showing += `<th>${element}</th>\n\t\t\t\t\t\t\t\t`
		});
        
        this.script_stub = this.script_stub.replace('{{DATA_SHOWING}}', this.script)
        this.index_stub = this.index_stub.replace('{{DATA_SHOWING}}', data_showing)

        this.clean_script()

        return this
    }

    clean_script(){

        this.script = ``
    }

    exportbois(){

        this.set_controller_url()
        .set_data_where()
        .set_primary_key()
        .set_breadcrumb()
        .set_data_showing()

        this.index_stub = this.index_stub.replace('{{SCRIPT}}', this.script_stub)

        this.fs.writeFile(`../export/${this.namespace}/view/index.php`, this.index_stub, err => {
            if (err) {
              console.error(err);
            }
            console.log('Generating javascript.. 📜')
        });

    }
}
module.exports = script;