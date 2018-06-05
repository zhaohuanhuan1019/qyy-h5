<template>
    <li class="net-error">
        <div>
           <img src="../assets/image/noticeloading.gif" alt="netErr">
            <p>点击屏幕重新加载</p> 
        </div>
    </li>
</template>
<script>

</script>
<style lang="scss" scoped="" type="text/css">
    .net-error{
        border-bottom: none !important;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-bottom: none;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items:center;
        img{
            width: 0.2rem;
            height: 0.2rem;
            margin-bottom: 0.1rem;
        }
        p{
            font-family: PingFangSC-Regular;
            font-size: 0.14rem;
            text-align: center;
            color: #BABFC5;
            letter-spacing: 0;
        }
    }
</style>