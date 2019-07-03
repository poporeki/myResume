const moment = require('moment');
const mongoose = require('mongoose');

const articleMod = require('../../modules/Article/article'); /* 文章Module */
const artCommMod = require('../../modules/Article/articleComments'); /* 文章评论Module */
const arcTypeMod = require("../../modules/Article/articleType");
const arcTagMod = require("../../modules/Article/articleTag");
/**
 * 显示文章列表 
 */
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
/**
 * 获取文章列表 
 */
exports.getArticleList = (req, res) => {
  let isDel = false;
  let referer = req.headers['referer'];
  if (referer.indexOf('articleTrash') !== -1 || referer.indexOf('recycle') !== -1) {
    isDel = true;
  }
  let by = req.query.by || req.body.by || {};
  if (typeof by === 'string') {
    typeof by === 'string' && by ? by = JSON.parse(by) : by = {};
  }
  by['is_delete'] = isDel;

  // 查找数量默认10
  let limit = parseInt(req.body.num) || 10;
  // 当前页数
  let page = parseInt(req.body.page) || 1;
  // 排序 -默认创建时间倒叙
  let sort = req.body.sort || {
    'create_time': -1
  };
  let keywords = req.body.keywords;
  if (keywords && keywords !== null) {
    by['$or'] = [{
      title: {
        $regex: new RegExp((keywords).trim(), 'i')
      }
    }]
  }
  // req.body.by.tags_id ? req.body.by.tags_id = mongoose.Types.ObjectId(req.body.by.tags_id) : '';
  // req.body.by.type_id ? req.body.by.type_id = mongoose.Types.ObjectId(req.body.by.type_id) : '';
  let params = {
    by,
    limit,
    page,
    sort,
    keywords
  };

  /* 获取总数 */
  function getArcCount() {
    return new Promise(function (resolve, reject) {
      articleMod.getCount(by, (err, result) => {
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
        if (result === undefined) return reject(-1);
        let arclist = result.arcList;
        if (arclist.length == 0) return reject(0);
        resolve({
          /*分类 */
          searchedName: result.searchedName,
          /* 文章列表 */
          arclist: arclist
        });
      });
    })
  }
  let fn = async () => {
    let [arcCount, arcList] = await Promise.all([getArcCount(), getArcList(params)])
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
    let obj = {
      status: false,
      msg: ''
    }
    if (err === 0) {
      obj['msg'] = '数据不存在'
    } else if (err === -1) {
      obj['msg'] = '数据获取失败'
    } else {
      obj['msg'] = '服务器错误'
    }
    return res.json(obj);
  })

}

/**
 * 删除文章到回收站 
 */
exports.moveToTrash = (req, res, next) => {
  res.render('./backend/articlelist', {
    isTrash: true,
    pageTitle: '文章回收站',
    modalTips: '确认删除吗，此操作无法恢复？！'
  })
}
/**
 * 恢复文章 通过id
 */

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

