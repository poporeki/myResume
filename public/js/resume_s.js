function opt(_color, _num, _text, _fontSize) {
  return option = {
    color: [_color],
    series: [{
      name: '值',
      type: 'pie',
      clockWise: true, //顺时加载
      hoverAnimation: false, //鼠标移入变大
      radius: ['60%', '61%'],
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'inside'
          },
          labelLine: {
            show: false,
            length: 0,
            smooth: 0.5
          },
          borderWidth: 5,
          shadowBlur: 40,
          borderColor: _color,
          shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
        }
      },
      data: [{
        value: _num,
        /* name: _num + '0%' */
      }, {
        value: 10 - _num,
        name: '',
        itemStyle: {
          normal: {
            color: "rgba(0,0,0,0)",
            borderColor: "rgba(0,0,0,0)",
            borderWidth: 0
          }
        }
      }]
    }, {
      name: '白',
      type: 'pie',
      clockWise: true,
      hoverAnimation: true,
      radius: [100, 100],
      label: {
        normal: {
          position: 'center'
        }
      },
      data: [{
        value: 1,
        label: {
          normal: {
            formatter: _text,
            textStyle: {
              color: '#666666',
              fontSize: _fontSize
            }
          }
        }
      }]
    }]
  };
}
var chartArr = [];

function createEchars(el, ops) {
  var dom = document.getElementById(el);
  var myChart = echarts.init(dom);
  myChart.setOption(ops);
  chartArr.push(myChart);
}
$(function () {
  createEchars('echars_html', opt('#fc7a26', 8, 'HTML', '130%'));
  createEchars('echars_css', opt('#4dc21f', 9, 'CSS', '130%'));
  createEchars('echars_js', opt('#1fc2b5', 7, 'Javascript', '130%'));
  createEchars('echars_ps', opt('#fcad26', 6, 'Photoshop', '130%'));
  createEchars('echars_tools', opt('#588ad3', 6, '其他工具', '130%'));
  window.onresize = function () {
    for (var i in chartArr) {
      chartArr[i].resize();
    }
  }
})