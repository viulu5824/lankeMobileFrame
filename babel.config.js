module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": {
                    "version": 3,
                    "proposals": true,
                },
                "modules": false,
                "debug": process.env.NODE_ENV!="production",
            }
        ]
    ],
    "plugins": [
        ["import", {
            "libraryName": "vant",
            "libraryDirectory": "es",
            "style": (name) => `${name}/style/less`,
        }, "vant"]
    ]
}