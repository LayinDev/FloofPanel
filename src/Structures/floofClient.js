const {
	Client, Collection
} = require(`discord.js`);
const Util = require(`./Util.js`);

module.exports = class floofClient extends Client {

	constructor(options = {}) {
		super({
			disableMentions: 'everyone'
		});
		this.validate(options);

		this.commands = new Collection();
		this.aliases = new Collection();
		this.utils = new Util(this);
		this.owners = options.owners;
		this.events = new Collection();
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError(`Options should be a type of Object.`);

		if (!options.token) throw new Error(`You must include a token for the client!`);
		this.token = options.token;

		if (!options.prefix) throw new Error(`You must provide a prefix that the client will recognize.`);
		if (typeof options.prefix !== 'string') throw new TypeError(`Prefix should be in a string type`);
		this.prefix = options.prefix;
	}

	// eslint-disable-next-line no-unused-vars
	async start(token = this.token) {
		this.utils.loadCommands();
		this.utils.loadEvents();
		super.login();
	}

};
