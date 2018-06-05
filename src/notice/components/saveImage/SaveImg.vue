<template>
    <div class="save-img">
        <div class="sure-save" @touchstart="save">保存到手机</div>
        <div class="cancel-save" @touchstart="cancel">取消</div>
    </div>
</template>
<script>
export default {
  name: 'saveImg',
  props: {
      downLoadSrc:{
          type: String,
          default: ''
      }
  },
  methods: {
      save(e) {
          //调用jsbridege
          e.preventDefault();
          alert('调用jsbridege=>保存到手机:'+ this.downLoadSrc)
          this.$emit('cancelSave')
      },
      cancel(e) {
          //alert('取消')
          e.preventDefault();
          this.$emit('cancelSave')
      }
  }
}
</script>

<style lang="scss" scoped="" type="text/css">
.save-img {
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    z-index: 34567;
    left: 0;
    bottom: 0;
    padding: 0 0.1rem 0.1rem;
    font-family: PingFangSC-Regular;
    font-size: 0.2rem;
    letter-spacing: 0.38px;
    text-align: center;

    .sure-save {
        width: 100%;
        margin-bottom: 0.1rem;
        color: #333333;
        background: rgba(252, 252, 252, 0.90);
        border-radius: 6px;
        padding: 0.13rem 0;
    }

    .cancel-save {
        width: 100%;
        background: #fff;
        color: #0076FF;
        border-radius: 6px;
        padding: 0.15rem 0 0.14rem;
    }
}
</style>
