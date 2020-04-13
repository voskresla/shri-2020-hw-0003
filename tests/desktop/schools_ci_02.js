const assert = require('chai').assert;
const expect = require('chai').expect;

/**
 *  do: Init
 *  assert: Есть список карточек (.card_summary). Он > 5   
 *  do: click() на карточку
 *  assert: перешли в url /build/*
 *  assert: есть #CardExpand
 *  assert: есть #Log
 *  assert: в #Log -> '...загрузка логов'
 *  do: wait пока '...зыгрузка логов' исчезнет
 *  assert: в #Log есть текст, и это не '...загрузка логов'
 * 
 * 
 * 
 */

describe('complex scenarios /build/*', function () {
    it.only('Можно перейти в детальную карточку сборки.', async function () {
        await this.browser.url('/').waitForExist('.card_summary', 3000)

        const list = await this.browser.getText('.card_summary')
        const list2 = await this.browser.$$('.card_summary')
        // console.log(list2)
        expect(list.length).gt(5)

        await this.browser.click(list2[0].selector)
        await this.browser.waitForExist('.pre', 4000)
        console.log('cliked')
        // await this.browser.click()
    });

});

