const request = require('request');
const querystring = require("querystring");
const superagent = require('superagent');
const moment = require('moment');

/**获取首页内容 */
exports.getHomeData = (req, res, next) => {
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?' +
    '-=recom17106206618388442' +
    '&g_tk=5381&loginUin=0&hostUin=0&format=json' +
    '&inCharset=utf8&outCharset=utf-8&notice=0' +
    '&platform=yqq.json&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%7D%2C%22category%22%3A%7B%22method%22%3A%22get_hot_category%22%2C%22param%22%3A%7B%22qq%22%3A%22%22%7D%2C%22module%22%3A%22music.web_category_svr%22%7D%2C%22recomPlaylist%22%3A%7B%22method%22%3A%22get_hot_recommend%22%2C%22param%22%3A%7B%22async%22%3A1%2C%22cmd%22%3A2%7D%2C%22module%22%3A%22playlist.HotRecommendServer%22%7D%2C%22playlist%22%3A%7B%22method%22%3A%22get_playlist_by_category%22%2C%22param%22%3A%7B%22id%22%3A8%2C%22curPage%22%3A1%2C%22size%22%3A40%2C%22order%22%3A5%2C%22titleid%22%3A8%7D%2C%22module%22%3A%22playlist.PlayListPlazaServer%22%7D%2C%22new_song%22%3A%7B%22module%22%3A%22newsong.NewSongServer%22%2C%22method%22%3A%22get_new_song_info%22%2C%22param%22%3A%7B%22type%22%3A5%7D%7D%2C%22new_album%22%3A%7B%22module%22%3A%22newalbum.NewAlbumServer%22%2C%22method%22%3A%22get_new_album_info%22%2C%22param%22%3A%7B%22area%22%3A1%2C%22sin%22%3A0%2C%22num%22%3A10%7D%7D%2C%22new_album_tag%22%3A%7B%22module%22%3A%22newalbum.NewAlbumServer%22%2C%22method%22%3A%22get_new_album_area%22%2C%22param%22%3A%7B%7D%7D%2C%22toplist%22%3A%7B%22module%22%3A%22musicToplist.ToplistInfoServer%22%2C%22method%22%3A%22GetAll%22%2C%22param%22%3A%7B%7D%7D%2C%22focus%22%3A%7B%22module%22%3A%22QQMusic.MusichallServer%22%2C%22method%22%3A%22GetFocus%22%2C%22param%22%3A%7B%7D%7D%7D';
  let options = {
    url,
    header: {
      Origin: 'https://y.qq.com',
      Referer: 'https://y.qq.com/'
    }
  }

  function cb(error, response, body) {
    if (!error && response.statusCode == 200) {
      return res.json(JSON.parse(body));
    }
    return res.json({
      status: 0,
      msg: 'error'
    })
  }
  request(options, cb)
}
/**搜索 */
exports.getSearch = (req, res, next) => {
  let searchWords = req.query.keywords;
  let page = req.query.page || 1;
  let num = req.query.limit || 10;
  searchWords && (searchWords = encodeURI(searchWords));

  let url = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?
  ct=24
  &qqmusic_ver=1298
  &new_json=1
  &remoteplace=txt.yqq.song
  &searchid=55807636867874796
  &t=0
  &aggr=1
  &cr=1
  &catZhida=1
  &lossless=0
  &flag_qc=0
  &p=${page}
  &n=${num}
  &w=${searchWords}
  &g_tk=1094049010
  &loginUin=0
  &hostUin=0
  &format=json
  &inCharset=utf8
  &outCharset=utf-8
  &notice=0
  &platform=yqq.json
  &needNewCode=0`;
  let options = {
    url,
    header: {
      Origin: 'https://y.qq.com',
      Referer: 'https://y.qq.com/portal/search.html'
    }
  }

  function callback(json) {
    return res.json(json);
  }

  function cb(error, response, body) {
    if (!error && response.statusCode == 200) {
      eval(body);
      return;
    }
    return res.json({
      status: 0,
      msg: 'error'
    })
  }
  request(options, cb);
}
/**获取歌手信息 */
exports.getSingerInfo = (req, res, next) => {
  let singermid = req.query.singer_mid;
  let sin = req.query.sin || 0;
  let limit = req.query.limit || 10;
  if (!singermid || !sin || !limit) return res.json({
    status: 0,
    msg: '参数不完整'
  })
  let url = "https://u.y.qq.com/cgi-bin/musicu.fcg?" +
    '-=getUCGI5360501215274367' +
    '&g_tk=5381' +
    '&loginUin=0' +
    '&hostUin=0' +
    '&format=json' +
    '&inCharset=utf8' +
    '&outCharset=utf-8' +
    '&notice=0' +
    '&platform=yqq.json' +
    '&needNewCode=0' +
    '&data={' +
    '"comm":{' +
    '"ct":24,' +
    '"cv":0' +
    '}, ' +
    '"singer": { ' +
    '"method":"get_singer_detail_info", ' +
    '"param": { ' +
    '"sort":5, ' +
    '"singermid":"' + singermid + '", ' +
    '"sin": ' + sin + ',' +
    '"num":' + limit +
    '}, ' +
    '"module":"music.web_singer_info_svr"' +
    '}' +
    '}';
  let options = {
    url,
    header: {
      Origin: 'https://y.qq.com',
      Referer: `https://y.qq.com/n/yqq/singer/${singermid}.html`
    }
  }

  function cb(error, response, body) {
    if (!error && response.statusCode == 200) {
      return res.json(JSON.parse(body));
      return;
    }
    return res.json({
      status: 0,
      msg: 'error'
    })
  }
  request(options, cb);
}

