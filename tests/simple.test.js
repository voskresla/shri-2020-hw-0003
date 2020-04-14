// import mock from "xhr-mock";
// import axios from "axios";
const request = require('supertest')
const yndx_db_api = require("../api/yndx_ci");

jest.mock("../api/yndx_ci")

describe("simple test echo", () => {

	let server;

	beforeEach(() => {
		server = require('../index');

	})

	beforeEach(() => {
		server.close()

	})

	it.only("respond to GET /api/settings", async () => {

		expect(yndx_db_api.get('conf')).toBe(200)
	});
	it.only("respond to GET /api/settings", async () => {

		expect(yndx_db_api.get('')).toBe(50)
	});
})

describe("simple test echo", () => {
	it("simple test", () => {
		expect(true).toBe(true)
	});
})

describe("simple test echo", () => {

	beforeEach(() => {
		mock.setup();
	});

	afterEach(() => {
		mock.teardown();
	});

	it("GET api/settings", () => {
		mock.get("/api/settings", (req, res) => {
			console.log('fire')
			expect(req.method()).toBe("GET");
			return res.status(201);
		});

		return axios.get('/api/settings').then((r) => {
			expect(r.status).toBe(200)
		})
	});
})