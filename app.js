const Discord = require('discord.js');
require('dotenv').config();
const fetch = require('node-fetch');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
var admin = require("firebase-admin");
const { MessageEmbed } = require('discord.js');
var serviceAccount = require("./servis.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const data = admin.firestore();

client.on('ready', () => {
    console.log('Bot is ready');
});

client.on('message', gotMessage);

const dataget = {
    Player: "",
    Reason: "",
    Blacklisted_By: "",
    Blacklisted_By_Id: 0,
    DateNow: 0,
};


async function gotMessage(msg) {
    if (msg.channel.id === "877590284844797975") {
        var splitted = msg.content.split(' ');
        if (splitted[0] === '!checkbl') {
            const ref = data.collection("Blacklist");
            const snapshot = await ref.get();
            const res = await data.collection('Blacklist').doc(`${splitted[1]}`).get().then(
                doc => {
                    if (doc.exists) {
                        // console.log(doc.id, '=>', doc.data()); //msg.reply works
                        var json = JSON.stringify(doc.data());
                        var warning = `Warning !!! \nPlayer is blacklisted ! \n`;
                        let x = dataget;
                        x = JSON.parse(json);

                        const exampleEmbed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Warning !!! Player is blacklisted !')
                            .setURL('https://discord.js.org/')
                            .addFields(
                                { name: 'Player', value: x.Player, inline: true },
                                { name: 'Blaclisted by', value: "<@" + x.Blacklisted_By_Id + ">", inline: true },
                                // { name: '\u200B', value: '\u200B' },
                                { name: 'Reason', value: x.Reason },
                                { name: 'Date', value: x.DateNow }
                            )
                        msg.reply({ embeds: [exampleEmbed] });
                    }
                    else {
                        msg.reply(`${splitted[1]} is not on the blacklist`)
                    }
                }
            )
        }
        if (splitted[0] === '!blacklist') {
            let text = "";
            for (let i = 2; i < splitted.length; i++) {
                text += splitted[i] + " ";
            }
            if (text === "") {
                text = "No reason is given";
            }
            var objToday = new Date(),
                weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
                dayOfWeek = weekday[objToday.getDay()],
                domEnder = function () { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
                dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
                months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
                curMonth = months[objToday.getMonth()],
                curYear = objToday.getFullYear(),
                curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
                curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
                curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
                curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
            var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;

            data.collection('Blacklist').doc(`${splitted[1]}`).set({
                Player: splitted[1],
                Blacklisted_By: msg.author.username,
                Blacklisted_By_Id: msg.author.id,
                Reason: text,
                DateNow: today
            })
            msg.reply(`${splitted[1]} added to blacklist`);
        }
        if (splitted[0] === '!removeblacklist') {
            const res = await data.collection('Blacklist').doc(`${splitted[1]}`).delete();
            msg.reply(`${splitted[1]} deleted from blacklist`);
        }
    }
}

client.login(process.env.BOT_TOKEN)