import fs from 'fs'
import path from 'path'
import { spawn, exec } from 'child_process'

import { Settings } from '../routes/routes'

export type GetCommitInfo = (commitHash: string, settings: Settings) => Promise<CommitInfo>

export interface CommitInfo {
	commitMessage: string
	commitHash: string
	branchName: string
	authorName: string
}

export const getCommitInfo: GetCommitInfo = (commitHash, settings) => {
	console.log('in get commit info', settings)
	const repository = settings.repoName.split('/')[1]
	return new Promise((resolve, reject) => {
		exec(
			`git log --format="%H|%an|%s|%D" | grep ${commitHash} -m 1`,
			{
				cwd: path.join(process.cwd(), 'repos', repository),
			},
			(error, stdout) => {
				if (error) {
					console.log(error)
					reject(`Не смогли найти коммит: ${commitHash}`)
				} else {
					// @ts-ignore
					const buffer = new Buffer.from(stdout).toString('utf8').split('|')

					console.log(buffer)

					const commitMessage = buffer[2]
					const commitHash = buffer[0]
					const branchName = settings.mainBranch
					const authorName = buffer[1]

					// TODO: откуда берем branch? И какая тут логика: ищем по всем веткам /
					// только в ветке из настроек? тогда что значит "любой коммит можно
					// запустить на билд" ?
					const commitInfo = {
						commitMessage,
						commitHash,
						branchName,
						authorName,
					}

					console.log(commitInfo)

					resolve(commitInfo)
				}
			},
		)
	})
}

// gitClone сейчас выполняет функции:
// - проверяет есть ли такой репозиторий уже в папке ./repos
// - если нет пытается склонировать с github
// - если есть то сделает git pull

// gitClone выйдет с reject, если:
// - нет такого репозитория на github или упал clone
// - если упал pull

// gitClone выйдет с resolve, если:
// - удачно склонировали репозиторий
// - удачно прошел pull

export type GitCloneArgs = Pick<Settings, 'repoName' | 'mainBranch'>
export type GitClone = ({ repoName, mainBranch }: GitCloneArgs) => Promise<string>

export const gitClone: GitClone = ({ repoName }) => {
	console.log(`Начинаем клонировать репозиторий ${repoName}`)
	return new Promise((resolve, reject) => {
		const [username, repository] = repoName.split('/')
		// проверяем есть ли уже такой репозиторий
		fs.access(path.join(process.cwd(), 'repos', repository), error => {
			// если такого репозитория нет в папке repos то пытаемся его скачать с
			// гитхаба
			if (error) {
				// myLogger.put(repoName, 'clone-start');

				const clone = spawn('git', [
					'clone',
					`https://github.com/${username}/${repository}.git`,
					path.join(process.cwd(), 'repos', repository),
				])

				clone.on('close', data => {
					if (data == 0) {
						// myLogger.put(repoName, 'clone-success');
						resolve('clone-success')
					}

					// myLogger.put(repoName, 'clone-fail');
					reject('clone-fail')
				})
			}
			// если есть такая папка - делаем гит пул
			// git -C <Path to directory> pull
			else {
				// myLogger.put(repoName, 'pull-start');

				const pull = spawn('git', [
					'-C',
					path.join(process.cwd(), 'repos', repository).toString(),
					'pull',
					'origin',
				])

				// пока предположим что все что не exit code:0 - ошибка
				pull.on('close', data => {
					if (data !== 0) {
						// myLogger.put(repository, 'pull-failed');
						reject('pull - fail')
					}

					// myLogger.put(repoName, 'pull-success');
					resolve('pull - success')
				})
			}
		})
	})
}

// Ищем и забираем послежний коммит из ветки mainBranch из репозитория из
// настроек
// - resolve c хэшем коммита
// - reject если ошибка в git rev-parse

export type GetLastCommit = (settings: Settings) => Promise<CommitInfo['commitHash']>

export const getLastCommit: GetLastCommit = settings => {
	// TODO: как тут избежать ошибки и явно сказать что надо брать вторую часть от split ?
	const repository = settings.repoName.split('/')[1]
	const repoPath = path.join(process.cwd(), 'repos', repository)

	return new Promise((resolve, reject) => {
		const revParse = spawn('git', ['rev-parse', 'HEAD'], { cwd: repoPath })
		revParse.stdout.on('data', data => {
			// @ts-ignore
			const buffer = new Buffer.from(data).toString('utf8').split('\n')
			resolve(buffer[0])
		})
		revParse.on('close', () => reject('rev-parse - fail'))
	})
}
