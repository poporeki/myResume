$.fn.sparkline.discrete=discrete=createClass($.fn.sparkline._base,barHighlightMixin,{type:"discrete",init:function(t,i,e,h,a){discrete._super.init.call(this,t,i,e,h,a),this.regionShapes={},this.values=i=$.map(i,Number),this.min=Math.min.apply(Math,i),this.max=Math.max.apply(Math,i),this.range=this.max-this.min,this.width=h="auto"===e.get("width")?2*i.length:this.width,this.interval=Math.floor(h/i.length),this.itemWidth=h/i.length,void 0!==e.get("chartRangeMin")&&(e.get("chartRangeClip")||e.get("chartRangeMin")<this.min)&&(this.min=e.get("chartRangeMin")),void 0!==e.get("chartRangeMax")&&(e.get("chartRangeClip")||e.get("chartRangeMax")>this.max)&&(this.max=e.get("chartRangeMax")),this.initTarget(),this.target&&(this.lineHeight="auto"===e.get("lineHeight")?Math.round(.3*this.canvasHeight):e.get("lineHeight"))},getRegion:function(t,i,e){return Math.floor(i/this.itemWidth)},getCurrentRegionFields:function(){var t=this.currentRegion;return{isNull:void 0===this.values[t],value:this.values[t],offset:t}},renderRegion:function(t,i){var e,h,a,n,s=this.values,r=this.options,g=this.min,l=this.max,o=this.range,c=this.interval,u=this.target,d=this.canvasHeight,m=this.lineHeight,v=d-m;return h=clipval(s[t],g,l),n=t*c,e=Math.round(v-v*((h-g)/o)),a=r.get("thresholdColor")&&h<r.get("thresholdValue")?r.get("thresholdColor"):r.get("lineColor"),i&&(a=this.calcHighlightColor(a,r)),u.drawLine(n,e,n,e+m,a)}});