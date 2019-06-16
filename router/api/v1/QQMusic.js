const express = require('express'),
  router = express.Router();
const MusicCtl = require('../../../controllers/api').qqmusic;

router.get('/getHomeData', MusicCtl.getHomeData);
router.get('/search', MusicCtl.getSearch);
router.get('/getSingerInfo', MusicCtl.getSingerInfo);
router.get('/getSongVkey', MusicCtl.getSongVkey);
router.get('/getsongslist', MusicCtl.getSongListById);
router.get('/getMVPlayUrl', MusicCtl.getMVUrlByVid);
router.get('/getMVDesc', MusicCtl.getMVInfo);
router.get('/getAlbumInfo', MusicCtl.getAlbumInfoByMid);
router.get('/getSongLyric', MusicCtl.getSongLyricData);
router.get('/getSingerList', MusicCtl.getSingerList);
router.get('/getTopList', MusicCtl.getTopList);
router.get('/getCategory', MusicCtl.getCategory);
router.get('/getOneCategory', MusicCtl.getOneCategoryById);
router.get('/getOneTopList/:topid', MusicCtl.getOneTopListById);
router.get('/getSongDetail', MusicCtl.postSongDetailById);
router.get('/getAllCategory', MusicCtl.postAllCategory);
router.get('/getCategoryArea/:areaid', MusicCtl.postCategoryAreaById);
router.get('/getradiolist', MusicCtl.getRadioList);
router.get('/getRadioSongList/:id', MusicCtl.getRadioSongListById);
router.get('/searchSmartBox', MusicCtl.getSearchSmartBox);
router.get('/getmvlist', MusicCtl.getHomeMvList);
module.exports = router;