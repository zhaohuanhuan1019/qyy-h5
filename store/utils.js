// 保存按钮状态
export const judgeSave = function (state) {
    if (state.saveFlow) {
        state.canSave = true;
    } else {
        state.canSave = false;
        return;
    }
    for (let element of state.elements) {
        // if (element.isMust) {
            if (state.save[element.typeName + '_' + element.orderCode]) {
                state.canSave = true;
                return;
            } else {
                state.canSave = false;
            }
        // } else {
        //     state.canSave = true;
        //     return;
        // }
    }
};

// 提交按钮状态
export const judgeSubmit = function (state) {
    if (state.submitFlow) {
        state.canSubmit = true;
    } else {
        state.canSubmit = false;
        return;
    }
    for (let element of state.elements) {
        if (element.isMust) {
            if (state.save[element.typeName + '_' + element.orderCode]) {
                state.canSubmit = true;
            } else {
                state.canSubmit = false;
                return;
            }
        } else {
            state.canSubmit = true;
        }
    }
};

// 提交时 元素对提交的控制
export const judgeSubmitByElements = function (state) {
    for (let element of state.elements) {
        if (element.isMust) {
            if (state.save[element.typeName + '_' + element.orderCode]) {
                state.canSubmitOnlyByElements = true;
            } else {
                state.canSubmitOnlyByElements = false;
                return;
            }
        } else {
            state.canSubmitOnlyByElements = true;
        }
    }
};

