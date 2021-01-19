auto.waitFor();

// 禁止脚本多次运行
var list = engines.all();
for (var i = 0; i < list.length; i++) {
    for (var j = i + 1; j < list.length; j++) {
        if (list[i].getSource().toString() == list[j].getSource().toString()) {
            list[j].forceStop();
        };
    };
};

setScreenMetrics(1080, 1920);
device.keepScreenOn()

// 唤醒屏幕
if (!device.isScreenOn()) {
    device.wakeUp();
    sleep(1000);
}

// 解锁屏幕
var keyguard_manager = context.getSystemService(context.KEYGUARD_SERVICE);
var isUnlocked = () => !keyguard_manager.isKeyguardLocked();
if (!isUnlocked()) {
    swipe(500, 30, 500, 1000, 300);
    sleep(1000);
    click(100, 120);
    sleep(1000);
    back();
}

var appName = "今日头条极速版";
var downloadUrl = 'https://d.toutiao.com/PqXU?apk=1';

// 打开App
var packageName = getPackageName(appName);
if (!packageName) {
    toast('未安装' + appName + ', 开始安装');
    importClass(java.io.File);
    importClass(com.stardust.util.IntentUtil);
    importClass(org.autojs.autojs.Pref);
    importClass(org.autojs.autojs.network.download.DownloadManager);
    importClass(org.autojs.autojs.external.fileprovider.AppFileProvider);

    var fileName = appName + '.apk';
    var path = new File(Pref.getScriptDirPath(), fileName).getPath();
    var res = DownloadManager.getInstance().download(downloadUrl, path);
    while (!res.hasComplete()) {
        sleep(3000);
    };
    IntentUtil.installApkOrToast(context, path, AppFileProvider.AUTHORITY)
    toast('等待' + appName + '安装结束');
    sleep(3000);
    click(775, 1850);
}

while (!packageName) {
    sleep(400);
    var packageName = getPackageName(appName);
    if (packageName) {
        toast('安装完成');
        sleep(3000);
        click(775, 1850);
        sleep(5000);
        click(540, 1312);
        sleep(3000);
        click(763, 1832);
        sleep(3000);
        click(763, 1832);
        sleep(3000);
        click(918, 382);
    }
}

if (currentPackage() != packageName) {
    toast('启动' + appName);
    var r = app.launchApp(appName);
    sleep(3000);
    waitForPackage(packageName);
    toast(appName + '已启动');
} else {
    toast(appName + '已在运行中');
}

// 开始读新闻
function jinRiTouTiaoClickReturnButton() {
    let back = className("android.widget.ImageView").id("abv");
    if (back.exists()) {
        let b = back.findOnce().bounds();
        click(b.centerX(), b.centerY());
    }
}

if (id("f2").exists()) {
    back();
    id("f2").findOnce().click();
}

/**
 * 今日头条读新闻
 */
for (var i = 1; i <= 2; i++) {
    sleep(3000);
    jinRiTouTiaoClickReturnButton();

    let all = className("android.widget.ImageView").id("ah1");
    if (all.exists()) {
        let b = all.findOnce().bounds();
        click(b.centerX(), b.centerY());
        sleep(1500);
    }

    toast("今日头条极速版读新闻第" + i + "次");
    if (className("android.widget.TextView").text("历史").exists()) {
        let tabMenu = className("android.widget.TextView").text("历史").findOnce(); //推荐里面容易有广告
        click(tabMenu.bounds().centerX(), tabMenu.bounds().centerY()); //进入到栏目
        sleep(6000);
        // 刷新一次
        let tabMenu2 = className("android.widget.TextView").text("历史").findOnce(); //推荐里面容易有广告
        click(tabMenu2.bounds().centerX(), tabMenu2.bounds().centerY()); //进入到栏目
        sleep(6000);
        let news = id("bz").findOnce(); //第二条新闻
        if (news != null) {
            click(news.bounds().centerX(), news.bounds().centerY()); //点击第二条新闻
            for (var x = 1; x <= 3; x++) {
                toast("今日头条极速版读新闻第" + i + "次" + "滑动第" + x + "次");
                swipe(303, 1000, 335, 50, 500);
                sleep(1500);
            }
        }
        back();
    }
}
sleep(1000);

/**
 * 今日头条读小说
 */
if (className("android.widget.TextView").text("小说").exists()) {
    let storyMenu = className("android.widget.TextView").text("小说").findOnce();
    click(storyMenu.bounds().centerX(), storyMenu.bounds().centerY());
    sleep(6000);
    // 更多
    let more = className("android.view.View").text("更多").find()
    if (more.length > 0) {
        let m = more[more.length - 1].bounds();
        click(m.centerX(), m.centerY());
    }
    sleep(4000);

    let views = className("android.widget.Image").find();
    if (views.length > 0) {
        let book = views[views.length - 2].bounds();
        click(book.centerX(), book.centerY());
        sleep(4000);
        if (className("android.view.View").text("立即阅读").exists()) {
            className("android.view.View").text("立即阅读").findOnce().click();
        }
        if (className("android.view.View").text("继续阅读").exists()) {
            className("android.view.View").text("继续阅读").findOnce().click();
        }

        sleep(2200);
        //权且算20片是一章
        for (let i = 1; i <= 4; i++) {
            toast("今日头条极速版小说滑动" + i + "次");//这个有点难 一章才给50金币 多少片算一章这个不知道啊
            swipe(750, 1000, 100, 1000, 500);
            sleep(1000);//加速阅读1S读一篇
            if (className("android.view.View").text("恭喜获得50金币").exists()) {
                let viewViews = className("android.view.View").find();
                viewViews[viewViews.length - 1].click();
            }
        }
        back();
        sleep(2200);
        back();
        sleep(2200);
        back();
    }
}
sleep(1000);

/**
 * 今日头条检索关键字
 */
var searchKeyWord = [
    'AutoJs教程',
    'RNN',
    'CNN',
    'HMM',
    'LSTM',
    '人工智能的出路',
    'Java的出路',
    'AI的出路',
    'DOTNET未来',
    'C#的出路',
    'Android教程',
    'IOS教程',
    'MAC教程',
    'XCODE教程',
    'IOS还有未来吗',
    'uniapp教程',
    '编辑距离',
    '欧式距离',
    '隐马尔可夫链',
    '云计算',
    '云存储',
    'Iaas',
    'AI',
    'AI和教育',
];

if (id('s5').exists()) {
    let s = id('s5').findOnce();
    click(s.bounds().centerX(), s.bounds().centerY());
    sleep(3000);

    for (i = 0; i < 5; i++) {
        let inputSearchButton = id('gp').findOne();
        if (inputSearchButton != null) {
            let keyWord = searchKeyWord[Math.floor(Math.random() * searchKeyWord.length)];
            className("android.widget.EditText").setText(keyWord)
            inputSearchButton.click();
            sleep(3000);
        }
    }
}

sleep(1000);
back();
sleep(2200);
back();
sleep(2200);
home();

exit();