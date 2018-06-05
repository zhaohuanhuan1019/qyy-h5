<template>
  <div class="left-delete">
    <div class="move"
         @touchstart="touchStart"
         @touchmove="touchMove"
         @touchend="touchEnd"
         :style="txtStyle">
      <slot></slot>
      <div class="deleteIcon" :style="zIndex"  @click.prevent="deleteItem(index)">
        <p>取消收藏</p>
      </div>
    </div>
  </div>
</template>
<script>
  import Event from 'common/js/bus.js';
  export default {
    props: ['index','item'],
    data() {
      return {
        startX: 0,
        moveX: 0,
        disX: 0,
        startY: 0,
        moveY: 0,
        disY: 0,
        txtStyle: '',
        delWidth: 72,
        top: '',
        zIndex: 'z-index:-1'
      }
    },
    mounted(){
      const _this = this;
      Event.$on('collected',function(data){
        switch (data){
          case 1:
            _this.txtStyle = "transform:translateX(0)";
            _this.$el.querySelector(".deleteIcon").style.transform = "translateX(+" + this.delWidth/100 + "rem)";
                break;
          case 0:
//            alert('更改收藏状态失败');
            _this.txtStyle = "transform:translateX(0)";
            _this.$el.querySelector(".deleteIcon").style.transform = "translateX(+" + this.delWidth/100 + "rem)";
                break;
        }

      });
    },
    methods: {
      touchStart: function(ev){
        ev = ev || event;
        if(ev.touches.length == 1){
          this.startX = ev.touches[0].clientX;
          this.startY = ev.touches[0].clientY;
        }
      },
      touchMove: function(ev) {
        ev = ev || event;
        if(ev.touches.length == 1) {
          this.moveX = ev.touches[0].clientX;
          this.disX = this.startX - this.moveX;
          this.moveY = ev.touches[0].clientY;
          this.disY = Math.abs(this.startY - this.moveY);
          if(this.disX < 0 || this.disX == 0) {
            this.txtStyle = "transform:translateX(0rem)";
          }else if (this.disX > 10 && this.disY < 10) {
            ev.preventDefault();
            this.txtStyle = "transform:translateX(-" + this.disX/100 + "rem)";
            if (this.disX >= this.delWidth/100) {
              this.txtStyle = "transform:translateX(-" + this.delWidth/100 + "rem)";
              this.zIndex = "z-index:" + 10 + "rem";
            }
          }
        }
      },
      touchEnd: function(ev) {
        ev = ev || event;
        if (ev.changedTouches.length == 1) {
          this.startX = 0;
          this.zIndex = "z-index:" + -8 + "rem";
          let endX = event.changedTouches[0].clientX;
          this.disX = this.startX - endX;
        }
      },
      deleteItem: function(index) {
       /* this.txtStyle = "transform:translateX(0)";
        this.$el.querySelector(".deleteIcon").style.transform = "translateX(+" + this.delWidth/100 + "rem)";*/
        this.$emit('deleteItem', {
          'index':index,
          'noticeStaffId':this.item.id,
          'id':this.item.noticeId
        });
      }
    }
  }
</script>
<style lang="scss" scoped="" type="text/css">
  .left-delete{
    width:100%;
    height:100%;
    position:relative;
    z-index:2;
  }
  .move{
    position: relative;
    height: 100%;
    width: 100%;
  }
  .deleteIcon{
    width: 0.72rem;
    height:calc(100% + 0.18rem);
    position: absolute;
    right:-0.88rem;
    top:-0.18rem;
    background-color:#FF6259;
    p{
      width: 100%;
      position: absolute;
      text-align: center;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #FFFFFF;
    }
  }
</style>
