const Event = require('../Structures/Event');
const db = require(`../Structures/Database`);

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}
	async run() {
		console.log(`Logged in as ${this.client.user.username}`);
		db.startDatabase();
	}

};
