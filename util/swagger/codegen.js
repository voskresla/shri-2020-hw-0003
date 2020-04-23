const fs = require('fs')

const CodeGen = require('swagger-typescript-codegen').CodeGen

const file = 'util/swagger/swagger.json'
const swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'))
const tsSourceCode = CodeGen.getTypescriptCode({
	className: 'Test',
	swagger: swagger,
	// imports: ['../../typings/tsd.d.ts'],
})
console.log(tsSourceCode)