/**
 * 显示修改文章页面 
 */
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
      arcTypeMod.findArticleType((err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
  /* 获取文章tag标签 */
  let getArcTags = () => {
    return new Promise((resolve, reject) => {
      arcTagMod.findArticleTags((err, result) => {
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
    let selectTagsId = arcInfo.tags_id;
    //选中的tag标签
    let selectedTags = [];
    //未选中的tag标签
    let isntSelectTags = [];
    let selectedType = [];
    let isntSelectTypes = [];
    //筛选tag标签
    for (var i = 0; i < arcTagsInfo.length; i++) {
      let tag = arcInfo.tags_id;
      for (var j = 0; j < tag.length; j++) {
        if (arcTagsInfo[i].id === tag[j].id) {
          selectedTags.push(arcTagsInfo[i]);
          break;
        }
        if (j === tag.length - 1) {
          isntSelectTags.push(arcTagsInfo[i]);
        }
      }
    }

    //筛选文章分类
    for (var i = 0; i < arcTypeInfo.length; i++) {
      console.log(arcTypeInfo[i]);
      let type = arcInfo.type_id;
      if (arcTypeInfo[i].id === type.id) {
        selectedType.push(arcTypeInfo[i]);
      } else {
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
          selected: selectedType,
          isntselect: isntSelectTypes
        },
        tags: {
          selected: selectedTags,
          isntselect: isntSelectTags
        },
        from: arcInfo.from,
        content: arcInfo.content,
        source: arcInfo.source,
        attribute: arcInfo.attribute
      }
    };
    if (req.xhr) {
      return res.json({
        statue: true,
        data: renObj
      })
    }
    res.render("./backend/addArticle", renObj);
  }
  fn().catch(err => {
    return next(err);
  })
}
/**
 * 提交更改
 */
exports.submitUpdate = (req, res, next) => {
  let arcid = req.params.artid; /* id */
  let body = req.body;
  if (!body.arc_title || !arcid || !body.arc_type || !body.arc_tags) {
    return res.json({
      status: 0,
      msg: '提交内容不完整'
    })
  }
  let from = body.arc_reproduction;
  let obj = {
    title: body.arc_title,
    /* 标题 */
    attribute: {
      carousel: body.arc_carousel === "on" ? true : false
    },
    from: {
      link: from ? from.link : undefined,
      name: from ? from.name : undefined
    },
    is_delete: false,
    /*  */
    type_id: body.arc_type,
    tags_id: body.arc_tags,
    /* 分类 */
    content: body.arc_content,
    /* Html内容 */
    source: body.arc_conSource /* 纯文本 */
  };
  articleMod.updateArticle(arcid, obj, (err, result) => {
    if (err) {
      return res.json({
        status: 0,
        msg: '修改失败'
      })
    }
    res.json({
      status: 1,
      href: "/backend/art/articlelist"
    });
  });
}

/**
 * 显示添加文章页面 
 */
exports.showAddTheArticle = (req, res, next) => {
  /* 获取分类 */
  let getArcType = () => {
    return new Promise((resolve, reject) => {
      arcTypeMod.findArticleType((err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    })
  }
  /* 获取tag标签 */
  let getArcTags = () => {
    return new Promise((resolve, reject) => {
      arcTagMod.findArticleTags((err, result) => {
        if (err) return reject(err);
        resolve(result)
      })
    })
  }
  let fn = async () => {
    let getArcTypeInfo = await getArcType();
    let getArcTagsInfo = await getArcTags();
    if (req.xhr) {
      return res.json({

      })
    }
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
/**
 * 提交新文章
 */
exports.submitNewArticle = (req, res, next) => {
  let reqBody = req.body;
  if (!reqBody.arc_type || !reqBody.arc_tags || !reqBody.arc_content || !reqBody.arc_source) {
    return res.json({
      status: 0,
      msg: '提交的文章参数不完整,请修改后重新提交'
    })
  }
  let arcTitle = reqBody.arc_title.trim() || '未命名';
  let arcAttrCarousel = reqBody.arc_carousel === 'on' ? true : false;
  let arcFrom = reqBody.arc_reproduction || undefined;
  let arcType = reqBody.arc_type;
  let arcTags = reqBody.arc_tags;
  let arcContent = reqBody.arc_content;
  let arcSource = reqBody.arc_source;
  let authorId = req.session.user._id;
  if (typeof arcFrom === 'string') {
    arcFrom['link'] = arcFrom['name'] = arcFrom;
  } else if (arcFrom instanceof Object) {
    if (!arcFrom.name && arcFrom.link) {
      arcFrom.name = arcFrom.link;
    }
  }
  let pars = {
    title: arcTitle,
    attribute: {
      carousel: arcAttrCarousel
    },
    from: arcFrom,
    type_id: arcType,
    tags_id: arcTags,
    is_delete: false,
    read: 0,
    content: arcContent,
    source: arcSource,
    support: 12,
    author_id: authorId,
    update_record: [{
      user: authorId
    }]
  };
  articleMod.addArticle(pars, (err, result) => {
    if (err) {
      return res.json({
        status: 0,
        msg: '添加失败'
      });
    }
    res.json({
      status: 1,
      msg: 'success'
    });
  });
}

/**
 * 显示添加文章分类页
 */
exports.showPageArticleTypeAdd = (req, res, next) => {
  res.render('./backend/add', {
    isType: true,
    pageTitle: '文章分类',
    formAction: '/type/add',
    userName: req.session.user.username
  });
}

/**
 * POST提交-添加文章分类
 */
exports.postArticleTypeAdd = (req, res, next) => {
  if (req.session.user.permissions !== 'root') {
    return next(-5);
  }
  if (!req.body.t_name && req.body.t_iconname) {
    return next(-2);
  }
  let typeName = req.body.t_name;
  let iconName = req.body.t_iconname;
  arcTypeMod.addArticleType(typeName, iconName, (err, result) => {
    if (err) return next(err);
    if (req.xhr) {
      return res.json({
        status: 1,
        msg: 'success'
      })
    }
    res.redirect('/backend');
  })
}

/**
 * 显示文章分类列表页
 */
exports.showPageArticleTypeList = (req, res, next) => {
  arcTypeMod.findArticleType((err, result) => {
    if (err) return next(err);
    let datas = [];
    for (let i = 0; i < result.length; i++) {
      let data = result[i];
      let obj = {
        id: data._id,
        name: data.type_name,
        timeCreate: moment(data.create_time).format('YYYY-MM-DD hh:mm:ss'),
        timeUpdate: moment(data.create_update).format('YYYY-MM-DD hh:mm:ss')
      }
      datas.push(obj);
    }
    res.render('./backend/articleTypeList', {
      pageTitle: '分类',
      identity: 'type',
      userName: req.session.user.username,
      info: datas
    });
  })
}

/**
 * 显示文章标签添加页面
 */
exports.showPageArticleTagAdd = (req, res, next) => {
  res.render('./backend/add', {
    pageTitle: 'Tag标签',
    formAction: '/tag/add',
    userName: req.session.user.username
  })
}
/**
 * POST提交-添加文章标签
 */
exports.postArticleTagAdd = (req, res, next) => {
  arcTagMod.addArticleTag(req.body, (err, result) => {
    if (err) return next(err);
    if (req.xhr) {
      return res.json({
        status: 1,
        msg: 'success',
        data: result
      })
    }
    res.redirect('/backend');
  })
}
//文章标签列表
exports.getArticleTagList = (req, res, next) => {
  //获取标签列表
  let getTagsList = () => {
    return new Promise((resolve, reject) => {
      arcTagMod.findArticleTags((err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }
  //格式化列表
  let formatting = (target) => {
    let arr = [];
    for (let i = 0; i < target.length; i++) {
      let data = target[i];
      let obj = {
        id: data._id,
        name: data.tag_name,
        timeCreate: moment(data.create_time).format('YYYY-MM-DD hh:mm:ss'),
        timeUpdate: moment(data.create_update).format('YYYY-MM-DD hh:mm:ss')
      }
      arr.push(obj);
    }
    return arr;
  }
  let fn = async () => {
    let taglist = await getTagsList();
    let obj = formatting(taglist);
    if (req.xhr) {
      return res.json({
        status: 1,
        msg: 'success',
        data: obj
      })
    }
    res.render('./backend/articleTypeList', {
      pageTitle: 'Tag标签',
      identity: 'tag',
      userName: req.session.user.username,
      info: datas
    });
  }
  fn().catch(err => {
    next(err);
  })
}
/**修改文章标签 */
exports.updateArticleTagUpdate = async (req, res, next) => {
  let tagid = req.body.tag_id;
  let newTagName = req.body.new_tag_name;
  let userid = req.session.user._id;
  if (!newTagName || !tagid) {
    return res.json({
      status: 0,
      msg: '参数不完整'
    })
  }
  try {
    await arcTagMod.updateArticleTagById(tagid, {
      tag_name: newTagName
    })
    return res.json({
      status: 1,
      msg: 'success'
    })
  } catch (err) {
    next(err);
  }
}
/**修改文章分类 */
exports.postArticleTypeUpdate = async (req, res, next) => {
  let typeid = req.body.type_id;
  let newTypeName = req.body.new_type_name;
  let userid = req.session.user._id;
  let iconName = req.body.icon_name;
  if (!newTypeName || !typeid) {
    return res.json({
      status: 0,
      msg: '参数不完整'
    })
  }
  try {
    await arcTypeMod.updateArticleTypeById(typeid, {
      type_name: newTypeName,
      icon_name: iconName
    })
    return res.json({
      status: 1,
      msg: 'success'
    })
  } catch (err) {
    next(err);
  }
}