/**获取vkey */
exports.getSongVkey = (req, res, next) => {
  let _guid = 0;
  let songmid = req.query.song_mid;
  if (!songmid) return res.json({
    status: 0,
    msg: '参数不完整'
  })

  var l = "getplaysongvkey" + (Math.random() + "").replace("0.", "");
  _guid = _getGuid(_guid);
  let url = `https://u.y.qq.com/cgi-bin/musicu.fcg?
  -=${l}
  &g_tk=2078730849
  &loginUin=0
  &hostUin=0
  &format=json
  &inCharset=utf8
  &outCharset=utf-8
  &notice=0
  &platform=yqq.json
  &needNewCode=0
  &data={
    "req":{
      "module":"CDN.SrfCdnDispatchServer",
      "method":"GetCdnDispatch",
      "param":{
        "guid": "${_guid}",
        "calltype":0,
        "userip":""
      }
    },
    "req_0":{
      "module":"vkey.GetVkeyServer",
      "method":"CgiGetVkey",
      "param":{
        "guid":"${_guid}",
        "songmid":[
          "${songmid}"
        ],
        "songtype":[0],
        "uin":"49907186",
        "loginflag":1,
        "platform":"20"
      }
    },
    "comm":{
      "uin":0,
      "format":"json",
      "ct":24,
      "cv":0
    }
  }`;
  let options = {
    url,
    header: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      Origin: 'https://y.qq.com',
      Referer: 'https://y.qq.com/portal/player.html'
    }
  }

  function cb(error, response, body) {
    if (!error && response.statusCode == 200) {
      return res.json(JSON.parse(body));
      return;
    }
    return res.json({
      status: 0,
      msg: 'error'
    })
  }
  request(options, cb);
}
/**获取音乐播放地址 */
exports.getSongPlayerUrl = (req, res, next) => {
  let guid = req.query.guid;
  let vkey = req.query.vkey;
  let songmid = req.query.song_mid;
  let url = `http://dl.stream.qqmusic.qq.com/C400${songmid}.m4a?
  guid=${guid}
  &vkey=${vkey}
  &uin=1522
  &fromtag=3
  &r=6562343195474447`;
  let options = {
    url,
    header: {
      Origin: 'https://y.qq.com',
      Referer: 'https://y.qq.com/portal/player.html'
    }
  }

  function cb(error, response, body) {
    if (!error && response.statusCode == 200) {
      return res.json(JSON.parse(body));
      return;
    }
    return res.json({
      status: 0,
      msg: 'error'
    })
  }
}
/**获取曲目列表 */
exports.getSongListById = (req, res, next) => {
  let disstid = parseInt(req.query.content_id);
  if (!disstid) return res.json({
    status: 0,
    msg: 'error'
  })
  let url2 = `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?
  type=1
  &json=1
  &utf8=1
  &onlysong=0
  &new_format=1
  &disstid=${disstid}
  &g_tk=5381
  &loginUin=0
  &hostUin=0
  &format=json
  &inCharset=utf8
  &outCharset=utf-8
  &notice=0
  &platform=yqq.json
  &needNewCode=0`;
  let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&new_format=1&disstid=' + disstid + '&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0';
  let options = {
    url,
    header: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      Origin: 'https://y.qq.com',
      Referer: `https://y.qq.com/n/yqq/playsquare/${disstid}.html`,
      Host: 'c.y.qq.com'
    }
  }

  function cb(error, response, body) {
    if (!error && response.statusCode == 200) {
      return res.json(JSON.parse(body));
      return;
    }
    return res.json({
      status: 0,
      msg: 'error'
    })
  }

  // request(options, cb);
  superagent
    .get(url)
    .set('Accept', 'application/json, */*; q=0.01')
    .set('Origin', 'https://y.qq.com')
    .set('Referer', 'https://y.qq.com/')
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36')
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'error'
        })
      }
      let body = response.body;

      function jsonCallback(j) {
        return res.json(j);
      }
      if (Buffer.isBuffer(body)) {
        body = body.toString();
        eval(body);
        return;
      }
      res.json(response.body);
    })
}

