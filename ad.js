cc.Class({
    extends: cc.Component,
    properties: {},
    editor: {
        executionOrder: -1,//让ad.js最先加载
    },
    onLoad() {
        //设置常驻节点
        cc.game.addPersistRootNode(this.node);
        window.ad = this;
    },
    /**
     * 初始化
     * @param {配置} json 
     */
    init(json) {
        var still = this;
        if (this.init_sdk) return;//确保ad.js只执行一次初始化
        this.init_sdk = true;
        this.config = json;
        this.init_function([
            'gameBox', 'toDesk', 'bannerShow', 'bannerHide', 'imageShow', 'videoPlay', 'shareText',
            'shareVideo', 'videoStart', 'videoStop', 'dataStart', 'getData', 'dataClick'
        ], function (obj) {
            obj.success && obj.success();
            return (this.data)
        }.bind(this));
        if (window.tt) this.tt();
        else if (window.swan) this.swan();
        else if (window.qg) {
            if (qg.getSystemInfoSync().COREVersion) this.oppo();
            else this.vivo();
        } else if (window.uc) this.uc();
        else if (window.qq) this.qq();
        else if (window.wx) this.wx();
        else if (window.h5api) this.w4399();
        else if (cc.sys.OS_ANDROID === cc.sys.os) this.apk();
        else this.OS = 'unknown';
        // 创建一个示例数据
        still.data = { adId: 0, clickBtnTxt: "", creativeType: 0, desc: "活动真实有效", icon: "http://www.tttal.com/202003102005332541500.png", imgUrlList: { 0: "http://www.tttal.com/055e69c6-9a28-4185-b73c-f7b4000c2e02.jpg", }, interactionType: 2, logoUrl: "", title: "恭喜收到奖励红包" };
    },
    init_function(array, func) {
        array.forEach(function (key) {
            this[key] = func;
        }.bind(this));
    },
    mode(type = 0) {
        var still = this;
        this.bannerShow = this.bannerHide = this.imageShow = this.videoPlay = this.shareText = this.shareVideo = this.videoStart = this.videoStop = this.dataStart = this.getData = this.dataClick = function (obj = {}) { obj.success && obj.success(); return (still.data) };
        switch (type) {
            case 1:
                break;
            case 2:
                this.videoPlay = function () {
                    //设置暂无广告的填充,根据平台使用不同的填充方法
                    switch (this.OS) {
                        case 'vivo_rpk':
                            if (window.qg) {
                                qg.showToast({
                                    message: '暂无广告'
                                });
                            }
                            break;

                        default:
                            break;
                    }

                };
                break;
            default:
                break;
        }
    },
    getConfig(a, b) {
        return this.config[a][b];
    },
    w4399() {
        this.OS = '4399';
        this.w4399CanPlay = function (res) {
            if (res.canPlayAd && res.remain) {
                this.w4399AdShow = true;
            } else {
                this.w4399AdShow = false;
            }
        }.bind(this);
        h5api.canPlayAd(this.w4399CanPlay)
        this.videoPlay = function (obj = {}) {
            if (confirm('确认观看视频获取奖励吗？')) {
                h5api.playAd(function (res) {
                    if (res.code === 10000) {
                        console.log('开始播放')
                    } else if (res.code === 10001) {
                        obj.success && obj.success();
                        h5api.canPlayAd(this.w4399CanPlay)
                    } else {
                        console.log('广告异常')
                    }

                }.bind(this));
            }
        }.bind(this);

    },

    uc() {
        var still = this;
        still.OS = 'uc';
        still.videoPlay = function (obj = {}) {
            still.rewardVideoAd = uc.createRewardVideoAd();
            still.rewardVideoAd.show().then().catch(err => console.log(err));
            still.rewardVideoAd.onError(err => {
                obj.error && obj.error();
            });
            still.rewardVideoAd.onClose(res => {
                if (res && res.isEnded) {
                    obj.success && obj.success();
                } else {
                    obj.fail && obj.fail();
                }
                obj.complete && obj.complete();
            });
        };

    },
    qq() {
        var still = this;
        still.toDesk = function (obj = {}) {
            qq.saveAppToDesktop({
                success() {
                    obj.success && obj.success();
                },
                fail() {
                    obj.fail && obj.fail();
                },
                complete() {
                    obj.complete && obj.complete();
                }
            });
        };
        still.box = qq.createAppBox({
            adUnitId: still.getConfig('qq', 'box_id')
        });
        still.gameBox = function (obj = {}) {

            still.box.load();
            still.box.show();
        };
        still.video_ad = qq.createRewardedVideoAd({ adUnitId: still.getConfig('qq', 'video_id') });
        still.videoPlay = function (obj) {
            still.video_ad.show()
                .then(() => {
                    still.adAction = function (res) {
                        if (res.isEnded) {
                            obj.success && obj.success();
                        } else {
                            obj.fail && obj.fail();
                        }
                        obj.complete && obj.complete();
                        still.video_ad.offClose(still.adAction);
                    };
                    still.video_ad.onClose(still.adAction);
                })
                .catch(err => {
                    still.video_ad.load()
                        .then(() => {
                            showAd();
                        });
                });
            var errorRes = function (res) {
                obj.error && obj.error();
            };
            still.video_ad.offError(errorRes);
            still.video_ad.onError(errorRes);
        };

        still.banner_ad = qq.createBannerAd({
            adUnitId: still.getConfig('qq', 'banner_id'),
            style: {
                width: 300,
                left: (window.innerWidth - 300) / 2,
                top: window.innerHeight - 80,
            }
        });
        still.banner_resize = false;
        still.banner_ad.onLoad(function () {
            still.banner_ad.onResize(function (res) {
                if (still.banner_resize == false) {
                    still.banner_ad.style.left = (window.innerWidth - res.width) / 2;
                    still.banner_ad.style.top = window.innerHeight - res.height;
                    still.banner_resize = true;
                }
            });
            still.banner_ad.show();
            still.bannerShow = function () {
                still.banner_ad.show();
            };
            still.bannerHide = function () {
                still.banner_ad.hide();
            }
        });

        still.imageShow = function () {
            still.interstitial_ad = qq.createInterstitialAd({
                adUnitId: still.getConfig('qq', 'image_id')
            });
            still.interstitial_ad.onLoad(function () {
                still.interstitial_ad.show();
            });
            still.interstitial_ad.load();
        };
        still.shareText = function (obj = {}) {
            qq.shareAppMessage({
                title: obj.title,
                imageUrl: obj.imageUrl,
                success() {
                    console.log('success');
                    obj.success && obj.success();
                    obj.complete && obj.complete();
                },
                fail(res) {
                    obj.fail && obj.fail();
                    obj.complete && obj.complete();
                },

            });
        };
        still.getData = function () {
            return (false);
        };

        still.OS = 'qq';
    },
    oppo() {
        var still = this;
        still.OS = 'vivo_rpk';
        cc.log('vivo_rpk平台');
        still.rewardedVideoAd = qg.createRewardedVideoAd({
            posId: still.getConfig('vivo_rpk', 'video_id'),
        });

        still.videoPlay = function (obj = {}) {
            if (still.rewardedVideoLock) {
                qg.showToast({
                    title: '暂无视频,请稍后再试'
                });
                obj.error && obj.error();
            }
            still.rewardedVideoLock = true;
            still.scheduleOnce(function () {
                still.rewardedVideoLock = false;
            }, 10);
            still.rewardedVideoAdonLoad = false;
            still.rewardedVideoAd.offLoad();
            still.rewardedVideoAd.onLoad(function (res) {
                obj.mute && obj.mute();
                still.rewardedVideoAdonLoad = true;
                still.rewardedVideoAd.show();
            });
            still.rewardedVideoAd.onError(function (res) {
                if (still.rewardedVideoAdonLoad) {
                    obj.unmute && obj.unmute();
                }
                obj.error && obj.error();
                qg.showToast({
                    title: '暂无视频,请稍后再试'
                });
            });
            still.rewardedVideoAd.offClose();
            still.rewardedVideoAd.onClose((res) => {
                if (still.rewardedVideoAdonLoad) {
                    obj.unmute && obj.unmute();
                }
                if (res.isEnded) {
                    obj.success && obj.success();
                } else {
                    obj.fail && obj.fail();
                }
                obj.complete && obj.complete();
            })
            still.rewardedVideoAd.load().catch(function (res) {
                console.error(res);
                if (still.rewardedVideoAdonLoad) {
                    obj.unmute && obj.unmute();
                }
                qg.showToast({
                    title: '暂无视频,请稍后再试'
                });
            });
        };

        still.scheduleOnce(function () {
            still.bannerAd = qg.createBannerAd({
                posId: still.getConfig('oppo_rpk', 'banner_id'),
                style: {}
            });
            still.bannerLock = true;
            still.scheduleOnce(function () {
                still.bannerLock = false;
            }, 11);
            still.bannerAd.show() && still.bannerAd.show().then(() => {

            }).catch((err) => {
                console.error(err);
            });
            still.bannerShow = function () {
                if (still.bannerLock) {
                    return;
                }
                still.bannerLock = true;
                still.scheduleOnce(function () {
                    still.bannerLock = false;
                }, 11);
                still.bannerAd.show();
            };
            still.bannerHide = function () {
                still.bannerAd.hide();
            };
        }, 2);
        still.imageShow = function () {
            try {
                still.interstitialAd = qg.createInterstitialAd({
                    posId: still.getConfig('oppo_rpk', 'image_id'),
                });
                var adshow = still.interstitialAd.show();
                // 调用then和catch之前需要对show的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
                adshow && adshow.then(() => {
                }).catch(err => {
                    console.error(err);
                });
            } catch (error) {
                still.interstitialAd = qg.createInsertAd({
                    posId: still.getConfig('oppo_rpk', 'image_id'),
                });
                var adshow = still.interstitialAd.show();
                // 调用then和catch之前需要对show的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
                adshow && adshow.then(() => {
                }).catch(err => {
                    console.error(err);
                });
            }
        };
        still.automatic = function () {
            still.nativeAd = qg.createNativeAd({ posId: still.getConfig('vivo_rpk', 'native_id'), });
            still.nativeAd.onLoad(function (res) {
                if (res) {
                    still.data = res.adList[0];
                }
            });
            still.scheduleOnce(function () {
                still.nativeAd.load();
            }, 1);
            still.nativeAd.onError(function (err) {
                console.error(err);
            });
        };
        still.dataClick = function () {
            still.nativeAd.reportAdShow({
                adId: still.getData().adId
            });
            still.scheduleOnce(function () {
                still.nativeAd.reportAdClick({
                    adId: still.getData().adId
                });
            }, 1);
        };
        still.schedule(function () {
            still.automatic();
        }, 10, 999, 1);
        // 清除示例数据
        still.data = 0;
        still.getData = function () {
            if (!still.data) {
                return (false);
            } else {
                return (still.data);
            }
        };
    },
    vivo() {
        var still = this;
        still.OS = 'vivo_rpk';
        cc.log('vivo_rpk平台');
        still.rewardedVideoAd = qg.createRewardedVideoAd({
            posId: still.getConfig('vivo_rpk', 'video_id'),
        });

        still.videoPlay = function (obj = {}) {
            if (still.rewardedVideoLock) {
                qg.showToast({
                    message: '暂无视频,请稍后再试'
                });
                obj.error && obj.error();
            }
            still.rewardedVideoLock = true;
            still.scheduleOnce(function () {
                still.rewardedVideoLock = false;
            }, 10);
            still.rewardedVideoAdonLoad = false;
            still.rewardedVideoAd.offLoad();
            still.rewardedVideoAd.onLoad(function (res) {
                obj.mute && obj.mute();
                still.rewardedVideoAdonLoad = true;
                still.rewardedVideoAd.show();
            });
            still.rewardedVideoAd.onError(function (res) {
                if (still.rewardedVideoAdonLoad) {
                    obj.unmute && obj.unmute();
                }
                obj.error && obj.error();
                qg.showToast({
                    message: '暂无视频,请稍后再试'
                });
            });
            still.rewardedVideoAd.offClose();
            still.rewardedVideoAd.onClose((res) => {
                if (still.rewardedVideoAdonLoad) {
                    obj.unmute && obj.unmute();
                }
                if (res.isEnded) {
                    obj.success && obj.success();
                } else {
                    obj.fail && obj.fail();
                }
                obj.complete && obj.complete();
            })
            still.rewardedVideoAd.load().catch(function (res) {
                console.error(res);
                if (still.rewardedVideoAdonLoad) {
                    obj.unmute && obj.unmute();
                }
                qg.showToast({
                    message: '暂无视频,请稍后再试'
                });
            });
        };
        still.bannerAd = qg.createBannerAd({
            posId: still.getConfig('vivo_rpk', 'banner_id'),
            style: {}
        });
        still.bannerLock = true;
        still.scheduleOnce(function () {
            still.bannerLock = false;
        }, 11);
        still.bannerAd.show() && still.bannerAd.show().then(() => {

        }).catch((err) => {
            console.error(err);
        });
        still.bannerShow = function () {
            if (still.bannerLock) {
                return;
            }
            still.bannerLock = true;
            still.scheduleOnce(function () {
                still.bannerLock = false;
            }, 11);
            still.bannerAd.show();
        };
        still.bannerHide = function () {
            still.bannerAd.hide();
        };
        still.imageShow = function () {
            still.interstitialAd = qg.createInterstitialAd({
                posId: still.getConfig('vivo_rpk', 'image_id'),
            });
            var adshow = still.interstitialAd.show();
            // 调用then和catch之前需要对show的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
            adshow && adshow.then(() => {
            }).catch(err => {
                console.error(err);
            });
        };
        still.automatic = function () {
            still.nativeAd = qg.createNativeAd({ posId: still.getConfig('vivo_rpk', 'native_id'), });
            still.nativeAd.onLoad(function (res) {
                if (res) {
                    still.data = res.adList[0];
                }
            });
            still.scheduleOnce(function () {
                still.nativeAd.load();
            }, 1);
            still.nativeAd.onError(function (err) {
                console.error(err);
            });
        };
        still.dataClick = function () {
            still.nativeAd.reportAdShow({
                adId: still.getData().adId
            });
            still.scheduleOnce(function () {
                still.nativeAd.reportAdClick({
                    adId: still.getData().adId
                });
            }, 1);
        };
        still.schedule(function () {
            still.automatic();
        }, 10, 999, 1);
        // 清除示例数据
        still.data = 0;
        still.getData = function () {
            if (!still.data) {
                return (false);
            } else {
                return (still.data);
            }
        };

    },
    tt() {
        var still = this;
        still.OS = 'tt';
        cc.log('tt平台');
        still.rewardedVideoAd = tt.createRewardedVideoAd({
            adUnitId: still.getConfig('tt', 'video_id')
        });
        still.videoPlay = function (obj = {}) {
            still.rewardedVideoAd.show()
                .then(() => {
                    still.listener = function (res) {
                        if (res.isEnded) {
                            still.rewardedVideoAd.offClose(still.listener);
                            obj.success && obj.success();
                        } else {
                            tt.showToast({
                                title: "观看完整视频才能获得奖励",
                                icon: 'fail',
                                duration: 2000,
                            });
                            still.rewardedVideoAd.offClose(still.listener);
                            obj.fail && obj.fail();
                        }
                        obj.complete && obj.complete();
                    };
                    still.rewardedVideoAd.onClose(still.listener);
                })
                .catch(err => {
                    tt.showToast({
                        title: "暂无视频广告",
                        icon: 'fail',
                        duration: 2000,
                    });
                });
        };
        still.bannerAd = tt.createBannerAd({
            adUnitId: still.getConfig('tt', 'banner_id'),
            style: {
                width: 128,
                top: window.innerHeight - (128 / 16) * 9
            }
        });
        still.bannerAd.onResize(function (res) {
            still.bannerAd.style.top = window.innerHeight - res.height;
            still.bannerAd.style.left = (window.innerWidth - res.width) / 2;
        });
        still.bannerShow = function () {
            still.bannerAd.show();
        };
        still.bannerHide = function () {
            still.bannerAd.hide();
        };
        still.shareText = function (obj = {}) {
            tt.shareAppMessage({
                templateId: still.getConfig('tt', 'share_id'),
                success() {
                    obj.success && obj.success();
                    obj.complete && obj.complete();
                },
                fail(e) {
                    obj.fail && obj.fail();
                    obj.complete && obj.complete();
                }
            });
        };

        still.r = tt.getGameRecorderManager();
        still.r.onStop(res => {
            still.recorderUrl = res.videoPath;
        });
        still.videoStart = function () {
            still.r.start({
                duration: 300
            });
        };
        still.videoStop = function () {
            still.r.stop();
        };

        still.shareVideo = function (obj = {}) {
            tt.shareAppMessage({
                channel: 'video',
                templateId: still.getConfig('tt', 'share_id'),
                extra: {
                    videoPath: still.recorderUrl,
                },
                success(res) {
                    obj.success && obj.success();
                    obj.complete && obj.complete();
                },
                fail(e) {
                    if (e.errMsg.indexOf('short') != -1) {
                        tt.showToast({
                            title: '分享失败：录屏时长低于 3 秒',
                            icon: 'fail',
                            duration: 2000,
                        });
                    }
                    obj.fail && obj.fail();
                    obj.complete && obj.complete();
                }
            });
        };
        still.imageShow = function () {
            if (!tt.createInterstitialAd) {
                console.error('tt.createInterstitialAd在过低版本的客户端无法使用(cc.ad.imageShow();)');
                return;
            }
            still.interstitialAd = tt.createInterstitialAd({
                adUnitId: still.getConfig('tt', 'image_id')
            });
            still.interstitialAd.load().then(() => {
                still.interstitialAd.show();
            }).catch(err => {
                console.log(err);
            });
        };
        still.getData = function () {
            return (false);
        };
    },

});