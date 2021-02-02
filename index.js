const express = require('express');
const app = express();
const request = require('request');
const sleep = require('sleep');

const port = process.env.PORT || 80;

app.listen(port, ()=>console.log('服务启动'));

//电脑登陆微信，然后登陆龙岗视频门禁，点击开门，抓包在接口请求和返回结果header,body中找参数

console.log(process.env);

//https://lggafw.com/v1.5/spmj/door/open-door 开门接口
const phonesnno = process.env.PHONESNNO;
const wechatopenid = process.env.WECHATOPENID;
const xAuthToken = process.env.XAUTHTOKEN;
const doorDeviceId = process.env.DOORDEVICEID*1;
//查询开门结果id(在返回结果中id字段,下面是随便设的一个,会在请求开门接口后重写)
//const commandId = process.env.COMMANDID;

//https://lggafw.com/v1.5/spmj/door/open-door-result 开门结果查询接口
const buildName = process.env.BUILDNAME;
const facilityName = process.env.FACILITYNAME;
const brandtype = process.env.BRANDTYPE;
const sn = process.env.SN;
const bluetoothMac = process.env.BLUETOOTHMAC;

app.get('/open', (req, res)=>{
    //开门
    var options = {
        'method': 'POST',
        'url': 'https://lggafw.com/v1.5/spmj/door/open-door',
        'headers': {
            'Host': 'lggafw.com',
            'Connection': 'keep-alive',
            'Content-Length': '22',
            'SDKVersion': '2.12.1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'appversion': 'v1.6.5',
            'content-type': 'application/json',
            'phonesnno': phonesnno,
            'phonetype': 'microsoft',
            'systype': 'wechat',
            'sysversion': 'Windows 10 x64',
            'wechatopenid': wechatopenid,
            'wechatversion': '7.0.9',
            'x-auth-token': xAuthToken,
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://servicewechat.com/wx3d2e6845f76fe4ca/68/page-frame.html'
        },
        body: JSON.stringify({"doorDeviceId":doorDeviceId})
    };
    request(options, function (error, response) {
        process.env.COMMANDID = JSON.parse(response.body).id;
        console.log("查询开门结果id：" + process.env.COMMANDID);
    });

    //查询状态
    getStatus(res);
});

function getStatus(res){
    var optionsStatus = {
        'method': 'POST',
        'url': 'https://lggafw.com/v1.5/spmj/door/open-door-result',
        'headers': {
            'Host': 'lggafw.com',
            'Connection': 'keep-alive',
            'Content-Length': '207',
            'SDKVersion': '2.12.1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'appversion': 'v1.6.5',
            'content-type': 'application/json',
            'phonesnno': phonesnno,
            'phonetype': 'microsoft',
            'systype': 'wechat',
            'sysversion': 'Windows 10 x64',
            'wechatopenid': wechatopenid,
            'wechatversion': '7.0.9',
            'x-auth-token': xAuthToken,
            'Referer': 'https://servicewechat.com/wx3d2e6845f76fe4ca/68/page-frame.html',
            'Accept-Encoding': 'gzip, deflate, br'
        },
        body: JSON.stringify({"commandId":process.env.COMMANDID,"buildName":buildName,"facilityName":facilityName,"brandtype":brandtype,"sn":sn,"bluetoothMac":bluetoothMac})
    };
    request(optionsStatus, function (error, response) {
        console.log("开门结果：" + response.body);
        if (!JSON.parse(response.body).success){
            sleep.msleep(500);
            getStatus(res);
        }
        res.json(JSON.parse(response.body).success);
    });
};







