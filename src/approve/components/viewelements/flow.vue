<template>
    <div class="flow-wrapper">
        <h1 class="title">审批流程</h1>
        <div class="flow-item">
            <div class="job-wrapper" @click="showStuffInfoPage(approves.ownerId)">
                <h1>
                    <span class="circle" :style="{backgroundColor: randomColor(ownInfo.staffName)}">{{ ownInfo.staffName | takeLastTwo}}</span>
                </h1>
            </div>
            <div class="detail-wrapper">
                <div class="detail-header">
                    <span class="staff-name">{{ ownInfo.staffName }}</span>
                    <span class="status">发起申请</span>
                </div>
                <span class="department">{{ownInfo.staffInfoToUser | staffInfoMainShow}}</span>
            </div>
            <p class="time">{{ approves.ctime | formatDate }}</p>
        </div>
        <!-- notes有值时 start-->
        <!--我发起的-->
        <div class="flow-item" v-for="(note, index) in featureNotes">
            <div v-if="note.resultCode === 3" class="job-wrapper" @click="showStuffInfoPage(approves.ownerId)">
                <h1 >
                    <span class="circle" :style="{backgroundColor: note.backgroundColor}">{{ ownInfo.staffName | takeLastTwo}}</span>
                </h1>
            </div>
            <div v-else class="job-wrapper" @click="showStuffInfoPage(getInfoValue(note))">
                <h1 >
                    <span class="circle" :style="{backgroundColor: note.backgroundColor}">{{ note.staffName | takeLastTwo}}</span>
                </h1>
            </div>
            <!-- notes有撤销时 -->
            <div v-if="note.resultCode === 3" class="detail-wrapper" >
                <div class="detail-header">
                    <span class="staff-name">{{ ownInfo.staffName }}</span>
                    <span class="status" :class="note.resultCode | getClass">{{ note.resultStatusText }}</span>
                </div>
                <span class="department">{{ownInfo.staffInfoToUser | staffInfoMainShow}}</span>
            </div>
            <!-- notes没有撤销时 -->
            <div v-else class="detail-wrapper" >
                <div class="detail-header">
                    <span class="staff-name">{{ note.staffName }}</span>
                    <span class="status" :class="note.resultCode | getClass">{{ note.resultStatusText }}</span>
                </div>
                <div class="detail">
                    <div class="inline-wrap">
                        <div class="block-wrap"  v-for="deptNameDutyName in note.staffInfoToUser">
                            <div class="inline-wrap">
                                <div class="block-wrap">
                                    <span class="department">
                                    {{ deptNameDutyName | staffInfoShow }}
                                                <!--兼职 icon-->
                                        <span v-if="deptNameDutyName.partTime" class="partTime_1"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p class="time">{{ note.utime | formatDate }}</p>
            <div class="reason-wrapper">
                <p class="reason">{{ note.note | formatToObj }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import format from 'common/js/dateformat';
    import jsBridge from 'common/js/jsbridge';

    export default {
        props: {
            notes: {
                type: Array
            },
            ownInfo: {
                type: Object
            },
            approves: {
                type: Object
            },
            routeName: {
                type: String
            }
        },
        data () {
            return {
                notesArr: []
            };
        },
        computed: {
        	featureNotes () {
        		let noteArr = [];
        		let approving = false;
                if (this.notes.length > 0) {
                	if (this.$route.name === 'apply-launch') {
                		for (let i = 0; i < this.notes.length; i++) {
                			let note = this.notes[i];
                			if (note.id) {
                                note.resultStatusText = this.resultStatus(note.resultCode);
                                note.backgroundColor = this.randomColor(note.staffName);
                            } else {
                				// 首个id为空  是审批中状态
                                if (!approving) {
                                    note.backgroundColor = this.randomColor(note.staffName);
                                    note.resultStatusText = '审批中';
                                    approving = true;
                                    note.resultCode = '#';
                                } else {
                                    note.backgroundColor = this.randomColor();
                                }
                            }
                        }
                        noteArr = this.notes;
                    }
                    if (this.$route.name === 'approval-wait' || this.$route.name === 'approval-done' || this.$route.name === 'apply-filed') {
                        for (let i = 0; i < this.notes.length; i++) {
                            let note = this.notes[i];
                            note.backgroundColor = this.randomColor(note.staffName);
                            if (note.id) {
                                note.resultStatusText = this.resultStatus(note.resultCode);
                                noteArr.push(note);
                            } else {
                                note.resultStatusText = '审批中';
                                note.resultCode = '#';
                                noteArr.push(note);
                                break;
                            }
                        }
                    }
                }

                return noteArr;
            }
        },
        methods: {
            resultStatus (code) {
                switch (code) {
                    case 0:
                        return '同意';
                    case 1:
                        return '已拒绝';
                    case 2:
                        return '已拒绝';
                    case 3:
                        return '已撤销';
                    case 8:
                        return '已转交';
                    default:
                        return '';
                }
            },
            randomColor (name) {
                if (name) {
                    let colorArr = ['#b2dbf3', '#81dbee', '#a6e6c2', '#68c6aa', '#f8b186', '#f693bf', '#b5b4e3', '#c280d3'];
                    let index = Math.floor((Math.random() * colorArr.length));

                    return colorArr[index];
                } else {
                    return '#eeeeee';
                }
            },
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
            mainAuth (arr) {
                let newArr = arr || [];
                let num = 0;
                if (newArr.length > 0) {
                    return ' - ' + newArr[num];
                } else {
                    return '';
                }
            },
            getInfoValue (note) {
                if (note.id) {
                    return Number(note.ownerId);
                } else {
                    return Number(note.assignNow);
                }
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
            staffInfoShow (obj) {
                let staffObj = obj || {};
                if (staffObj.dutyName) {
                    return staffObj.deptName + ' - ' + staffObj.dutyName;
                } else {
                    return staffObj.deptName;
                }
            },
            staffInfoMainShow (arr) {
                let staffArr = arr || {};
                for (let staff of staffArr) {
                	if (staff.partTime === 0) {
                		if (staff.dutyName) {
                            return staff.deptName + ' - ' + staff.dutyName;
                        } else {
                            return staff.deptName;
                        }
                    }
                }
            },
            formatDate (date) {
                if (date) {
                    Date.prototype.Format = format;
                    return new Date(Number(date)).Format('yyyy/MM/dd HH:mm');
                } else {
                    return '';
                }
            },
            getClass (num) {
                if (num || num === 0) {
                    switch (num) {
                        case 0:
                            return 'agree';
                        case 1:
                            return 'refuse';
                        case 2:
                            return 'refuse';
                        case 3:
                            return 'cancel';
                        case '#':
                            return 'approving';
                        default:
                            return '';
                    }
                } else {
                    return '';
                }
            },
            formatToObj (obj) {
                if(obj) {
                    let noteOBJ = JSON.parse(obj);
                    let reason = noteOBJ.reason;
                    let opinion = noteOBJ.opinion;
                    if (opinion && reason) {
                        return reason + ':' + opinion;
                    }
                    if (reason && !opinion) {
                        return reason;
                    }
                    if (opinion && !reason) {
                        return opinion;
                    }
                    if (!opinion && !reason) {
                        return '';
                    }
                }
            }
        }
    };
</script>
<style lang='scss' rel="stylesheet/scss" type="text/css" scoped>
    @import "../../../common/css/mixin";

    .flow-wrapper {
        width: 100%;
        font-size: 0.14rem;
        color: #757678;
        padding-bottom: .44rem;

        .title {
            margin: .24rem 0 .09rem 0;
            font-size: 0.16rem;
            line-height: .25rem;
            color: #999999;
        }

        .job-wrapper {
            align-items: center;
            display: inline-block;
            position: absolute;
            z-index: 2;

            &:after {
                clear:both;
                content:'.';
                display:block;
                width: 0;
                height: 0;
                visibility:hidden;
            }

            h1 {
                float: left;
                font-size: .16rem;
                color: #333333;
                position: relative;

                .circle {
                    $height: 0.34rem;
                    width: $height;
                    height: $height;
                    font-size: .12rem;
                    color: #ffffff;
                    display: inline-block;
                    vertical-align: top;
                    border-radius: 5px;
                    line-height: $height;
                    text-align: center;
                }


            }

        }

        .flow-item {
            padding-bottom: 0.36rem;
            @include border-left(#ebebeb);

            &:before {
                top: .12rem !important;
                left: .165rem;
            }

            &:nth-last-of-type(1) {
                &:before {
                    border-left: none !important;
                }
            }

            .detail-wrapper {
                padding-left: 0.54rem;
                /*padding-top: 0.04rem;*/

                .detail-header {


                    .staff-name {
                        font-size: 0.18rem;
                        line-height: .25rem;
                        color: #333333;
                    }

                    .status {
                        font-size: .12rem;
                        line-height: .17rem;
                        color: #666666;

                        float: right;
                        position: relative;
                        top: .05rem;
                        &.refuse {
                            color: #F06767;
                        }

                        &.cancel {
                            color: #CCCCCC;
                        }

                        &.agree {
                            color: #68C6AA;
                        }

                        &.approving {
                            color: #F1991A;
                        }
                    }
                }

                .detail {
                    overflow: hidden;

                    .inline-wrap {
                        display: inline-block;
                        max-width: 100%;

                        .block-wrap {
                            width: 100%;
                        }
                    }
                }

                .department {
                    position: relative;
                    padding-right: .2rem;
                    line-height: .2rem;
                    font-size: 0.14rem;
                    color: #333333;
                    display: block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    .partTime_1 {
                        position: absolute;
                        right: 0;
                        display: inline-block;
                        width: .15rem;
                        height: .15rem;
                        @include bg-image('../../../../static/image/parttime');
                        background-size: .15rem;
                    }
                }
            }

            .time {
                padding-left: 0.54rem;
                line-height: .2rem;
                font-size: .14rem;
                color: #999999;
            }

            .reason-wrapper {
                padding-left: 0.54rem;

                .reason {
                    text-align: justify;
                    font-size: .14rem;
                    line-height: .2rem;
                    color: #757678;
                }
            }
        }
    }
</style>
