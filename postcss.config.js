module.exports = {
    plugins: [require("autoprefixer")(), require("postcss-pxtorem")({
        rootValue: 37.5,
        propList: ['*',"!min-width","!max-width"]
    })]
}