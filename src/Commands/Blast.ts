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
	public name = 'blast'
	public description = 'Chocoblast someone'
	public options: Array<CommandOptions> = [{
		name: 'comment',
		description: 'You can add a comment that will also be put back :D',
		required: false,
		type: CommandOptionType.STRING
	}]

	// eslint-disable-next-line complexity
	public async execute(ctx: DiscordContext) {
		if (!ctx.author) {
			return 'hum, I can\'t find who you are...'
		}
		const scoreboard = await findScoreboard(ctx)
		const scores = parseScoreboard(scoreboard.embeds[0].description)
		let found = false
		for (const score of scores) {
			if (score.user === ctx.author.displayName) {
				score.score++
				found = true
			}
		}
		if (!found) {
			scores.push({user: ctx.author.displayName, score: 1})
		}
		const description = buildScoreboard(scores)
		scoreboard.edit((ctx.platform as Discord).formatMessage(new Message('Chocoblast scoreboard, to chocoblast someone, go on the victom computer and type in this channel `@Chocoblast` or `/blast`.').embed(new Embed('Scoreboard', description))))
		return `<@${ctx.author.id}> was chocoblasted ! ${ctx.args.length > 0 ? `he left a message "${ctx.args.join(' ')}"` : ''}`
	}
}
