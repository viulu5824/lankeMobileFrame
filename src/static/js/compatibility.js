
document.getElementsByTagName("body")[0].innerHTML =
    '<style>' +
    '    .version-tip-fixed {' +
    '        position: fixed;' +
    '        width: 100%;' +
    '        height: 100%;' +
    '        left: 0;' +
    '        top: 0;' +
    '        z-index:10000000;' +
    '        background-color: #dfdfdf;' +
    '    }' +
    '' +
    '    .version-tip-fixed .version-tip-box {' +
    '        width: 600px;' +
    '        margin: 50px auto 0;' +
    '    }' +
    '' +
    '    .version-tip-fixed h1 {' +
    '        font-size: 24px;' +
    '    }' +
    '' +
    '    .version-tip-fixed a {' +
    '        color: #fff;' +
    '    }' +
    '' +
    '    .version-tip-fixed p {' +
    '        margin-top: 15px;' +
    '        font-size: 16px;' +
    '    }' +
    '' +
    '    .version-tip-fixed .browser-list {' +
    '        padding:0;' +
    '        margin-top: 12px;' +
    '    }' +
    '' +
    '    .version-tip-fixed .browser-list li {' +
    '        display: inline-block;' +
    '        margin-right: 12px;' +
    '        padding: 0 15px;' +
    '        line-height: 32px;' +
    '        background-color: red;' +
    '    }' +
    '</style>' +
    '<div class="version-tip-fixed">' +
    '    <div class="version-tip-box">' +
    '        <h1>您的浏览器版本过低，可能存在安全风险！</h1>' +
    '        <p>建议升级浏览器：</p>' +
    '        <ol class="browser-list">' +
    '            <li><a target="_blank" href="https://www.google.cn/intl/zh-CN/chrome/browser/desktop/">谷歌浏览器</a></li>' +
    '            <li><a target="_blank" href="http://www.firefox.com.cn/">火狐浏览器</a></li>' +
    '            <li><a target="_blank" href="https://browser.360.cn/ee/">360浏览器（极速模式）</a></li>' +
    '        </ol>' +
    '    </div>' +
    '</div>';