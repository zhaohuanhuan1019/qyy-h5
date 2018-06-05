<template>
  <div class="footer">
      <ul class="footer-wrapper">
          <li :class="{ unusual: number.lateTimes>0}"><div class='number'>{{number.lateTimes}}</div><span class="down">迟到</span></li>
          <li :class="{ unusual: number.earlyTimes>0}"><div class='number'>{{number.earlyTimes}}</div></span><span class="down">早退</span></li>
          <li :class="{ unusual: number.absentTimes>0}"><div class='number'>{{number.absentTimes}}</div></span><span class="down">旷工</span></li>
          <li :class="{ unusual: number.unclockTimes>0}"><div class='number'>{{number.unclockTimes}}</div></span><span class="down">未打卡</span></li>
      </ul>
  </div>
</template>

<script>
export default {
    props: ['number']
};
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>

.footer{
    width:100%;
    height: .64rem;
    min-height: .64rem;
    position: absolute;
    left:0;
    bottom:0;
    background: #fff;
    /*background: #F9F9F9;*/

    .footer-wrapper{
        width:100%;
        height: 100%;
        height: .64rem;
        min-height: .64rem;
        li{
            width: 25%;
            height: 100%;
            float: left;
            text-align: center;
            font-size: .3rem;
            color: #2E2E2E;
            &.unusual{
                color: #FF6200;
            }
            span{
                &.down{
                    font-family: PingFangSC-Regular;
                    font-size: 0.12rem;
                    color: #929292;
                    height:.14rem;
                    display: block;
                }
            }
            .number{
                width: 100%;
                height: 0.42rem;
                line-height: 0.42rem;
            }
        }
    }
}
</style>
