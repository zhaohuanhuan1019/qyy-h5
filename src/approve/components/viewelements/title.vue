<template>
    <div class="title-wrapper" @click="showStuffInfoPage(approves.ownerId)">
        <h1>
           <span class="circle" :style="{background: randomColor(ownInfo.staffName)}">{{ ownInfo.staffName | takeLastTwo}}</span>
        </h1>
        <p class="form-name"
           :class="{'margin-right': ifStamp}"
           style="-webkit-box-orient:vertical"
            >{{ name }}{{ approves.formName }}
        </p>
        <span class="urgent-icon" :class="{more: approves.urgencyLevel === 1, very: approves.urgencyLevel === 2}"></span>
        <div class="img" :class="{
            stamp_2: Number(approves.status) === 2,
            stamp_3: Number(approves.status) === 3,
            stamp_4: Number(approves.status) === 4}">
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import jsBridge from 'common/js/jsbridge';

    export default {
        props: {
            approves: {
                type: Object
            },
            ownInfo: {
                type: Object
            }
        },
        filters: {
            takeLastTwo (name) {
                if (name) {
                    return name.substr(-2);
                } else {
                    return '';
                }
            },
            staffInfoMainShow (arr) {
                let staffArr = arr || {};
                for (let staff of staffArr) {
                    if (staff.partTime === 0) {
                        return staff.deptName + '-' + staff.dutyName;
                    }
                }
            }
        },
        methods:{
            showStuffInfoPage (staffId) {
                let toAppJson = {
                    code: 0,
                    msg: '',
                    data: {
                        staffId: staffId // 查看审批人信息
                    }
                };

                if (staffId) {
                    toAppJson.code = 0;
                } else {
                    toAppJson.code = 1;
                }

                jsBridge.getExtra(JSON.stringify(toAppJson)).then(function (value) {
                });
            },
           randomColor (name) {
                if (name) {
                    let colorArr = ['#b2dbf3', '#81dbee', '#a6e6c2', '#68c6aa', '#f8b186', '#f693bf', '#b5b4e3', '#c280d3'];
                    let index = Math.floor((Math.random() * colorArr.length));

                    return colorArr[index];
                } else {
                    return '#eeeeee';
                }
            }
        },
        computed: {
        	ifStamp () {
                return Number(this.approves.status) === 2 || Number(this.approves.status) === 3 || Number(this.approves.status) === 4;
            },
            name () {
                if (this.$route.name === 'approval-done' || this.$route.name === 'approval-wait') {
                    return this.approves.ownerName ? this.approves.ownerName + '的' : '';
                } else {
                    return this.approves.ownerName ? '我的' : '';
                }
            }
        }
    };
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss" scoped>
    @import "../../../common/css/mixin";

    .title-wrapper {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        min-height: .85rem;
        padding: .2rem 0 .1rem .55rem ;

        h1 {
            font-size: .16rem;
            color: #333333;
            margin-right:0.1rem;
            position: absolute;
            top: .2rem;
            left: 0;

            .circle {
                $height: 0.45rem;
                width: $height;
                height: $height;
                font-size: .14rem;
                color: #ffffff;
                display: inline-block;
                vertical-align: top;
                border-radius: 5px;
                line-height: $height;
                text-align: center;
            }


        }
        .form-name {
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            flex-direction:column;
            word-break: break-all;

            overflow: hidden;
            font-size: .2rem;
            color: #333333;
            line-height: .28rem;

            &.margin-right {
                margin-right: .68rem;
            }
        }

        .urgent-icon {
            width: .4rem;
            height: .16rem;
            display: inline-block;
            margin-top: .02rem;
            background-size: 100%;

            &.more {
                @include bg-image('../../../../static/image/moreurgent');
            }

            &.very {
                @include bg-image('../../../../static/image/veryurgent');
            }
        }

        .department {
            font-size: .16rem;
            color: #757678;
            line-height: .22rem;
            margin-top: .04rem;
        }
        & > .img {
            width: 0.6rem;
            height: 0.6rem;
            position:absolute;
            right: 0;
            top: 0;
            background-size: .6rem;
            background-repeat: no-repeat;
            background-position: right bottom;
            z-index: 10;
            &.stamp_2 {
                @include bg-image('../../../../static/image/Passed2');
            }

            &.stamp_3 {
                @include bg-image('../../../../static/image/no_approval');
            }

            &.stamp_4 {
                @include bg-image('../../../../static/image/revoked');
            }
        }

    }
</style>
