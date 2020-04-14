const assert = require('chai').assert;

describe('simple scenarios', function () {
	it('init. должен показать строку инициализации приложения', function () {
		return this.browser
			.url('/')
			.getText('.initerror-full span')
			// .waitUntil(() => this.browser.getText('.header__title'), 5000)
			.then(function (v) {
				assert.equal(v, 'Инициализируем приложение...')
			});
	});
	it('init. t+ 2000, должен показать #HistoryPage', function () {

		const xStr = '#HistoryPage'

		return this.browser
			.url('/')
			.waitForExist(xStr, 3000)
			.then(function (v) {
				assert.isTrue(v)
			});
	});
	it('init. t+ 2000. url /settings. должен показать #SettingsPage', function () {

		const xStr = '#SettingsPage'

		return this.browser
			.url('/settings')
			.waitForExist(xStr, 3000)
			.then(function (v) {
				assert.isTrue(v)
			});
	});
});

