const assert = require('chai').assert;
const expect = require('chai').expect;

/**
 *  1. Run build - complex scenarios /build/*
 * 		- переходит в детальную информацию сборки
 * 		- ставит ее на Rebuild
 * 		- история сборок обновляется
 * 	2. New Settings - complex scenarios /settings
 * 		- Переходит на страницу настроек
 * 		- Заполняет inputs новыми настройками
 * 		- Сохраняет настройки
 * 		- Переходит на главную по кнопке Cancel
 * 		- В списке сборок появился коммит из репозитория из новых настроек
 * 		- Снова переходит на страницу настроек
 * 		- Новые настройки применились
 * 
 */

describe('complex scenarios /build/*', function () {
	it('Можно перейти в детальную карточку сборки и поставить ее на rebuild', async function () {
		await this.browser.url('/').waitForExist('.card_summary', 3000)

		const cards = await this.browser.getText('.card_summary')
		expect(cards.length).gt(5)

		const cardList = await this.browser.$$('.card_summary')
		this.browser.click(cardList[0].selector)

		await this.browser.waitForExist('.pre', 1000)
		await this.browser.getText('.pre').then((r) => assert.equal(r, '...загрузка логов'))

		await this.browser.waitUntil(async () => {
			const text = await this.browser.getText('.pre')
			return text !== '...загрузка логов'
		}, 3000)

		const cardPrevNumber = await this.browser.getText('.card__number')
		const cardPrevMessage = await this.browser.getText('.card__message')

		const buttons = await this.browser.$('#rebuild_button')
		this.browser.click(buttons.selector)

		await this.browser.waitUntil(async () => {
			const cardNextNumber = await this.browser.getText('.card__number')
			// assert.equal(text, 'Для этой сборки еще нет логов')
			return cardNextNumber !== cardPrevNumber
		}, 4000)

		const cardNextNumber = await this.browser.getText('.card__number')
		const cardNextMessage = await this.browser.getText('.card__message')

		expect(cardPrevNumber).not.to.equal(cardNextNumber)
		expect(cardPrevMessage).to.equal(cardNextMessage)

		await this.browser.click('.header__title a')


		await this.browser.getUrl().then(r => {
			expect(r).to.equal('http://localhost:3000/')
		})

	});

});

describe('complex scenarios /settings', function () {
	it('Заполняет новые настройки. Первая сборка в истории = последнему коммиту из новых настроек', async function () {
		await this.browser.url('/').waitForExist('.card_summary', 3000)

		await this.browser.click('button#settings')

		await this.browser.getUrl().then(r => expect(r).to.equal('http://localhost:3000/settings'))
		await this.browser.waitForExist('form', 2000)

		const repoName = 'voskresla/voskresla.github.io'
		const buildCommand = 'npm run build && npm run test'
		const mainBranch = 'master'

		await this.browser.$('#repoName').setValue(repoName)
		await this.browser.$('#buildCommand').setValue(buildCommand)
		await this.browser.$('#mainBranch').setValue(mainBranch)

		const saveButton = await this.browser.$('.form__controls > button')

		await this.browser.click(saveButton.selector)
		await this.browser.getText(saveButton.selector).then(r => expect(r[0]).to.equal('Fetching & Cloning..'))

		await this.browser.waitUntil(async () => {
			const buttonText = await this.browser.getText(saveButton.selector)
			return buttonText[0] === 'Save'
		}, 10000)

		await this.browser.click('.header__title a')

		const cardMessage = await this.browser.getText('.card__message')

		expect(cardMessage[0]).to.equal('main.js')

		// await this.browser.pause(10000)

		// const cards = await this.browser.getText('.card_summary')
		// expect(cards.length).gt(5)

		// const cardList = await this.browser.$$('.card_summary')
		// this.browser.click(cardList[0].selector)

		// await this.browser.waitForExist('.pre', 1000)
		// await this.browser.getText('.pre').then((r) => assert.equal(r, '...загрузка логов'))

		// await this.browser.waitUntil(async () => {
		// 	const text = await this.browser.getText('.pre')
		// 	return text !== '...загрузка логов'
		// }, 3000)

		// const cardPrevNumber = await this.browser.getText('.card__number')
		// const cardPrevMessage = await this.browser.getText('.card__message')

		// const buttons = await this.browser.$('#rebuild_button')
		// this.browser.click(buttons.selector)

		// await this.browser.waitUntil(async () => {
		// 	const cardNextNumber = await this.browser.getText('.card__number')
		// 	// assert.equal(text, 'Для этой сборки еще нет логов')
		// 	return cardNextNumber !== cardPrevNumber
		// }, 4000)

		// const cardNextNumber = await this.browser.getText('.card__number')
		// const cardNextMessage = await this.browser.getText('.card__message')

		// expect(cardPrevNumber).not.to.equal(cardNextNumber)
		// expect(cardPrevMessage).to.equal(cardNextMessage)

		// await this.browser.click('.header__title a')


		// await this.browser.getUrl().then(r => {
		// 	expect(r).to.equal('http://localhost:3000/')
		// })

	});

});

