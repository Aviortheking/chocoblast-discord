// @ts-nocheck
import Discord from './Platforms/Discord'
import { DiscordContext } from './interfaces'

export type ScoreList = Array<{user: string, score: number}>

export function buildScoreboard(list: ScoreList) {
	list = list.filter((it) => it.score !== 0 && !Number.isNaN(it.score)).sort((a, b) => b.score - a.score)
	const userSize = list.reduce((p, c) => Math.max(c.user.length, p), 4)
	const scoreSize = list.reduce((p, c) => Math.max(c.score.toString().length, p), 12)
	return `\`\`\`
| User${''.padEnd(userSize - 4, ' ')} | Chocoblasted |
| ${''.padEnd(userSize, '-')} | ------------ |
${list.map((it) => `| ${it.user.padEnd(userSize, ' ')} | ${it.score.toString().padEnd(scoreSize, ' ')} |`).join('\n')}
\`\`\``
}

export async function findScoreboard(ctx: DiscordContext) {
	const discord = ctx.platform as Discord
	const messages = await discord.listMessages(ctx.channel)
	return messages
		.find((it) => it.author.id === discord.client.user!.id && it.embeds.find((ebd) => ebd.title === 'Scoreboard'))
}

export function parseScoreboard(str: string): ScoreList {
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
