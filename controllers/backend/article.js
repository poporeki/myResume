const moment = require('moment');
const mongoose = require('mongoose');

const articleMod = require('../../modules/Article/article'); /* 文章Module */
const artCommMod = require('../../modules/Article/articleComments'); /* 文章评论Module */
const arcTypeMod = require("../../modules/Article/articleType");
const arcTagMod = require("../../modules/Article/articleTag");
/* 显示文章列表 */
exports.showArticleList = (req, res) => {
  res.render('./backend/articlelist', {
    isTrash: false,
    pageTitle: "文章列表",
    userName: req.session.user.username,
    importScript: [
      '/js/back/articlelist.js'
    ]
  });
}
/* 获取文章列表 */
exports.getArticleList = (req, res) => {
  let isDel = false;
  let referer = req.headers['referer'];
  if (referer.indexOf('articleTrash') > 0) {
    isDel = true;
  }
  req.body.by ? req.body.by['is_delete'] = isDel : req.body.by = {
    'is_delete': isDel
  };
  // 查找数量默认10
  let limit = parseInt(req.body.num) || 10;
  // 当前页数
  let page = parseInt(req.body.page);
  // 排序 -默认创建时间倒叙
  let sort = req.body.sort || {
    'create_time': -1
  };
  req.body.by.tags_id ? req.body.by.tags_id = mongoose.Types.ObjectId(req.body.by.tags_id) : '';
  req.body.by.type_id ? req.body.by.type_id = mongoose.Types.ObjectId(req.body.by.type_id) : '';
  let by = req.body.by;
  let params = { by, limit, page, sort };

  /* 获取总数 */
  function getArcCount() {
    return new Promise(function (resolve, reject) {
      articleMod.getCount(req, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    })
  }
  /* 获取文章列表 */
  function getArcList(params) {
    return new Promise(function (resolve, reject) {
      articleMod.showArticleList(params, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    })
  }
  let fn = async () => {
    let arcCount = await getArcCount();
    let arcList = await getArcList(params);
    let resDatas = {};
    resDatas['artCount'] = arcCount;
    resDatas['artInfo'] = arcList;
    return res.json({
      status: 1,
      msg: '',
      data: resDatas
    });
  }
  fn().catch(err => {
    return res.json({
      status: 0,
      msg: '获取数据失败'
    })
  })

}

/* 删除文章到回收站 */
exports.moveToTrash = (req, res, next) => {
  res.render('./backend/articlelist', {
    isTrash: true,
    pageTitle: '文章回收站',
    modalTips: '确认删除吗，此操作无法恢复？！'
  })
}
/* 恢复文章 通过id*/

exports.restoreArticleById = (req, res, next) => {
  if (req.session.user.permissions !== 'root') {
    return res.json({
      status: 0,
      msg: '没有此操作权限'
    })
  }
  var arcid = req.params.id;
  articleMod.recoveryArticle(arcid, (err, result) => {
    if (err || !result) {
      return res.json({
        status: 0,
        msg: '操作失败'
      });
    }
    return res.json({
      status: 1,
      msg: '恢复成功'
    })
  })
}

/* 显示修改文章页面 */
exports.showUpdateArticleById = (req, res, next) => {

  /* 获取文章信息 */
  let getArcInfo = (arcid) => {
    return new Promise((resolve, reject) => {
      articleMod.showOneArticle(arcid, (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) reject("not article");
        resolve(result[0]);
      });
    });
  };
  /* 获取文章分类 */
  let getArcType = () => {
    return new Promise((resolve, reject) => {
      arcTypeMod.findArticleType({}, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
  /* 获取文章tag标签 */
  let getArcTags = () => {
    return new Promise((resolve, reject) => {
      arcTagMod.findArticleTags({}, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
  let fn = async () => {
    let arcid = mongoose.Types.ObjectId(req.params.artid);
    let arcInfo = await getArcInfo(arcid);
    let arcTagsInfo = await getArcTags();
    let arcTypeInfo = await getArcType();
    let selectTagsId=arcInfo.tags_id;
    //选中的tag标签
    let selectedTags=[];
    //未选中的tag标签
    let isntSelectTags=[];
    let selectedType=[];
    let isntSelectTypes=[];
    //筛选tag标签
    for(var i=0;i<arcTagsInfo.length;i++){
      let tag=arcInfo.tags_id;
      for(var j=0;j<tag.length;j++){
        if(arcTagsInfo[i].id===tag[j].id){
          selectedTags.push(arcTagsInfo[i]);
          break;
        }
        if(j===tag.length-1){
          isntSelectTags.push(arcTagsInfo[i]);
        }
      }
    }

    //筛选文章分类
    for(var i=0;i<arcTypeInfo.length;i++){
      console.log(arcTypeInfo[i]);
      let type=arcInfo.type_id;
        if(arcTypeInfo[i].id===type.id){
          selectedType.push(arcTypeInfo[i]);
        }else{
          isntSelectTypes.push(arcTypeInfo[i]);
        }
        
    }
    let renObj = {
      pageTitle: "修改文章",
      submitURL: "/backend/art/updatearticle/" + req.params.artid,
      userName: arcInfo.author_id.user_name,
      typeName: arcTypeInfo,
      tagName: arcTagsInfo,
      artInfo: {
        name: arcInfo.title,
        types: {
          selected:selectedType,
          isntselect:isntSelectTypes
        },
        tags: {
          selected:selectedTags,
          isntselect:isntSelectTags
        },
        from: arcInfo.from,
        content: arcInfo.content,
        attribute: arcInfo.attribute
      }
    };
    res.render("./backend/addArticle", renObj);
  }
  fn().catch(err => {
    return next(err);
  })
}
/* 提交更改 */
exports.submitUpdate = (req, res) => {
  let arcid = req.params.artid; /* id */
  let obj = {
    title: req.body.arc_title,
    /* 标题 */
    attribute: {
      carousel: req.body.arc_carousel === "on" ? true : false
    },
    from: req.body.arc_reproduction,
    is_delete: false,
    /*  */
    type_id: req.body.arc_type,
    tags_id: req.body.arc_tags,
    /* 分类 */
    content: req.body.arc_content,
    /* Html内容 */
    source: req.body.arc_conSource /* 纯文本 */
  };
  articleMod.updateArticle(arcid, obj, (err, result) => {
    if (err) {
      return res.json({
        status: false,
        msg: '修改失败'
      })
    }
    res.json({
      status: true,
      href: "/backend/art/articlelist"
    });
  });
}

/* 显示添加文章页面 */
exports.showAddTheArticle = (req, res) => {
  /* 获取分类 */
  let getArcType = () => {
    return new Promise((resolve, reject) => {
      arcTypeMod.findArticleType({}, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    })
  }
  /* 获取tag标签 */
  let getArcTags = () => {
    return new Promise((resolve, reject) => {
      arcTagMod.findArticleTags({}, (err, result) => {
        if (err) return reject(err);
        resolve(result)
      })
    })
  }
  let fn = async () => {
    let getArcTypeInfo = await getArcType();
    let getArcTagsInfo = await getArcTags();
    let renObj = {
      pageTitle: '添加文章',
      submitURL: '/backend/art/addarticle',
      userName: req.session.user.username,
      typeName: getArcTypeInfo,
      tagName: getArcTagsInfo
    }
    res.render('./backend/addArticle', renObj);
  }
  fn().catch(err => {
    return next(err);
  })

}
/* 提交新文章 */
exports.submitNewArticle = (req, res, next) => {
  articleMod.addArticle(req, (err, result) => {
    if (err) {
      return res.json({
        status: false
      });
    }
    res.json({
      status: true
    });
  });
}