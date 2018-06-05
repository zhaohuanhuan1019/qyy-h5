<template>
  <div id="collection-notice">
    <my-header :baseTitle="baseTitle"></my-header>
    <section class="notice-container">
      <div class="alert" v-show="alertState"></div>
      <div class="refresh" style="display: none" ref="refreshHint">
        <img src="../assets/image/noticeloading.gif" alt="loading">
      </div>
      <ul class="notice-list" ref="moveContent">
        <li v-for="(val,index) in dataListNotice" v-if="dataListNotice.length != 0">
          <router-link :to="{path:'/notice/detailCollect',query:{id:val.noticeId}}">
            <left-slider :index="index" :item="val" v-if="isLeftDel" @deleteItem="deleteItem">
              <h6 v-text="val.content" style="-webkit-box-orient:vertical"></h6>
              <div class="notice-base-msg clearFix">
                <span class="fl timer">{{val.timer | time}}</span>
                <span class="fl attachment" v-if="val.hasAttachment == 1 && val.hasread !=1 "></span>
                <span class="fl attachment attachment_hasread" v-if="val.hasAttachment == 1 && val.hasread == 1"></span>
                <span class="fl author" :class="{'author-attach': val.hasAttachment == 1}">{{val.author}}</span>
              </div>
            </left-slider>
          </router-link>
        </li>
        <net-error v-if="netErrState"></net-error>
        <li v-show="noCollectMsgState" class="noNotice">
          <p v-html="noCollectMsg"></p>
        </li>
      </ul>
      <infinite-loading @infinite="onInfinite" ref="infiniteLoading" spinner="circles">
        <span slot="no-results">
        </span>
        <span slot="no-more">
          <!--暂无更多数据-->
        </span>
        <span slot="spinner">
          <span class="load-more-hint">
            <span class="hint-content">
              <img src="../assets/image/noticeloading.gif" alt="">
              <i>正在加载...</i>
            </span>
          </span>
        </span>
      </infinite-loading>
    </section>
    <no-Permission ></no-Permission>
  </div>
</template>
<script type="text/ecmascript-6">
import Event from 'common/js/bus.js';
import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
import {mapActions} from 'vuex';
import Header from '../components/NoticeHeader.vue'
import NetErrorPrompt from '../components/NetErrorPrompt.vue';
import LeftSlider from '../components/NoticeLeftSlider.vue'
import InfiniteLoading from 'vue-infinite-loading';
const getCollectApi = '/notice/queryNoticeStaffInfo';//获取公告列表api
const updataApi = '/notice/collectNotice';//修改公告收藏状态

