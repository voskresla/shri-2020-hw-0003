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
	it.only('Можно перейти в детальную карточку сборки и поставить ее на rebuild', async function () {
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
	it.only('Можно перейти в детальную карточку сборки и поставить ее на rebuild', async function () {
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

