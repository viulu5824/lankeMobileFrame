const NODE_ENV = process.env.NODE_ENV;
switch (NODE_ENV) {
    case "production":
        window.apiUrl = "";
        break;
    default:
        window.apiUrl = "";
        break;
}
const config = {
    development: {
        apiUrl: "http://localhost:5866",
        baseUrl: "/",
        routerMode: "history",
    },
    production: {
        apiUrl: "",
        baseUrl: "/",
        routerMode: "history",
    },
    test: {
        apiUrl: "",
        baseUrl: "/",
        routerMode: "history",
    },
}
export default config[NODE_ENV];