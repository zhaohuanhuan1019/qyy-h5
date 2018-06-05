<template>
  <div id="noticeDetail">
    <my-header @moveCarouselZero="moveCarouselZero" :isCarousel="isCarousel" :baseTitle="baseTitle" :isCollection="isCollection" :noticeStaffId="detailNotice.noticeStaffId" :mainId="detailNotice.id" :hascollect="detailNotice.hascollect" :state="detailNotice.state"></my-header>
    <section class="noticeDetail">
      <div v-show="detailNotice.id != '' && detailNotice.state == 1">
        <div class="detail-title" v-html="detailNotice.title"></div>
        <div class="detail-base clearFix">
          <span class="timer date">{{detailNotice.sendtime | time}}</span>
          <span class="attachment" v-if="detailNotice.hasAttachment == 1"></span>
          <span class="author" v-html="detailNotice.author"></span>
        </div>
        <div class="detail-content" id="noticeContent" ref="noticeContent"></div>
      <!--附件展示区域-->
        <div v-if="detailNotice.hasAttachment == 1" class="detail-attach">
          <ul class="attach-list">
            <li class="attach-style" v-for="attach in detailNotice.attachments" @click="previewAttachment(attach)">
              <div class="attach-icon" :class="fileTypeIcon(attach.fileType)" :style="fileImageIcon(attach.fileType,attach.src)"></div>
              <div class="attach-other">
                <span class="attach-title">{{attach.fileName}}</span>
                <span class="attach-type">{{attach.fileType}}-{{attach.fileSize}}</span>
              </div>
            </li>
          </ul>
        </div>
        <!--附件个数统计-->
        <div class="attach-num" v-if="detailNotice.hasAttachment == 1 && detailNotice.attachments.length>1"><span class="attach-sum">{{detailNotice.attachments.length}}个附件&nbsp;({{detailNotice.attachSumSize}})</span>
        </div>
      </div>
      <div class="err-msg" v-if="detailNotice.state !== 1 || noPermission !== -1">
        <p v-text="errMsg"></p>
      </div>
      <ul v-if="netErrState">
        <net-error></net-error>
      </ul>
    </section>
    <!--附件预览的错误提示-->
    <div class="preview-hint" ref="collectionHint" v-show="previewHint">
      <p v-text="previewMsg"></p>
    </div>
    <collect-err v-if="collectNetErr"></collect-err>
    <!-- 保存到手机弹层 -->
    <save-img v-show="saveImg" @cancelSave="cancelSave" :downLoadSrc="downLoadSrc"></save-img>
    <no-Permission ></no-Permission>
  </div>
</template>
<script>
import Header from '../components/NoticeHeader.vue';
import NetErrorPrompt from '../components/NetErrorPrompt.vue';
import saveImg from '../components/saveImage/SaveImg'
import Event from 'common/js/bus.js';
import 'common/js/previewImage.js'
import 'common/js/ueditor.parse.min.js';
import jsBridge from 'common/js/jsbridge'; // 引入jsBridge
import {mapActions} from 'vuex';
const deatiApi = '/notice/queryUserNoticeById/';//获取公告详情