/**
 * 搜索框智能提示
 */
exports.getSearchSmart = (req, res, next) => {
  let url = `https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0
  &key=l
  &g_tk=343100479
  &loginUin=0
  &hostUin=0
  &format=json
  &inCharset=utf8
  &outCharset=utf-8
  &notice=0
  &platform=yqq.json
  &needNewCode=0`;
}
/**
 * 获取MV播放地址
 */
exports.getMVUrlByVid = (req, res, next) => {
  let vid = req.query.vid;
  if (!vid) return res.json({
    status: 0,
    msg: "参数不完整"
  })
  let data = {
    getMvUrl: {
      module: "gosrf.Stream.MvUrlProxy",
      method: "GetMvUrls",
      param: {
        vids: [vid],
        request_typet: 10001
      },
      mvInfo: {}
    }
  };
  let url = `https://u.y.qq.com/cgi-bin/musicu.fcg?data=${JSON.stringify(data)}&g_tk=1322894041&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=GB2312&notice=0&platform=yqq&needNewCode=0`;
  superagent.get(url)
    .set('Referer', `https://y.qq.com/n/yqq/mv/v/${vid}`)
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'no result'
        })
      }
      res.json(Object.keys(response.body).length === 0 ? JSON.parse(response.text) : response.body);
    })
}

/**获取MV详情及相关 */
exports.getMVInfo = (req, res, next) => {
  let vid = req.query.vid;
  let url = `https://u.y.qq.com/cgi-bin/musicu.fcg?_=1557677324071`;
  let data = {
    "comm": {
      "g_tk": 2073098045,
      "uin": 0,
      "format": "json",
      "inCharset": "utf-8",
      "outCharset": "utf-8",
      "notice": 0,
      "platform": "h5",
      "needNewCode": 1
    },
    "getToplistInfo": {
      "module": "video.VideoLogicServer",
      "method": "get_hitlist_info",
      "param": {
        "vid": vid
      }
    },
    "getRecomMV": {
      "module": "video.VideoLogicServer",
      "method": "rec_video_byvid",
      "param": {
        "vid": vid,
        "required": ["vid", "type", "cover_pic_medium", "name", "singers", "uploader_nick", "playcnt"],
        "support": 1
      }
    },
    "getMVInfo": {
      "module": "video.VideoDataServer",
      "method": "get_video_info_batch",
      "param": {
        "vidlist": [vid],
        "required": ["vid", "type", "name", "singers", "playcnt", "pubdate", "uploader_headurl", "uploader_nick", "uploader_encuin", "uploader_uin", "uploader_follower_num", "uploader_hasfollow", "from", "isfav", "video_switch", "desc", "sid", "gmid", "cover_pic_medium"]
      }
    }
  };
  superagent.post(url).send(data).end((err, response) => {
    if (err || response.statusCode !== 200) {
      return res.json({
        status: 0,
        msg: 'no result'
      })
    }
    res.json(JSON.parse(response.text));
  })
}
/**获取MV评论 */
exports.getMVComment = (req, res, next) => {
  let url = `https://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg
  ?g_tk=1322894041
  &loginUin=0
  &hostUin=0
  &format=json
  &inCharset=utf8
  &outCharset=GB2312
  &notice=0
  &platform=yqq.json
  &needNewCode=0
  &cid=205360772
  &reqtype=2
  &biztype=5
  &topid=w0025lvkrsg
  &cmd=8
  &needmusiccrit=0
  &pagenum=0
  &pagesize=25
  &lasthotcommentid=
  &domain=qq.com
  &ct=24
  &cv=10101010`;
}

