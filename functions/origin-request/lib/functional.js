const compose2 = (f, g) => (...args) => f(g(...args))
exports.compose = (...fns) => fns.reduce(compose2)
exports.pipe = (...fns) => fns.reduceRight(compose2)
