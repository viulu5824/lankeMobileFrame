//正则验证函数

//验证数字
export const testNumber = (val) => {
    return {
        regex: /^\d+(\.\d+)?$/,
        result: /^\d+(\.\d+)?$/.test(val)
    };
}
//验证身份证
export const testIDcard = (val) => {
    return {
        regex: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/,
        result: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/.test(val)
    };
}
//验证手机号
export const testPhone = (val) => {
    return {
        regex: /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/,
        result: /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/.test(val)
    }
}