/**获取专辑信息 */
exports.getAlbumInfoByMid = (req, res, next) => {
  let albummid = req.query.album_mid;
  if (!albummid) {
    return res.json({
      status: 0,
      msg: '参数不完整'
    })
  }
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg' +
    '?ct=24' +
    '&albummid=' + albummid +
    '&g_tk=5831' +
    '&loginUin=0' +
    '&hostUin=0' +
    '&format=json' +
    '&inCharset=utf8' +
    '&outCharset=utf-8' +
    '&notice=0' +
    '&platform=yqq.json' +
    '&needNewCode=0';
  superagent.get(url)
    .set('Origin', 'https://y.qq.com')
    .set('Referer', `https://y.qq.com/n/yqq/album/${albummid}.html`)
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.3 6')
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'no result'
        })
      }
      res.json(JSON.parse(response.text));
    })
}


exports.getSongLyricData = (req, res, next) => {
  let songmid = req.query.song_mid;
  if (!songmid) {
    return res.json({
      status: 0,
      msg: 'no result'
    })
  }
  let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg' +
    '?-=MusicJsonCallback_lrc' +
    '&pcachetime=' + new Date().getTime() +
    '&songmid=' + songmid +
    '&g_tk=1331927626&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0';
  superagent.get(url)
    .set('Origin', 'https://y.qq.com')
    .set('Referer', `https://y.qq.com/portal/player.html`)
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.3 6')
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'no result'
        })
      }
      res.json(JSON.parse(response.text));
    })
}

exports.getSingerList = (req, res, next) => {
  let area = req.query.area || -100;
  let sex = req.query.sex || -100;
  let genre = req.query.genre || -100;
  let index = req.query.index || -100;
  let cur_page = parseInt(req.query.cur_page || 1);
  let skip = cur_page === 1 ? 0 : (cur_page - 1) * 80;
  let urlData = {
    "comm": {
      "ct": 24,
      "cv": 0
    },
    "singerList": {
      "module": "Music.SingerListServer",
      "method": "get_singer_list",
      "param": {
        "area": parseInt(area),
        "sex": parseInt(sex),
        "genre": parseInt(genre),
        "index": parseInt(index),
        "sin": skip,
        "cur_page": parseInt(cur_page)
      }
    }
  };
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg' +
    '?-=getUCGI5186244843018528' +
    '&g_tk=1847422971&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0' +
    '&data=' + JSON.stringify(urlData);
  superagent.get(url)
    .set('Origin', 'https://y.qq.com')
    .set('Referer', `https://y.qq.com/portal/singer_list.html`)
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.3 6')
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'no result'
        })
      }
      res.json(JSON.parse(response.text));
    })
}

exports.getTopList = (req, res, next) => {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?_=1558544240886&g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1';
  superagent.get(url)
    .set('Origin', 'https://y.qq.com')
    .set('Referer', `https://y.qq.com/m/index.html`)
    .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1')
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'no result'
        })
      }
      let body = response.body;
      if (Buffer.isBuffer(body)) {
        body = body.toString();
        res.json(JSON.parse(body));
        return;
      }
      res.json(JSON.parse(response.text));
    })
}

