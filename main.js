console.log("checking Accessibility");
// 注册AccessibilityService 等待授权开启辅助功能
auto.waitFor();
/* 申请屏幕截图权限. */
images.requestScreenCapture();
// 检查无障碍服务
var service = auto.service;
if (!service) {
    toast("请先开启辅助功能");
    exit();
}
console.log("got auto service: ", service);
console.log("start to open wechat");

// app.launchPackage("com.tencent.mm")
app.startActivity({
    packageName: "com.tencent.mm",
    className: "com.tencent.mm.ui.LauncherUI"
})

console.log("now package 1 is: ", currentPackage())

waitForPackage("com.tencent.mm")

console.log("now package 2 is: ", currentPackage())


// 找到搜索按钮前不断回退到主页，直到搜索按钮可用
back2WechatHome();

function getSearchButtonInWechat() {
    return pickupLog(selector().clickable(true).longClickable(true).desc("搜索").className("android.widget.RelativeLayout"));
}

let searchButton = getSearchButtonInWechat();
console.log("found search button: ", searchButton)
console.log("click search button")
searchButton.click()

// 解除输入法
wait()
back()

console.log("current package", currentPackage())

// const searchEditTextSelector = selector().text("搜索").className("android.widget.EditText").clickable(true).longClickable(true)
let searchEditTextSelector = selector().id('cd7')
const searchEditText = searchEditTextSelector.findOnce()
console.log("found control: ", searchEditText)
let searchText = "陕西历史博物馆";
setTextLog(searchEditText, searchText)
// 等待自动搜索
sleep(2000)

let resultNetLayout = selector().text("搜索网络结果").findOnce().parent().parent();
console.log("found control: ", resultNetLayout)

let search2Click = pickup(resultNetLayout, selector().text(searchText).className("android.widget.TextView"));

findClickable2Click(search2Click)

// 等待加载搜索结果页面
sleep(3000)

let appointmentEntryButton = pickup(selector().textStartsWith("门票预约").className("android.widget.Button"));
console.log("found control: ", appointmentEntryButton)
findClickable2Click(appointmentEntryButton)

// 等待加载博物馆预约界面
sleep(2000)

let meituanTicketsHomeButton = pickupLog(selector().desc("返回").className("android.widget.Button"));
findClickable2Click(meituanTicketsHomeButton)

// 等待进入美团门票主页
sleep(2000)

let maskButton = pickupLog(selector().clickable(true).className("android.widget.Button"));
maskButton.click()
// 进入遮罩层宣传页
wait()
// 退出到主页以解除遮罩
back()
// 等待遮罩层消失
wait()

// 点击搜索框
let searchViewPointEditText = pickupLog(selector().text("景点/目的地").className("android.widget.EditText"));
findClickable2ClickBounds(searchViewPointEditText)

// 等待跳转
wait()
// 解除输入法
back()

wait()
// 搜索历史搜索中的北京环球度假区并直接点击对应坐标
let project = "北京环球度假区";
let searchViewPointEditText2 = pickupLog(selector().text(project).className("android.widget.TextView"));
searchViewPointEditText2.clickBounds()
// 等待加载
sleep(2000)

let beijingTextView = selector().text(project).className("android.widget.TextView").find()[1];
beijingTextView.parent().parent().clickBounds(10, 15)
// setTextLog(searchViewPointEditText2, "北京环球度假区")
// 等待加载
sleep(2000)

// 上滑拉出预订按钮
swipe(200, 800, 200, 0, 500)

// 找出预订按钮
let bookButton = pickupLog(selector().text("预订").className("android.widget.Button"));
findClickable2Click(bookButton)

sleep(5000)

// 如果存在更换按钮，则先移除所有客人
let haveGuest = ocrExist(["更", "换|換"]);

// 移除所有客人
if (haveGuest) {
    // 打开新增更换列表
    ocrClick(["更", "换|換"])
    wait()
    // 删除所有游客
    while(ocrExist(["编辑"])){
        ocrClick(["编辑"])
        wait()
        ocrClick(["除", "游客"])
        wait()
        ocrClick(["确定"], 1)
        wait()
    }
    ocrClick(["完成"])
    wait()
}

// TODO 填写客人信息
// 找出新增按钮
ocrClick(["点击", "游客信息"])
// 等待弹窗
wait()

const infoText = `郑智辉 362501196403150017
蔡晓军 362501196508090647
王杨权煜 320323201011160699
王刚 320323198301010774
杨茗喧 320381201103309212`
const infos = parseTextToInfoList(infoText)
console.log("got infos: ", infos)

// 填充信息
inputInfoAndSave(infos[0]);
wait()
infos.splice(0, 1)

ocrClick(["更", "换|換"])
wait()
for (let i = 0; i < infos.length; i++) {
    ocrClick(["新|折", "增|増", "游客"])
    wait()
    inputInfoAndSave(infos[i])
    wait()
}

ocrClick(["完成"])
wait()

