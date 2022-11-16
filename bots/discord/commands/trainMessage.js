import {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	ActionRowBuilder,
	SelectMenuBuilder,
	ComponentType
} from 'discord.js';
export default {
	data: new ContextMenuCommandBuilder()
		.setName('Train Message')
		.setType(ApplicationCommandType.Message),
	async execute(interaction) {
		const options = [];

		for (const { label } of global.config.responses) {
			options.push({
				label: label,
				description: `The ${label} label.`,
				value: label.toLowerCase()
			});
		}

		const row = new ActionRowBuilder().addComponents(
			new SelectMenuBuilder()
				.setCustomId('select')
				.setPlaceholder('Nothing selected')
				.addOptions(options)
		);
		const reply = await interaction.reply({
			content: 'Please select the corresponding label to train the bot.',
			components: [row],
			ephemeral: true
		});

		const collector = reply.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 15000
		});

		collector.on('collect', (i) => {
			i.client.helper.sendTrainData(
				interaction.targetMessage.content,
				i.values[0].toUpperCase()
			);

			i.reply({ content: 'Sent train data to server.', ephemeral: true });
		});
	}
};
