/*通用方法
* @Author: Rosen
* @Date:   2017-05-15 15:26:38
* @Last Modified by:   Rosen
* @Last Modified time: 2017-05-21 14:58:37
*/

'use strict';
//引入hogan插件
var Hogan = require('hogan');
var conf = {
    serverHost : ''
};
var _mm = {
    // 网络请求函数
    request : function(param){
        var _this = this;
        $.ajax({
            type        : param.method  || 'get',
            url         : param.url     || '',
            dataType    : param.type    || 'json',
            data        : param.data    || '',
            success     : function(res){
                // 请求成功
                if(0 === res.status){
                    typeof param.success === 'function' && param.success(res.data, res.msg);
                }
                // 没有登录状态，需要强制登录
                else if(10 === res.status){
                    _this.doLogin();
                }
                // 请求数据错误
                else if(1 === res.status){
                    typeof param.error === 'function' && param.error(res.msg);
                }
            },
            error       : function(err){
                typeof param.error === 'function' && param.error(err.statusText);
            }
        });
    },
    // 获取服务器地址
    getServerUrl : function(path){
        return conf.serverHost + path;
    },
    // 获取url参数
    // http:localhost:8080/mmall/product/list.do?keyword=xx&pageNum=2
    // name：传入pageNum，得到result=2
    getUrlParam : function(name){
        // 使用正则表达式
        var reg     = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result  = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    // 渲染html模板，传入模板和数据
    renderHtml : function(htmlTemplate, data){
        // 编译模板
        var template    = Hogan.compile(htmlTemplate),
            result      = template.render(data);
        return result;
    },
    // 成功提示
    successTips : function(msg){
        alert(msg || '操作成功！');
    },
    // 错误提示
    errorTips : function(msg){
        alert(msg || '哪里不对了~');
    },
    // 字段的验证，支持非空、手机、邮箱的判断
    validate : function(value, type){
        var value = $.trim(value);
        // 非空验证
        if('require' === type){
            return !!value;
        }
        // 手机号验证
        if('phone' === type){
            return /^1\d{10}$/.test(value);
        }
        // 邮箱格式验证
        if('email' === type){
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
    },
    // 统一登录处理
    doLogin : function(){
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    // 跳回主页
    goHome : function(){
        window.location.href = './index.html';
    }
};
// 提供了暴露接口的方法，写在最后，这里把声明的网络请求变量_mm暴露出去
module.exports = _mm;