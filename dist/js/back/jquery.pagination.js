!function(d,a){function t(a,t){this.$table=a,this.__DEFAULT__={limit:10,btnNum:5,updateDataURL:"",animation:"",delDataURL:"",process:""},this.options=d.extend({},this.__DEFAULT__,t)}t.prototype={init:function(){this.page=1,this.limit=this.options.limit,this.pageReg=/(page-)+(\d+)/,this.btnNum=this.options.btnNum,this.delDataURL=this.options.delDataURL,this.data={},this.readHistory(),this.getNewDatas(),null!==this.delDataURL&&""!==this.delDataURL&&this.delDataFn(),this.addEvent()},readHistory:function(){if(window.sessionStorage&&sessionStorage.pageInfo){var a=JSON.parse(sessionStorage.pageInfo);a.href===window.location.href&&("number"==typeof a.page&&(this.page=a.page),"number"==typeof a.limit&&(this.limit=a.limit))}},byIsChanged:function(){var a={};if(1<window.location.search.length)for(var t,e=0,i=window.location.search.substr(1).split("&");e<i.length;e++)t=i[e].split("="),a[decodeURIComponent(t[0])]=1<t.length?decodeURIComponent(t[1]):"";return"{}"==!JSON.stringify(a)},addEvent:function(){var i=this,a=i.$table;$tableWrap=a.parent(),$tableWrap.on("click",".pagination>li>a",function(){var a=d(this);if(!a.parent("li").hasClass("disabled")){var t=a.attr("data-page"),e=i.pageReg.exec(t);e?i.page=Number(e[2]):("prev"===t&&i.page--,"next"===t&&i.page++),i.getNewDatas()}}),$tableWrap.on("click",".btn-retry",function(){i.retry()})},formatSearch:function(a){if(void 0!==a){var t=(a=a.substr(1)).split("&"),n={},l=[],r=/([^\)]*)\[([^\)]*)\]/;return d.each(t,function(a,t){if(l=t.split("="),void 0===n[l[0]]){var e=l[0],i=r.exec(e);if(i){void 0===n.by&&(n.by={});var s=i[2];return void(n.by[s]=l[1])}n[l[0]]=l[1]}}),n}},getData:function(){this.data=this.formatSearch(window.location.search),this.data.page=this.page,this.data.limit=this.limit;window.location;var a={href:window.location.href,page:this.page,limit:this.limit};sessionStorage.setItem("pageInfo",JSON.stringify(a))},getNewDatas:function(){var e=this,i=e.$table;this.getData();this.Ajax_process;requestAjax({el:i.find("tbody"),url:this.options.updateDataURL,data:JSON.stringify(this.data),aniEle:this.options.animation,contentType:"application/json;charset=utf-8"},function(a){if($tbody=i.find("tbody"),$tbody.empty(),1!==a.status||null===a.data||0===a.data.length)return $tbody.html("没有数据");var t=e.options.process(a);$tbody.html(t.addHtml),e.refreshPaginator(t.Count)})},delDataFn:function(){var t=this,a=t.$table,e="",i=d("#delArc_btn");a.on("click",".del-art-btn",function(){e=d(this).attr("data-artid")}),i.on("click",function(){var a={artid:e};d.ajax({url:t.delDataURL,data:a,type:"post",success:function(a){1==a.status&&(alert("删除成功"),t.getNewDatas()),0==a.status&&alert("删除失败："+a.msg)}})})},refresh:{gt:function(a,t){var e=a.page,i="";if(t-e<a.btnNum-2)for(var s=e-(t-e);s<=t;s++)i+='<li class="page-item"><a href="javascript:void(0);" class="page page-link" data-page="page-'+s+'">'+s+"</a></li>";else{for(s=e;s<e+a.btnNum-2;s++)i+='<li class="page-item"><a href="javascript:void(0);" class="page page-link" data-page="page-'+s+'">'+s+"</a></li>";i+='<li class="page-item disabled"><span class="page-link">...</span></li>',i+='<li class="page-item"><a class="page page-link" href="javascript:void(0);" data-page="page-'+t+'">'+t+"</a></li>"}return i},equal:function(a,t){var e='<li class="page-item"><a href="javascript:void(0);" class="page page-link" data-page="page-1">1</a></li>';e+='<li class="page-item disabled"><span class="page-link">...</span></li>';for(var i=a.page-(a.btnNum-3);i<=t;i++)e+='<li class="page-item"><a href="javascript:void(0);" class="page page-link" data-page="page-'+i+'">'+i+"</a></li>";return e},lte:function(a,t){for(var e="",i=1;i<=t;i++)e+='<li class="page-item"><a href="javascript:void(0);" class="page page-link" data-page="page-'+i+'">'+i+"</a></li>";return e}},refreshPaginator:function(a){var t=this,e=this.$table,i=Math.ceil(a/t.limit),s='<ul class="pagination"><li class="page-item"><a class="page-link btn-start" href="#" aria-label="Last"   data-page="page-1"><i class="fa fa-angle-double-left"></i></a></li><li class="page-item"><a href="javascript:void(0);" data-page="prev" class="btn-prev page-link" aria-label="上一页"><i class="fa fa-angle-left"></i></a></li>';t.page===i&&i>=t.btnNum?s+=t.refresh.equal(t,i):i>t.btnNum?s+=t.refresh.gt(t,i):i<=t.btnNum&&(s+=t.refresh.lte(t,i)),s+='<li class="page-item"><a href="javascript:void(0);" data-page="next" class="btn-next page-link" aria-label="下一页"><i class="fa fa-angle-right"></i></a></li><li class="page-item"><a class="page-link btn-end" href="#" aria-label="Last"  data-page="page-'+i+'"><i class="fa fa-angle-double-right"></i></a></li></ul>';var n=e.parent().find(".navigation");n.empty().append(s),t.updatePageStyles(n,i)},updatePageStyles:function(a,t){var i=this,e=a.find(".btn-next"),s=a.find(".btn-prev"),n=a.find(".page"),l=a.find(".btn-start"),r=a.find(".btn-end");a.find("li").removeClass("disabled active"),n.each(function(){var a=d(this),t=a.attr("data-page"),e=i.pageReg.exec(t);e&&Number(e[2])===i.page&&a.parent("li").addClass("disabled active")}),1===i.page&&(s.parent("li").addClass("disabled hidden"),l.parent("li").addClass("disabled hidden")),1===t&&(s.parent("li").addClass("disabled hidden"),e.parent("li").addClass("disabled hidden")),i.page===t&&(e.parent("li").addClass("disabled hidden"),r.parent("li").addClass("disabled hidden"))},retry:function(){return this.getNewDatas()}},d.fn.pagination=function(a){return new t(this,a).init()}}(window.jQuery);