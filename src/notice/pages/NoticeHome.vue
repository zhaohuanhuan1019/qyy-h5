<template>
    <div class="notice-home">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <no-Permission ></no-Permission>
    </div>
</template>
<script>
    export default{
        name:'notice-home'
    }
</script>