console.log("checking Accessibility");
// 注册AccessibilityService 等待授权开启辅助功能
auto.waitFor();
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

const searchButtonSelector = selector().clickable(true).longClickable(true).desc("搜索").className("android.widget.RelativeLayout");
let searchButton = searchButtonSelector.findOnce();
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

let meituanTicketsHomeButton = pickup(selector().desc("返回").className("android.widget.Button"));
console.log("found control: ", meituanTicketsHomeButton)
findClickable2Click(meituanTicketsHomeButton)

// 等待进入美团门票主页
sleep(2000)

let maskButton = pickupLog(selector().clickable(true).className("android.widget.Button"));
console.log("found objects: ", maskButton)
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
let searchViewPointEditText2 = pickupLog(selector().text("北京环球度假区").className("android.widget.TextView"));
searchViewPointEditText2.clickBounds()
// 等待加载
sleep(2000)
// setTextLog(searchViewPointEditText2, "北京环球度假区")

// TODO 找出搜索框
// TODO 填充搜索框: 陕西历史博物馆
// TODO 搜索
// TODO 点击预约
// TODO 进入美团门票小程序
// TODO 点击预定
// TODO 移除所有客人
// TODO 填写客人信息

// 找到搜索按钮前不断回退到主页
function back2WechatHome() {
    while (true) {
        let backButton = pickupLog(selector().desc("返回").className("android.widget.ImageView"));
        let cancelButton = pickupLog(selector().desc("取消按钮").text("取消").className("android.widget.TextView"));
        if (backButton != null) {
            findClickable2Click(backButton)
        } else if (cancelButton != null) {
            findClickable2Click(cancelButton)
        } else {
            break;
        }
        wait()
    }
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