export default {
  name: 'noticeDetail',
  data() {
    return {
      winw: 0,
      errMsg: '',
      noPermission: -1,
      isCollection: true,
      netErrState: false,
      detailNotice: {},
      collectNetErr: false,//请求收藏网络失败状态
      baseTitle: {
        title: '公告详情',
        isCollection: true,
        isCollectionDetail: true
      },
      saveImg: false,
      downLoadSrc: '',
      carouselObj: null,
      carouselImg: null,
      //add previewimage
      carouselData: { urls: [], currentIndex: -1, hasOrigin:false },
      //add previewimage 附件区域的图片轮播
      attachCarouselData:{urls: [], currentIndex: -1,hasOrigin:true},
      //图片轮播状态
      isCarousel: false,
      //预览错误提示相关
      previewHint:false,
      previewMsg:''
    }
  },
  created() {
    this.isOpenAppstore(4);
    this.getData();
  },
  mounted() {
    this.winw = window.innerWidth || document.body.clientWidth;  //窗口的宽度
    this.carouselObj = document.querySelector('#__previewImage-container')
    window.addEventListener('click', () => {
      if (this.netErrState) {
        this.getData();
      }
    });
  },
  components: {
    'my-header': Header,
    'net-error': NetErrorPrompt,
    'save-img': saveImg
  },
  methods: {
    ...mapActions(['isOpenAppstore']),
    getData() {
      const _this = this;
      const id = this.$route.query.id;
      jsBridge.getHeader().then((value) => {
        this.netErrState = false;
        let header = value;
        this.$http({
          method: 'GET',
          url: deatiApi + id,
          headers: value,
          timeout: 5000
        }).then((res) => {
          if (res.data.code == 0) {
            let contentText = res.data.data.text.replace(/\\"/g, '"');
            this.$el.querySelector('.detail-content').innerHTML = contentText;
            uParse('#noticeContent', {
              rootPath: '../'
            });
            const aLink = this.$el.querySelectorAll('.detail-content a')
            if (aLink.length) {
              for (let i = 0; i < aLink.length; i++) {
                let oHref = aLink[i].getAttribute('href');
                aLink[i].setAttribute('href', 'javascript:;')
                aLink[i].addEventListener('click', function() {
                  jsBridge.setUrl({
                    "code": 0,
                    "msg": "",
                    "data": {
                      "webUrl": oHref
                    }
                  })
                }, false);
              }
            }
            const aTable = this.$el.querySelectorAll('.detail-content table')
            for (let i = 0; i < aTable.length; i++) {
              aTable[i].style.width = this.winw -32  + 'px';
            }
            this.carouselImg = this.$el.querySelectorAll('.detail-content img')
            const aImgLength = this.carouselImg.length
            if (aImgLength) {
              for (let i = 0; i < aImgLength; i++) {
                //this.carouselImg[i].style.maxWidth = this.winw  - 32 + 'px'
                if(/^\/notice\/downLoadFile.*/.test(this.carouselImg[i].getAttribute('src'))){
                  this.carouselImg[i].setAttribute("src",this.carouselImg[i].getAttribute('src')+"&noticeId="+res.data.data.id+"&access_token="+value.access_token);
                }
                 _this.carouselData.urls.push({
                  'url':this.carouselImg[i].getAttribute('src'),
                  'originUrl':this.carouselImg[i].getAttribute('src'),
                  'fileSize':0,
                  'isOrigin':true
                });
                this.carouselImg[i].addEventListener('click', function(e) {
                  _this.isCarousel = true
                  _this.carouselData.current = this.getAttribute('src')
                  _this.imgCarousel()
                }, false)
              }
            }
           const aDetailChild = this.$el.querySelector('#noticeContent').children;
           //console.log(aDetailChild)
            for (let i = 0; i < aDetailChild.length; i++) {
              aDetailChild[i].style.maxWidth = this.winw -32 + 'px';
            }
            this.detailNotice = {
              "id": res.data.data.id,
              "title": res.data.data.title,
              "sendtime": res.data.data.sendtime,
              "text": contentText,
              "author": res.data.data.author,
              "state": res.data.data.state,
              "noticeStaffId": res.data.data.noticeStaffId,//修改收藏状态的id
              "hascollect": res.data.data.hascollect,
              "hasAttachment":res.data.data.uploadsJson == "[]" || res.data.data.uploadsJson == "" ? 0 : 1
            };
            //如果有附件，处理附件
            if(res.data.data.uploadsJson!="[]" && res.data.data.uploadsJson!=""){
              let attachments=JSON.parse(res.data.data.uploadsJson);
              let sumSize=0;
              let imgIndex=-1;
              this.detailNotice.attachments=[];
              for(let i in attachments){
                let attach={};
                let dotLastIndex=attachments[i].fileName.lastIndexOf(".")
                attach.fileName=attachments[i].fileName.substring(0,dotLastIndex);
                attach.fileType=attachments[i].fileName.substring(dotLastIndex+1).toUpperCase();
                attach.fileSrc=attachments[i].fileSrc;
                attach.fileSize=this.computeFileSize(Number(attachments[i].fileSize));
                attach.src="";
                sumSize+=Number(attachments[i].fileSize);
                if(attach.fileType == "PNG" || attach.fileType == "JPG" || attach.fileType == "JPEG" || attach.fileType == "GIF"){
                  imgIndex++;
                  attach.src="/notice/downLoadFile?fileKey="+attachments[i].fileKey+"&noticeId="+res.data.data.id+"&companyId="+res.data.data.companyId+"&access_token="+value.access_token+"&zoomOut=-240!90";
                  this.attachCarouselData.urls.push({
                    'url':attach.src,
                    'originUrl':"/notice/downLoadFile?fileKey="+attachments[i].fileKey+"&noticeId="+res.data.data.id+"&companyId="+res.data.data.companyId+"&access_token="+value.access_token,
                    'fileSize':attach.fileSize,
                    'isOrigin':false
                  });
                }
                attach.imgIndex=imgIndex;
                this.detailNotice.attachments.push(attach);
              }
              this.detailNotice.attachSumSize=this.computeFileSize(sumSize);
            }
            switch (res.data.data.state) {
              case 0:
                this.errMsg = '该公告已撤回';
                break;
              case 3:
                this.errMsg = '该公告已撤回';
                break;
              case 4:
                this.errMsg = '该公告已撤回';
                break;
              case 5:
                this.errMsg = '由于你已变更部门该公告无法查看';
                break;
            };
          } else {
            this.noPermission = res.data.code;
            this.errMsg = res.data.msg;
          }
        }, (err) => {
          this.netErrState = true;
          this.collectNetErr = true;
          setTimeout(() => {
            this.collectNetErr = false;
          }, 1000);
        })
      })
    },
    //图片相关
    moveCarouselZero() {
      this.isCarousel = false
      this.carouselObj.style.transform = 'translate3d(' + this.winw + 'px, 0px,0px)'
      if (this.carouselImg.length) {
        for (let i = 0; i < this.carouselImg.length; i++) {
          this.carouselImg[i].style.transform = 'scale3d(1,1,1)'
        }
      }
    },
    saveImgToast(src) {
      this.downLoadSrc = src
      //this.saveImg = true
    },
    showImgView() {
      this.show = true
    },
    cancelSave() {
      this.saveImg = false
    },
    imgCarousel() {
      previewImage.start(this.carouselData, this);
    },
    attachImgCarousel(){
      previewImage.start(this.attachCarouselData, this)
    },
    /*计算文件大小*/
    computeFileSize(size){
      if(size < 1024){
        size=size.toFixed(2)+"B";
      }else if(size<1024*1024){
        size=(size/1024).toFixed(2) +"KB";
      }else if(size<1024*1024*1024){
        size=(size/(1024*1024)).toFixed(2) +"MB";
      }else{
        size=(size/(1024*1024*1024)).toFixed(2) +"GB";
      }
      return size;
    },
    /*根据文件类型判断显示哪种图标*/
    fileTypeIcon(type){
      let typeIcon=""
      switch (type){
        case "PDF":
          typeIcon="attach-icon-pdf";
          break;
        case "XLS":
        case "XLSX":
          typeIcon="attach-icon-xisx";
          break;
        case "PPT":
        case "PPTX":
          typeIcon="attach-icon-ppt";
          break;
        case "DOC":
        case "DOCX":
          typeIcon="attach-icon-doc";
          break;
         case "ZIP":
          typeIcon="attach-icon-zip";
          break;
         case "RAR":
          typeIcon="attach-icon-rar";
          break;
          default:
            typeIcon="attach-icon-other";
            break;
      }
      return typeIcon;
    },

    /**/
    fileImageIcon(type,src){
      if(type == "JPG" || type == "JPEG" || type == "GIF" || type == "PNG"){
        return "background-image:url("+src+")";
      }
    },

    /*附件的预览*/
    previewAttachment(attachment){
      if(attachment.fileType == "PNG" || attachment.fileType == "JPG" || attachment.fileType == "JPEG" || attachment.fileType == "GIF"){
        this.isCarousel = true;
        this.attachCarouselData.currentIndex=attachment.imgIndex;
        this.attachImgCarousel()
      }else{
        this.previewHint=true;
        this.previewMsg="暂不支持预览";
        setTimeout(() => {
          this.previewHint = false;
        }, 1000);
      }
    }
  },
  filters: {
    time: function(value) {
      let oDate = new Date(parseInt(value))
      return (oDate.getFullYear()) + '-' + (oDate.getMonth() + 1 > 9 ? oDate.getMonth() + 1 : '0' + (oDate.getMonth() + 1)) + '-' + (oDate.getDate() > 9 ? oDate.getDate() : '0' + oDate.getDate()) + ' ' + oDate.getHours() + ':' + (oDate.getMinutes() > 9 ? oDate.getMinutes() : '0' + oDate.getMinutes())
    }
  }
}
</script>
<style lang="scss" scoped type="text/css">
@import '../../common/css/mixin';
.noticeDetail {
  padding: 0.62rem 0.16rem 0.5rem 0.16rem;
  overflow: hidden;
  .detail-title {
    width: 100%;
    font-family: PingFang-SC-Medium;
    font-size: 0.22rem;
    line-height: 0.3rem;
    color: #2E2E2E;
    word-break: break-all;
    word-wrap: break-word;
  }
  .detail-base {
    margin-top: 0.1rem;
    font-family: PingFangSC-Regular;
    font-size: 0.12rem;
    color: #969FA9;
    .timer {
      line-height: 0.16rem;
      font-size: 0.14rem;
      // margin-top: 0.04rem;
      // float: left;
      vertical-align: middle;
      display: inline-block;
    }
    .date {
      /*margin-right: 0.16rem;*/
    }
    .attachment{
      width: 0.14rem;
      height: 0.14rem;
      margin-left: 0.07rem;
      // margin-top: 0.03rem;
      @include bg-image('../assets/image/attachment');
      background-size: cover;
      display: inline-block;
      vertical-align: text-top;
      // float: left;
    }
    .author {
      line-height: 0.2rem;
      margin-left: 0.07rem;
      // height: 0.2rem;
      font-style: normal;
      vertical-align: middle;
      word-wrap:break-word;
      word-break: break-all;
      // float: left;
    }
  }
  .detail-content {
    color: #55585B;
    font-size: 0.16rem;
    margin-top: 0.18rem;
    padding-bottom: 0.26rem;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 0.15rem;
    /* line-height: 0.23rem; */
    color: #55585B;
    p,
    div {
      font-size: 0.15rem;
      /* line-height: 0.23rem; */
      color: #55585B;
    }
    ul {
      padding: 0 0 0 0.4rem
    }
    ol {
      padding: 0 0 0 0.4rem
    }
  }
  .err-msg {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1.6rem;
    P {
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 0.2rem;
      color: #BABFC5;
      letter-spacing: 0;
      line-height: 0.28rem;
    }
  }
  
}
</style>
<style lang="scss"  type="text/css">
/*图片预览的错误提示*/
  .preview-hint {
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
