let axiosMock = jest.genMockFromModule('axios');

axiosMock.create = jest.fn(() => axiosMock)
export default axiosMock
