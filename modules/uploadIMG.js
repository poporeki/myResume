const formidable = require('formidable'),
  fs = require('fs'),
  path = require('path'),
  moment = require('moment'),
  crypto = require('crypto'),
  gm = require('gm').subClass({
    imageMagick: true
  });

const upLoadSchema = require('../db/schema/uploadFile'),
  userSchema = require('../db/schema/userSchema');

let uploadPath, pathArr;
let nowDate, _year, _month, _day;
let pathUrl, uploadDir;

exports.upLoadIMG = function (req, uPath, cb) {
  let form = new formidable.IncomingForm();
  uploadPath = uPath;
  pathArr = [];
  nowDate = new Date();
  _year = nowDate.getFullYear();
  _month = nowDate.getMonth() + 1;
  _day = nowDate.getDate();
  pathArr.push(_year, _month, _day);
  /* path.sep */
  mk();
  uploadDir = pathUrl;
  upfunc();
  /* 比对数据库上传图片MD5，有记录则返回路径 没有记录则上传文件夹并记录数据库，并返回路径 */


  function upfunc() {
    let resPath = uploadDir.split(path.sep + 'public')[1];
    form.uploadDir = uploadDir;
    form.hash = 'md5';
    /* 获取数据 */
    let getFilesData = () => {
      return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve(files);
        })
      })
    }
    /* 比对数据库md5 */
    let comparisonDBisExist = (files) => {
      return new Promise((resolve, reject) => {
        let file;
        for (file in files) {};
        let hash = files[file].hash;
        checkDb(hash, function (err, result) {
          if (err) reject(err);
          if (!result || result === null) return resolve({
            file,
            files
          });
          if (result) {
            return cb(null, result);
          };
        });
      })
    }
    /* 保存为文件并重命名 */
    let saveFiles = (f) => {
      return new Promise((resolve, reject) => {
        let file = f.file,
          files = f.files;

        let extname = path.extname(files[file].name); /* 扩展名 */
        let timestamp = moment().format('YYYYMMDDhhmmssms') + Math.floor(Math.random() * 90000 + 9999); /* 时间戳 */
        let new_name = timestamp + extname; /* 重命名 */
        let oldPath = files[file].path;
        let newPath = path.join(form.uploadDir, new_name);
        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            return cb(err, null);
          }
          resolve({
            file,
            files,
            extname,
            new_name
          });
        });
      })
    };
    /* 信息保存入数据库 */
    let saveInfoToDB = (f) => {
      return new Promise((resolve, reject) => {
        let file = f.file,
          files = f.files,
          extname = f.extname,
          new_name = f.new_name;

        let ofileInfo = {
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
        }, function (err, result) {
          if (err) reject(err);
          resolve(new_name);
        })
      });
    }
    getFilesData()
      .then(comparisonDBisExist)
      .then(saveFiles)
      .then(saveInfoToDB)
      .then((newName) => cb(null, resPath + newName))
      .catch((err) => cb(err, null));
  }


}

function mk() {
  /* 判断目标文件夹是否存在不存在即创建 */
  (function (idx, pathArr) {
    pathUrl = path.join(process.cwd(), '/public/' + uploadPath);
    mkdirs(idx, pathArr, pathUrl);
  })(-1, pathArr);

  function mkdirs(idx, pathArr, Dir) {
    idx++;
    if (idx > pathArr.length - 1) return pathUrl;
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
}
/* 对比数据库已保存的图片md5 */
function checkDb(hash, cb) {
  upLoadSchema.find({
    'hash': hash
  }, (err, result) => {
    if (err) return;
    if (result.length != 0) {
      return cb(null, result[0].save_path + result[0].new_name);
    };
    return cb(null, null);
  });
}
exports.baseUpload = function (req, uPath, cb) {
  uploadPath = uPath;
  pathArr = [];

  nowDate = new Date();
  _year = nowDate.getFullYear();
  _month = nowDate.getMonth() + 1;
  _day = nowDate.getDate();

  pathArr.push(_year, _month, _day);
  /* 判断目标文件夹是否存在不存在即创建 */
  mk();
  uploadDir = pathUrl;
  let imgBase = req.body.imgBase;
  let base64 = imgBase.replace(/^data:image\/\w+;base64,/, ""); //去前缀 data:image/png;base64
  let dataBuffer = new Buffer(base64, 'base64'); //base64码转成buffer对象，
  console.log('dataBuffer是否是Buffer对象：' + Buffer.isBuffer(dataBuffer));
  let md5 = crypto.createHash('md5');
  md5.update(dataBuffer);
  let hash = md5.digest('hex');
  let timestamp, new_name, dir, resPath;
  /* 比对数据库 该文件是否存在 */
  function comparisonDBisExist() {
    return new Promise((resolve, reject) => {
      checkDb(hash, function (err, result) {
        if (err) reject(err);
        if (!result) {
          resolve()
        }
        if (result) {
          return cb(null, result);
        }
      })
    })
  }
  /* 保存图片为文件 */
  function saveIMGFile() {
    return new Promise((resolve, reject) => {
      timestamp = moment().format('YYYYMMDDhhmmssms') + Math.floor(Math.random() * 90000 + 9999); /* 时间戳 */
      new_name = timestamp + '.jpg'; /* 重命名 */
      dir = path.join(uploadDir, new_name);
      resPath = uploadDir.split(path.sep + 'public')[1];
      fs.writeFile(dir, dataBuffer, function (err) {
        if (err) {
          reject(err);
        }

        resolve();
      });
    })
  }
  /* 保存缩略图为文件 */
  function saveThumbnail() {
    return new Promise((resolve, reject) => {
      let thumbnail = path.join(uploadDir + 'thumbnail_' + timestamp + '.jpg');
      gm(dir).resize(100).write(thumbnail, function (err) {
        if (err) {
          reject(err);
        }
        console.log('thumbnail saved');
        resolve();
      });
    })
  }
  /* 保存文件信息到数据库 */
  function saveIMGInfo() {
    return new Promise((resolve, reject) => {
      var ofileInfo = {
        position: dir,
        file: new_name,
        source_name: imgBase,
        save_path: resPath,
        ext_name: '.jpg',
        new_name: new_name,
        hash: hash
      };
      upLoadSchema.create({
        source_name: ofileInfo.source_name,
        ext_name: ofileInfo.ext_name,
        new_name: ofileInfo.new_name,
        save_path: ofileInfo.save_path,
        hash: ofileInfo.hash,
        author_id: req.session.user._id
      }, function (err, result) {
        if (err) return reject(err);
        resolve(result._id);

      })
    })
  }
  /* 更新用户信息-头像路径 */
  function updateUserAvatarPath(avatarID) {
    return new Promise((resolve, reject) => {
      userSchema.update({
        _id: req.session.user._id
      }, {
        $set: {
          avatar_path: avatarID
        }
      }, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve();
      })
    });
  }
  comparisonDBisExist()
    .then(saveIMGFile)
    .then(saveThumbnail)
    .then(saveIMGInfo)
    .then(updateUserAvatarPath)
    .then(() => {
      return cb(null, resPath + 'thumbnail_' + new_name);
    }).catch((err) => {
      return cb(err, null);
    })
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