exports.getCategory = (req, res, next) => {
  let urlData = {
    "area": {
      "module": "music.area.CategoryAreaServer",
      "method": "getCategoryAreaInCategoryPlaylist",
      "param": {}
    },
    "menu": {
      "module": "playlist.PlayListNavigateServer",
      "method": "get_category_grid",
      "param": {
        "cmd": 0
      }
    },
    "daily": {
      "module": "playlist.PlayListNavigateServer",
      "method": "get_daily_pick",
      "param": {
        "cmd": 0
      }
    },
    "activity": {
      "module": "playlist.PlayListNavigateServer",
      "method": "get_playlist_activity",
      "param": {
        "cmd": 0
      }
    },
    "daren": {
      "module": "daren.DarenListServer",
      "method": "get_daren_view",
      "param": {
        "tagid": 0,
        "sin": 0,
        "ein": 3
      }
    }
  }
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg' +
    '?_=1559219002042' +
    '&g_tk=876837304&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0' +
    '&platform=h5&needNewCode=1&ct=23&cv=0' +
    '&data=' + JSON.stringify(urlData);
  superagent.get(url)
    .set('Origin', 'https://y.qq.com')
    .set('Referer', 'https://y.qq.com/m/client/categoryzone/category.html')
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'no result'
        })
      }
      let body = response.body;
      if (Buffer.isBuffer(body)) {
        body = body.toString();
        res.json(JSON.parse(body));
        return;
      }
      res.json(JSON.parse(response.text));
    })
}
/**获取分类详情 */
exports.getOneCategoryById = (req, res, next) => {
  let cid = req.query.id;
  let isBasic = req.query.basic;
  if (!cid) {
    return res.json({
      status: 0,
      msg: '参数不完整'
    })
  }
  let urlData = {
    "list": {
      "module": "playlist.PlayListCategoryServer",
      "method": "get_category_content",
      "param": {
        "cmd": 0,
        "caller": "0",
        "category_id": parseInt(cid),
        "last_id": "0",
        "size": 20
      }
    }
  }
  let urlData_basic = {
    "info": {
      "module": "playlist.PlayListCategoryServer",
      "method": "get_category_basic",
      "param": {
        "cmd": 0,
        "caller": "0",
        "category_id": parseInt(cid),
        "daren_opt": 1
      }
    }
  }
  if (isBasic) {
    urlData = urlData_basic;
  }
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg' +
    '?_=1559225720537&g_tk=876837304&uin=0' +
    '&format=json&inCharset=utf-8&outCharset=utf-8' +
    '&notice=0&platform=h5&needNewCode=1&ct=23&cv=0' +
    '&data=' + JSON.stringify(urlData);
  superagent.get(url)
    .set('Origin', 'https://y.qq.com')
    .set('Referer', 'https://y.qq.com/m/client/categoryzone/detail.html?isParent=1&_hidehd=1&categoryId=' + cid)
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'no result'
        })
      }
      let body = response.body;
      if (Buffer.isBuffer(body)) {
        body = body.toString();
        res.json(JSON.parse(body));
        return;
      }
      res.json(JSON.parse(response.text));
    })
}