// 找到搜索按钮前不断回退到主页
function back2WechatHome() {
    while (true) {
        let backButton = pickupLog(selector().desc("返回").className("android.widget.ImageView"));
        let cancelButton = pickupLog(selector().desc("取消按钮").text("取消").className("android.widget.TextView"));
        let searchButton = getSearchButtonInWechat();
        if (searchButton != null) {
            break;
        } else if (backButton != null) {
            findClickable2Click(backButton)
        } else if (cancelButton != null) {
            findClickable2Click(cancelButton)
        } else {
            break;
        }
        wait()
    }
}

// 输入用户信息并保存
function inputInfoAndSave(info) {
    console.log("input info: ", info)
    ocrPaste(info.name, ["必", "姓名"])
    wait()
    ocrPaste(info.licenseID, ["必", "证件号"])
    wait()
    ocrPaste(info.phoneNumber, ["必", "手机号"])
    ocrClick(["保存"])
}


function findClickable2Click(target) {
    target = getClickableParent(target);
    target.click()
}

function findClickable2ClickBounds(target) {
    target = getClickableParent(target)
    target.clickBounds()
}

function getClickableParent(target) {
    while (!target.clickable() && target.parent() !== null) {
        target = target.parent()
    }
    return target;
}

function wait() {
    sleep(1000)
}

function setTextLog(uiObject, text) {
    console.log("set text: ", text)
    uiObject.setText(text)
}

function pickupLog(selector) {
    let uiObject = pickup(selector);
    console.log("found uiObject: ", uiObject)
    return uiObject
}

function ocrPaste(text, locationIncludes) {
    // 写剪切板
    setClip(text)
    // 粘贴信息
    let bound2Click = ocrFirstBounds(locationIncludes);
    click(bound2Click.centerX(), bound2Click.centerY())
    sleep(500)
    longClick(bound2Click.centerX(), bound2Click.centerY())
    sleep(500)
    let pasteButtonBounds = getFilteredOcrResult(["粘贴"])[0].bounds;
    click(pasteButtonBounds.left + 10, pasteButtonBounds.centerY())
}

function ocrExist(includes) {
    let exist = getFilteredOcrResult(includes).length != 0;
    console.log("ocr exist: ", includes, exist)
    return exist;
}

function ocrClick(includes, number) {
    console.log("ocr click to click: ", includes)
    let filteredResults = getFilteredOcrResult(includes);
    let targetResult
    if (number != null) {
        targetResult = filteredResults[number]
    } else {
        targetResult = filteredResults[0]
    }
    let bound2Click = targetResult.bounds;
    click(bound2Click.centerX(), bound2Click.centerY())
}


function ocrLongClick(includes) {
    let bound2Click = ocrFirstBounds(includes);
    longClick(bound2Click.centerX(), bound2Click.centerY())
}

function ocrFirstBounds(includes) {
    let filteredResults = getFilteredOcrResult(includes);
    return filteredResults[0].bounds;
}


function getFilteredOcrResult(includes) {
    let ocrDetectResult = ocrDetectScreen();
    // 对 ocr 检测结果进行过滤，要求结果中的 label 属性同时满足所有输入的不定长参数表
    let filteredResults = filterOcrResults(ocrDetectResult, includes);
    console.log("filtered ocr detected result: ", filteredResults)
    return filteredResults;
}

function ocrDetectScreen() {
    /* 截屏并获取包装图像对象. */
    let img = images.captureScreen();
    /* OCR 识别并获取结果, 结果为字符串数组. */
    let results = ocr.detect(img);
    console.log("ocr detect results: ", results)
    return results
}

function filterOcrResults(ocrDetectResult, includes) {
    // 正则表达式过滤，以满足错别字容错
    // const escapedFilters = includes.map((filter) => escapeRegExp(filter));
    const regexFilters = includes.map((filter) => new RegExp(filter));
    console.log("use regex: ", regexFilters)
    return ocrDetectResult.filter((result) => {
        return regexFilters.every((regex) => regex.test(result.label));
    });
}

function generateRandomPhoneNumber() {
    const prefix = "134";
    const digitsNeeded = 11 - prefix.length;
    let randomNumber = "";
    // Generate random digits for the rest of the phone number
    for (let i = 0; i < digitsNeeded; i++) {
        randomNumber += Math.floor(Math.random() * 10);
    }
    // Concatenate the prefix and random digits to get the full phone number
    return prefix + randomNumber;
}

/**
 * 将输入的客户文本信息转换成 json 列表
 * @param text 文本信息
 * @return {*[]} 列表
 */
function parseTextToInfoList(text) {
    const regex = /(.+?)\s+(\d{18}|\d{17}[xX]|\d{15})/g;
    const infoList = [];

    let match;
    while ((match = regex.exec(text))) {
        console.log("got match:", match)
        let name = match[1];
        let licenseID = match[2];
        let phoneNumber = generateRandomPhoneNumber();

        let info = {name, licenseID, phoneNumber};
        infoList.push(info);
    }

    return infoList;
}