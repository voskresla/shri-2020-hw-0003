// import { gitClone } from '../../child_process'

// // const fsMock = require('./__mocks__').default;
// // const fs = require('fs');
// // let fsMock = jest.genMockFromModule('fs');
// const fs = require('fs');
// jest.mock('fs');

// describe('simple echo test', () => {
//     it('should ', () => {
//         expect(true).toBe(true);
//     });
// });

// describe('Test child_process api', () => {
//     it.only('gitClone', async () => {

//         const repoName = 'voskresla/voskresla.github.io'
//         const mainBranch = 'master'
//         fs.access = jest.fn()
//         fs.access.mockReturnValue(Promise.resolve())
//         // fsMock.access = jest.fn()
//         await gitClone({ repoName, mainBranch })
//         expect(fs.access).toHaveBeenCalledTimes(1)
//         expect(true).toBe(true);
//     });
// });
