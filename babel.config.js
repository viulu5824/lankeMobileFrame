module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": 2,
                "modules": false
                // "debug": true
            }
        ]
    ],
    "plugins": [
        "@babel/plugin-transform-runtime",
        //babel-plugin-import按需引入vant
        ["import", {
            "libraryName": "vant",
            "libraryDirectory": "es",
            "style": (name) => `${name}/style/less`
        }, "vant"]
    ]
}