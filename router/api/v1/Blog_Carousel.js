/**
 * 轮播
 */
const express = require('express'),
  router = express.Router();

const articleMod = require('../../../modules/Article/article');

router.get('/', (req, res, next) => {
  /* 获取文章列表 */
  let getArcList = () => {
    return new Promise((resolve, reject) => {
      var by = {
        by: {
          is_delete: false,
          attribute: {
            carousel: true
          }
        }
      };
      req.query = by;
      articleMod.showArticleList(req, (err, result) => {
        if (err) return reject(err);
        resolve(result.arcList);
      });
    })
  }
  let entityDataSource = (arclist) => {
    let arr = [];
    for (let j = 0, len = arclist.length; j < len; j++) {
      let obj = {};
      let item = arclist[j];
      let src = getImgSrc(item.content);
      obj['id'] = item.id;
      obj['title'] = item.title;
      obj['imgSrc'] = src;
      obj['timeCreate'] = item.time_create;
      arr.push(obj);
    }
    return arr;

  }
  /* 得到文章首张图片，如果没有 则用默认替代 */
  let getImgSrc = str => {
    var imgReg = /<img.*?(?:>|\/>)/gi;
    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arr = str.match(imgReg);
    if (arr != null) {
      var src = arr[0].match(srcReg);
      return src === null ?
        '' :
        src[1];
    } else {
      return '';
    }
  }
  let fn = async () => {
    let arclist = await getArcList();
    let list = entityDataSource(arclist);
    return res.json({
      status: 1,
      data: list
    })
  }
  getArcList().then(carlist => {
    let list = getIMGsrc(carlist);
    return res.json(list);
  }).catch(err => {
    return res.json({
      status: 0,
      msg: '获取失败'
    })
  })
})

module.exports = router;