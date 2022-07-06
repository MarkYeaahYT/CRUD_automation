 class controller{

    constructor(object){
		this.fs = require('fs');
        /**
         * assign controller name
         * breadcrumb name and table name
         */
        this.namespace 	 = object.namespace;
        this.controller  = object.controller;
        this.breadcrumb  = object.breadcrumb;
        this.table 		 = object.table;
        this.short_table = object.short_table;

        /**
         * assign method
         */
        this.method = object.method;

		this.script = ``
		this.class_stub = this.fs.readFileSync('stub/components/Class.stub').toString()

    }

	set_namespace(){

		this.class_stub = this.class_stub.replace('{{NAMESPACE}}', this.namespace)

		return this;
	}

	set_breadcrumb(){

		this.class_stub = this.class_stub.replace('{{BREADCRUMB}}', this.breadcrumb)

		return this;
	}

	set_controller(){

		this.class_stub = this.class_stub.replace('{{CONTROLLER}}', this.controller)

		return this;
	}


	set_ajaxtable(){

		let searchable_column = ``
		let order_column = ``
		let data_return = ``

		this.script = this.fs.readFileSync('stub/components/postAjaxtable.stub').toString();
		
		let first = true;
		this.method.ajaxtable.searchable_column.forEach(element => {
			if(first){
				searchable_column += `lower(${this.short_table}.${element}::text) like '$like'\n\t\t\t\t`
				first = false;
			}else{
				searchable_column += `or lower(${this.short_table}.${element}::text) like '$like'\n\t\t\t\t`
			}
		});
		
		for (const [key, value] of Object.entries(this.method.ajaxtable.order_column)) {
			order_column += `'${key}' => '${this.short_table}.${value}',\n\t\t\t`
		}

		this.method.ajaxtable.data_return.forEach(element => {
			data_return += `'${element}' => $items['${element}'],\n\t\t\t\t`
		});

		this.script = this.script.replaceAll('{{TABLE_NAME}}', this.table)
		this.script = this.script.replaceAll('{{SHORT_TABLE_NAME}}', this.short_table)
		this.script = this.script.replace('{{SEARCHABLE_COLUMNN}}', searchable_column)
		this.script = this.script.replace('{{ORDER_COLUMN}}', order_column)
		this.script = this.script.replace('{{DATA_RETURN}}', data_return)

		this.class_stub = this.class_stub.replace('{{AJAXTABLE}}', this.script)

		this.clean_script()

		return this;
	}

	set_post_tambah(){

		let rules = ``
		let data_insert = ``

        this.script = this.fs.readFileSync('stub/components/postTambah.stub');

		this.script = this.script.toString()
		
		this.method.tambah.rules.forEach(element => {
			rules += `'${element}' => 'required',\n\t\t\t`
			data_insert += `'${element}' => $post['${element}'],\n\t\t\t`
		});
		
		this.script = this.script.replace('{{RULES}}', rules)
		this.script = this.script.replace('{{DATA_INSERT}}', data_insert)
		this.script = this.script.replace('{{TABLE_NAME}}', this.table)

		/**
		 * 
		 */
		this.class_stub = this.class_stub.replace('{{POST_TAMBAH}}', this.script)

		this.clean_script()
		
		return this;

	}

	set_post_edit(){

		let rules = ``
		let data_where = ``
		let data_update = ``

        this.script = this.fs.readFileSync('stub/components/postEdit.stub');

		this.script = this.script.toString()
		
		this.method.edit.rules.forEach(element => {
			rules += `'${element}' => 'required',\n\t\t\t`
		});
		
		this.method.edit.where.forEach(element => {
			data_where += `'${element}' => $post['${element}'],\n\t\t\t`
		});
		
		this.method.edit.update.forEach(element => {
			data_update += `'${element}' => $post['${element}'],\n\t\t\t`
		});
		
		this.script = this.script.replace('{{RULES}}', rules)
		this.script = this.script.replace('{{DATA_WHERE}}', data_where)
		this.script = this.script.replace('{{DATA_UPDATE}}', data_update)
		this.script = this.script.replace('{{TABLE_NAME}}', this.table)

		/**
		 * 
		 */
		this.class_stub = this.class_stub.replace('{{POST_EDIT}}', this.script)

		this.clean_script()

		return this;
	}

    set_post_hapus(){
        
		let rules = ``
		let where = ``

        this.script = this.fs.readFileSync('stub/components/postHapus.stub');

		this.script = this.script.toString()
		
		this.method.hapus.where.forEach(element => {
			where += `'${element}' => $post['${element}'],\n\t\t\t`
		});
		
		this.method.hapus.rules.forEach(element => {
			rules += `'${element}' => 'required',\n\t\t\t`
		});

		this.script = this.script.replace('{{RULES}}', rules)
		
		this.script = this.script.replace('{{DATA_WHERE}}', where)
		this.script = this.script.replace('{{TABLE_NAME}}', this.table)

		/**
		 * 
		 */
		this.class_stub = this.class_stub.replace('{{POST_HAPUS}}', this.script)

		this.clean_script()
		
		return this;
    }

	clean_script(){
		/**
		 * clean some piece of code
		 */
		this.script = ``
	}

	debug(){
		console.log('yeay debug')
	}

	exportbois(){

		this.set_namespace()
		.set_breadcrumb()
		.set_controller()
		.set_ajaxtable()
		.set_post_tambah()
		.set_post_edit()
		.set_post_hapus()

		this.fs.mkdirSync(`../export/${this.namespace}`, { recursive: true })
		this.fs.mkdirSync(`../export/${this.namespace}/view`, { recursive: true })

		this.fs.writeFile(`../export/${this.namespace}/${this.controller}Controller.php`, this.class_stub, err => {
			if (err) {
			  console.error(err);
			}
			this.clean_script()
			console.log('Generating backend controller.. 🚓')
		});
	}

}
module.exports = controller;