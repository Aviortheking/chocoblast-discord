// @ts-nocheck

import TCGdex, { SetResume } from '@tcgdex/sdk'
import ActionRow from '../Components/Components/ActionRow'
import Select from '../Components/Components/Select'
import Embed from '../Components/Embed'
import Message from '../Components/Message'
import CardEmbed from '../Embeds/CardEmbed'
import Discord from '../Platforms/Discord'
import { getTCGdexLang, t } from '../Utils'
import { buildScoreboard, findScoreboard, parseScoreboard } from '../chocoUtils'
import { Command, CommandOptionType, CommandOptions, Context, DiscordContext } from '../interfaces'
import texts from '../texts'

export default class blast implements Command {
	public name = 'score'
	public description = 'Chocoblast someone'
	public options: Array<CommandOptions> = [{
		name: 'action',
		description: 'the action you want to do (\'add\', \'remove\', \'reload\')',
		required: true,
		type: CommandOptionType.STRING,
		choices: [{
			name: {
				en: 'Add',
				fr: 'Ajouter'
			},
			value: 'add'
		}, {
			name: {
				en: 'Remove',
				fr: 'Enlever'
			},
			value: 'remove'
		}, {
			name: {
				en: 'Reload',
				fr: 'Recharger'
			},
			value: 'reload'
		}]
	}, {
		name: 'user',
		description: 'The user to run on',
		required: false,
		type: CommandOptionType.USER
	}, {
		name: 'score',
		description: 'the score change',
		required: false,
		type: CommandOptionType.INTEGER
	}]

	// eslint-disable-next-line complexity
	public async execute(ctx: DiscordContext) {
		if (!ctx.author) {
			return 'hum, I can\'t find who you are...'
		}
		const discord = ctx.platform as Discord
		const [ action, userTemp, changeTemp ] = ctx.args

		const scoreboard = await findScoreboard(ctx)
		const scores = parseScoreboard(scoreboard.embeds[0].description)
		let change = 0

		if (action !== 'reload') {
			const user = (await discord.getUser(userTemp))?.displayName ?? userTemp
			change = action === 'remove' ? -Number.parseInt(changeTemp, 10) : Number.parseInt(changeTemp, 10)
			if (Number.isNaN(change)) {
				return 'please indicate a number !'
			}
			let found = false
			for (const score of scores) {
				if (score.user === user || Number.isNaN(score.score)) {
					score.score += change
					found = true
				}
			}
			if (!found) {
				scores.push({user: user, score: change})
			}
		}

		const description = buildScoreboard(scores)
		scoreboard.edit(discord.formatMessage(new Message('Chocoblast scoreboard, to chocoblast someone, go on the victom computer and type in this channel `@Chocoblast` or `/blast`.').embed(new Embed('Scoreboard', description))))

		if (action === 'reload') {
			return 'reloaded the scoreboard'
		}

		return `Added ${change} points to ${userTemp}`
	}
}
