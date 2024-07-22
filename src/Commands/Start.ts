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
			return 'scoreboard already setup !' + JSON.stringify(this.parseScoreboard(scoreboard.embeds[0].description))
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

	private parseScoreboard(str: string): Array<{user: string, score: number}> {
		const lines = str.split('\n')
		return lines.map((it) => {
			if (!it.includes('|')) {
				return null
			}
			if (it.includes('- | -')) {
				return null
			}
			if (it.includes('| User') && it.includes('| Chocoblasted')) {
				return null
			}
			const middleSep = it.indexOf('|', 2)
			const name = it.slice(1, middleSep)
			const score = it.slice(middleSep + 1, it.length - 1)
			return {user: name.trim(), score: Number.parseInt(score, 10)}
		}).filter((it) => !!it)
	}
}
