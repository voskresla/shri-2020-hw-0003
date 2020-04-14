module.exports = {
    sets: {
        desktop: {
            files: 'tests/desktop'
        }
    },

    browsers: {
        firefox: {
            desiredCapabilities: {
                browserName: 'firefox',
            }
        }
    },
    baseUrl: 'http://localhost:3000/',
    retry: 3
};