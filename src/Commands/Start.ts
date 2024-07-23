// @ts-nocheck
import Embed from '../Components/Embed'
import Message from '../Components/Message'
import Discord from '../Platforms/Discord'
import Telegram from '../Platforms/Telegram'
import { Command, Context, DiscordContext, Platform } from '../interfaces'

/**
 * Welcome message for the bot when it is first run in Telegram
 */
export default class Start implements Command {
	public name = 'start'
	public description = {
		en: 'Welcome message from the bot :D',
		fr: 'Message de bienvenue du bot :D'
	}

	public async execute(ctx: DiscordContext) {
		const discord = (ctx.platform as Discord)
		const messages = await discord.listMessages(ctx.channel)
		const scoreboard = messages
			.find((it) => it.author.id === discord.client.user!.id && it.embeds.find((ebd) => ebd.title === 'Scoreboard'))
		if (scoreboard) {
			return 'scoreboard is already setup !'
		}
		// return JSON.stringify(res)
		return new Message().embed(
			new Embed('Scoreboard', `\`\`\`
				| User      | Chocoblasted |
				| --------- | ------------ |
				\`\`\`
			`.replace(/\n\t+/g, '\n').trim())
		)
	}
}
