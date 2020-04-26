import { spawn, exec } from 'child_process'
import fs from 'fs'
import path from 'path'

import { BuildModel } from '../routes'

import { SettingsModel } from './../routes/settings'

interface QueueBuildInput {
	commitMessage: string
	commitHash: BuildModel['commitHash']
	branchName: string
	authorName: string
}

type GetCommitInfoFn = (commitHash: BuildModel['commitHash'], settings: SettingsModel) => Promise<QueueBuildInput>

export const getCommitInfo: GetCommitInfoFn = (commitHash, settings) => {
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
					reject(`Не смогли найти коммит: ${commitHash}`)
				} else {
					// TODO: возможно тут надо new Buffer
					const buffer = Buffer.from(stdout).toString('utf8').split('|')

					const commitMessage = buffer[2]
					const commitHash = buffer[0]
					const branchName = settings.mainBranch
					const authorName = buffer[1]

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

export interface SerializerSettings {
	repoName: SettingsModel['repoName']
	mainBranch: SettingsModel['mainBranch']
}

// REVIEW: так сделано чтобы можно было брать не только GitCloneStatus.succes, но и 'success'. Тут безтолку, а иногда полезно.
export enum GitCloneStatus {
	success = 'success',
	fail = 'fail',
}

export enum GitPullStatus {
	success = 'success',
	fail = 'fail',
}

export type GitCLoneFn = (
	{ repoName, mainBranch }: SerializerSettings) => Promise<keyof typeof GitCloneStatus | keyof typeof GitPullStatus>

export const gitClone: GitCLoneFn = ({ repoName }) => {
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
						resolve(GitCloneStatus.success)
					}

					// myLogger.put(repoName, 'clone-fail');
					reject(GitCloneStatus.fail)
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
						reject(GitPullStatus.success)
					}

					// myLogger.put(repoName, 'pull-success');
					resolve(GitPullStatus.fail)
				})
			}
		})
	})
}

// Ищем и забираем послежний коммит из ветки mainBranch из репозитория из
// настроек
// - resolve c хэшем коммита
// - reject если ошибка в git rev-parse

export type GetLastCommitFn = (settings: SettingsModel) => Promise<string>

export const getLastCommit: GetLastCommitFn = (settings) => {
	const repository = settings.repoName.split('/')[0]
	const repoPath = path.join(process.cwd(), 'repos', repository)

	return new Promise((resolve, reject) => {
		const revParse = spawn('git', ['rev-parse', 'HEAD'], { cwd: repoPath })
		revParse.stdout.on('data', data => {
			// TODO:  возможно надо new Buffer
			const buffer = Buffer.from(data).toString('utf8').split('\n')
			resolve(buffer[0])
		})
		revParse.on('close', () => reject('rev-parse - fail'))
	})
}
