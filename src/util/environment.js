//区分运行环境

const ua = navigator.userAgent;

export const isWX = ua.toLowerCase().indexOf('micromessenger') !== -1;
export const isWindowsPhone = /(?:Windows Phone)/.test(ua)
export const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
export const isAndroid = /(?:Android)/.test(ua);
export const isFireFox = /(?:Firefox)/.test(ua);
export const isChrome = /(?:Chrome|CriOS)/.test(ua)
export const isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
export const isIphone = /(?:iPhone)/.test(ua) && !isTablet
export const isPc = !isIphone && !isAndroid && !isSymbian;