/**获取分类基本信息 */
exports.getCategoryBasic = (req, res, next) => {
  let urlData = {
    "info": {
      "module": "playlist.PlayListCategoryServer",
      "method": "get_category_basic",
      "param": {
        "cmd": 0,
        "caller": "0",
        "category_id": 71,
        "daren_opt": 1
      }
    }
  }
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg' +
    '?_=1559226776343&g_tk=876837304&uin=0' +
    '&format=json&inCharset=utf-8&outCharset=utf-8&notice=0' +
    '&platform=h5&needNewCode=1&ct=23&cv=0' +
    '&data=' + JSON.stringify(urlData);
}
exports.getOneTopListById = (req, res, next) => {
  let topid = req.params.topid;
  if (!topid) {
    return res.json({
      status: 0,
      msg: '参数不完整'
    })
  }
  let urlData = {
    "detail": {
      "module": "musicToplist.ToplistInfoServer",
      "method": "GetDetail",
      "param": {
        "topId": parseInt(topid),
        "offset": 0,
        "num": 20,
        "period": moment().format('YYYY-MM-DD')
      }
    },
    "comm": {
      "ct": 24,
      "cv": 0
    }
  };
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg' +
    '?-=getUCGI1320059863135028&g_tk=1847422971&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0' +
    '&data=' + JSON.stringify(urlData);
  superagent.get(url)
    .set('Origin', 'https://y.qq.com')
    .set('Referer', 'https://y.qq.com/n/yqq/toplist/' + topid + '.html')
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'no result'
        })
      }
      let body = response.body;
      if (Buffer.isBuffer(body)) {
        body = body.toString();
        res.json(JSON.parse(body));
        return;
      }
      res.json(JSON.parse(response.text));
    })
}
/**获取歌曲详情-by ID */
exports.postSongDetailById = (req, res, next) => {
  let songId = req.query.songid;
  if (!songId) {
    return res.json({
      status: false,
      msg: '参数不完整'
    })
  }
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=1847422971';
  let data = {
    "comm": {
      "uin": "0",
      "ct": "24",
      "cv": "0",
      "gzip": "0",
      "mcc": "460",
      "mnc": "1"
    },
    "data_id": {
      "module": "track_info.UniformRuleCtrlServer",
      "method": "GetTrackInfo",
      "param": {
        "ids": [parseInt(songId)],
        "types": [0]
      }
    }
  }
  superagent.post(url).send(data).end((err, response) => {
    if (err || response.statusCode !== 200) {
      return res.json({
        status: 0,
        msg: 'no result'
      })
    }
    let body = response.body;
    if (Buffer.isBuffer(body)) {
      body = body.toString();
      res.json(JSON.parse(body));
      return;
    }
    res.json(JSON.parse(response.text));
  })
}
exports.postAllCategory = (req, res, next) => {
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?_=1559242982665';
  let data = {
    "comm": {
      "g_tk": 876837304,
      "uin": 0,
      "format": "json",
      "inCharset": "utf-8",
      "outCharset": "utf-8",
      "notice": 0,
      "platform": "h5",
      "needNewCode": 1,
      "ct": 23,
      "cv": 0
    },
    "categoryList": {
      "module": "playlist.PlaylistAllCategoriesServer",
      "method": "get_all_categories",
      "param": {}
    }
  };
  superagent.post(url).send(data).end((err, response) => {
    if (err || response.statusCode !== 200) {
      return res.json({
        status: 0,
        msg: 'no result'
      })
    }
    let body = response.body;
    if (Buffer.isBuffer(body)) {
      body = body.toString();
      res.json(JSON.parse(body));
      return;
    }
    res.json(JSON.parse(response.text));
  })
}

exports.postCategoryAreaById = (req, res, next) => {
  let areaid = req.params.areaid;
  if (!areaid) {
    return res.json({
      status: 0,
      msg: '参数不完整'
    })
  }
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?_=1559291395549';
  let data = {
    "comm": {
      "g_tk": 622934468,
      "uin": 0,
      "format": "json",
      "inCharset": "utf-8",
      "outCharset": "utf-8",
      "notice": 0,
      "platform": "h5",
      "needNewCode": 1
    },
    "PoolApiServer": {
      "module": "music.area.AreaHomeServer",
      "method": "getAreaHomePage",
      "param": {
        "cmd": 0,
        "encArea": areaid
      }
    }
  }
  superagent.post(url).send(data).end((err, response) => {
    if (err || response.statusCode !== 200) {
      return res.json({
        status: 0,
        msg: 'no result'
      })
    }
    let body = response.body;
    if (Buffer.isBuffer(body)) {
      body = body.toString();
      res.json(JSON.parse(body));
      return;
    }
    res.json(JSON.parse(response.text));
  })
}

exports.getRadioList = (req, res, next) => {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_radiolist.fcg' +
    '?channel=radio&page=index&tpl=wk&new=1&p=0.7863735596378039' +
    '&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0' +
    '&platform=yqq.json&needNewCode=0';
  superagent.get(url).set('Origin', 'https://y.qq.com').set('Referer', 'https://y.qq.com/portal/radio.html').end((err, response) => {
    if (err || response.statusCode !== 200) {
      return res.json({
        status: 0,
        msg: 'no result'
      })
    }
    let body = response.body;
    if (Buffer.isBuffer(body)) {
      body = body.toString();
      res.json(JSON.parse(body));
      return;
    }
    res.json(JSON.parse(response.text));
  })
}

