var BMP24 = require('gd-bmp').BMP24;


//制造验证码图片
function rand(min, max) {
    return Math.random() * (max - min + 1) + min | 0; //特殊的技巧，|0可以强制转换为整数
}

function makeCapcha(num) {
    var result = {};
    var img = new BMP24(100, 40);
    img.fillRect(0, 0, 100, 40, 0xc3c3c3);
    img.drawCircle(rand(0, 100), rand(0, 40), rand(10, 40), rand(0, 0xffffff));
    //边框
    img.drawPoint(rand(0, 100), rand(0, 40), rand(0, 0xffffff));
    img.fillRect(rand(0, 100), rand(0, 40), rand(10, 35), rand(10, 35), rand(0, 0xffffff));
    img.drawLine(rand(0, 100), rand(0, 40), rand(0, 100), rand(0, 40), rand(0, 0xffffff));
    //return img;



    var p = "ABCDEFGHKMNPQRSTUVWXYZ3456789";
    var str = '';
    for (var i = 0; i < num; i++) {
        str += p.charAt(Math.random() * p.length | 0);
    }
    result.str = str;
    var fonts = [BMP24.font8x16, BMP24.font12x24, BMP24.font16x32];
    var x = 15,
        y = 8;
    for (var i = 0; i < str.length; i++) {
        var f = fonts[Math.random() * fonts.length | 0];
        y = 8 + rand(-10, 10);
        img.drawChar(str[i], x, y, f, rand(0, 0xffffff));
        x += f.w + rand(2, 8);
    }
    const dataUrl = 'data:image/bmp;base64,' + img.getFileData().toString('base64');
    result.dataUrl = dataUrl;
    return result;
}
module.exports = makeCapcha;