const Plugin = require('../../structures/Plugin');

module.exports = class CardsAgainstHumanityPlugin extends Plugin {
    constructor(...args) {
        super(...args);
        this.name = 'Cards against humanity';
        this.description = 'Complete the sentence to make the funniest phrase.';
        this.games = {};
    }
    getPhrase(explicit) {
        let file = 'cah.json';
        if (explicit === true) file = 'expl-cah.json';
        const json = require('../../assets/'+file);
        const b = json[0].black.filter(r=>r.pick===1);
        return b[Math.round(Math.random()*b.length)].text;
    }
};