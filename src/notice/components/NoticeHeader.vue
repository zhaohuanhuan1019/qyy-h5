<template>
  <div id="header">
    <header class="header">
      <div class="header-title">
        <div class="go-back" @click="goBack()">
        </div>
        <div class="header-right">
          <!--<div v-if="!baseTitle.isCollection" >收藏列表</div>-->
          <router-link to="/notice/collection" v-if="!baseTitle.isCollection"> 收藏列表</router-link>
          <div v-if="isCollection && state == 1">
            <div class="collection-icon" v-if="baseTitle.isCollection && baseTitle.isCollectionDetail" @click="collectionHandle" :class="{'collectioned': hascollected == 1}"></div>
            <!-- 收藏列表进来的 -->
          </div>
          <div v-if="!isCollection && state == 1">
            <div class="collection-icon" v-if="baseTitle.isCollection && baseTitle.isCollectionDetail" @click="collectionHandle" :class="{'collectioned': hascollected == 1}"></div>
          </div>
        </div>
        <h6 class="go-top">{{baseTitle.title}}</h6>
      </div>
      <div class="collection-hint" ref="collectionHint" v-show="collectionHint">
        <p v-text="collectMsg"></p>
      </div>
    </header>
  </div>
</template>
<script type="text/ecmascript-6">
import Event from 'common/js/bus.js';
import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
import 'common/js/hammer.min.js';
const updataApi = '/notice/collectNotice';//修改公告收藏状态

export default {
  name: 'header',
  props: ['baseTitle', 'isCollection', 'noticeStaffId', 'mainId', 'hascollect', 'state','isCarousel'],
  data() {
    return {
      clicked: 0,
      collectioned: true,//收藏与否的判断条件
      collectioned2: false,//收藏与否的判断条件
      title: '',
      isLockCollect: false,//更改收藏状态的锁头
      hascollected: 2,//获取到传过来的收藏标志位
      collect: 2,//要改变到收藏状态的值
      collectionHint: false,//已收藏等显示控制
      collectMsg: '已收藏',
      deviceHeight: 0,
      topObg: ''
    }
  },
  mounted() {
    this.topObg = this.$el.querySelector('.go-top');
    var hammer = new Hammer.Manager(this.topObg);
    hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    hammer.on('doubletap', this.goTop);

    // 安卓 控制全局物理返回键页面跳转
    WebViewJavascriptBridge.registerHandler("functionInJs", () => {
      this.goBack();
    });
  },
  methods: {
    goBack() {
      if(this.isCarousel) this.$emit('moveCarouselZero')
      if (this.$route.name == 'noticeAll') {
        jsBridge.requestBack().then(function() { });
      } else if(!this.isCarousel) {
        this.$router.back();
      }
    },
    collectionHandle() {//切换公告收藏状态的函数
      if (this.hascollected == 0) {
        this.collect = 1;
      } else if (this.hascollected == 1) {
        this.collect = 0;
      }
      if (!this.isLockCollect && this.hascollected !== 2) {
        this.isLockCollect = true;
        jsBridge.getHeader().then((value) => {
          let headersApp = value;
          this.$http({
            method: 'PUT',
            url: updataApi,
            body: JSON.stringify({
              "id": this.noticeStaffId,
              "noticeId": this.mainId,
              "hascollect": this.collect
            }),
            headers: headersApp,
            timeout: 5000
          }).then(function(res) {
            this.isLockCollect = false;
            if (res.data.code == 0) { //说明修改收藏状态成功
              Event.$emit('upDataCollect');
              this.hascollected = this.collect;
              switch (this.hascollected) {
                case 1:
                  this.collectMsg = '已收藏';
                  this.collectionHint = true;
                  setTimeout(() => {
                    this.collectionHint = false;
                  }, 1000);
                  break;
                case 0:
                  this.collectMsg = '已取消收藏';
                  this.collectionHint = true;
                  setTimeout(() => {
                    this.collectionHint = false;
                  }, 1000);
                  break;
              }
            } else {
              let oldMsg = this.collectMsg;
              if (this.collect == 0) {
                this.collectMsg = '该公告已撤回，无法进行取消收藏操作';
              } else if (this.collect == 1) {
                this.collectMsg = '该公告已撤回，无法收藏';
              }
              this.collectionHint = true;
              setTimeout(() => {
                this.collectionHint = false;
                this.collectMsg = oldMsg;
              }, 1000);
            }
          }, function(err) {
            this.isLockCollect = false;
          });
        });
      }
    },
    goTop() {
      Event.$emit('alertState', '1');
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollTop == 0) {
        setTimeout(() => {
          Event.$emit('alertState', '0');
        }, 2000);
      }
    }
  },
  watch: {
    hascollect() {
      this.hascollected = this.hascollect;
    }
  }
}
</script>
<style lang="scss" scoped="" type="text/css" >
@import '../../common/css/mixin';

#header {
  font-family: PingFangSC-Regular;
  height: 0.44rem;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  width: calc(100% - 0.16rem);
  padding: 0 0.16rem 0 0;
  background-color: #4590E4;
  .header-title {
    position: relative;
    .go-back {
      width: .37rem;
      height: .44rem;
      position: absolute;
      left: 0;
      display: inline-block;
      @include bg-image('../../../static/image/return');
      background-repeat: no-repeat;
      background-size: .09rem .16rem;
      background-position: center;
    }
    .header-right {
      line-height: 0.44rem;
      opacity: 0.87;
      font-size: 0.16rem;
      position: absolute;
      right: 0;
      top: 0;
      a {
        color: #FFFFFF;
        text-decoration: none;
        font-size: 0.16rem;
      }
      .collection-icon {
        width: 0.2rem;
        height: 0.2rem;
        @include bg-image('../assets/image/collection');
        background-size: cover;
        margin-top: 0.12rem;
      }
      .collectioned {
        @include bg-image('../assets/image/collectioned');
        background-size: cover;
      }
    }
    h6 {
      width: 100%;
      text-align: center;
      line-height: 0.44rem;
      font-size: 0.18rem;
      color: #FFFFFF;
    }
  }
}

.collection-hint {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  z-index: 666;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items:center;
  

  p{
    padding: 0.11rem 0.15rem;
    opacity: 0.9;
    background: rgba(0, 0, 0, 0.71);
    border: 1px solid rgba(151, 151, 151, 0.00);
    border-radius: 6px;
    font-family: PingFangSC-Regular;
    font-size: 0.14rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
  }
}
</style>
