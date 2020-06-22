cc.Class({
    extends: cc.Component,
    properties: {},
    editor: {
        executionOrder: -1
    },
    onLoad: function () {
        cc.game.addPersistRootNode(this.node),
            window.ad = this
    },
    init: function (e) {
        var t = this;
        this.init_sdk || (this.init_sdk = !0, this.config = e, this.gameBox = this.toDesk = this.bannerShow = this.bannerHide = this.imageShow = this.videoPlay = this.shareText = this.shareVideo = this.videoStart = this.videoStop = this.dataStart = this.getData = this.dataClick = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            return e.success && e.success(),
                t.data
        },
            window.tt ? this.tt() : window.swan ? this.swan() : window.qg ? qg.getSystemInfoSync().COREVersion ? this.oppo() : this.vivo() : window.uc ? this.uc() : window.qq ? this.qq() : window.wx ? this.wx() : window.h5api ? this.w4399() : cc.sys.OS_ANDROID === cc.sys.os ? this.apk() : (this.OS = "unknown", cc.log("未知平台")), t.data = {
                adId: 0,
                clickBtnTxt: "",
                creativeType: 0,
                desc: "活动真实有效",
                icon: "http://www.tttal.com/202003102005332541500.png",
                imgUrlList: {
                    0: "http://www.tttal.com/055e69c6-9a28-4185-b73c-f7b4000c2e02.jpg"
                },
                interactionType: 2,
                logoUrl: "",
                title: "恭喜收到奖励红包"
            })
    },
    mode: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
            t = this;
        switch (this.bannerShow = this.bannerHide = this.imageShow = this.videoPlay = this.shareText = this.shareVideo = this.videoStart = this.videoStop = this.dataStart = this.getData = this.dataClick = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            return e.success && e.success(),
                t.data
        },
        e) {
            case 1:
                break;
            case 2:
                this.videoPlay = function () {
                    switch (this.OS) {
                        case "vivo_rpk":
                            window.qg && qg.showToast({
                                message: "暂无广告"
                            })
                    }
                }
        }
    },
    getConfig: function (e, t) {
        return this.config[e][t]
    },
    w4399: function () {
        this.OS = "4399",
            this.w4399CanPlay = function (e) {
                e.canPlayAd && e.remain ? this.w4399AdShow = !0 : this.w4399AdShow = !1
            }.bind(this),
            h5api.canPlayAd(this.w4399CanPlay),
            this.videoPlay = function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                confirm("确认观看视频获取奖励吗？") && h5api.playAd(function (t) {
                    1e4 === t.code ? console.log("开始播放") : 10001 === t.code ? (e.success && e.success(), h5api.canPlayAd(this.w4399CanPlay)) : console.log("广告异常")
                }.bind(this))
            }.bind(this)
    },
    uc: function (e) {
        function t() {
            return e.apply(this, arguments)
        }
        return t.toString = function () {
            return e.toString()
        },
            t
    }(function () {
        var e = this;
        e.OS = "uc",
            e.videoPlay = function () {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                e.rewardVideoAd = uc.createRewardVideoAd(),
                    e.rewardVideoAd.show().then().
                        catch(function (e) {
                            return console.log(e)
                        }),
                    e.rewardVideoAd.onError(function (e) {
                        t.error && t.error()
                    }),
                    e.rewardVideoAd.onClose(function (e) {
                        e && e.isEnded ? t.success && t.success() : t.fail && t.fail(),
                            t.complete && t.complete()
                    })
            }
    }),
    qq: function (e) {
        function t() {
            return e.apply(this, arguments)
        }
        return t.toString = function () {
            return e.toString()
        },
            t
    }(function () {
        var e = this;
        e.toDesk = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            qq.saveAppToDesktop({
                success: function () {
                    e.success && e.success()
                },
                fail: function () {
                    e.fail && e.fail()
                },
                complete: function () {
                    e.complete && e.complete()
                }
            })
        },
            e.box = qq.createAppBox({
                adUnitId: e.getConfig("qq", "box_id")
            }),
            e.gameBox = function () {
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                e.box.load(),
                    e.box.show()
            },
            e.video_ad = qq.createRewardedVideoAd({
                adUnitId: e.getConfig("qq", "video_id")
            }),
            e.videoPlay = function (t) {
                e.video_ad.show().then(function () {
                    e.adAction = function (n) {
                        n.isEnded ? t.success && t.success() : t.fail && t.fail(),
                            t.complete && t.complete(),
                            e.video_ad.offClose(e.adAction)
                    },
                        e.video_ad.onClose(e.adAction)
                }).
                    catch(function (t) {
                        e.video_ad.load().then(function () {
                            showAd()
                        })
                    });
                var n = function (e) {
                    t.error && t.error()
                };
                e.video_ad.offError(n),
                    e.video_ad.onError(n)
            },
            e.banner_ad = qq.createBannerAd({
                adUnitId: e.getConfig("qq", "banner_id"),
                style: {
                    width: 300,
                    left: (window.innerWidth - 300) / 2,
                    top: window.innerHeight - 80
                }
            }),
            e.banner_resize = !1,
            e.banner_ad.onLoad(function () {
                e.banner_ad.onResize(function (t) {
                    0 == e.banner_resize && (e.banner_ad.style.left = (window.innerWidth - t.width) / 2, e.banner_ad.style.top = window.innerHeight - t.height, e.banner_resize = !0)
                }),
                    e.banner_ad.show(),
                    e.bannerShow = function () {
                        e.banner_ad.show()
                    },
                    e.bannerHide = function () {
                        e.banner_ad.hide()
                    }
            }),
            e.imageShow = function () {
                e.interstitial_ad = qq.createInterstitialAd({
                    adUnitId: e.getConfig("qq", "image_id")
                }),
                    e.interstitial_ad.onLoad(function () {
                        e.interstitial_ad.show()
                    }),
                    e.interstitial_ad.load()
            },
            e.shareText = function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                qq.shareAppMessage({
                    title: e.title,
                    imageUrl: e.imageUrl,
                    success: function () {
                        console.log("success"),
                            e.success && e.success(),
                            e.complete && e.complete()
                    },
                    fail: function (t) {
                        e.fail && e.fail(),
                            e.complete && e.complete()
                    }
                })
            },
            e.getData = function () {
                return !1
            },
            e.OS = "qq"
    }),
    oppo: function () {
        var e = this;
        e.OS = "vivo_rpk",
            cc.log("vivo_rpk平台"),
            e.rewardedVideoAd = qg.createRewardedVideoAd({
                posId: e.getConfig("vivo_rpk", "video_id")
            }),
            e.videoPlay = function () {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                e.rewardedVideoLock && (qg.showToast({
                    title: "暂无视频,请稍后再试"
                }), t.error && t.error()),
                    e.rewardedVideoLock = !0,
                    e.scheduleOnce(function () {
                        e.rewardedVideoLock = !1
                    },
                        10),
                    e.rewardedVideoAdonLoad = !1,
                    e.rewardedVideoAd.offLoad(),
                    e.rewardedVideoAd.onLoad(function (n) {
                        t.mute && t.mute(),
                            e.rewardedVideoAdonLoad = !0,
                            e.rewardedVideoAd.show()
                    }),
                    e.rewardedVideoAd.onError(function (n) {
                        e.rewardedVideoAdonLoad && t.unmute && t.unmute(),
                            t.error && t.error(),
                            qg.showToast({
                                title: "暂无视频,请稍后再试"
                            })
                    }),
                    e.rewardedVideoAd.offClose(),
                    e.rewardedVideoAd.onClose(function (n) {
                        e.rewardedVideoAdonLoad && t.unmute && t.unmute(),
                            n.isEnded ? t.success && t.success() : t.fail && t.fail(),
                            t.complete && t.complete()
                    }),
                    e.rewardedVideoAd.load().
                        catch(function (n) {
                            console.error(n),
                                e.rewardedVideoAdonLoad && t.unmute && t.unmute(),
                                qg.showToast({
                                    title: "暂无视频,请稍后再试"
                                })
                        })
            },
            e.scheduleOnce(function () {
                e.bannerAd = qg.createBannerAd({
                    posId: e.getConfig("oppo_rpk", "banner_id"),
                    style: {}
                }),
                    e.bannerLock = !0,
                    e.scheduleOnce(function () {
                        e.bannerLock = !1
                    },
                        11),
                    e.bannerAd.show() && e.bannerAd.show().then(function () { }).
                        catch(function (e) {
                            console.error(e)
                        }),
                    e.bannerShow = function () {
                        e.bannerLock || (e.bannerLock = !0, e.scheduleOnce(function () {
                            e.bannerLock = !1
                        },
                            11), e.bannerAd.show())
                    },
                    e.bannerHide = function () {
                        e.bannerAd.hide()
                    }
            },
                2),
            e.imageShow = function () {
                try {
                    e.interstitialAd = qg.createInterstitialAd({
                        posId: e.getConfig("oppo_rpk", "image_id")
                    });
                    var t = e.interstitialAd.show();
                    t && t.then(function () { }).
                        catch(function (e) {
                            console.error(e)
                        })
                } catch (n) {
                    e.interstitialAd = qg.createInsertAd({
                        posId: e.getConfig("oppo_rpk", "image_id")
                    });
                    var t = e.interstitialAd.show();
                    t && t.then(function () { }).
                        catch(function (e) {
                            console.error(e)
                        })
                }
            },
            e.automatic = function () {
                e.nativeAd = qg.createNativeAd({
                    posId: e.getConfig("vivo_rpk", "native_id")
                }),
                    e.nativeAd.onLoad(function (t) {
                        t && (e.data = t.adList[0])
                    }),
                    e.scheduleOnce(function () {
                        e.nativeAd.load()
                    },
                        1),
                    e.nativeAd.onError(function (e) {
                        console.error(e)
                    })
            },
            e.dataClick = function () {
                e.nativeAd.reportAdShow({
                    adId: e.getData().adId
                }),
                    e.scheduleOnce(function () {
                        e.nativeAd.reportAdClick({
                            adId: e.getData().adId
                        })
                    },
                        1)
            },
            e.schedule(function () {
                e.automatic()
            },
                10, 999, 1),
            e.data = 0,
            e.getData = function () {
                return !!e.data && e.data
            }
    },
    vivo: function () {
        var e = this;
        e.OS = "vivo_rpk",
            cc.log("vivo_rpk平台"),
            e.rewardedVideoAd = qg.createRewardedVideoAd({
                posId: e.getConfig("vivo_rpk", "video_id")
            }),
            e.videoPlay = function () {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                e.rewardedVideoLock && (qg.showToast({
                    message: "暂无视频,请稍后再试"
                }), t.error && t.error()),
                    e.rewardedVideoLock = !0,
                    e.scheduleOnce(function () {
                        e.rewardedVideoLock = !1
                    },
                        10),
                    e.rewardedVideoAdonLoad = !1,
                    e.rewardedVideoAd.offLoad(),
                    e.rewardedVideoAd.onLoad(function (n) {
                        t.mute && t.mute(),
                            e.rewardedVideoAdonLoad = !0,
                            e.rewardedVideoAd.show()
                    }),
                    e.rewardedVideoAd.onError(function (n) {
                        e.rewardedVideoAdonLoad && t.unmute && t.unmute(),
                            t.error && t.error(),
                            qg.showToast({
                                message: "暂无视频,请稍后再试"
                            })
                    }),
                    e.rewardedVideoAd.offClose(),
                    e.rewardedVideoAd.onClose(function (n) {
                        e.rewardedVideoAdonLoad && t.unmute && t.unmute(),
                            n.isEnded ? t.success && t.success() : t.fail && t.fail(),
                            t.complete && t.complete()
                    }),
                    e.rewardedVideoAd.load().
                        catch(function (n) {
                            console.error(n),
                                e.rewardedVideoAdonLoad && t.unmute && t.unmute(),
                                qg.showToast({
                                    message: "暂无视频,请稍后再试"
                                })
                        })
            },
            e.bannerAd = qg.createBannerAd({
                posId: e.getConfig("vivo_rpk", "banner_id"),
                style: {}
            }),
            e.bannerLock = !0,
            e.scheduleOnce(function () {
                e.bannerLock = !1
            },
                11),
            e.bannerAd.show() && e.bannerAd.show().then(function () { }).
                catch(function (e) {
                    console.error(e)
                }),
            e.bannerShow = function () {
                e.bannerLock || (e.bannerLock = !0, e.scheduleOnce(function () {
                    e.bannerLock = !1
                },
                    11), e.bannerAd.show())
            },
            e.bannerHide = function () {
                e.bannerAd.hide()
            },
            e.imageShow = function () {
                e.interstitialAd = qg.createInterstitialAd({
                    posId: e.getConfig("vivo_rpk", "image_id")
                });
                var t = e.interstitialAd.show();
                t && t.then(function () { }).
                    catch(function (e) {
                        console.error(e)
                    })
            },
            e.automatic = function () {
                e.nativeAd = qg.createNativeAd({
                    posId: e.getConfig("vivo_rpk", "native_id")
                }),
                    e.nativeAd.onLoad(function (t) {
                        t && (e.data = t.adList[0])
                    }),
                    e.scheduleOnce(function () {
                        e.nativeAd.load()
                    },
                        1),
                    e.nativeAd.onError(function (e) {
                        console.error(e)
                    })
            },
            e.dataClick = function () {
                e.nativeAd.reportAdShow({
                    adId: e.getData().adId
                }),
                    e.scheduleOnce(function () {
                        e.nativeAd.reportAdClick({
                            adId: e.getData().adId
                        })
                    },
                        1)
            },
            e.schedule(function () {
                e.automatic()
            },
                10, 999, 1),
            e.data = 0,
            e.getData = function () {
                return !!e.data && e.data
            }
    },
    tt: function (e) {
        function t() {
            return e.apply(this, arguments)
        }
        return t.toString = function () {
            return e.toString()
        },
            t
    }(function () {
        var e = this;
        e.OS = "tt",
            cc.log("tt平台"),
            e.rewardedVideoAd = tt.createRewardedVideoAd({
                adUnitId: e.getConfig("tt", "video_id")
            }),
            e.videoPlay = function () {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                e.rewardedVideoAd.show().then(function () {
                    e.listener = function (n) {
                        n.isEnded ? (e.rewardedVideoAd.offClose(e.listener), t.success && t.success()) : (tt.showToast({
                            title: "观看完整视频才能获得奖励",
                            icon: "fail",
                            duration: 2e3
                        }), e.rewardedVideoAd.offClose(e.listener), t.fail && t.fail()),
                            t.complete && t.complete()
                    },
                        e.rewardedVideoAd.onClose(e.listener)
                }).
                    catch(function (e) {
                        tt.showToast({
                            title: "暂无视频广告",
                            icon: "fail",
                            duration: 2e3
                        })
                    })
            },
            e.bannerAd = tt.createBannerAd({
                adUnitId: e.getConfig("tt", "banner_id"),
                style: {
                    width: 128,
                    top: window.innerHeight - 72
                }
            }),
            e.bannerAd.onResize(function (t) {
                e.bannerAd.style.top = window.innerHeight - t.height,
                    e.bannerAd.style.left = (window.innerWidth - t.width) / 2
            }),
            e.bannerShow = function () {
                e.bannerAd.show()
            },
            e.bannerHide = function () {
                e.bannerAd.hide()
            },
            e.shareText = function () {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                tt.shareAppMessage({
                    templateId: e.getConfig("tt", "share_id"),
                    success: function () {
                        t.success && t.success(),
                            t.complete && t.complete()
                    },
                    fail: function (e) {
                        t.fail && t.fail(),
                            t.complete && t.complete()
                    }
                })
            },
            e.r = tt.getGameRecorderManager(),
            e.r.onStop(function (t) {
                e.recorderUrl = t.videoPath
            }),
            e.videoStart = function () {
                e.r.start({
                    duration: 300
                })
            },
            e.videoStop = function () {
                e.r.stop()
            },
            e.shareVideo = function () {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                tt.shareAppMessage({
                    channel: "video",
                    templateId: e.getConfig("tt", "share_id"),
                    extra: {
                        videoPath: e.recorderUrl
                    },
                    success: function (e) {
                        t.success && t.success(),
                            t.complete && t.complete()
                    },
                    fail: function (e) {
                        - 1 != e.errMsg.indexOf("short") && tt.showToast({
                            title: "分享失败：录屏时长低于 3 秒",
                            icon: "fail",
                            duration: 2e3
                        }),
                        t.fail && t.fail(),
                        t.complete && t.complete()
                    }
                })
            },
            e.imageShow = function () {
                if (!tt.createInterstitialAd) return void console.error("tt.createInterstitialAd在过低版本的客户端无法使用(cc.ad.imageShow();)");
                e.interstitialAd = tt.createInterstitialAd({
                    adUnitId: e.getConfig("tt", "image_id")
                }),
                    e.interstitialAd.load().then(function () {
                        e.interstitialAd.show()
                    }).
                        catch(function (e) {
                            console.log(e)
                        })
            },
            e.getData = function () {
                return !1
            }
    })
});