<template>
  <div id="all-notice">
    <my-header :baseTitle="baseTitle"></my-header>
    <section class="notice-container allNotice">
      <div class="alert" v-show="alertState"></div>
      <div class="refresh" ref="refreshHint" v-if="refreshState == 1">
        <img src="../assets/image/noticeloading.gif" alt="loading">
      </div>
      <!-- @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"-->
      <ul class="notice-list" ref="moveContent">
        <li v-for="(val,index) in NoticeList" v-if="NoticeList.length != 0">
          <router-link :class="{'hasread': val.hasread == 1}" :to="{path:'/notice/detailAll',query:{id:val.id,index:index}}">
            <h6 v-text="val.content"  class="title" style="-webkit-box-orient:vertical"></h6>
            <div class="notice-base-msg clearFix">
              <span class="fl timer">{{val.timer | time}}</span>
              <span class="fl attachment" v-if="val.hasAttachment == 1 && val.hasread !=1 "></span>
              <span class="fl attachment attachment_hasread" v-if="val.hasAttachment == 1 && val.hasread == 1"></span>
              <span class="fl author" :class="{'author-attach': val.hasAttachment == 1}" v-html="val.author"></span>
            </div>
          </router-link>
        </li>
        <li v-if="noListMsgState" class="noNotice" v-text="noListMsg"></li>
        <net-error v-if="netErrState"></net-error>
      </ul>
      <infinite-loading @infinite="onInfinite" ref="infiniteLoading" spinner="circles">
        <span slot="no-results">
          <!--暂无更多数据-->
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
import Header from '../components/NoticeHeader.vue';
import NetErrorPrompt from '../components/NetErrorPrompt.vue';
import InfiniteLoading from 'vue-infinite-loading';
import Event from 'common/js/bus.js';
import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
import {mapActions} from 'vuex';
const getAllApi = '/notice/queryNoticeStaffInfo';//获取公告列表api

