const Base = require('./Base');
module.exports = class Command extends Base {
    constructor(kottu) {
        super(kottu);
        this.options = this.options || [];
    }    
    validate() {
        if (!this.name || typeof this.name !== 'string') throw new TypeError('U fool, WHERES THE COMMAND NAME!!!!');
        if (!this.description || typeof this.description !== 'string') throw new TypeError('DONT BE LAZY ADD THE COMMAND DESCRIPTION');
        
    }
    /*eslint-disable no-unused-vars */
    execute(interaction) {
        throw new Error('Forgot the execute function');
    }
};