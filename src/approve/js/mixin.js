/**
 * Created by yangjiali on 2017/9/13.
 */
export const approveMixin = {
    computed: {
        ifShowWrapper () {
            return !this.SF.ifShowSPage && !this.SF.ifShowFPage;
        },
        ifShowTipsWrapper () {
            return this.SF.ifShowTips;
        }
    },
    methods: {
        showSPage () {
            this.SF.ifShowTips = false;
            this.showView = true;
            this.SF.ifShowSPage = true;
            this.$refs.searchBox.searching = false;
            if (this.entryType === 0) {
                this.clearBatchStatus();
            }
        },
        hideSPage () {
            console.log(this.noListShowIcon, 'noListShowIcon')

            this.showView = true;
            this.SF.ifShowSPage = false;
                this.initData(this.listType);
        },
        showFPage () {
            this.$refs.filterBox.queryGroup.group = [];
            this.$refs.filterBox.getApproveGroup();

            console.log(this.$refs.filterBox.queryGroup.group, '====this.$refs.filterBox.queryGroup.group')

        },
        getGroupReady () {
            console.log('1111111111111');
            this.SF.ifShowTips = false;
            this.SF.fTips = '';
            this.showView = false;
            this.SF.ifShowFPage = true;
            if (this.entryType === 0) {
                this.clearBatchStatus();
            }
        },
        hideFPage () {
            this.showView = true;
            this.SF.ifShowFPage = false;
        }
    }
};
