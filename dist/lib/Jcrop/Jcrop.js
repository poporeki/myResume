!function(u){"use strict";var l=function(t,e){var n=navigator.userAgent.toLowerCase();this.opt=u.extend({},l.defaults,e||{}),this.container=u(t),this.opt.is_msie=/msie/.test(n),this.opt.is_ie_lt9=/msie [1-8]\./.test(n),this.container.addClass(this.opt.css_container),this.ui={},this.state=null,this.ui.multi=[],this.ui.selection=null,this.filter={},this.init(),this.setOptions(e),this.applySizeConstraints(),this.container.trigger("cropinit",this),this.opt.is_ie_lt9&&(this.opt.dragEventTarget=document.body)};u.extend(l,{component:{},filter:{},stage:{},registerComponent:function(t,e){l.component[t]=e},registerFilter:function(t,e){l.filter[t]=e},registerStageType:function(t,e){l.stage[t]=e},attach:function(t,e){return new u.Jcrop(t,e)},imgCopy:function(t){var e=new Image;return e.src=t.src,e},imageClone:function(t){return u.Jcrop.supportsCanvas?l.canvasClone(t):l.imgCopy(t)},canvasClone:function(t){var e=document.createElement("canvas"),n=e.getContext("2d");return u(e).width(t.width).height(t.height),e.width=t.naturalWidth,e.height=t.naturalHeight,n.drawImage(t,0,0,t.naturalWidth,t.naturalHeight),e},propagate:function(t,e,n){for(var i=0,r=t.length;i<r;i++)e.hasOwnProperty(t[i])&&(n[t[i]]=e[t[i]])},getLargestBox:function(t,e,n){return t<e/n?[n*t,n]:[e,e/t]},stageConstructor:function(t,e,n){var i=[];u.each(l.stage,function(t,e){i.push(e)}),i.sort(function(t,e){return t.priority-e.priority});for(var r=0,o=i.length;r<o;r++)if(i[r].isSupported(t,e)){i[r].create(t,e,function(t,e){"function"==typeof n&&n(t,e)});break}},supportsColorFade:function(){return u.fx.step.hasOwnProperty("backgroundColor")},wrapFromXywh:function(t){var e={x:t[0],y:t[1],w:t[2],h:t[3]};return e.x2=e.x+e.w,e.y2=e.y+e.h,e}});var r=function(){};u.extend(r,{isSupported:function(t,e){return!0},priority:100,create:function(t,e,n){var i=new r;i.element=t,n.call(this,i,e)},prototype:{attach:function(t){this.init(t),t.ui.stage=this},triggerEvent:function(t){return u(this.element).trigger(t),this},getElement:function(){return this.element}}}),l.registerStageType("Block",r);var s=function(){};s.prototype=new r,u.extend(s,{isSupported:function(t,e){if("IMG"==t.tagName)return!0},priority:90,create:function(i,r,o){u.Jcrop.component.ImageLoader.attach(i,function(t,e){var n=new s;n.element=u(i).wrap("<div />").parent(),n.element.width(t).height(e),n.imgsrc=i,"function"==typeof o&&o.call(this,n,r)})}}),l.registerStageType("Image",s);var a=function(){this.angle=0,this.scale=1,this.scaleMin=.2,this.scaleMax=1.25,this.offset=[0,0]};a.prototype=new s,u.extend(a,{isSupported:function(t,e){if(u.Jcrop.supportsCanvas&&"IMG"==t.tagName)return!0},priority:60,create:function(i,t,r){var o=u(i),s=u.extend({},t);u.Jcrop.component.ImageLoader.attach(i,function(t,e){var n=new a;o.hide(),n.createCanvas(i,t,e),o.before(n.element),n.imgsrc=i,s.imgsrc=i,"function"==typeof r&&(r(n,s),n.redraw())})}}),u.extend(a.prototype,{init:function(t){this.core=t},setOffset:function(t,e){return this.offset=[t,e],this},setAngle:function(t){return this.angle=t,this},setScale:function(t){return this.scale=this.boundScale(t),this},boundScale:function(t){return t<this.scaleMin?t=this.scaleMin:t>this.scaleMax&&(t=this.scaleMax),t},createCanvas:function(t,e,n){this.width=e,this.height=n,this.canvas=document.createElement("canvas"),this.canvas.width=e,this.canvas.height=n,this.$canvas=u(this.canvas).width("100%").height("100%"),this.context=this.canvas.getContext("2d"),this.fillstyle="rgb(0,0,0)",this.element=this.$canvas.wrap("<div />").parent().width(e).height(n)},triggerEvent:function(t){return this.$canvas.trigger(t),this},clear:function(){return this.context.fillStyle=this.fillstyle,this.context.fillRect(0,0,this.canvas.width,this.canvas.height),this},redraw:function(){return this.context.save(),this.clear(),this.context.translate(parseInt(.5*this.width),parseInt(.5*this.height)),this.context.translate(this.offset[0]/this.core.opt.xscale,this.offset[1]/this.core.opt.yscale),this.context.rotate(this.angle*(Math.PI/180)),this.context.scale(this.scale,this.scale),this.context.translate(-parseInt(.5*this.width),-parseInt(.5*this.height)),this.context.drawImage(this.imgsrc,0,0,this.width,this.height),this.context.restore(),this.$canvas.trigger("cropredraw"),this},setFillStyle:function(t){return this.fillstyle=t,this}}),l.registerStageType("Canvas",a);var t=function(){this.minw=40,this.minh=40,this.maxw=0,this.maxh=0,this.core=null};u.extend(t.prototype,{tag:"backoff",priority:22,filter:function(t){var e=this.bound;return t.x<e.minx&&(t.x=e.minx,t.x2=t.w+t.x),t.y<e.miny&&(t.y=e.miny,t.y2=t.h+t.y),t.x2>e.maxx&&(t.x2=e.maxx,t.x=t.x2-t.w),t.y2>e.maxy&&(t.y2=e.maxy,t.y=t.y2-t.h),t},refresh:function(t){this.elw=t.core.container.width(),this.elh=t.core.container.height(),this.bound={minx:0+t.edge.w,miny:0+t.edge.n,maxx:this.elw+t.edge.e,maxy:this.elh+t.edge.s}}}),l.registerFilter("backoff",t);var e=function(){this.core=null};u.extend(e.prototype,{tag:"constrain",priority:5,filter:function(t,e){return"move"==e?(t.x<this.minx&&(t.x=this.minx,t.x2=t.w+t.x),t.y<this.miny&&(t.y=this.miny,t.y2=t.h+t.y),t.x2>this.maxx&&(t.x2=this.maxx,t.x=t.x2-t.w),t.y2>this.maxy&&(t.y2=this.maxy,t.y=t.y2-t.h)):(t.x<this.minx&&(t.x=this.minx),t.y<this.miny&&(t.y=this.miny),t.x2>this.maxx&&(t.x2=this.maxx),t.y2>this.maxy&&(t.y2=this.maxy)),t.w=t.x2-t.x,t.h=t.y2-t.y,t},refresh:function(t){this.elw=t.core.container.width(),this.elh=t.core.container.height(),this.minx=0+t.edge.w,this.miny=0+t.edge.n,this.maxx=this.elw+t.edge.e,this.maxy=this.elh+t.edge.s}}),l.registerFilter("constrain",e);var i=function(){this.core=null};u.extend(i.prototype,{tag:"extent",priority:12,offsetFromCorner:function(t,e,n){var i=e[0],r=e[1];switch(t){case"bl":return[n.x2-i,n.y,i,r];case"tl":return[n.x2-i,n.y2-r,i,r];case"br":return[n.x,n.y,i,r];case"tr":return[n.x,n.y2-r,i,r]}},getQuadrant:function(t){var e=t.opposite[0]-t.offsetx,n=t.opposite[1]-t.offsety;return e<0&&n<0?"br":0<=e&&0<=n?"tl":e<0&&0<=n?"tr":"bl"},filter:function(t,e,n){if("move"==e)return t;var i=t.w,r=t.h,o=n.state,s=this.limits,a=o?this.getQuadrant(o):"br";return s.minw&&i<s.minw&&(i=s.minw),s.minh&&r<s.minh&&(r=s.minh),s.maxw&&i>s.maxw&&(i=s.maxw),s.maxh&&r>s.maxh&&(r=s.maxh),i==t.w&&r==t.h?t:l.wrapFromXywh(this.offsetFromCorner(a,[i,r],t))},refresh:function(t){this.elw=t.core.container.width(),this.elh=t.core.container.height(),this.limits={minw:t.minSize[0],minh:t.minSize[1],maxw:t.maxSize[0],maxh:t.maxSize[1]}}}),l.registerFilter("extent",i);var o=function(){this.stepx=1,this.stepy=1,this.core=null};u.extend(o.prototype,{tag:"grid",priority:19,filter:function(t){var e={x:Math.round(t.x/this.stepx)*this.stepx,y:Math.round(t.y/this.stepy)*this.stepy,x2:Math.round(t.x2/this.stepx)*this.stepx,y2:Math.round(t.y2/this.stepy)*this.stepy};return e.w=e.x2-e.x,e.h=e.y2-e.y,e}}),l.registerFilter("grid",o);var c=function(){this.ratio=0,this.core=null};u.extend(c.prototype,{tag:"ratio",priority:15,offsetFromCorner:function(t,e,n){var i=e[0],r=e[1];switch(t){case"bl":return[n.x2-i,n.y,i,r];case"tl":return[n.x2-i,n.y2-r,i,r];case"br":return[n.x,n.y,i,r];case"tr":return[n.x,n.y2-r,i,r]}},getBoundRatio:function(t,e){var n=l.getLargestBox(this.ratio,t.w,t.h);return l.wrapFromXywh(this.offsetFromCorner(e,n,t))},getQuadrant:function(t){var e=t.opposite[0]-t.offsetx,n=t.opposite[1]-t.offsety;return e<0&&n<0?"br":0<=e&&0<=n?"tl":e<0&&0<=n?"tr":"bl"},filter:function(t,e,n){if(!this.ratio)return t;t.w,t.h;var i=n.state,r=i?this.getQuadrant(i):"br";if("move"==(e=e||"se"))return t;switch(e){case"n":t.x2=this.elw,t.w=t.x2-t.x,r="tr";break;case"s":t.x2=this.elw,t.w=t.x2-t.x,r="br";break;case"e":t.y2=this.elh,t.h=t.y2-t.y,r="br";break;case"w":t.y2=this.elh,t.h=t.y2-t.y,r="bl"}return this.getBoundRatio(t,r)},refresh:function(t){this.ratio=t.aspectRatio,this.elw=t.core.container.width(),this.elh=t.core.container.height()}}),l.registerFilter("ratio",c);var h=function(){this.core=null};u.extend(h.prototype,{tag:"round",priority:90,filter:function(t){var e={x:Math.round(t.x),y:Math.round(t.y),x2:Math.round(t.x2),y2:Math.round(t.y2)};return e.w=e.x2-e.x,e.h=e.y2-e.y,e}}),l.registerFilter("round",h);var p=function(t,e){this.color=e||"black",this.opacity=t||.5,this.core=null,this.shades={}};u.extend(p.prototype,{tag:"shader",fade:!0,fadeEasing:"swing",fadeSpeed:320,priority:95,init:function(){var t=this;t.attached||(t.visible=!1,t.container=u("<div />").addClass(t.core.opt.css_shades).prependTo(this.core.container).hide(),t.elh=this.core.container.height(),t.elw=this.core.container.width(),t.shades={top:t.createShade(),right:t.createShade(),left:t.createShade(),bottom:t.createShade()},t.attached=!0)},destroy:function(){this.container.remove()},setColor:function(n,i){var r=this;if(n==r.color)return r;this.color=n;var o=l.supportsColorFade();return u.each(r.shades,function(t,e){r.fade&&!i&&o?e.animate({backgroundColor:n},{queue:!1,duration:r.fadeSpeed,easing:r.fadeEasing}):e.css("backgroundColor",n)}),r},setOpacity:function(n,i){var r=this;return n==r.opacity||(r.opacity=n,u.each(r.shades,function(t,e){!r.fade||i?e.css({opacity:n}):e.animate({opacity:n},{queue:!1,duration:r.fadeSpeed,easing:r.fadeEasing})})),r},createShade:function(){return u("<div />").css({position:"absolute",backgroundColor:this.color,opacity:this.opacity}).appendTo(this.container)},refresh:function(t){var e=this.core,n=this.shades;this.setColor(t.bgColor?t.bgColor:this.core.opt.bgColor),this.setOpacity(t.bgOpacity?t.bgOpacity:this.core.opt.bgOpacity),this.elh=e.container.height(),this.elw=e.container.width(),n.right.css("height",this.elh+"px"),n.left.css("height",this.elh+"px")},filter:function(t,e,n){if(!n.active)return t;var i=this,r=i.shades;return r.top.css({left:Math.round(t.x)+"px",width:Math.round(t.w)+"px",height:Math.round(t.y)+"px"}),r.bottom.css({top:Math.round(t.y2)+"px",left:Math.round(t.x)+"px",width:Math.round(t.w)+"px",height:i.elh-Math.round(t.y2)+"px"}),r.right.css({left:Math.round(t.x2)+"px",width:i.elw-Math.round(t.x2)+"px"}),r.left.css({width:Math.round(t.x)+"px"}),i.visible||(i.container.show(),i.visible=!0),t}}),l.registerFilter("shader",p);var f=function(t){this.stage=t,this.core=t.core,this.cloneStagePosition()};f.prototype={cloneStagePosition:function(){var t=this.stage;this.angle=t.angle,this.scale=t.scale,this.offset=t.offset},getElement:function(){var t=this.stage;return u("<div />").css({position:"absolute",top:t.offset[0]+"px",left:t.offset[1]+"px",width:t.angle+"px",height:t.scale+"px"})},animate:function(t){var r=this;this.scale=this.stage.boundScale(this.scale),r.stage.triggerEvent("croprotstart"),r.getElement().animate({top:r.offset[0]+"px",left:r.offset[1]+"px",width:r.angle+"px",height:r.scale+"px"},{easing:r.core.opt.animEasing,duration:r.core.opt.animDuration,complete:function(){r.stage.triggerEvent("croprotend"),"function"==typeof t&&t.call(this)},progress:function(t){var e,n={},i=t.tweens;for(e=0;e<i.length;e++)n[i[e].prop]=i[e].now;r.stage.setAngle(n.width).setScale(n.height).setOffset(n.top,n.left).redraw()}})}},l.stage.Canvas.prototype.getAnimator=function(){return new f(this)},l.registerComponent("CanvasAnimator",f);var d=function(t){this.selection=t,this.core=t.core};d.prototype={getElement:function(){var t=this.selection.get();return u("<div />").css({position:"absolute",top:t.y+"px",left:t.x+"px",width:t.w+"px",height:t.h+"px"})},animate:function(t,e,n,i,r){var o=this;o.selection.allowResize(!1),o.getElement().animate({top:e+"px",left:t+"px",width:n+"px",height:i+"px"},{easing:o.core.opt.animEasing,duration:o.core.opt.animDuration,complete:function(){o.selection.allowResize(!0),r&&r.call(this)},progress:function(t){var e,n={},i=t.tweens;for(e=0;e<i.length;e++)n[i[e].prop]=i[e].now;var r={x:parseInt(n.left),y:parseInt(n.top),w:parseInt(n.width),h:parseInt(n.height)};r.x2=r.x+r.w,r.y2=r.y+r.h,o.selection.updateRaw(r,"se")}})}},l.registerComponent("Animator",d);var g=function(t,e,n){var i=this;i.x=t.pageX,i.y=t.pageY,i.selection=e,i.eventTarget=e.core.opt.dragEventTarget,i.orig=e.get(),e.callFilterFunction("refresh");var r=e.core.container.position();i.elx=r.left,i.ely=r.top,i.offsetx=0,i.offsety=0,i.ord=n,i.opposite=i.getOppositeCornerOffset(),i.initEvents(t)};g.prototype={getOppositeCornerOffset:function(){var t=this.orig,e=this.x-this.elx-t.x,n=this.y-this.ely-t.y;switch(this.ord){case"nw":case"w":return[t.w-e,t.h-n];case"sw":return[t.w-e,-n];case"se":case"s":case"e":return[-e,-n];case"ne":case"n":return[-e,t.h-n]}return[null,null]},initEvents:function(t){u(this.eventTarget).on("mousemove.jcrop",this.createDragHandler()).on("mouseup.jcrop",this.createStopHandler())},dragEvent:function(t){this.offsetx=t.pageX-this.x,this.offsety=t.pageY-this.y,this.selection.updateRaw(this.getBox(),this.ord)},endDragEvent:function(t){var e=this.selection;e.core.container.removeClass("jcrop-dragging"),e.element.trigger("cropend",[e,e.core.unscale(e.get())]),e.focus()},createStopHandler:function(){var e=this;return function(t){return u(e.eventTarget).off(".jcrop"),e.endDragEvent(t),!1}},createDragHandler:function(){var e=this;return function(t){return e.dragEvent(t),!1}},update:function(t,e){this.offsetx=t-this.x,this.offsety=e-this.y},resultWrap:function(t){var e={x:Math.min(t[0],t[2]),y:Math.min(t[1],t[3]),x2:Math.max(t[0],t[2]),y2:Math.max(t[1],t[3])};return e.w=e.x2-e.x,e.h=e.y2-e.y,e},getBox:function(){var t=this,e=t.orig,n={x2:e.x+e.w,y2:e.y+e.h};switch(t.ord){case"n":return t.resultWrap([e.x,t.offsety+e.y,n.x2,n.y2]);case"s":return t.resultWrap([e.x,e.y,n.x2,t.offsety+n.y2]);case"e":return t.resultWrap([e.x,e.y,t.offsetx+n.x2,n.y2]);case"w":return t.resultWrap([e.x+t.offsetx,e.y,n.x2,n.y2]);case"sw":return t.resultWrap([t.offsetx+e.x,e.y,n.x2,t.offsety+n.y2]);case"se":return t.resultWrap([e.x,e.y,t.offsetx+n.x2,t.offsety+n.y2]);case"ne":return t.resultWrap([e.x,t.offsety+e.y,t.offsetx+n.x2,n.y2]);case"nw":return t.resultWrap([t.offsetx+e.x,t.offsety+e.y,n.x2,n.y2]);case"move":return n.nx=e.x+t.offsetx,n.ny=e.y+t.offsety,t.resultWrap([n.nx,n.ny,n.nx+e.w,n.ny+e.h])}}},l.registerComponent("DragState",g);var m=function(t){this.core=t};m.prototype={on:function(t,e){u(this).on(t,e)},off:function(t){u(this).off(t)},trigger:function(t){u(this).trigger(t)}},l.registerComponent("EventManager",m);var v=function(t,e,n){this.src=t,e||(e=new Image),this.element=e,this.callback=n,this.load()};u.extend(v,{attach:function(t,e){return new v(t.src,t,e)},prototype:{getDimensions:function(){var t=this.element;return t.naturalWidth?[t.naturalWidth,t.naturalHeight]:t.width?[t.width,t.height]:null},fireCallback:function(){this.element.onload=null,"function"==typeof this.callback&&this.callback.apply(this,this.getDimensions())},isLoaded:function(){return this.element.complete},load:function(){var e=this;e.element.src=e.src,e.isLoaded()?e.fireCallback():e.element.onload=function(t){e.fireCallback()}}}}),l.registerComponent("ImageLoader",v);var y=function(t){this.core=t,this.init()};u.extend(y,{support:function(){if("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch)return!0},prototype:{init:function(){var t=u.Jcrop.component.DragState.prototype;t.touch||(this.initEvents(),this.shimDragState(),this.shimStageDrag(),t.touch=!0)},shimDragState:function(){var e=this;u.Jcrop.component.DragState.prototype.initEvents=function(t){"touch"==t.type.substr(0,5)?u(this.eventTarget).on("touchmove.jcrop.jcrop-touch",e.dragWrap(this.createDragHandler())).on("touchend.jcrop.jcrop-touch",this.createStopHandler()):u(this.eventTarget).on("mousemove.jcrop",this.createDragHandler()).on("mouseup.jcrop",this.createStopHandler())}},shimStageDrag:function(){this.core.container.addClass("jcrop-touch").on("touchstart.jcrop.jcrop-stage",this.dragWrap(this.core.ui.manager.startDragHandler()))},dragWrap:function(e){return function(t){return t.preventDefault(),t.stopPropagation(),"touch"==t.type.substr(0,5)&&(t.pageX=t.originalEvent.changedTouches[0].pageX,t.pageY=t.originalEvent.changedTouches[0].pageY,e(t))}},initEvents:function(){var t=this.core;t.container.on("touchstart.jcrop.jcrop-touch","."+t.opt.css_drag,this.dragWrap(t.startDrag()))}}}),l.registerComponent("Touch",y);var x=function(t){this.core=t,this.init()};u.extend(x,{defaults:{eventName:"keydown.jcrop",passthru:[9],debug:!1},prototype:{init:function(){u.extend(this,x.defaults),this.enable()},disable:function(){this.core.container.off(this.eventName)},enable:function(){var n=this,i=n.core;i.container.on(n.eventName,function(t){var e=t.shiftKey?16:2;if(0<=u.inArray(t.keyCode,n.passthru))return!0;switch(t.keyCode){case 37:i.nudge(-e,0);break;case 38:i.nudge(0,-e);break;case 39:i.nudge(e,0);break;case 40:i.nudge(0,e);break;case 46:case 8:return i.requestDelete(),!1;default:n.debug&&console.log("keycode: "+t.keyCode)}t.metaKey||t.ctrlKey||t.preventDefault()})}}}),l.registerComponent("Keyboard",x);var w=function(){};u.extend(w,{defaults:{minSize:[8,8],maxSize:[0,0],aspectRatio:0,edge:{n:0,s:0,e:0,w:0},bgColor:null,bgOpacity:null,last:null,state:null,active:!0,linked:!0,canDelete:!0,canDrag:!0,canResize:!0,canSelect:!0},prototype:{init:function(t){this.core=t,this.startup(),this.linked=this.core.opt.linked,this.attach(),this.setOptions(this.core.opt),t.container.trigger("cropcreate",[this])},attach:function(){},startup:function(){var e=this,t=e.core.opt;u.extend(e,w.defaults),e.filter=e.core.getDefaultFilters(),e.element=u("<div />").addClass(t.css_selection).data({selection:e}),e.frame=u("<button />").addClass(t.css_button).data("ord","move").attr("type","button"),e.element.append(e.frame).appendTo(e.core.container),e.core.opt.is_msie&&e.frame.css({opacity:0,backgroundColor:"white"}),e.insertElements(),e.frame.on("focus.jcrop",function(t){e.core.setSelection(e),e.element.trigger("cropfocus",e),e.element.addClass("jcrop-focus")}).on("blur.jcrop",function(t){e.element.removeClass("jcrop-focus"),e.element.trigger("cropblur",e)})},propagate:["canDelete","canDrag","canResize","canSelect","minSize","maxSize","aspectRatio","edge"],setOptions:function(t){return l.propagate(this.propagate,t,this),this.refresh(),this},refresh:function(){this.allowResize(),this.allowDrag(),this.allowSelect(),this.callFilterFunction("refresh"),this.updateRaw(this.get(),"se")},callFilterFunction:function(t,e){for(var n=0;n<this.filter.length;n++)this.filter[n][t]&&this.filter[n][t](this);return this},addFilter:function(t){t.core=this.core,this.hasFilter(t)||(this.filter.push(t),this.sortFilters(),t.init&&t.init(),this.refresh())},hasFilter:function(t){var e,n=this.filter;for(e=0;e<n.length;e++)if(n[e]===t)return!0},sortFilters:function(){this.filter.sort(function(t,e){return t.priority-e.priority})},clearFilters:function(){for(var t=this.filter,e=0;e<t.length;e++)t[e].destroy&&t[e].destroy();this.filter=[]},removeFilter:function(t){for(var e=this.filter,n=[],i=0;i<e.length;i++)e[i].tag&&e[i].tag==t||t===e[i]?e[i].destroy&&e[i].destroy():n.push(e[i]);this.filter=n},runFilters:function(t,e){for(var n=0;n<this.filter.length;n++)t=this.filter[n].filter(t,e,this);return t},endDrag:function(){this.state&&(u(document.body).off(".jcrop"),this.focus(),this.state=null)},startDrag:function(t,e){this.core;return e=e||u(t.target).data("ord"),this.focus(),"move"==e&&this.element.hasClass(this.core.opt.css_nodrag)||(this.state=new l.component.DragState(t,this,e)),!1},allowSelect:function(t){return void 0===t&&(t=this.canSelect),t&&this.canSelect?this.frame.attr("disabled",!1):this.frame.attr("disabled","disabled"),this},allowDrag:function(t){var e=this,n=e.core.opt;return null==t&&(t=e.canDrag),t&&e.canDrag?e.element.removeClass(n.css_nodrag):e.element.addClass(n.css_nodrag),this},allowResize:function(t){var e=this,n=e.core.opt;return null==t&&(t=e.canResize),t&&e.canResize?e.element.removeClass(n.css_noresize):e.element.addClass(n.css_noresize),this},remove:function(){this.element.trigger("cropremove",this),this.element.remove()},toBack:function(){this.active=!1,this.element.removeClass("jcrop-current jcrop-focus")},toFront:function(){this.active=!0,this.element.addClass("jcrop-current"),this.callFilterFunction("refresh"),this.refresh()},redraw:function(t){return this.moveTo(t.x,t.y),this.resize(t.w,t.h),this.last=t,this},update:function(t,e){return this.updateRaw(this.core.scale(t),e)},updateRaw:function(t,e){return t=this.runFilters(t,e),this.redraw(t),this.element.trigger("cropmove",[this,this.core.unscale(t)]),this},animateTo:function(t,e){var n=new l.component.Animator(this),i=this.core.scale(l.wrapFromXywh(t));n.animate(i.x,i.y,i.w,i.h,e)},center:function(t){var e=this.get(),n=this.core,i=n.container.width(),r=n.container.height(),o=[(i-e.w)/2,(r-e.h)/2,e.w,e.h];return this[t?"setSelect":"animateTo"](o)},createElement:function(t,e){return u("<div />").addClass(t+" ord-"+e).data("ord",e)},moveTo:function(t,e){this.element.css({top:e+"px",left:t+"px"})},blur:function(){return this.element.blur(),this},focus:function(){return this.core.setSelection(this),this.frame.focus(),this},resize:function(t,e){this.element.css({width:t+"px",height:e+"px"})},get:function(){var t=this.element,e=t.position(),n=t.width(),i=t.height(),r={x:e.left,y:e.top};return r.x2=r.x+n,r.y2=r.y+i,r.w=n,r.h=i,r},insertElements:function(){var t,e=this,n=(e.core,e.element),i=e.core.opt,r=i.borders,o=i.handles,s=i.dragbars;for(t=0;t<s.length;t++)n.append(e.createElement(i.css_dragbars,s[t]));for(t=0;t<o.length;t++)n.append(e.createElement(i.css_handles,o[t]));for(t=0;t<r.length;t++)n.append(e.createElement(i.css_borders,r[t]))}}}),l.registerComponent("Selection",w);var b=function(t,e){u.extend(this,b.defaults,e||{}),this.manager=t,this.core=t.core};b.defaults={offset:[-8,-8],active:!0,minsize:[20,20]},u.extend(b.prototype,{start:function(t){var e=this.core;if(e.opt.allowSelect){if(e.opt.multi&&e.opt.multiMax&&e.ui.multi.length>=e.opt.multiMax)return!1;var n=u(t.currentTarget).offset(),i=t.pageX-n.left+this.offset[0],r=t.pageY-n.top+this.offset[1],o=e.ui.multi;if(!e.opt.multi)if(e.opt.multiCleanup){for(var s=0;s<o.length;s++)o[s].remove();e.ui.multi=[]}else e.removeSelection(e.ui.selection);e.container.addClass("jcrop-dragging");var a=e.newSelection().updateRaw(l.wrapFromXywh([i,r,1,1]));return a.element.trigger("cropstart",[a,this.core.unscale(a.get())]),a.startDrag(t,"se")}},end:function(t,e){this.drag(t,e);var n=this.sel.get();this.core.container.removeClass("jcrop-dragging"),n.w<this.minsize[0]||n.h<this.minsize[1]?this.core.requestDelete():this.sel.focus()}}),l.registerComponent("StageDrag",b);var C=function(t){this.core=t,this.ui=t.ui,this.init()};u.extend(C.prototype,{init:function(){this.setupEvents(),this.dragger=new b(this)},tellConfigUpdate:function(t){for(var e=0,n=this.ui.multi,i=n.length;e<i;e++)n[e].setOptions&&(n[e].linked||this.core.opt.linkCurrent&&n[e]==this.ui.selection)&&n[e].setOptions(t)},startDragHandler:function(){var e=this;return function(t){if(!t.button||e.core.opt.is_ie_lt9)return e.dragger.start(t)}},removeEvents:function(){this.core.event.off(".jcrop-stage"),this.core.container.off(".jcrop-stage")},shimLegacyHandlers:function(n){var i,r=this.core;u.each(r.opt.legacyHandlers,function(t,e){t in n&&(i=n[t],r.container.off(".jcrop-"+t).on(e+".jcrop.jcrop-"+t,function(t,e,n){i.call(r,n)}),delete n[t])})},setupEvents:function(){var e=this,n=e.core;n.event.on("configupdate.jcrop-stage",function(t){e.shimLegacyHandlers(n.opt),e.tellConfigUpdate(n.opt),n.container.trigger("cropconfig",[n,n.opt])}),this.core.container.on("mousedown.jcrop.jcrop-stage",this.startDragHandler())}}),l.registerComponent("StageManager",C);var S=function(){};u.extend(S,{defaults:{selection:null,fading:!0,fadeDelay:1e3,fadeDuration:1e3,autoHide:!1,width:80,height:80,_hiding:null},prototype:{recopyCanvas:function(){var t=this.core.ui.stage,e=t.context;this.context.putImageData(e.getImageData(0,0,t.canvas.width,t.canvas.height),0,0)},init:function(t,e){var n=this;this.core=t,u.extend(this,S.defaults,e),n.initEvents(),n.refresh(),n.insertElements(),n.selection?(n.renderSelection(n.selection),n.selectionTarget=n.selection.element[0]):n.core.ui.selection&&n.renderSelection(n.core.ui.selection),n.core.ui.stage.canvas&&(n.context=n.preview[0].getContext("2d"),n.core.container.on("cropredraw",function(t){n.recopyCanvas(),n.refresh()}))},updateImage:function(t){return this.preview.remove(),this.preview=u(u.Jcrop.imageClone(t)),this.element.append(this.preview),this.refresh(),this},insertElements:function(){this.preview=u(u.Jcrop.imageClone(this.core.ui.stage.imgsrc)),this.element=u("<div />").addClass("jcrop-thumb").width(this.width).height(this.height).append(this.preview).appendTo(this.core.container)},resize:function(t,e){this.width=t,this.height=e,this.element.width(t).height(e),this.renderCoords(this.last)},refresh:function(){this.cw=this.core.opt.xscale*this.core.container.width(),this.ch=this.core.opt.yscale*this.core.container.height(),this.last&&this.renderCoords(this.last)},renderCoords:function(t){var e=this.width/t.w,n=this.height/t.h;return this.preview.css({width:Math.round(e*this.cw)+"px",height:Math.round(n*this.ch)+"px",marginLeft:"-"+Math.round(e*t.x)+"px",marginTop:"-"+Math.round(n*t.y)+"px"}),this.last=t,this},renderSelection:function(t){return this.renderCoords(t.core.unscale(t.get()))},selectionStart:function(t){this.renderSelection(t)},show:function(){this._hiding&&clearTimeout(this._hiding),this.fading?this.element.stop().animate({opacity:1},{duration:80,queue:!1}):this.element.stop().css({opacity:1})},hide:function(){var t=this;t.fading?t._hiding=setTimeout(function(){t._hiding=null,t.element.stop().animate({opacity:0},{duration:t.fadeDuration,queue:!1})},t.fadeDelay):t.element.hide()},initEvents:function(){var i=this;i.core.container.on("croprotstart croprotend cropimage cropstart cropmove cropend",function(t,e,n){if(i.selectionTarget&&i.selectionTarget!==t.target)return!1;switch(t.type){case"cropimage":i.updateImage(n);break;case"cropstart":i.selectionStart(e);case"croprotstart":i.show();break;case"cropend":i.renderCoords(n);case"croprotend":i.autoHide&&i.hide();break;case"cropmove":i.renderCoords(n)}})}}}),l.registerComponent("Thumbnailer",S);var D=function(){};D.prototype={init:function(t,e,n){e||(e=t.container),this.$btn=u(e),this.$targ=u(e),this.core=t,this.$btn.addClass("dialdrag").on("mousedown.dialdrag",this.mousedown()).data("dialdrag",this),u.isFunction(n)||(n=function(){}),this.callback=n,this.ondone=n},remove:function(){return this.$btn.removeClass("dialdrag").off(".dialdrag").data("dialdrag",null),this},setTarget:function(t){return this.$targ=u(t),this},getOffset:function(){var t=this.$targ,e=t.offset();return[e.left+t.width()/2,e.top+t.height()/2]},relMouse:function(t){var e=t.pageX-this.offset[0],n=t.pageY-this.offset[1];return[e,n,Math.atan2(n,e)*(180/Math.PI),Math.sqrt(Math.pow(e,2)+Math.pow(n,2))]},mousedown:function(){var n=this;function i(t){u(window).off(".dialdrag"),n.ondone.call(n,n.relMouse(t)),n.core.container.trigger("croprotend")}function r(t){n.callback.call(n,n.relMouse(t))}return function(t){n.offset=n.getOffset();var e=n.relMouse(t);return n.angleOffset=-n.core.ui.stage.angle+e[2],n.distOffset=e[3],n.dragOffset=[e[0],e[1]],n.core.container.trigger("croprotstart"),u(window).on("mousemove.dialdrag",r).on("mouseup.dialdrag",i),n.callback.call(n,n.relMouse(t)),!1}}},l.registerComponent("DialDrag",D),l.defaults={edge:{n:0,s:0,e:0,w:0},setSelect:null,linked:!0,linkCurrent:!0,canDelete:!0,canSelect:!0,canDrag:!0,canResize:!0,eventManagerComponent:l.component.EventManager,keyboardComponent:l.component.Keyboard,dragstateComponent:l.component.DragState,stagemanagerComponent:l.component.StageManager,animatorComponent:l.component.Animator,selectionComponent:l.component.Selection,stageConstructor:l.stageConstructor,allowSelect:!0,multi:!1,multiMax:!1,multiCleanup:!0,animation:!0,animEasing:"swing",animDuration:400,fading:!0,fadeDuration:300,fadeEasing:"swing",bgColor:"black",bgOpacity:.5,applyFilters:["constrain","extent","backoff","ratio","shader","round"],borders:["e","w","s","n"],handles:["n","s","e","w","sw","ne","nw","se"],dragbars:["n","e","w","s"],dragEventTarget:window,xscale:1,yscale:1,boxWidth:null,boxHeight:null,css_nodrag:"jcrop-nodrag",css_drag:"jcrop-drag",css_container:"jcrop-active",css_shades:"jcrop-shades",css_selection:"jcrop-selection",css_borders:"jcrop-border",css_handles:"jcrop-handle jcrop-drag",css_button:"jcrop-box jcrop-drag",css_noresize:"jcrop-noresize",css_dragbars:"jcrop-dragbar jcrop-drag",legacyHandlers:{onChange:"cropmove",onSelect:"cropend"}},u.extend(l.prototype,{init:function(){this.event=new this.opt.eventManagerComponent(this),this.ui.keyboard=new this.opt.keyboardComponent(this),this.ui.manager=new this.opt.stagemanagerComponent(this),this.applyFilters(),u.Jcrop.supportsTouch&&new u.Jcrop.component.Touch(this),this.initEvents()},applySizeConstraints:function(){var t=this.opt,e=this.opt.imgsrc;if(e){var n=e.naturalWidth||e.width,i=e.naturalHeight||e.height,r=t.boxWidth||n,o=t.boxHeight||i;if(e&&(r<n||o<i)){var s=l.getLargestBox(n/i,r,o);u(e).width(s[0]).height(s[1]),this.resizeContainer(s[0],s[1]),this.opt.xscale=n/s[0],this.opt.yscale=i/s[1]}}if(this.opt.trueSize){var a=this.opt.trueSize[0],c=this.opt.trueSize[1],h=this.getContainerSize();this.opt.xscale=a/h[0],this.opt.yscale=c/h[1]}},initComponent:function(t){if(l.component[t]){var e=Array.prototype.slice.call(arguments),n=new l.component[t];return e.shift(),e.unshift(this),n.init.apply(n,e),n}},setOptions:function(t,e){return u.isPlainObject(t)||(t={}),u.extend(this.opt,t),this.opt.setSelect&&(this.ui.multi.length||this.newSelection(),this.setSelect(this.opt.setSelect),this.opt.setSelect=null),this.event.trigger("configupdate"),this},destroy:function(){this.opt.imgsrc?(this.container.before(this.opt.imgsrc),this.container.remove(),u(this.opt.imgsrc).removeData("Jcrop").show()):this.container.remove()},applyFilters:function(){for(var t,e=0,n=this.opt.applyFilters,i=n.length;e<i;e++)u.Jcrop.filter[n[e]]&&(t=new u.Jcrop.filter[n[e]]),t.core=this,t.init&&t.init(),this.filter[n[e]]=t},getDefaultFilters:function(){for(var t=[],e=0,n=this.opt.applyFilters,i=n.length;e<i;e++)this.filter.hasOwnProperty(n[e])&&t.push(this.filter[n[e]]);return t.sort(function(t,e){return t.priority-e.priority}),t},setSelection:function(t){for(var e=this.ui.multi,n=[],i=0;i<e.length;i++)e[i]!==t&&n.push(e[i]),e[i].toBack();return n.unshift(t),this.ui.multi=n,(this.ui.selection=t).toFront(),t},getSelection:function(t){return this.ui.selection.get()},newSelection:function(t){return t||(t=new this.opt.selectionComponent),t.init(this),this.setSelection(t),t},hasSelection:function(t){for(var e=0;e<this.ui.multi;e++)if(t===this.ui.multi[e])return!0},removeSelection:function(t){for(var e=[],n=this.ui.multi,i=0;i<n.length;i++)t!==n[i]?e.push(n[i]):n[i].remove();return this.ui.multi=e},addFilter:function(t){for(var e=0,n=this.ui.multi,i=n.length;e<i;e++)n[e].addFilter(t);return this},removeFilter:function(t){for(var e=0,n=this.ui.multi,i=n.length;e<i;e++)n[e].removeFilter(t);return this},blur:function(){return this.ui.selection.blur(),this},focus:function(){return this.ui.selection.focus(),this},initEvents:function(){this.container.on("selectstart",function(t){return!1}).on("mousedown","."+this.opt.css_drag,this.startDrag())},maxSelect:function(){this.setSelect([0,0,this.elw,this.elh])},nudge:function(t,e){var n=this.ui.selection,i=n.get();i.x+=t,i.x2+=t,i.y+=e,i.y2+=e,i.x<0?(i.x2=i.w,i.x=0):i.x2>this.elw&&(i.x2=this.elw,i.x=i.x2-i.w),i.y<0?(i.y2=i.h,i.y=0):i.y2>this.elh&&(i.y2=this.elh,i.y=i.y2-i.h),n.element.trigger("cropstart",[n,this.unscale(i)]),n.updateRaw(i,"move"),n.element.trigger("cropend",[n,this.unscale(i)])},refresh:function(){for(var t=0,e=this.ui.multi,n=e.length;t<n;t++)e[t].refresh()},blurAll:function(){for(var t=this.ui.multi,e=0;e<t.length;e++)t[e]!==sel&&n.push(t[e]),t[e].toBack()},scale:function(t){var e=this.opt.xscale,n=this.opt.yscale;return{x:t.x/e,y:t.y/n,x2:t.x2/e,y2:t.y2/n,w:t.w/e,h:t.h/n}},unscale:function(t){var e=this.opt.xscale,n=this.opt.yscale;return{x:t.x*e,y:t.y*n,x2:t.x2*e,y2:t.y2*n,w:t.w*e,h:t.h*n}},requestDelete:function(){if(1<this.ui.multi.length&&this.ui.selection.canDelete)return this.deleteSelection()},deleteSelection:function(){this.ui.selection&&(this.removeSelection(this.ui.selection),this.ui.multi.length&&this.ui.multi[0].focus(),this.ui.selection.refresh())},animateTo:function(t){return this.ui.selection&&this.ui.selection.animateTo(t),this},setSelect:function(t){return this.ui.selection&&this.ui.selection.update(l.wrapFromXywh(t)),this},startDrag:function(){var r=this;return function(t){var e=u(t.target),n=e.closest("."+r.opt.css_selection).data("selection"),i=e.data("ord");return r.container.trigger("cropstart",[n,r.unscale(n.get())]),n.startDrag(t,i),!1}},getContainerSize:function(){return[this.container.width(),this.container.height()]},resizeContainer:function(t,e){this.container.width(t).height(e),this.refresh()},setImage:function(n,i){var r=this,o=r.opt.imgsrc;if(!o)return!1;new u.Jcrop.component.ImageLoader(n,null,function(t,e){r.resizeContainer(t,e),o.src=n,u(o).width(t).height(e),r.applySizeConstraints(),r.refresh(),r.container.trigger("cropimage",[r,o]),"function"==typeof i&&i.call(r,t,e)})},update:function(t){this.ui.selection&&this.ui.selection.update(t)}}),u.fn.Jcrop=function(e,o){e=e||{};var t=this.eq(0).data("Jcrop"),n=Array.prototype.slice.call(arguments);return"api"==e?t:t&&"string"==typeof e?!!t[e]&&(n.shift(),t[e].apply(t,n),t):void this.each(function(){var r=u(this),t=r.data("Jcrop");return t?t.setOptions(e):(e.stageConstructor||(e.stageConstructor=u.Jcrop.stageConstructor),e.stageConstructor(this,e,function(t,e){var n=e.setSelect;n&&delete e.setSelect;var i=u.Jcrop.attach(t.element,e);"function"==typeof t.attach&&t.attach(i),r.data("Jcrop",i),n&&(i.newSelection(),i.setSelect(n)),"function"==typeof o&&o.call(i)})),this})};var E,j=function(t,l,o){var e,i,r,s={},p=l.documentElement,f="modernizr",n=l.createElement(f),a=n.style,c={}.toString,h=" -webkit- -moz- -o- -ms- ".split(" "),u="Webkit Moz O ms",d=u.split(" "),g=u.toLowerCase().split(" "),m="http://www.w3.org/2000/svg",v={},y=[],x=y.slice,w=function(t,e,n,i){var r,o,s,a,c=l.createElement("div"),h=l.body,u=h||l.createElement("body");if(parseInt(n,10))for(;n--;)(s=l.createElement("div")).id=i?i[n]:f+(n+1),c.appendChild(s);return r=["&#173;",'<style id="s',f,'">',t,"</style>"].join(""),c.id=f,(h?c:u).innerHTML+=r,u.appendChild(c),h||(u.style.background="",u.style.overflow="hidden",a=p.style.overflow,p.style.overflow="hidden",p.appendChild(u)),o=e(c,t),h?c.parentNode.removeChild(c):(u.parentNode.removeChild(u),p.style.overflow=a),!!o},b=(r={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"},function(t,e){e=e||l.createElement(r[t]||"div");var n=(t="on"+t)in e;return n||(e.setAttribute||(e=l.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(t,""),n=D(e[t],"function"),D(e[t],"undefined")||(e[t]=o),e.removeAttribute(t))),e=null,n}),C={}.hasOwnProperty;function S(t){a.cssText=t}function D(t,e){return typeof t===e}function E(t,e){for(var n in t){var i=t[n];if(!~(""+i).indexOf("-")&&a[i]!==o)return"pfx"!=e||i}return!1}function j(t,e,n){var i=t.charAt(0).toUpperCase()+t.slice(1),r=(t+" "+d.join(i+" ")+i).split(" ");return D(e,"string")||D(e,"undefined")?E(r,e):function(t,e,n){for(var i in t){var r=e[t[i]];if(r!==o)return!1===n?t[i]:D(r,"function")?r.bind(n||e):r}return!1}(r=(t+" "+g.join(i+" ")+i).split(" "),e,n)}for(var M in i=D(C,"undefined")||D(C.call,"undefined")?function(t,e){return e in t&&D(t.constructor.prototype[e],"undefined")}:function(t,e){return C.call(t,e)},Function.prototype.bind||(Function.prototype.bind=function(i){var r=this;if("function"!=typeof r)throw new TypeError;var o=x.call(arguments,1),s=function(){if(this instanceof s){var t=function(){};t.prototype=r.prototype;var e=new t,n=r.apply(e,o.concat(x.call(arguments)));return Object(n)===n?n:e}return r.apply(i,o.concat(x.call(arguments)))};return s}),v.canvas=function(){var t=l.createElement("canvas");return!(!t.getContext||!t.getContext("2d"))},v.canvastext=function(){return!(!s.canvas||!D(l.createElement("canvas").getContext("2d").fillText,"function"))},v.touch=function(){var e;return"ontouchstart"in t||t.DocumentTouch&&l instanceof DocumentTouch?e=!0:w(["@media (",h.join("touch-enabled),("),f,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(t){e=9===t.offsetTop}),e},v.draganddrop=function(){var t=l.createElement("div");return"draggable"in t||"ondragstart"in t&&"ondrop"in t},v.csstransforms=function(){return!!j("transform")},v.svg=function(){return!!l.createElementNS&&!!l.createElementNS(m,"svg").createSVGRect},v.inlinesvg=function(){var t=l.createElement("div");return t.innerHTML="<svg/>",(t.firstChild&&t.firstChild.namespaceURI)==m},v.svgclippaths=function(){return!!l.createElementNS&&/SVGClipPath/.test(c.call(l.createElementNS(m,"clipPath")))},v)i(v,M)&&(e=M.toLowerCase(),s[e]=v[M](),y.push((s[e]?"":"no-")+e));return s.addTest=function(t,e){if("object"==typeof t)for(var n in t)i(t,n)&&s.addTest(n,t[n]);else{if(t=t.toLowerCase(),s[t]!==o)return s;e="function"==typeof e?e():e,"undefined"!=typeof enableClasses&&enableClasses&&(p.className+=" "+(e?"":"no-")+t),s[t]=e}return s},S(""),n=null,s._version="2.7.1",s._prefixes=h,s._domPrefixes=g,s._cssomPrefixes=d,s.hasEvent=b,s.testProp=function(t){return E([t])},s.testAllProps=j,s.testStyles=w,s}(window,window.document);(E=new Image).onerror=function(){j.addTest("datauri",function(){return!1})},E.onload=function(){j.addTest("datauri",function(){return 1==E.width&&1==E.height})},E.src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",u.Jcrop=l,u.Jcrop.supportsCanvas=j.canvas,u.Jcrop.supportsCanvasText=j.canvastext,u.Jcrop.supportsDragAndDrop=j.draganddrop,u.Jcrop.supportsDataURI=j.datauri,u.Jcrop.supportsSVG=j.svg,u.Jcrop.supportsInlineSVG=j.inlinesvg,u.Jcrop.supportsSVGClipPaths=j.svgclippaths,u.Jcrop.supportsCSSTransforms=j.csstransforms,u.Jcrop.supportsTouch=j.touch}(jQuery);