var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var upLoadSchema = require('../db/schema/uploadFile');

function upLoadIMG(req, uPath, cb) {
    var form = new formidable.IncomingForm();
    var uploadPath = uPath;
    var pathArr = [];
    var nowDate, _year, _month, _day;
    var pathUrl, uploadDir;
    nowDate = new Date();
    _year = nowDate.getFullYear();
    _month = nowDate.getMonth() + 1;
    _day = nowDate.getDate();
    pathArr.push(_year, _month, _day);
    /* path.sep */
    /* 判断目标文件夹是否存在不存在即创建 */
    (function (idx, pathArr) {
        pathUrl = path.join(process.cwd(), '/public/' + uploadPath);
        mkdirs(idx, pathArr, pathUrl);
    })(-1, pathArr);

    function mkdirs(idx, pathArr, Dir) {
        idx++;
        if (idx > pathArr.length - 1) return;
        pathUrl = path.join(Dir + pathArr[idx] + '/');
        try {
            fs.mkdirSync(pathUrl);
            mkdirs(idx, pathArr, pathUrl);
        } catch (err) {
            if (err.code === "EEXIST") {
                mkdirs(idx, pathArr, pathUrl);
            }
        }
    }
    uploadDir = pathUrl;
    upfunc();
    /* 比对数据库上传图片MD5，有记录则返回路径 没有记录则上传文件夹并记录数据库，并返回路径 */
    function upfunc() {
        form.uploadDir = uploadDir;
        form.hash = 'md5';
        form.parse(req, function (err, fields, files) {
            var file;
            for (file in files) {};
            var hash = files[file].hash;
            /* 比對數據庫是否上传过 */
            upLoadSchema.find({
                'hash': hash
            }, function (err, result) {
                if (err) {
                    return;
                }
                var resPath = uploadDir.split(path.sep + 'public')[1];
                if (result.length == 0) {
                    var extname = path.extname(files[file].name); /* 扩展名 */
                    var timestamp = moment().format('YYYYMMDDhhmmssms') + Math.floor(Math.random() * 90000 + 9999); /* 时间戳 */
                    var new_name = timestamp + extname; /* 重命名 */
                    fs.rename(files[file].path, path.join(form.uploadDir, new_name), function (err) {
                        if (err) {
                            console.log(err);
                            return cb(err, null);
                        }

                        var ofileInfo = {
                            position: path.join(form.uploadDir, new_name),
                            file: files[file],
                            source_name: files[file].name,
                            save_path: resPath,
                            ext_name: extname,
                            new_name: new_name,
                            type: files[file].type,
                            size: files[file].size,
                            hash: files[file].hash,
                            last_modified_date: files[file].last_modified_date
                        };
                        upLoadSchema.create({
                            source_name: ofileInfo.source_name,
                            ext_name: ofileInfo.ext_name,
                            new_name: ofileInfo.new_name,
                            save_path: ofileInfo.save_path,
                            type: ofileInfo.type,
                            size: ofileInfo.size,
                            hash: ofileInfo.hash,
                            last_modified_date: ofileInfo.last_modified_date,
                            author_id: req.session.user._id
                        })
                        return cb(null, {
                            'errno': 0,
                            'fileUrl': resPath + new_name
                        })
                    })
                } else {
                    return cb(null, {
                        'errno': 0,
                        'fileUrl': result[0].save_path + result[0].new_name
                    })
                }
            })



        });
    }

}
// 创建所有目录
function mkdirs(dirpath, callback) {
    fs.stat(dirpath, function (serr) {
        if (serr) {
            callback(dirpath);
        } else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dirpath), function () {
                fs.mkdir(dirpath, callback);
            });
        }
    });
};
module.exports = upLoadIMG;