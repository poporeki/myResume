$.fn.sparkline.bar=bar=createClass($.fn.sparkline._base,barHighlightMixin,{type:"bar",init:function(t,a,i,e,h){var l,r,s,n,o,g,c,p,M,u,f,d,v,y,x,C,R,b,B,m,H,V=parseInt(i.get("barWidth"),10),k=parseInt(i.get("barSpacing"),10),A=i.get("chartRangeMin"),W=i.get("chartRangeMax"),z=i.get("chartRangeClip"),I=1/0,w=-1/0;for(bar._super.init.call(this,t,a,i,e,h),g=0,c=a.length;g<c;g++)((l="string"==typeof(m=a[g])&&-1<m.indexOf(":"))||$.isArray(m))&&(x=!0,l&&(m=a[g]=normalizeValues(m.split(":"))),m=remove(m,null),(r=Math.min.apply(Math,m))<I&&(I=r),w<(s=Math.max.apply(Math,m))&&(w=s));this.stacked=x,this.regionShapes={},this.barWidth=V,this.barSpacing=k,this.totalBarWidth=V+k,this.width=e=a.length*V+(a.length-1)*k,this.initTarget(),z&&(v=void 0===A?-1/0:A,y=void 0===W?1/0:W),o=[],n=x?[]:o;var E=[],O=[];for(g=0,c=a.length;g<c;g++)if(x)for(C=a[g],a[g]=B=[],E[g]=0,n[g]=O[g]=0,R=0,b=C.length;R<b;R++)null!==(m=B[R]=z?clipval(C[R],v,y):C[R])&&(0<m&&(E[g]+=m),I<0&&0<w?m<0?O[g]+=Math.abs(m):n[g]+=m:n[g]+=Math.abs(m-(m<0?w:I)),o.push(m));else m=z?clipval(a[g],v,y):a[g],null!==(m=a[g]=normalizeValue(m))&&o.push(m);this.max=d=Math.max.apply(Math,o),this.min=f=Math.min.apply(Math,o),this.stackMax=w=x?Math.max.apply(Math,E):d,this.stackMin=I=x?Math.min.apply(Math,o):f,void 0!==i.get("chartRangeMin")&&(i.get("chartRangeClip")||i.get("chartRangeMin")<f)&&(f=i.get("chartRangeMin")),void 0!==i.get("chartRangeMax")&&(i.get("chartRangeClip")||i.get("chartRangeMax")>d)&&(d=i.get("chartRangeMax")),this.zeroAxis=M=i.get("zeroAxis",!0),u=f<=0&&0<=d&&M?0:0==M?f:0<f?f:d,this.xaxisOffset=u,p=x?Math.max.apply(Math,n)+Math.max.apply(Math,O):d-f,this.canvasHeightEf=M&&f<0?this.canvasHeight-2:this.canvasHeight-1,f<u?(H=((x&&0<=d?w:d)-u)/p*this.canvasHeight)!==Math.ceil(H)&&(this.canvasHeightEf-=2,H=Math.ceil(H)):H=this.canvasHeight,this.yoffset=H,$.isArray(i.get("colorMap"))?(this.colorMapByIndex=i.get("colorMap"),this.colorMapByValue=null):(this.colorMapByIndex=null,this.colorMapByValue=i.get("colorMap"),this.colorMapByValue&&void 0===this.colorMapByValue.get&&(this.colorMapByValue=new RangeMap(this.colorMapByValue))),this.range=p},getRegion:function(t,a,i){var e=Math.floor(a/this.totalBarWidth);return e<0||e>=this.values.length?void 0:e},getCurrentRegionFields:function(){var t,a,i=this.currentRegion,e=ensureArray(this.values[i]),h=[];for(a=e.length;a--;)t=e[a],h.push({isNull:null===t,value:t,color:this.calcColor(a,t,i),offset:i});return h},calcColor:function(t,a,i){var e,h,l=this.colorMapByIndex,r=this.colorMapByValue,s=this.options;return e=this.stacked?s.get("stackedBarColor"):a<0?s.get("negBarColor"):s.get("barColor"),0===a&&void 0!==s.get("zeroColor")&&(e=s.get("zeroColor")),r&&(h=r.get(a))?e=h:l&&l.length>i&&(e=l[i]),$.isArray(e)?e[t%e.length]:e},renderRegion:function(t,a){var i,e,h,l,r,s,n,o,g,c,p=this.values[t],M=this.options,u=this.xaxisOffset,f=[],d=this.range,v=this.stacked,y=this.target,x=t*this.totalBarWidth,C=this.canvasHeightEf,R=this.yoffset;if(n=(p=$.isArray(p)?p:[p]).length,o=p[0],l=all(null,p),c=all(u,p,!0),l)return M.get("nullColor")?(h=a?M.get("nullColor"):this.calcHighlightColor(M.get("nullColor"),M),i=0<R?R-1:R,y.drawRect(x,i,this.barWidth-1,0,h,h)):void 0;for(r=R,s=0;s<n;s++){if(o=p[s],v&&o===u){if(!c||g)continue;g=!0}e=0<d?Math.floor(C*(Math.abs(o-u)/d))+1:1,o<u||o===u&&0===R?(i=r,r+=e):(i=R-e,R-=e),h=this.calcColor(s,o,t),a&&(h=this.calcHighlightColor(h,M)),f.push(y.drawRect(x,i,this.barWidth-1,e-1,h,h))}return 1===f.length?f[0]:f}});