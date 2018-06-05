<template>
    <div>
        <div class="search-box">
            <span class="icon-search" @click="search(authName)"></span>
            <input @focus="recovery" :placeholder="placeholder" type="text" class="box" v-model="authName" />
            <span v-show="authName" @click="clear" class="icon-clear"></span>
            <span v-show="cancelShow" @click="cancelSearch" class="icon-cancel">取消</span>
            <span v-show="searchShow" @click="search(authName)" class="icon-cancel">搜索</span>
        </div>
        <div class="history-title" v-show="historyList.length && !searching">
            <span class="text">搜索历史</span>
            <i class="delete" @click="emptyHistory"></i>
        </div>
        <div class="history-list" v-show="historyList.length && !searching">
            <ul>
                <li @click="selectHis(item)" v-for="item in historyList" class="item">{{ item }}</li>
            </ul>
        </div>
    </div>

</template>

<script type="text/ecmascript-6">
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default{
    	data () {
    		return {
                placeholder: ' 请输入申请人姓名',
                authName: '',
                searching: false
            };
        },
        computed: {
            historyList () {
            	return this.$store.state.searchHistory;
            },
            cancelShow () {
            	return (this.searching && !this.authName) || (!this.searching && !this.authName);
            },
            searchShow () {
            	return (!this.searching && this.authName) || (this.searching && this.authName);
            }
        },
        methods: {
            ...mapActions([
                'saveSearchHistory',
                'clearSearchHistory'
            ]),
            saveHistory (name) {
                this.saveSearchHistory(name);
            },
            emptyHistory () {
                this.clearSearchHistory();
            },
            cancelSearch () {
                this.authName = '';
//                console.log('=======cancel')
                this.$emit('hideSPage');
            },
            selectHis (name) {
                this.authName = name;
            },
            search (name) {
            	console.log(this.authName, 'authName')
            	if (name) {
            		this.searching = true;
                    this.saveHistory(name);
                    this.$emit('searchName', name);
                } else {
                    this.searching = false;
                    this.cancelSearch();
//                    return false;
                }
//                console.log(this.authName, 'authName2222222222222')
//                console.log(this.searching, 'searching----------')

            },
            clear () {
                this.authName = '';
                this.searching = false;
            },
            recovery () {
                this.searching = false;
            }
        }
    }
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import "../../../common/css/mixin";

    $height: .47rem;
    $size: .14rem;
    $color: #4590E4;
    $background: #e3e3e3;
    $top: .99rem + .87rem;

    .search-box {
        position: fixed;
        top: .99rem;
        left: 0;
        z-index: 100;
        /*display: flex;*/
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        padding: .085rem 0 .085rem .1rem;
        height: $height;
        background-color: $background;

        .icon-search {
            position: absolute;
            top: .165rem;
            left: .23rem;
            width: .14rem;
            height: .14rem;
            background-size: 100%;
            @include bg-image('../../../../static/image/search_dis');
        }

        .search_able {
            @include bg-image('../../../../static/image/search');
        }

        .box {
            width: 3.05rem;
            height: .3rem;
            box-sizing: border-box;
            padding-left: .37rem;
            padding-right: .35rem;
            outline: none;
            /*line-height: .3rem;*/
            background-color: #FFFFFF;
            border: 1px solid $background;
            border-radius: .05rem;
            color: #333333;
            font-size: $size;

            &::-webkit-input-placeholder {
                color: #999999;
                font-family: PingFangSC-Regular,Helvetica,Arial,sans-serif;
                font-size: .14rem;
            }
            &:-moz-placeholder,
            &::-moz-placeholder,
            &:-ms-input-placeholder {
                color: #999999;
                font-family: PingFangSC-Regular,Helvetica,Arial,sans-serif;
                font-size: .14rem;
            }
        }

        .icon-cancel {
            position: absolute;
            top: 0;
            right: 0;
            height: $height;
            width: .6rem;
            line-height: $height;
            font-size: $size;
            color: $color;
            text-align: center;
        }

        .icon-clear {
            position: absolute;
            top: .17rem;
            right: .73rem;
            width: .14rem;
            height: .14rem;
            @include bg-image('../../../../static/image/clear');
            background-size: 100%;
        }
    }

    .history-title {
        $hisHeight: .4rem;
        position: fixed;
        top: 1.46rem;
        left: 0;
        height: $hisHeight;
        width: 100%;
        z-index: 100;
        line-height: $hisHeight;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 .16rem;
        font-size: $size;
        color: #666666;
        background-color: $background;

        .delete {
            width: .24rem;
            @include bg-image('../../../../static/image/delete_his');
            background-size: 100%;
            background-position: 0 .085rem;
        }
    }

    .history-list {
        /*position: absolute;*/
        /*top: 0;*/
        /*left: 0;*/
        /*right: 0;*/
        /*bottom: 0;*/

        position: fixed;
        top: $top;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        background-color: #ffffff;

        padding: .05rem .16rem;
        font-size: $size;
        color: $color;

        .item {
            padding: .05rem 0;
            line-height: .2rem;
        }
    }
</style>
