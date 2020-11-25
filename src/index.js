const floofClient = require(`./Structures/floofClient`);
const config = require(`./config.json`);

// eslint-disable-next-line new-cap
const client = new floofClient(config);
client.start();
