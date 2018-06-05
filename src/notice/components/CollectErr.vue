<template>
    <div class="collect-err">
        <p>网络不给力</p>
    </div>
</template>
<style lang="scss" scoped="" type="text/css">
    .collect-err{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items:center;

        p{
            padding: 0.11rem 0.16rem;
            opacity: 0.9;
            background: rgba(0,0,0,0.71);
            border: 1px solid rgba(151,151,151,0.00);
            border-radius: 6px;
            font-family: PingFangSC-Regular;
            font-size: 0.14rem;
            color: #FFFFFF;
            letter-spacing: 0;
        }
    }
</style>