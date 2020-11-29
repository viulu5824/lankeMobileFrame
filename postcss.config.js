module.exports = {
    plugins: [require("autoprefixer")(), require("postcss-pxtorem")({
        rootValue: 75,
        propList: ['*',"!min-width","!max-width"]
    })]
}