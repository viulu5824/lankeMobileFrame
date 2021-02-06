import $request from "request";

/**
 * @description 示例复用请求函数
 * @param {Object} ops 
 * @param {String} ops.imgUrl
 */
export function getBase64Img({ imgUrl }) {
    return $request({
        method: "post",
        url: "/perCenter/getFacePic.do",
        serverTypeStr: "fuseApi",
        hasGlobalLoading: true,
        loadingText: "头像获取中",
        data: {
            imgUrl,
        }
    })
}