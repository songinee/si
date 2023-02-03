const fs = require("fs")
const path = require("path")
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
let token = require("./config.json").TOKEN;
let PREFIX = process.env.PREFIX;
const client = new Client({ intents: 130815});
PREFIX = `${process.env.PREFIX} `

client.commands = new Collection;

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[주의] ${filePath}커맨드에서 data, excute구문이 발견되지 않았습니다.`);
	}
}

client.once(Events.ClientReady, c => {
    console.info(`반갑습니다! \n ${client.user.username} \n ${client.user.tag} \n ${new Date()}`);
    client.user.setActivity(`도움말: /당근! | ${client.guilds.cache.size}개의 서버와 함께하는 중이에요.`);
})

client.on(Events.InteractionCreate, async interaction => {
    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`커맨드폴더를 찾아봤지만 ${interaction.commandName}과 일치하는 커맨드파일을 찾을수 없었어요`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: `커맨드를 구동하는데 문제가 발생했어요!`, ephemeral: true });
	}
});




client.login(token)