const allnotice = {
  name: 'allNotice',
  data() {
    return {
      baseTitle: {
        title: '公告',
        isCollection: false,
        isCollectionDetail: false
      },
      noListMsg: '暂无公告',
      noListMsgState: false,
      isCollection: false,
      isLeftDel: false,
      NoticeList: [],//后台请求公告列表的数组
      pageNo: 1,//当前页码
      pageSize: 20,//每次请求的数据内容条数
      isLockDown: false,
      isLockInfinite: false,
      headersApp: null,
      refreshState: 0,
      moveObj: '',
      alertState: false,
      netErrState: false
    }
  },
  created() {
    this.isOpenAppstore(4);
  },
  mounted() {
    Event.$on('changeHasReadAll', (index) => {
      this.NoticeList[index].hasread = 1;
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
  components: {
    'my-header': Header,
    'net-error': NetErrorPrompt,
    InfiniteLoading
  },
  methods: {
    ...mapActions(['isOpenAppstore']),
    touchStart(ev) {
      ev = ev || event;
      if (ev.touches.length == 1) {
        this.startY = ev.touches[0].clientY;
      }
    },
    touchMove(ev) {
      ev = ev || event;
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      if (ev.touches.length == 1) {
        this.moveY = ev.touches[0].clientY;
        this.disY = this.moveY - this.startY;
        if (this.disY >= 10 && scrollTop == 0) {
          ev.preventDefault();
          if (this.disY >= 10) {
            this.noListMsgState = false;
            this.$el.querySelector('.notice-container').style.paddingBottom = '50px';
            this.refreshState = 1;
            this.$el.querySelector('.infinite-status-prompt').style.transition = "0.5s all ease";
            this.$el.querySelector('.infinite-status-prompt').style.transform = "translateY(0.2rem)";
            this.isDirection = 'down';
            if (this.moveObj) {
              this.moveObj.style.transition = "0.5s all ease";
              this.moveObj.style.transform = "translateY(0.2rem)";//下拉刷新的距离
            }
          }
        }
      }
    },
    touchEnd(ev) {
      ev = ev || event;
      if (ev.changedTouches.length == 1) {
        if (this.moveObj) {
          this.moveObj.style.transition = "none";
          this.moveObj.style.transform = "translateY(0)";//下拉刷新的距离
        }
        this.$el.querySelector('.notice-container').style.paddingBottom = '0';
        this.$el.querySelector('.infinite-status-prompt').style.transition = "none";
        this.$el.querySelector('.infinite-status-prompt').style.transform = "translateY(0)";
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (!this.isLockDown && this.isDirection == 'down' && scrollTop == 0) {
          this.isLockInfinite = false;
          //this.netErrState = false;
          this.isDirection = '';
          this.isLockDown = true;
          const _this = this;
          //var pageSize = _this.NoticeList.length<20 ? 20 : _this.NoticeList.length;
          if (_this.NoticeList.length == 0 || _this.NoticeList.length <= 20) {
            var pageSize = 20;
          } else {
            var pageSize = Math.ceil(_this.NoticeList.length / 10) * 10;
          }
          jsBridge.getHeader().then((value) => {
            let header = value;
            this.$http({
              method: 'GET',
              url: getAllApi,
              params: {
                pageNo: 1,
                pageSize: pageSize
              },
              headers: header,
              timeout: 5000
            }).then((res) => {
              if (res.data.data.totalCount == 0) {
                this.noListMsgState = true;
              }
              if (res.data.code == 0) {
                this.refreshState = 0;
                _this.isLockDown = false;
                if (res.data.data.list.length != 0) {
                  _this.NoticeList = [];
                  res.data.data.list.forEach(function(item) {
                    _this.NoticeList.push({
                      id: item.notice.id,
                      content: item.notice.title,//标题
                      timer: item.notice.sendtime,//发送时间
                      author: item.notice.author,//作者
                      state: item.notice.state,//状态
                      hasread: item.hasread,
                      hasAttachment:item.notice.uploadsJson == '[]'|| item.notice.uploadsJson == ''? 0 : 1 //是否有附件 0-无 1-有
                    });
                  });
                };
              } else {
                this.refreshState = 0;
              }
            }, (err) => {
              this.$refs.refreshHint.style.display = "none";
              _this.isLockDown = false;
              this.refreshState = 0;
              /*this.netErrState = true;*/
            });
          });
        }
      }
    },
    onInfinite:function($state) {
      if (!this.isLockInfinite) {
        this.isLockInfinite = true;
        this.netErrState = false;
        const _this = this;
        jsBridge.getHeader().then((value) => {
          let header = value;
          this.$http({
            method: 'GET',
            url: getAllApi,
            params: {
              pageNo: _this.pageNo,
              pageSize: _this.pageSize
            },
            headers: header,
            timeout: 5000
          }).then((res) => {
            _this.isLockInfinite = false;
            if (res.data.code == 0) {//说明没有错误信息
              if (res.data.data.totalCount == 0) {
                _this.noListMsgState = true;//说明没有公告
              }
              if (res.data.data.list.length != 0) {
                if (_this.pageNo === res.data.data.pageCount) {
                  //_this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                  $state.complete();
                }
                res.data.data.list.forEach(function(item) {
                  _this.NoticeList.push({
                    id: item.notice.id,
                    content: item.notice.title,//标题
                    timer: item.notice.sendtime,//发送时间
                    author: item.notice.author,//作者
                    state: item.notice.state,//状态
                    hasread: item.hasread,
                    hasAttachment:item.notice.uploadsJson == '[]'||item.notice.uploadsJson == '' ? 0 : 1 //是否有附件 0-无 1-有
                  });
                });
                if (res.data.data.list.length >= 20) {
                  //_this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                  $state.loaded();
                  _this.pageNo++;
                };
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
            if (_this.NoticeList.length <= 20) {
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
        localStorage.setItem("allPosY", scrollTop);
      };
    }
  },
  beforeRouteEnter(to, from, next) {
    next(allnotice => {
      window.addEventListener('touchstart', allnotice.touchStart, false);
      window.addEventListener('touchmove', allnotice.touchMove, false);
      window.addEventListener('touchend', allnotice.touchEnd, false);
      window.addEventListener('scroll', allnotice.saveScrollTop, false);
    });
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('touchstart', this.touchStart, false);
    window.removeEventListener('touchmove', this.touchMove, false);
    window.removeEventListener('touchend', this.touchEnd, false);
    window.removeEventListener('scroll', this.saveScrollTop, false);
    next();
  },
  filters: {
    time: function(value) {
      let oDate = new Date(parseInt(value));
      return (oDate.getFullYear()) + '-' + (oDate.getMonth() + 1 > 9 ? oDate.getMonth() + 1 : '0' + (oDate.getMonth() + 1)) + '-' + (oDate.getDate() > 9 ? oDate.getDate() : '0' + oDate.getDate()) + ' ' + oDate.getHours() + ':' + (oDate.getMinutes() > 9 ? oDate.getMinutes() : '0' + oDate.getMinutes())
    }
  }
};
export default allnotice
</script>
<style lang="scss" scoped="" type="text/css">
@import '../../common/css/mixin';
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
    top: 0.1rem;
    left: 0;
    z-index: 1;
  }
  .noNotice {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: PingFangSC-Regular;
    font-size: 0.2rem;
    text-align: center;
    line-height: 0.28rem;
    color: #BABFC5;
    letter-spacing: 0;
    padding: 0;
    border-bottom: none;
  }
  li {
    padding-top: 0.18rem;
    border-bottom: 1px solid #EBEBEB;
    .hasread .notice-base-msg,
    .hasread .title{
      color: #c1c1c1;
    }
    .title {
      font-family: PingFangSC-Regular;
      font-size: 0.18rem;
      color: #2E2E2E;
      width: 100%;
      height: 0.5rem;
      line-height: 0.25rem;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      flex-direction: column;
      /*word-break: break-word;*/
      word-break: break-all;
      overflow: hidden;
    }
    .notice-base-msg {
      margin-top: 0.04rem;
      margin-bottom: 0.11rem;
      font-size: 0.14rem;
      color: #969FA9;
      .timer {
        height: 0.2rem;
        line-height: 0.2rem;
        // margin-right: 0.12rem;
        // margin-top: 0.02rem;
        font-size: 0.14rem;
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
        margin-left:0.12rem; 
        // margin-top: 0.02rem;
        font-size: 0.14rem;
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
</style>

