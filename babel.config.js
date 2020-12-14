module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "entry",
                "corejs": 2,
                "modules": false
                // "debug": true
            }
        ]
    ],
    "plugins": [
        ["import", {
            "libraryName": "vant",
            "libraryDirectory": "es",
            "style": (name) => `${name}/style/less`
        }, "vant"]
    ]
}