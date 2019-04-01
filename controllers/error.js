module.exports = (err, req, res, next) => {
    if (req.method === 'OPTIONS') next();
    console.log(err);
    if (res.headersSent) {
        return next(err);
    }
    if (err === -9) {
        if (req.xhr === true || req.baseUrl.indexOf('api') !== '-1') {
            return res.json({
                status: -9,
                msg: '未登录'
            })
        }
        res.redirect('/login');
    } else
    if (err === -1) {
        if (req.xhr === true) {
            return res.json({
                status: -1,
                msg: '服务器错误'
            })
        }
    }
    if (err === 404) {
        if (req.xhr === true) {
            return res.json({
                status: 404,
                msg: '访问内容不存在'
            })
        }
        res.render('404');
    } else {
        if (res.headersSent) {
            return next(err);
        }
        res.status(500);
        res.render('error', {
            error: err
        });
    }
}