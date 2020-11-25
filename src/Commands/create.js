const Command = require(`../Structures/Command`);
const node = require(`nodeactyl`);
const App = node.Application;
const host = "";
const api_key = "";

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "create"
        });
    }

    async run(message, args, sql) {

        sql.query(`CREATE TABLE IF NOT EXISTS servers_created(d_id varchar(200), email varchar(200))`, (error) => {
            if(error) console.log(error);
            return;
        })

        await App.login(host, api_key, (logged_in, error) => {
            if (error) return console.log(error);
        })

        if (message.member.bot) {
            message.channel.send(`Sorry only human users can run this command!`);
            message.delete();
            return;
        }

        if (!args[0]) {
            message.channel.send(`Please provide your email to succesfully use this command!`);
            message.delete();
            return;
        }

        let email = args[0];
        const emailFilter = RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        let test = emailFilter.test(email);

        if (!test) {
            message.channel.send('Please provide a valid email adrress!');
            message.delete();
            return;
        }

        let users = await App.getAllUsers();

        let sysCheck = users.find(u => u.attributes.email === email);
        if (sysCheck) {
            message.channel.send(`That email is already registered in our network!`);
            message.delete();
            return;
        }


        sql.query(`SELECT * FROM servers_created where d_id=${message.member.id}`, (error, results, fields) => {

            if (error) return console.log(error);

            if (results.length > 0) {
                message.channel.send(`Sorry, It appears you already have one server created!`)
                message.delete();
                return;
            }

            sql.query(`INSERT INTO servers_created values('${message.member.id}', '${email}')`, async (e) => {
                if (e) {
                    console.log(e);
                }

                let password = createPassword(7);
                let channel = await message.member.user.createDM();
                
                App.createUser(`${message.member.user.username}`, password.toString(), email, 'Server', 'User', false, "en")
                .then(u => {

                    channel.send(`Congratulations on creating your free server and account here at **${message.guild.name}**!

To get started, Please make sure to take note of these important details!

Email: \`${email}\`
Password: \`${password.toString()}\`
Panel: https://panel.floofyhosting.com/

If you have encountered any error, please create a ticket on our server.
                    `)

                      App.createServer("latest", `${message.member.user.username}'s Server`, u.id, null, '46', 'quay.io/parkervcp/pterodactyl-images:debian_openjdk-8-jre', 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}', 2048, 0, 10240, 500, 100, 1, 1);

                });

                message.channel.send(`Successfully created a server for you!`);
                message.delete();
            })

        });
    }
}

function createPassword(length) {

    let result = '';
    let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charLength = char.length;
    for(let i = 0 ; i < length ; i++) {
        result += char.charAt(Math.floor(Math.random() * charLength));
    }
    return result;

} 