exports.getRadioSongListById = (req, res, next) => {
  let id = req.params.id;
  if (!id) {
    return res.json({
      status: 0,
      msg: '参数不完整'
    })
  }
  let data = {
    "songlist": {
      "module": "pf.radiosvr",
      "method": "GetRadiosonglist",
      "param": {
        "id": parseInt(id),
        "firstplay": 1,
        "num": 10
      }
    },
    "comm": {
      "ct": 24,
      "cv": 0
    }
  }
  let _ = (Math.random() + "").replace("0.", "");
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg' +
    '?-=getradiosonglist' + _ + '&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8' +
    '&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0' +
    '&data=' + JSON.stringify(data);

  superagent.get(url)
    .set('Origin', 'https://y.qq.com')
    .set('Referer', 'https://y.qq.com/portal/player_radio.html')
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'no result'
        })
      }
      let body = response.body;
      if (Buffer.isBuffer(body)) {
        body = body.toString();
        res.json(JSON.parse(body));
        return;
      }
      res.json(JSON.parse(response.text));
    })
}
exports.getSearchSmartBox = (req, res, next) => {
  let kws = req.query.keywords;
  if (!kws) {
    return res.json({
      status: 0,
      msg: '参数不完整'
    })
  }
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg' +
    '?is_xml=0' +
    '&key=' + kws +
    '&g_tk=590507101&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0';
  superagent.get(url)
    .set('Origin', 'https://y.qq.com')
    .set('Referer', 'https://y.qq.com/')
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'no result'
        })
      }
      let body = response.body;
      if (Buffer.isBuffer(body)) {
        body = body.toString();
        res.json(JSON.parse(body));
        return;
      }
      res.json(JSON.parse(response.text));
    })
}
exports.getHomeMvList = (req, res, next) => {
  let url = 'https://c.y.qq.com/mv/fcgi-bin/getmv_by_tag?g_tk=1281376306&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=GB2312&notice=0&platform=yqq.json&needNewCode=0&cmd=shoubo&lan=all';
  superagent.get(url)
    .set('Origin', 'https://y.qq.com')
    .set('Referer', 'https://y.qq.com/')
    .end((err, response) => {
      if (err || response.statusCode !== 200) {
        return res.json({
          status: 0,
          msg: 'no result'
        })
      }
      let body = response.body;
      if (Buffer.isBuffer(body)) {
        body = body.toString();
        res.json(JSON.parse(body));
        return;
      }
      res.json(JSON.parse(response.text));
    })
}
/**Guid生成规则 */
function _getGuid(_guid) {
  if (_guid.length > 0) return _guid;
  var t = (new Date).getUTCMilliseconds();
  return _guid = Math.round(2147483647 * Math.random()) * t % 1e10;
}
/**g_tk生成规则 */
function getACSRFToken() {
  function e(e) {
    for (var n = 5381, o = 0, t = e.length; t > o; ++o) n += (n << 5) + e.charCodeAt(o);
    return 2147483647 & n
  }
  return e(getSthing("p_skey") || getSthing("skey") || getSthing("p_lskey") || getSthing("lskey"))
}

function getSthing(e) {
  var n, o = function (e) {
    if (!e) return e;
    for (; e != unescape(e);) e = unescape(e);
    for (var n = ["<", ">", "'", '"', "%3c", "%3e", "%27", "%22", "%253c", "%253e", "%2527", "%2522"], o = ["&#x3c;", "&#x3e;", "&#x27;", "&#x22;", "%26%23x3c%3B", "%26%23x3e%3B", "%26%23x27%3B", "%26%23x22%3B", "%2526%2523x3c%253B", "%2526%2523x3e%253B", "%2526%2523x27%253B", "%2526%2523x22%253B"], t = 0; t < n.length; t++) e = e.replace(new RegExp(n[t], "gi"), o[t]);
    return e
  };
  return o((n = document.cookie.match(RegExp("(^|;\\s*)" + e + "=([^;]*)(;|$)"))) ? unescape(n[2]) : "")
}