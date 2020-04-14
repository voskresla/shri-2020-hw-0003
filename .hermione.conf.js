module.exports = {
    sets: {
        desktop: {
            files: 'tests/desktop'
        }
    },

    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: 'firefox',
            }
        }
    },
    baseUrl: 'http://localhost:3000/'
};