const collect = {
  name: 'collection',
  data() {
    return {
      splice: '',
      startX: 0,
      moveX: 0,
      disX: 0,
      startY: 0,
      baseTitle: {
        title: '收藏列表',
        isCollection: true,
        isCollectionDetail: false//是否为收藏详情页
      },
      noCollectMsg: '暂无收藏',
      noCollectMsgState: false,
      pageNo: 1,
      pageSize: 20,
      isCollection: true,
      isLeftDel: true,//是否开启作移删除
      dataListNotice: [],
      isLockDown: false,
      isDirection: '',
      isLockInfinite: false,
      moveObj: '',
      alertState: false,
      netErrState: false
    }
  },
  created() {
    this.isOpenAppstore(4);
  },
  components: {
    'my-header': Header,
    'net-error': NetErrorPrompt,
    LeftSlider,
    InfiniteLoading
  },
  mounted() {
    var _this = this;
    Event.$on('upDataCollect', function() {/* 这里是：当修改收藏状态后刷新收藏列表数据 */
      console.log('更新收藏列表数据');
      if (_this.dataListNotice.length <= 20) {
        var pageSize = 20;
      } else {
        var pageSize = Math.ceil(_this.dataListNotice.length / 10) * 10;
      }

      jsBridge.getHeader().then((value) => {
        let headersApp = value;
        this.$http({
          method: 'GET',
          url: getCollectApi,
          params: {
            "pageNo": 1,
            "pageSize": pageSize,
            "hascollect": 1
          },
          headers: headersApp,
          timeout: 5000
        }).then((res) => {
          if (res.data.code == 0) {
            _this.dataListNotice = [];
            if (res.data.data.list.length != 0) {
              _this.dataListNotice = [];
              res.data.data.list.forEach(function(item) {
                _this.dataListNotice.push({
                  id: item.id,
                  content: item.notice.title,//标题
                  timer: item.notice.sendtime,//发送时间
                  author: item.notice.author,//作者
                  state: item.notice.state,//状态
                  noticeId: item.noticeId,
                  hasAttachment:item.notice.uploadsJson == '[]'||item.notice.uploadsJson == '' ? 0 : 1 //是否有附件 0-无 1-有
                });
              });
            }
          }
        }, (err) => {
        });
      })
    });
    Event.$on('alertState', (data) => {
      if (data == 1) {
        this.alertState = true;
      } else if (data == 0) {
        this.alertState = false;
      }
    });
    window.addEventListener('click', () => {
      if (this.netErrState) {
        this.onInfinite();
      }
    }, false);
  },
  methods: {
    ...mapActions(['isOpenAppstore']),
    deleteItem(json) {
      jsBridge.getHeader().then((value) => {
        let header = value;
        this.$http({
          method: 'PUT',
          url: updataApi,
          body: JSON.stringify({
            "id": json.noticeStaffId,
            "noticeId": json.id,
            "hascollect": 0
          }),
          headers: value,
          timeout: 5000
        }).then(function(res) {
          if (res.data.code == 0) { //说明修改收藏状态成功
            Event.$emit('collected', 1);
            this.dataListNotice.splice(json.index, 1);
            if (this.dataListNotice.length == 0) {//更改公告状态，判断数组长度是否为0
              this.noCollectMsgState = true;
            } else {
              this.noCollectMsgState = false;
            }
          } else {
            Event.$emit('collected', 0);
          }
        }, (err) => {
          Event.$emit('collected', 0);
        });
      })
    },
    touchStart(ev) {
      ev = ev || event;
      if (ev.touches.length == 1) {
        this.startX = ev.touches[0].clientX;
        this.startY = ev.touches[0].clientY;
      }
    },
    touchMove(ev) {
      ev = ev || event;
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      if (ev.touches.length == 1) {
        this.moveY = ev.touches[0].clientY;
        this.disY = this.moveY - this.startY;
        this.moveX = ev.touches[0].clientX;
        this.disX = Math.abs(this.startX - this.moveX);
        if (this.disY >= 10 && scrollTop == 0 && this.disX < 10) {
          ev.preventDefault();
          if (this.disY >= 10) {
            this.$el.querySelector('.notice-container').style.paddingBottom = '50px';
            this.$el.querySelector('.infinite-status-prompt').style.transition = "0.5s all ease";
            this.$el.querySelector('.infinite-status-prompt').style.transform = "translateY(0.2rem)";
            this.$refs.refreshHint.style.display = "block";
            if (this.moveObj) {
              this.moveObj.style.transition = "0.5s all ease";
              this.moveObj.style.transform = "translateY(0.2rem)";//下拉刷新的距离
            }
            this.isDirection = 'down';
            this.noCollectMsgState = false;
          }
        }
      }
    },
    touchEnd(ev) {
      ev = ev || event;
      if (event.changedTouches.length == 1) {
        if (this.moveObj) {
          this.moveObj.style.transition = "none";
          this.moveObj.style.transform = "translateY(0)";//下拉刷新的距离
        }
        this.$el.querySelector('.notice-container').style.paddingBottom = '0';
        this.$el.querySelector('.infinite-status-prompt').style.transition = "none";
        this.$el.querySelector('.infinite-status-prompt').style.transform = "translateY(0)";
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        //这里请求接口刷新数组列表
        if (!this.isLockDown && this.isDirection == 'down' && scrollTop == 0) {
          //this.netErrState = false;
          this.isDirection = '';
          this.isLockDown = true;
          const _this = this;
          console.log('数据数组长度:' + _this.dataListNotice.length)
          if (_this.dataListNotice.length <= 20) {
            var pageSize = 20;
          } else {
            var pageSize = (Math.ceil(_this.dataListNotice.length / 10) + 1) * 10;
          }
          console.log('收藏列表条数:' + pageSize)
          jsBridge.getHeader().then((value) => {
            let header = value;
            this.$http({
              method: 'GET',
              url: getCollectApi,
              params: {
                "pageNo": 1,
                "pageSize": pageSize,
                "hascollect": 1
              },
              headers: header,
              timeout: 5000
            }).then((res) => {
              _this.isLockDown = false;
              this.$refs.refreshHint.style.display = "none";
              if (res.data.data.totalCount == 0) {
                this.noCollectMsgState = true;
              }
              if (res.data.code == 0 && res.data.data.list.length != 0) {
                _this.dataListNotice = [];
                res.data.data.list.forEach(function(item) {
                  _this.dataListNotice.push({
                    id: item.id,
                    content: item.notice.title,//标题
                    timer: item.notice.sendtime,//发送时间
                    author: item.notice.author,//作者
                    state: item.notice.state,//状态
                    noticeId: item.noticeId,
                    hasread: item.hasread,
                    hasAttachment:item.notice.uploadsJson == '[]'||item.notice.uploadsJson == '' ? 0 : 1 //是否有附件 0-无 1-有
                  });
                });
              };
            }, (err) => {
              this.$refs.refreshHint.style.display = "none";
              _this.isLockDown = false;
              this.refreshState = 0;
              // this.netErrState = true;
            });
          });
        }
      }
    },
    onInfinite($state) {
      if (!this.isLockInfinite) {
        this.isLockInfinite = true;
        this.netErrState = false;
        const _this = this;
        jsBridge.getHeader().then((value) => {
          let header = value;
          this.$http({
            method: 'GET',
            url: getCollectApi,
            params: {
              "pageNo": _this.pageNo,
              "pageSize": _this.pageSize,
              "hascollect": 1
            },
            headers: header,
            timeout: 5000
          }).then((res) => {
            _this.isLockInfinite = false;
            if (res.data.code == 0) {
              if (res.data.data.totalCount == 0) {
                _this.noCollectMsgState = true;
              }
              if (res.data.data.list.length != 0) {
                if (_this.pageNo === res.data.data.pageCount) {
                  //_this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                  $state.complete();
                }
                res.data.data.list.forEach(function(item) {
                  _this.dataListNotice.push({
                    id: item.id,
                    content: item.notice.title,//标题
                    timer: item.notice.sendtime,//发送时间
                    author: item.notice.author,//作者
                    state: item.notice.state,//状态
                    noticeId: item.noticeId,
                    hasread: item.hasread,
                    hasAttachment:item.notice.uploadsJson == '[]'||item.notice.uploadsJson == '' ? 0 : 1 //是否有附件 0-无 1-有
                  });
                });
                if (res.data.data.list.length >= _this.pageSize) {
                  //_this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                  $state.loaded();
                  _this.pageNo++;
                }
              } else {
                //_this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                $state.complete();
              }
            } else {
              _this.isLockInfinite = false;
              _this.netErrState = true;
              //_this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
              $state.complete();
            }
          }, (err) => {
            _this.isLockInfinite = false;
            if (_this.dataListNotice.length <= 20) {
              _this.netErrState = true;
            }
            //_this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            $state.complete();
          });
        });
      }
    },
    saveScrollTop() {
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollTop !== 0) {
        localStorage.setItem("collPosY", scrollTop);
      };
    }
  },
  watch: {
    dataListNotice: function(newData, oldData) {
      if (newData.length == 0) {
        this.noCollectMsgState = true;
      } else {
        this.noCollectMsgState = false;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(collect => {
      window.addEventListener('touchstart', collect.touchStart, false);
      window.addEventListener('touchmove', collect.touchMove, false);
      window.addEventListener('touchend', collect.touchEnd, false);
      window.addEventListener('scroll', collect.saveScrollTop, false);
    });
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('touchstart', this.touchStart, false);
    window.removeEventListener('touchmove', this.touchMove, false);
    window.removeEventListener('touchend', this.touchEnd, false);
    window.removeEventListener('scroll', this.saveScrollTop, false);
    Event.$emit('collected', 0);
    next();
  },
  filters: {
    time: function(value) {
      let oDate = new Date(parseInt(value));
      return (oDate.getFullYear()) + '-' + (oDate.getMonth() + 1 > 9 ? oDate.getMonth() + 1 : '0' + (oDate.getMonth() + 1)) + '-' + (oDate.getDate() > 9 ? oDate.getDate() : '0' + oDate.getDate()) + ' ' + oDate.getHours() + ':' + (oDate.getMinutes() > 9 ? oDate.getMinutes() : '0' + oDate.getMinutes())
    }
  }
};
export default collect
</script>
<style lang="scss" scoped="" type="text/css">
@import '../../common/css/mixin';
html {
  -ms-touch-action: manipulation;
  touch-action: manipulation;
}

#collection-notice {
  .notice-container {
    position: relative;
    padding: 0.44rem 0.16rem 0;
    overflow: hidden;
    .refresh {
      width: 100%;
      height: 0.2rem;
      position: relative;
      padding: 0.16rem 0;
      img {
        width: 0.2rem;
        height: 0.2rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .alert {
      background-color: transparent;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .noNotice {
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      border-bottom: none;
      display: flex;
      justify-content: center;
      align-items:center;

      p{
        font-family: PingFangSC-Regular;
        font-size: 0.2rem;
        text-align: center;
        line-height: 0.28rem;
        color: #BABFC5;
        letter-spacing: 0;
        padding: 0;
      }
    }
    li {
      padding-top: 0.18rem;
      border-bottom: 1px solid #EBEBEB;
      h6 {
        font-size: 0.18rem;
        color: #c1c1c1;
        line-height: 0.25rem;
        height: 0.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        /*word-break: break-word;*/
        word-break: break-all;
      }
      .notice-base-msg {
        margin-top: 0.04rem;
        margin-bottom: 0.11rem;
        font-size: 0.14rem;
        color: #c1c1c1;
        .timer {
          height: 0.2rem;
          line-height: 0.16rem;
          // margin-right: 0.12rem;
          margin-top: 0.02rem;
        }
        .attachment{
          width: 0.14rem;
          height: 0.14rem;
          line-height: 0.2rem;
          margin-left: 0.12rem;
          margin-top: 0.03rem;
          @include bg-image('../assets/image/attachment');
          background-size: cover;
        }
        .attachment_hasread{
          @include bg-image('../assets/image/attachment_hasread');
        }
        .author {
          width: 2.08rem;
          height: 0.2rem;
          line-height: 0.2rem;
          margin-left: 0.12rem;
          font-style: normal;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .author-attach{
          width: 1.82rem;
        }
      }
    }
  }
  .notice-container::-webkit-scrollbar {
    width: 0;
  }
  .load-more-hint {
    width: 100%;
    height: 0.2rem;
    padding-top: 0.06rem;
    padding-bottom: 0.06rem;
    display: block;
    position: relative;
    display: flex;
    justify-content: center;
    align-items:center;

    .hint-content {
      img {
        width: 0.2rem;
        height: 0.2rem;
        float: left;
        margin-right: 0.06rem;
      }
      i {
        float: left;
        line-height: 0.2rem;
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        color: #7B838B;
        font-style: normal;
      }
    }
  }
}
</style>
