require('dotenv').config()

const api = require('../api/yndx_ci')

const prepareForTest = () => {
	return api.delete('/conf')
		.then(() => {
			console.log('Удалили старые настрйоки.')
			return api.post('/conf',
				{
					repoName: 'voskresla/voskresla.github.io',
					buildCommand: 'npm run build',
					mainBranch: 'master',
					period: 20
				})
		}
		)
		.then(() => {
			console.log('Насовываем билды')

			const builds = [
				{
					"commitMessage": "main.js",
					"commitHash": "98a11e49f1c3e78e05880b4b78a3fbb2a71d53ea",
					"branchName": "master",
					"authorName": "Stepan Polevshchikov",
				},
				{
					"commitMessage": "main.js",
					"commitHash": "98a11e49f1c3e78e05880b4b78a3fbb2a71d53ea",
					"branchName": "master",
					"authorName": "Stepan Polevshchikov",
				},
				{
					"commitMessage": "main.js",
					"commitHash": "98a11e49f1c3e78e05880b4b78a3fbb2a71d53ea",
					"branchName": "master",
					"authorName": "Stepan Polevshchikov",
				},
				{
					"commitMessage": "main.js",
					"commitHash": "98a11e49f1c3e78e05880b4b78a3fbb2a71d53ea",
					"branchName": "master",
					"authorName": "Stepan Polevshchikov",
				},
				{
					"commitMessage": "main.js",
					"commitHash": "98a11e49f1c3e78e05880b4b78a3fbb2a71d53ea",
					"branchName": "master",
					"authorName": "Stepan Polevshchikov",
				},
				{
					"commitMessage": "main.js",
					"commitHash": "98a11e49f1c3e78e05880b4b78a3fbb2a71d53ea",
					"branchName": "master",
					"authorName": "Stepan Polevshchikov",
				},
				{
					"commitMessage": "main.js",
					"commitHash": "98a11e49f1c3e78e05880b4b78a3fbb2a71d53ea",
					"branchName": "master",
					"authorName": "Stepan Polevshchikov",
				},
				{
					"commitMessage": "main.js",
					"commitHash": "98a11e49f1c3e78e05880b4b78a3fbb2a71d53ea",
					"branchName": "master",
					"authorName": "Stepan Polevshchikov",
				},
				{
					"commitMessage": "main.js",
					"commitHash": "98a11e49f1c3e78e05880b4b78a3fbb2a71d53ea",
					"branchName": "master",
					"authorName": "Stepan Polevshchikov",
				},
				{
					"commitMessage": "main.js",
					"commitHash": "98a11e49f1c3e78e05880b4b78a3fbb2a71d53ea",
					"branchName": "master",
					"authorName": "Stepan Polevshchikov",
				},
				{
					"commitMessage": "main.js",
					"commitHash": "98a11e49f1c3e78e05880b4b78a3fbb2a71d53ea",
					"branchName": "master",
					"authorName": "Stepan Polevshchikov",
				},
			]


			const promisesArray = builds.map((e, i) =>
				new Promise(resolve => setTimeout(() => {
					console.log(`№:`, i);
					resolve(api.post("/build/request", e))
				},
					Math.floor(Math.random() * (1000 - 2000 + 1) + 2000))
				)
			)

			// console.log(promisesArray)

			return Promise.all(promisesArray)


		})
}

prepareForTest().then(r => console.log('Доби свободен.'))
