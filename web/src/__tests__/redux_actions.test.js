import { getCurrentBuildByNumber } from '../actions/index'

const axiosMock = require('../__mocks__/axios').default;
import { actionsTypeCONST } from '../actions/index'

afterEach(() => {
	jest.clearAllMocks()
});

describe('test complex async store actions', () => {

	// Сначала я попробовал jest-mock-axios. Но.
	// jest-mock-axios не умеет перехватить два async запроса в одной функции. Попробуем классический __mock__.
	// https://github.com/knee-cola/jest-mock-axios/issues/46#issuecomment-590872893

	// Потом я попробовал axios-mock-adapter. Но.
	// Он не умеет отдавать statusText, а у меня на него завязано. Пропатчить библиотеку - быстро не вышло.
	// https://github.com/ctimmerm/axios-mock-adapter/issues/151

	// Поэтому потом я сделал мок сам ) Поэтому тестов мало, но, разобрался наконец-то. 
	// Сейчас выглядит как обычно - "а в чем тут вобще разбираться". Но так всегда, когда разобрался.

	const buildNumber = 34
	it('getCurrentBuildByNumber action -> получает сборку по номеру + получает лог', async () => {

		const actions = []
		const acceptedActions = [
			actionsTypeCONST.FETCH_BUILD_BY_NUMBER_SUCCESS,
			actionsTypeCONST.FETCH_LOG_BY_BUILD_ID_SUCCESS
		]
		axiosMock.get.mockImplementationOnce(() => Promise.resolve({ status: 200, statusText: 'OK', data: { id: buildNumber } }));
		axiosMock.get.mockImplementationOnce(() => Promise.resolve({ status: 200, statusText: 'OK' }));

		const dispatch = jest.fn(({ type }) => actions.push(type))

		await getCurrentBuildByNumber(buildNumber)(dispatch)

		expect(axiosMock.get).toHaveBeenCalledTimes(2)
		expect(actions.sort()).toEqual(acceptedActions.sort())
	});

	it('getCurrentBuildByNumber action -> получает сборку по номеру + корректно обрабатывает ошибку получения лога', async () => {

		const actions = []
		const acceptedActions = [
			actionsTypeCONST.FETCH_BUILD_BY_NUMBER_SUCCESS,
			actionsTypeCONST.FETCH_LOG_BY_BUILD_ID_ERROR
		]
		axiosMock.get.mockImplementationOnce(() => Promise.resolve({ status: 200, statusText: 'OK', data: { id: buildNumber } }));
		axiosMock.get.mockImplementationOnce(() => Promise.resolve({ status: 200, statusText: 'ERROR', data: { message: 'error message' } }));

		const dispatch = jest.fn(({ type }) => actions.push(type))

		await getCurrentBuildByNumber(buildNumber)(dispatch)

		expect(axiosMock.get).toHaveBeenCalledTimes(2)
		expect(acceptedActions.sort()).toEqual(actions.sort())
	});

	it('getCurrentBuildByNumber action -> есть сообщение об ошибке получения лога', async () => {

		const actions = []
		const acceptedActions = [
			{ type: actionsTypeCONST.FETCH_BUILD_BY_NUMBER_SUCCESS, payload: { id: buildNumber } },
			{ type: actionsTypeCONST.FETCH_LOG_BY_BUILD_ID_ERROR, payload: 'error message' }
		]
		axiosMock.get.mockImplementationOnce(() => Promise.resolve({ status: 200, statusText: 'OK', data: { id: buildNumber } }));
		axiosMock.get.mockImplementationOnce(() => Promise.resolve({ status: 200, statusText: 'ERROR', data: { message: 'error message' } }));

		const dispatch = jest.fn(({ type, payload }) => actions.push({ type, payload }))

		await getCurrentBuildByNumber(buildNumber)(dispatch)

		expect(axiosMock.get).toHaveBeenCalledTimes(2)
		expect(acceptedActions).toEqual(actions)
	});

	it('getCurrentBuildByNumber action -> корректно обрабатывает ошибку получения сборки, не вызывает лишнего xhr', async () => {

		const actions = []
		const acceptedActions = [
			{ type: actionsTypeCONST.FETCH_BUILD_BY_NUMBER_ERROR, payload: 'error message' },
		]
		axiosMock.get.mockImplementationOnce(() => Promise.resolve({ status: 200, statusText: 'ERROR', data: { message: 'error message' } }));

		const dispatch = jest.fn(({ type, payload }) => actions.push({ type, payload }))

		await getCurrentBuildByNumber(buildNumber)(dispatch)

		expect(axiosMock.get).toHaveBeenCalledTimes(1)
		expect(acceptedActions).toEqual(actions)
	});

	it('getCurrentBuildByNumber action -> корретно обрабатывает не переданые параметры, не вызывает лишнего xhr', async () => {

		axiosMock.get.mockImplementationOnce(() => Promise.resolve({ status: '200', statusText: 'ERROR', data: { message: 'error message' } }));

		const dispatch = jest.fn(({ type, payload }) => actions.push({ type, payload }))

		await getCurrentBuildByNumber()(dispatch)

		expect(axiosMock.get).toHaveBeenCalledTimes(0)

	});
});

// REVIEW: А это пруфы предыдущих эксперименты с различными библиотеками. 

// afterEach(() => {
// 	mockAxios.reset();
// });

// describe('test simple async store actions', () => {
// 	test('getSettingsFromYNDX action -> 200', async () => {

// 		let dispatch = jest.fn();

// 		const promise = getSettingsFromYNDX()(dispatch)

// 		mockAxios.mockResponse({
// 			status: 200,
// 			statusText: 'OK',
// 		});
// 		expect(mockAxios.get).toHaveBeenCalledWith('/settings');

// 		const result = await promise;

// 		expect(dispatch).toBeCalledWith({ payload: {}, type: "SAVE_SETTINGS_TO_REDUX" });
// 	});
// 	test('getSettingsFromYNDX action -> error', async () => {

// 		let dispatch = jest.fn();

// 		const promise = getSettingsFromYNDX()(dispatch)

// 		mockAxios.mockError()
// 		expect(mockAxios.get).toHaveBeenCalledWith('/settings');

// 		const result = await promise;

// 		expect(dispatch).toBeCalledWith({ type: "FETCH_SETTINGS_ERROR" });
// 		expect(dispatch).toHaveBeenCalledTimes(1);
// 	});

// 	test('getSettingsFromYNDX action -> reducer -> correct store', async () => {
// 		const promise = getSettingsFromYNDX()(store.dispatch)

// 		mockAxios.mockResponse({
// 			status: 200,
// 			statusText: 'OK',
// 			data: settings
// 		});
// 		expect(mockAxios.get).toHaveBeenCalledWith('/settings');

// 		const result = await promise;

// 		expect(store.getState().settings.conf).toMatchObject(settings);
// 	});
// });

