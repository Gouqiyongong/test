<template>
  <div class="detail-container">
    <!--顶部Tab-->
    <Header ref="detail_header_bar" :tabs="tabList" :show="showHeaderTab" :infoId="infoId"
            :selectedTabIndex="selectedTabIndex" :followAccount="attentionOpenTobToolStatus"
            :eventHub="eventHub"></Header>

    <!--商品基础信息区-->
    <GoodsInfo
      :swipeImgs="swipeImgs"
      :imgVideoList="imgVideoList"
      :auctionPrice="auctionPrice"
      :goodsInfo="goodsInfo"
      :eventHub="eventHub" :serviceItems="serviceItems"
      :countdownText.sync="countdownText" :countdownTime.sync="countdownTime"
      :auctionStatus="auctionStatus" :auctionSuccess="auctionSuccess"
      :videoList="videoList" :infos="autionInfo"
      :certPath="certPath"
      :isSpuGoods="isSpuGoods"
      :isAuctionGood.sync="isAuctionGood"
      v-on:reUpdateAuction="getAuctionInfo"
    ></GoodsInfo>

    <!-- 优惠券 -->
    <DetailCoupon v-if="infoId" :mUid="uid" :infoId="infoId" :isAuctionGood="isAuctionGood"></DetailCoupon>

    <!--商品服务信息-->
    <CateService :antiqueServiceList="antiqueServiceList" :serviceItems="serviceItems" :infoId="infoId"></CateService>
    <SpuSwing v-if="reStructureSpu&&isSpuSwingShow" :infoId="infoId" :isSpuGoods="isSpuGoods" :eventHub="eventHub"
              :defSpuGoods="defSpuGoods" :spuPanelShow.sync="isSpuPanelShow"></SpuSwing>

    <!-- 推荐直播 -->
    <RecommendLive v-if="recommendLiveBar" :recommendLive="recommendLiveBar" :infoId="infoId"></RecommendLive>

    <!--拍卖信息区-->
    <AuctionInfo
      v-if="isAuctionGood" :auctionPrice.sync="auctionPrice" :confirmAlert.sync="confirmAlert"
      :ifGoodsSelf="ifGoodsSelf"
      :infoId="infoId" :metric="metric" :totalCount="totalCount" :watchCount="watchCount" :infos="autionInfo"
      :eventHub="eventHub" :auctionStatus="auctionStatus" :btnStatus="btnStatus"
      :btnCopyWriting="btnCopyWriting" :isAuctionGood.sync="isAuctionGood"
      :againEntry="againEntry"></AuctionInfo>
    <!--&lt;!&ndash;店铺宝贝区&ndash;&gt;-->
    <ShopInfo v-if="userInfo" ref="shopPos"
              :attentionOpenTobToolStatus="attentionOpenTobToolStatus" :mUid="uid" :infoId="infoId"
              :source="'yiGeInfoDetail'"
              isCommon="isCommon" :refType="refType" :eventHub="eventHub" showVisit="1"
              :hasPlatFormRedPackage="hasPlatFormRedPackage" :isYiGeProduct="isYiGeProduct"
              :followAmount="followAmount" :userInfo="userInfo" :isPlanIdExists="isPlanIdExists"
              :isSettleMerchant="isSettleMerchant"></ShopInfo>
    <!-- 商品详情 -->
    <BaseGoodInfo ref="baseGoodInfo" v-if="imgVideoList.length>0" :enterTimeCount="enterTimeCount"
                  :imgList="swipeImgs" :imgVideoList="imgVideoList" :videoList="videoList"
                  :eventHub="eventHub" :goodsInfo="goodsInfo"></BaseGoodInfo>
    <!--鉴定证书-->
    <CertCard :certPath="certPath"></CertCard>
    <!--拍卖说明，如果以后有复杂修改可抽离成组件-->
    <div v-if="isAuctionGood" ref="goods_auction_description"
        class="auctionTip" @click="eventHub.$emit('showAucTipDialog')">
      <p class="tip-title">拍卖说明</p>
      <img src="./asset/arrow.png" class="arrow" alt=""/>
      <div class="tipBg"></div>
    </div>
    <!--商品推荐-->
    <RecommendGoodsList v-if="!isSpuGoods" :infoId="infoId" :isCommon="isCommon" :eventHub="eventHub" positionId="3"
                        :infoUid="uid" :followAccount="attentionOpenTobToolStatus"
                        :paramValue="paramValue"></RecommendGoodsList>
    <!--底部按钮操作区-->
    <BtmInfo :ifGoodsSelf="ifGoodsSelf" :buyDilogShow.sync="buyDilogShow" :showQrcode.sync="showQrcode"
            :auctionStatus="auctionStatus" :eventHub="eventHub" :btnStatus.sync="btnStatus" :infoId="infoId"
            :autionInfo="autionInfo"
            :isAuctionGood="isAuctionGood"
            :goodsInfo="goodsInfo"
            :metric="metric"
            :userId="uid"
            :orderId="orderId"
            :confirmAlert.sync="confirmAlert"
            :isCommon="isCommon"
            :btnCopyWriting="btnCopyWriting"
            :detailFrom="detailFrom"
            :isSpuGoods="isSpuGoods"
            :attentionOpenTobToolStatus="attentionOpenTobToolStatus"
    ></BtmInfo>

    <!--toast-->
    <Alert :options="confirmAlert"></Alert>
    <!--二维码-->
    <AccountsQrcode :eventHub="eventHub" :showQrcode.sync="showQrcode"></AccountsQrcode>
    <!--出价弹窗-->
    <BuyDialog :eventHub="eventHub" :increment="bidIncrement" :currentPrice="nowPrice"
              :followAccount="attentionOpenTobToolStatus"
              :infoId="infoId" :countdownTime="countdownTime"
              :nowPrice.sync="auctionPrice" :totalCount.sync="totalCount"
              :buyDilogShow.sync="buyDilogShow" :confirmAlert.sync="confirmAlert"
              :autionInfo="autionInfo"
              :metric="metric"
              :detailFrom="detailFrom"
              :firstOffer="firstOffer"
    ></BuyDialog>
    <!-- 分享弹窗 -->
    <shareDialog v-if="showShareDialog" :nowPrice.sync="goodsPrice"
                :destUrl="destUrl" :defaultContent="defaultContent"
                :defaultImages="swipeImgs" :infoId="infoId"
                :eventBus="eventHub" :pageRoute="detailUrl"
                from="shareEarnCredit-detail">
    </shareDialog>
    <!--详情页底部按钮-->
    <foot-tab :tabVisible="false" :notifyVisible="true"></foot-tab>
    <!--BackTop-->
    <BackTop></BackTop>
    <!--引导弹层-->
    <DetailGuide v-if="isAuctionGood&&isPayNewUser&&isSelfGoodsStrict===0"
                :locationBase="auctionDescription"></DetailGuide>
    <!--拍卖规则-->
    <AuctionRule v-if="isAuctionGood" :eventHub="eventHub"></AuctionRule>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator'

    import FriendsClickEarnCredit from '@/model/tobtoollogic/friendsClickEarnCredit.js'
    import GetOrderIdByInfoIdAndUid from '@/model/tobtoollogic/getOrderIdByInfoIdAndUid.js'
    import GetLastOfferPrice from '@/model/tobtoollogic/getLastOfferPrice.js'
    import IsDepositPaySuccess from '@/model/transfer/isDepositPaySuccess.js'
    import GetOriInfoDetail from '@/model/tobtoollogic/getOriInfoDetail.js'
    import GetServicesByInfoId from '@/model/tobtoollogic/getServicesByInfoId.js'
    import IsPayNewUser from '@/model/tobtoollogic/isPayNewUser.js'
    import GetMerchantDetail from "@/model/tobtoollogic/getMerchantDetail.js";
    import GetRecommendLiveBar from "@/model/tobvideo/getRecommendLiveByInfoId.js";
    import GetSpuParamBySpuId from "@/model/tobtoollogic/getSpuParam.js";

    import Share from '@/libs/share.js'
    import isZZ from '@/libs/isZhuanzhuan.js';
    import ZZAPP from '@zz-vc/zz-open-libs/lib/libs/adapter'
    import cookie from '@zz-vc/zz-open-libs/lib/libs/cookie'
    import Cookies from '@zz-vc/zz-open-libs/lib/libs/cookie'
    import {Alert} from "@zz-vc/zz-open-ui";
    import {setTitle} from '@zz-vc/zz-open-libs/lib/libs/decorator';
    import toRealPx from '@zz-vc/zz-open-libs/lib/libs/toRealPx'
    import {bindEvent, unbindEvent} from '@/libs/throttleEvent.js'

    const qs = require('querystring');
    let enterTimes = 1, clientHeight = 0;
    let eventHandler;

    Vue.use(Share);
    @Component({
        provide() {
            return {
                infoId: this.infoId
            }
        },
        components: {
            Alert,
            BaseUserInfo: require('@/components/Detail/components/BaseUserInfo.vue'),
            GoodsInfo: require('@/components/Detail/components/GoodsInfoV2.vue'),
            BuyDialog: require('@/components/Detail/components/BuyDialog.vue'),
            AccountsQrcode: require('@/components/Detail/components/AccountsQrcode.vue'),
            BtmInfo: require('@/components/Detail/components/BtmInfo.vue'),
            BaseGoodInfo: require('@/components/Detail/components/BaseGoodInfo.vue'),
            Header: require('@/components/Detail/components/Header.vue'),
            ShopInfo: require('@/components/Detail/components/ShopInfo.vue'),
            shareDialog: require('@/components/common/SharePanel/Index.vue'),
            BackTop: require('@/components/common/BackTop.vue'),
            RecommendGoodsList: require('@/components/Detail/components/RecommandGoodsList.vue'),
            AuctionInfo: require('@/components/Detail/components/AuctionInfo.vue'),
            DetailGuide: require('@/components/Detail/components/DetailGuide.vue'),
            AuctionGuide: require('@/components/Detail/components/AuctionGuide.vue'),
            AuctionRule: require('@/components/Detail/components/AuctionRuleV2.vue'),
            FootTab: require('@/components/common/FootTab/FootTab.vue'),
            CateService: require('@/components/Detail/components/CateService.vue'),
            CertCard: require('@/components/Detail/components/CertCard.vue'),
            DetailCoupon: require('@/components/Detail/components/DetailCoupon.vue'),
            RecommendLive: require('@/components/Detail/components/RecommendLiveV2.vue'),
            SpuSwing: require('@/components/Detail/components/SpuSwing.vue')
        }
    })
    export default class GoodsDetail extends Vue {
        refType="detail";
        eventHub:Vue = new Vue();
        swipeImgs: string[] = [];//轮播图片
        userInfo: any = {};//部分用户信息
        goodsInfo: any = {};//部分商品信息
        // infoId:string = '';//商品Id
        metric: string = '';
        autionInfo: any = null;//部分拍卖信息
        countdownText: string = '';//倒计时文案
        countdownTime: string = '';//剩余时间
        auctionStatus: string = '';//商品拍卖状态0-未开始，1-已开始，2-已结束
        userStatus: string = '';//用户拍卖状态，0-未交保证金，1-已交保证金
        auctionSuccess: string = '';//0流拍，1已排出
        bidIncrement: string = '';//加价幅度
        nowPrice: string = '';//起拍价
        totalCount: string = '';//出价记录总数
        watchCount: string = '';//围观数
        showQrcode: boolean = false;
        attentionStatus: string = '';//是否关注商家 关注用户状态，-1:本人 1：已关注，2：未关注
        bookingAutionNotifyStatus: string = '';//是否预约提醒 预约商品提醒状态， 1：已预约，2：未预约
        attentionOpenTobToolStatus: string = '';//是否关注公众号 关注公众号状态， 1：已关注，2：未关注
        btnStatus: string = '';//底部按钮状态
        zzfrom: string = '';//分享来源
        uid: string = '';//商品所属的uid
        cateId: string = '';//商品所属的uid
        buyDilogShow: boolean = false;//出价弹窗判断
        securityDeposit: string = '';
        auctionPrice: string = '';
        isAuctionGood: boolean = false;
        videoList: any = [];
        imgVideoList: Array<any> = [];
        hasPlatFormRedPackage: number = 0;
        isSettleMerchant: boolean = true; //默认是旗舰版商家属性，非入驻返回的服务保障为空，免费版根据searchable == 52来判断
        isPlanIdExists: number = 0;
        enterTimeCount: number = 0;
        paramValue: number = 0;
        confirmAlert: object = {
            show: false,
            width: 560,
            height: 520,
            title: '拍卖须知',
            content: '1.该手机号已绑定其他转转账户，是否确认绑定为该账户\n2.该手机号已绑定其他转转账户，是否确认绑定\n3.为该账户该手机号已绑定其他转转账户，是否确认绑定为该账户',
            contentStyle: 'start',
            buttons: [
                {
                    name: '知道了',
                    click: () => {
                        this.confirmAlert['show'] = false
                    }
                }
            ]
        };
        tabList = [{name: '宝贝', scrollTop: 0}, {name: '店铺信息'}, {name: '详情'}];
        showHeaderTab: boolean = false;
        selectedTabIndex: number = 0;
        infoStatus: string = "0";
        orderId: string = "";
        btnCopyWriting: object = {};
        tabChanging: boolean = false;
        isYiGeProduct: boolean = false;
        isCommon = '0';
        againEntry = false;
        showShareDialog: boolean = false;
        destUrl: string = '';
        defaultContent: string = '';
        headerbarHeight: number = -1;
        busiSource: number = 0;
        followAmount: number = 0;
        serviceItems = [];
        certPath = '';
        detailSource: string = this.$getQuery('detailSource') || 'wenwan';//用来区分b端和c端，默认是文玩，B端的是c2c
        detailFrom: string = this.$getQuery('detailFrom') || '';//用来区分是那个活动专场来的
        private lastCurrentTop: number = 0;
        firstOffer: number = 1;
        isAndroid: boolean = false;
        isSelfGoodsStrict: number = -1;//是否是自己的商品 -1：未知状态，0：不是自己商品，1：自己商品
        private isPayNewUser: boolean = false;//新用户定义：频道未支付用户
        auctionDescription: HTMLElement = null;
        antiqueServiceList: Array<object> = [];
        recommendLiveBar: any = null;
        liveStatus: number | string;//当前商品对应的卖家直播状态：1-预播，2-直播中
        isSpuGoods = false;//是否是spu商品
        isSkuGoods = false;//是否是spu商品
        defSpuGoods: any = null;//spu商品信息
        isSpuPanelShow = false;//spu商品面板是否展示

        get goodsPrice() {
            return this.goodsInfo ? this.goodsInfo['nowPrice'] + '' : 0
        }

        get ifGoodsSelf() {
            let myUid = Cookies.getUID();
            return myUid == this.uid;
        }

        get infoId() {//skuId和infoId处理目前相同
            if (this.$route.path == '/detail' || this.$route.path == '/detail/') {
                let infoId = this.$route.query.infoId;
                if (!infoId) {
                    infoId = this.$getQuery('infoId');
                }
                if (Array.isArray(infoId) && infoId.length > 0) {
                    infoId = infoId[infoId.length - 1];
                }
                if (!infoId) {
                    let skuId = this.$route.query.skuId;
                    if (!skuId) {
                        skuId = this.$getQuery('skuId');
                    }
                    if (Array.isArray(skuId) && skuId.length > 0) {
                        skuId = skuId[skuId.length - 1];
                    }
                    return skuId;
                }
                return infoId
            }
        }

        get spuId() {
            if (this.$route.path == '/detail' || this.$route.path == '/detail/') {
                let spuId = this.$route.query.spuId;
                if (!spuId) {
                    spuId = this.$getQuery('spuId');
                }
                if (Array.isArray(spuId) && spuId.length > 0) {
                    spuId = spuId[spuId.length - 1];
                }
                return spuId
            }
        }

        get detailUrl() {
            return `https://m.zhuanzhuan.com/open/ZZAntiqueTool/index.html?infoId=${this.infoId}&metric=${this.metric}&isCommon=${this.isCommon}#/detail`
        }


        @Watch('infoId', {immediate: true})
        updateInfo(newVal) {
            const map = new Map(Object.entries(this.$route.query));
            if (newVal) {
                this.isSpuGoods = false;
                this.initData()
            } else if (this.spuId) {
                this.isSpuGoods = true;
                this.initSpuData()
            }
        }

        beforeRouteEnter(to, from, next: (vm) => void): void {
            next((vm) => {
                vm.isSpuPanelShow = false;
                // console.log("beforeRouteEnter >>>>> to.path =" + to.path + ", from.path = " + from.path);
                if (from.path == '/' && sessionStorage.getItem(vm.$getQuery('infoId')) == '1') {
                    sessionStorage.setItem(vm.$getQuery('infoId'), '0');
                }
                if (from.path == '/' && sessionStorage.getItem(vm.$getQuery('spuId')) == '1') {
                    sessionStorage.setItem(vm.$getQuery('spuId'), '0');
                }
                // 通知子组件
                vm.eventHub.$emit('eventRouteEnter');
            })
        }

        beforeRouteUpdate(to, from, next) {
            // console.log("beforeRouteUpdate >>>>> to.path =" + to.path + ", from.path = " + from.path);
            // just use `this`
            window.scrollTo(0, 0);
            next()
        }

        async pullData() {
            if (!this.uid) return;
            const res = await new GetMerchantDetail().fetch({
                mUid: this.uid
            });
            if (res.result.state === "success") {
                this.userInfo = res.result.data;
                this.isSettleMerchant = this.userInfo.isSettleMerchant;
                this.isPlanIdExists = this.userInfo.isPlanIdExists;
                this.hasPlatFormRedPackage = this.userInfo.hasPlatFormRedPackage;
                this.liveStatus = this.userInfo.liveStatus;
                this.followAmount = this.userInfo.followAmount;
                if (this.liveStatus != '2' && this.infoId) {
                    this.getRecommendLiveBar();
                } else {
                    this.recommendLiveBar = null;
                }
                if (this.zzfrom == 'bussiness' || this.zzfrom == 'toolbussiness') {
                    this.checkCredit();
                }
            }
        }

        async getRecommendLiveBar() {
            const res = await new GetRecommendLiveBar().fetch({
                infoId: this.infoId,
                positionid: '4',
            });
            if (res.result.state === "success") {
                const liveBar = res.result.data;
                if (liveBar && liveBar.liveStudioList && liveBar.liveStudioList.length > 0) {
                    this.recommendLiveBar = liveBar;
                } else {
                    this.recommendLiveBar = null;
                }
            } else {
                this.recommendLiveBar = null;
            }
        }

        get isSpuSwingShow() {
            return this.isSkuGoods || this.isSpuGoods;
        }

        private lastDetailSpuId = null;
        private reStructureSpu = true;

        reStructureSpuCheck(curr) {
            // console.log("reStructureSpuCheck =  curr = " + curr + ", lastDetailSpuId = " + this.lastDetailSpuId
            //     + ", eq = " + ((curr == this.lastDetailSpuId) || (!curr || !this.lastDetailSpuId)));
            if (curr == this.lastDetailSpuId) {
                return;
            }
            if (!curr || !this.lastDetailSpuId) {
                this.lastDetailSpuId = curr;
                return;
            }
            this.lastDetailSpuId = curr;
            this.reStructureSpu = false;
            this.$nextTick(() => {
                this.reStructureSpu = true;
            })
        }

        /**
         * 商品信息
         */
        async getGoodsInfo() {
            let request = new GetOriInfoDetail();

            let res = await request.fetch({infoId: this.infoId, metric: this.metric, repeatrequest: true});
            if (res.result.state == 'success') {
                this.uid = res.get('uid', '');
                this.cateId = res.get('cateId', '');
                let spuId = res.get('spuId', '');
                this.isSkuGoods = !!spuId;
                // 文玩自定义服务标签，如鉴定保
                this.antiqueServiceList = res.result.data.services;
                this.isSelfGoodsStrict = (this.uid && this.uid == Cookies.getUID()) ? 1 : 0;
                this.firstOffer = res.result.data.firstOffer;
                this.isYiGeProduct = res.result.data.isYiGeProduct;
                this.followAmount = res.result.data.followAmount;
                let goodsType = res.get('type', '');//type => 0:一口价 ，1：拍卖
                if (goodsType == 0) {
                    this.isAuctionGood = false;
                } else if (goodsType == 1) {
                    this.isAuctionGood = true;
                }

                let pics = (res.get('pics') || res.get('pic')).split('|').filter(it => it && it.length > 0);
                let converImgs = this.$handleImg.handleArray(pics, 1500, 1500);
                if (this.isAndroid) {
                    this.swipeImgs = converImgs.map(it => (it && /&t=|\?t=/gi.test(it)) ? it : it + '&t=5');
                } else {
                    this.swipeImgs = converImgs;
                }
                let list = res.result.data.videoList || [];
                if (list.length) {
                    this.videoList = list.map((v: any) => {
                        let picUrl = this.$handleImg.handleSingle(v.picUrl, 1500, 1500);
                        v.picUrl = picUrl.replace('t=5&', '');
                        return v
                    })
                }

                this.paramValue = res.get('paramValue', 0);
                this.goodsInfo = {
                    nowPrice: res.get('nowPrice') / 100,
                    title: res.get('title', ''),
                    content: res.get('desc', '').replace(/(^\s*)|(\s*$)/g, ''),
                    infoStatus: parseInt(res.get('infoStatus') || res.get('status')),
                    freight: res.get('freight') ? parseFloat(res.get('freight')) / 100 : 0,
                    oriPrice: parseFloat(res.get('oriPrice')) / 100,
                    orderId: res.get('orderId'),
                    busiSource: res.get('busiSource')
                };

                this.orderId = res.get('orderId');
                this.busiSource = res.get('busiSource') || 0;
                this.infoStatus = res.get('infoStatus') || res.get('status');

                if (this.infoStatus != '1') {
                    spuId = '';
                    this.isSkuGoods = false;
                }

                let watch = res.get('watchCount');
                if (watch) {
                    this.watchCount = watch + '';
                }
                this.initShare();
                if (!isZZ && this.attentionOpenTobToolStatus != '1' && cookie.get('uid') != this.uid) {//获取二维码
                    this.eventHub.$emit('getPubCode', this.uid);
                }
                this.eventHub.$emit('getUserInfo', this.uid)
                this.eventHub.$emit('showGoodsInfo', true)
                let isSettleMerchant = true;
                if (res.get('searchable') == 52) {//免费商家发的商品
                    isSettleMerchant = false;
                    this.isSettleMerchant = false;
                }
                let arr = this.swipeImgs.map((v) => {
                    if (!isSettleMerchant) {//免费商家发的商品
                        let index = v.indexOf('?wt=');
                        v = v.slice(0, index < 0 ? v.length : index);
                    }
                    return {picUrl: v}
                });
                this.imgVideoList = [...this.videoList, ...arr];


                //是否关注商家、公众号、预约提醒
                this.attentionStatus = res.get('attentionStatus').toString();
                this.bookingAutionNotifyStatus = res.get('bookingAutionNotifyStatus').toString();
                this.attentionOpenTobToolStatus = res.get('attentionOpenTobToolStatus').toString();
                if (this.attentionStatus != '1' && cookie.get('uid') != this.uid) {
                    this.$log('attentionShow')
                }

                //默认文案
                let copyWriting = res.get('btnCopyWriting');
                if (typeof copyWriting == 'object') {
                    this.btnCopyWriting = copyWriting;
                }

                this.reStructureSpuCheck(spuId);

            } else {
                ZZAPP.toast({"msg": res.result.error.errorMsg || '商品已下架'});
                setTimeout(() => {
                    this.$enterPage('/index', {
                        infoId: ''
                    }, 'replace')
                }, 1500)
            }
        }


        /**
         * 拍卖信息
         */
        getAuctionInfo() {
            this.$http.get('/zz/transfer/getAuctionInfoById', {
                infoId: this.infoId,
                reqUId: cookie.get('uid')
            }).then((res) => {
                if (parseInt(res.data.respCode) === 0) {
                    let data = res.data.respData;
                    this.totalCount = data.totalCount || '0';
                    this.securityDeposit = parseFloat(data.securityDeposit || '0').toString()
                    this.auctionPrice = data.nowPrice || '';
                    this.autionInfo = {
                        leastCustomer: data.leastCustomer || '1',
                        bidIncrement: data.bidIncrement || '10',
                        startPrice: data.startPrice || '100',
                        securityDeposit: data.securityDeposit || '0',
                        hasReservePrice: data.hasReservePrice || '0',
                        canDelay: data.canDelay || '0',
                        delayCycle: data.delayCycle || '10',//延迟时间，单位秒
                        delayTriggerTime: data.delayTriggerTime || '300'
                    };

                    this.countdownText = data.countdownText;

                    this.countdownTime = data.countdownTime;
                    this.auctionStatus = data.auctionStatus;
                    this.userStatus = data.userStatus;
                    this.auctionSuccess = data.auctionSuccess || '0';
                    this.nowPrice = data.nowPrice || data.startPrice;
                    this.bidIncrement = data.bidIncrement || '0';
                    let priceList = data.priceList || [];
                    this.eventHub.$emit('priceInfo', priceList)
                    this.handleBtnTxt(data.auctionStatus, data.countdownTime, data.userStatus, data.frontRunner, data.freeDeposit);
                    // this.handleBtnTxt(data.auctionStatus,data.countdownTime,data.userStatus,data.frontRunner);
                } else {
                    ZZAPP.toast({
                        "msg": res.result.error.errorMsg || res.data.errMsg
                    })
                }
            }).catch((error) => {
                console.error(error)
            })
        }

        /**
         * 设置底部按钮文案
         * @param auctionStatus 商品拍卖状态0-未开始，1-已开始，2-已结束
         * @param countdownTime
         * @param userStatus 用户拍卖状态，0-未交保证金，1-已交保证金
         * @param frontRunner 出价最高者uid
         */
        // handleBtnTxt(auctionStatus,countdownTime,userStatus,freeDeposit){
        // let btnStatus = '';//0-预约提醒，1-已预约，2-即将开拍，3-我要竞价，4-我要出价，5-拍卖结束
        // switch(parseInt(auctionStatus)){
        handleBtnTxt(auctionStatus, countdownTime, userStatus, frontRunner, freeDeposit) {
            let btnStatus = '';//0-预约提醒，1-已预约，2-即将开拍，3-我要竞价，4-我要出价，5-拍卖结束 6-竞拍成功 7-竞拍失败
            switch (parseInt(auctionStatus)) {
                case 0:
                    btnStatus = this.bookingAutionNotifyStatus === '1' ? '1' : (parseInt(countdownTime) > 1800000 ? '0' : '2');
                    break;
                case 1:
                    if (freeDeposit == 0) {
                        btnStatus = '4'
                    } else {
                        btnStatus = (userStatus === '0') ? '3' : '4';
                    }
                    break;
                case 2:
                    btnStatus = '5';
                    break;
                default:
                    btnStatus = '5'
            }
            if (btnStatus == '5') {//某些场景(直播)会默认都交保证金
                if (this.orderId) {
                    btnStatus = '6';
                    this.setBtnStatus(btnStatus);
                } else {
                    this.refreshUserStatus(btnStatus, frontRunner)
                }
            } else {
                this.setBtnStatus(btnStatus)
            }
        }


        //拍卖商品拍卖结束后，存在订单或是最大出价者这表明拍卖成功（出价格）,需要二次调用接口确认
        async refreshUserStatus(btnStatus, frontRunner) {
            let res = await (new GetLastOfferPrice()).fetch({infoId: this.infoId});
            if (res.result.state == 'success') {
                let offerPrice = 0;
                try {
                    offerPrice = res.result.data.offerPrice && parseInt(res.result.data.offerPrice);
                } catch (e) {
                }
                if (btnStatus == '5' && (offerPrice && offerPrice > 0)) {
                    if (this.orderId) {
                        btnStatus = '6';
                        this.setBtnStatus(btnStatus);
                    } else if (frontRunner && frontRunner !== cookie.get('uid')) {
                        this.setBtnStatus('7');
                    } else {
                        this.getOrderIdByInfoIdAndUid(frontRunner);
                    }
                } else {
                    this.setBtnStatus(btnStatus)
                }
            } else {
                this.setBtnStatus(btnStatus)
            }
        }

        async getOrderIdByInfoIdAndUid(frontRunner) {
            let res = await (new GetOrderIdByInfoIdAndUid()).fetch({infoId: this.infoId});
            if (res.result.state == 'success') {
                this.orderId = res.result.data.result;
                if (this.orderId || (frontRunner && frontRunner == cookie.get('uid'))) {
                    this.setBtnStatus('6');
                } else {
                    this.setBtnStatus('7');
                }
            } else {
                ZZAPP.toast({"msg": res.result.error.errorMsg || '网络异常，请重试'})
            }
        }

        /**
         * 设置底部按钮状态 0-预约提醒，1-已预约，2-即将开拍，3-我要竞价，4-我要出价，5-拍卖结束
         */
        setBtnStatus(status) {
            this.btnStatus = status;
        }

        /**
         * 设置弹窗内容
         */
        setConfirmAlert(obj) {
            this.confirmAlert = obj;
        }

        initShare() {
            let shareUrl = `https://m.zhuanzhuan.com/open/ZZAntiqueTool/index.html?needHideHead=1&${this.spuId ? `spuId=${this.spuId}` : `infoId=${this.infoId}`}&metric=${this.metric}&isCommon=${this.isCommon}#/index`;
            shareUrl = this.ifGoodsSelf ? shareUrl + '&shareFrom=toolbussiness' : shareUrl;
            let obj = {
                "title": '这么好的宝贝，不推荐给你，我心里过意不去',
                "content": this.goodsInfo.title + "  " + this.goodsInfo.content,
                "picPath": this.swipeImgs[0],
                "url": shareUrl,
                "logParam": '',
                "posterPicPath": 'https://img1.zhuanstatic.com/open/zhuanzhuan/zzwa/runningbear/detail/default.png',
                "panelType": 'onlyWeixin',
                "shareType": 'common',
                "needLogin": 0,
                "shareParam":
                    {
                        "isMiniApp": "1",
                        "miniAppTitle": '这么好的宝贝，不推荐给你，我心里过意不去',
                        "miniAppContent": this.goodsInfo.title + "  " + this.goodsInfo.content,
                        "miniAppId": "gh_c2980df66965",
                        "smallPicUrl": 'https://img1.zhuanstatic.com/open/zhuanzhuan/zzwa/runningbear/detail/default.png',
                        "miniPath": `pages/webview/bridge?url=${encodeURIComponent(shareUrl)}`,
                        "miniAppHeadPic": 'https://img1.zhuanstatic.com/open/zhuanzhuan/zzwa/runningbear/detail/default.png',
                        "miniAppNickName": '',
                        "miniAppCircleTitle": ''
                    }
            };
            this.destUrl = shareUrl
            this.defaultContent = this.goodsInfo.title + "  " + this.goodsInfo.content;

            this.$share(obj);
        }

        /**
         * 判断增加商家积分
         */
        async checkCredit() {
            let res = await (new FriendsClickEarnCredit()).fetch({
                productId: this.infoId,
                merchantUid: this.userInfo['uid']
            });
            if (res.result.state == 'success') {
            } else {
                ZZAPP.toast({"msg": res.result.error.errorMsg || '网络异常，请重试'})
            }
        }

        /**
         * 检测保证金是否支付成功（交易的坑，必须再次查下）
         */
        async isDepositPaySuccess() {
            let res = await (new IsDepositPaySuccess()).fetch({
                infoId: this.infoId
            });
            if (res.result.state == 'success') {
                if (res.result.data.isSuccess == 1) {
                    this.$log('depositSuc', 'Mdeposit', {infoId: this.infoId})
                    ZZAPP.toast({
                        msg: res.result.data.successMsg || '保证金支付成功'
                    })
                }
            }
        }

        deactivated() {
            this.isSkuGoods = false;
            this.isSpuGoods = false;
        }

        /**
         * 初始化数据
         * @return {[type]} [description]
         */
        async initData() {
            this.reset2Default();
            if (this.$getQuery('payDeposit')) {
                await this.isDepositPaySuccess();
            }
            await this.getGoodsInfo();
            this.pullData();
            if (this.isAuctionGood) {
                this.getAuctionInfo();
                this.checkPayNewUser();
            }

            this.eventHub.$emit('getRecommendInfoList');//拉取推荐商品
            //调起新接口，判断是否预约该商品的拍卖提醒、是否关注公众号、是否关注改商家
            this.eventHub.$on('setConfirmAlert', this.setConfirmAlert)
            this.againEntry = true;
            this.$log('view', void 0, {
                detailFrom: this.$getQuery('detailFrom'),
                infoId: this.infoId,
                isCommon: this.isCommon,
                sellerId: this.uid,
                busiSource: this.busiSource,
                detailSource: this.$getQuery('detailSource') || 'wenwan',
                metric: this.metric || '',
                paramValue: this.paramValue
            });
            if (this.isSettleMerchant) this.getGoodsService();
            this.auctionDescription = this.$refs.goods_auction_description as HTMLElement;
        }

        async initSpuData() {
            this.reset2Default();
            this.isAuctionGood = false;//spu商品非拍卖
            this.reStructureSpuCheck(this.spuId);
            let res = await new GetSpuParamBySpuId().fetch({
                spuId: this.spuId || 0,
            });
            if (res.result.state === "success") {
                this.defSpuGoods = res.result.data;
                this.uid = res.get('uid', '');
                this.goodsInfo = {
                    nowPrice: (res.get('minPrice') / 100) + '-' + (res.get('maxPrice') / 100),
                    title: res.get('title', ''),
                    content: res.get('content', '').replace(/(^\s*)|(\s*$)/g, ''),
                    infoStatus: 1,
                };
                let pics = (res.get('pics') || res.get('pic')).split('|').filter(it => it && it.length > 0);
                this.swipeImgs = this.$handleImg.handleArray(pics, 1500, 1500);
                let arr = this.swipeImgs.map((v) => {
                    return {picUrl: v}
                });
                this.imgVideoList = [...arr];
            }
            this.pullData();
            this.initShare();
            this.eventHub.$emit('getUserInfo', this.uid);
            this.eventHub.$emit('showGoodsInfo', true);
            this.eventHub.$emit('getRecommendInfoList');//拉取推荐商品
        }

        private reset2Default() {
            if (cookie.get('t') == 129) {
                cookie.set('t', "24", {path: "/", domain: ".zhuanzhuan.com"})
            }

            this.selectedTabIndex = 0;
            this.isSelfGoodsStrict = -1;
            this.videoList = [];
            this.imgVideoList = [];
            this.countdownTime = '';
            this.recommendLiveBar = null;
            this.swipeImgs = [];
            this.isCommon = this.$getQuery('isCommon') || '0';
            this.metric = this.$getQuery('metric');
            this.zzfrom = this.$getQuery('shareFrom') || this.$getQuery('fromShare');
            this.isAuctionGood = this.$getQuery('isCommon') != 1;
            this.recommendLiveBar = null;
            this.userInfo = null;
            this.certPath = '';
            this.serviceItems = [];
            this.defSpuGoods = null;
        }

        async getGoodsService() {
            let resp = await new GetServicesByInfoId().fetch({
                productId: this.infoId
            });
            if (resp.result.state == 'success') {
                let respData = resp.result.data;
                if (respData) {
                    this.certPath = respData.certificateUrl;
                    this.serviceItems = respData.serviceLabel || [];
                }
            }
        }

        goShop() {
            ZZAPP.skipToUrl({
                targetUrl: `https://m.zhuanzhuan.com/open/ZZAntiqueTool/index.html?mUid=${this.uid}#/shop`
            })
        }

        showShareBox() {
            this.showShareDialog = true;
        }

        changeShareDialog() {
            this.showShareDialog = false;
            this.eventHub.$emit('getRecommendInfoList');//拉取推荐商品
            //调起新接口，判断是否预约该商品的拍卖提醒、是否关注公众号、是否关注改商家
            this.eventHub.$on('setConfirmAlert', this.setConfirmAlert)
            this.againEntry = true;
            this.$log('view', void 0, {
                infoId: this.infoId,
                detailFrom: this.$getQuery('detailFrom') || '',
                isCommon: this.isCommon,
                sellerId: this.uid,
                busiSource: this.busiSource,
                metric: this.metric || ''
            });
        }

        updateTabChnage(index) {
            if (index == this.selectedTabIndex) return;
            this.tabChanging = true;
            this.selectedTabIndex = index;
            this.$log('headTabClick', 'detail', {index: index, isCommon: this.isCommon});
            this.updateHeaderHeight();

            if (index == 0) {
                window.scrollTo(0, 0)
            } else if (index == 1) {
                const shop: any = this.$refs.shopPos;
                let shopY = shop && shop.$el.offsetTop - this.headerbarHeight - 20;
                window.scrollTo(0, shopY);
            } else {
                const info: any = this.$refs.baseGoodInfo;
                let infoY = info && info.$el.offsetTop - this.headerbarHeight - 30;
                window.scrollTo(0, infoY)
            }
        }

        updateHeaderHeight() {
            if (this.headerbarHeight < 1) {
                let headerBar = this.$refs.detail_header_bar as any;
                if (headerBar) {
                    try {
                        this.headerbarHeight = parseInt(headerBar.$el.clientHeight);
                    } catch (e) {
                    }
                }
            }
        }

        @setTitle('商品详情')
        created() {
            const ua = navigator.userAgent.toLowerCase();
            this.isAndroid = ua.indexOf('android') > -1 || ua.indexOf('adr') > -1;
            this.bindVisibilitychangeEvent((res) => {
                if (res == 'visible') {
                    if (enterTimes++ >= 1) {
                        this.enterTimeCount = enterTimes;
                        if (sessionStorage.getItem('fromOrder') == '1') {
                            this.initData();
                            sessionStorage.setItem('fromOrder', '0');
                        }
                        this.againEntry = true;
                    }
                }
            });

        }

        mounted() {
            this.eventHub.$on('updateTab', this.updateTabChnage);
            this.eventHub.$on('goProfile', this.goShop);
            this.eventHub.$on('openShareDiaog', this.showShareBox);
            this.eventHub.$on('changeShareDialog', this.changeShareDialog);
            let px60 = toRealPx(60);
            eventHandler = bindEvent(document, 'scroll', () => {
                let currentTop = document.documentElement.scrollTop || document.body.scrollTop;
                if (Math.abs(currentTop - this.lastCurrentTop) > px60) {
                    this.eventHub.$emit('notifyElementScroll', {top: currentTop});
                    this.lastCurrentTop = currentTop;
                }
                if (this.tabChanging) return;
                this.updateHeaderHeight();
                const info: any = this.$refs.baseGoodInfo;
                let infoY = info && info.$el.offsetTop - this.headerbarHeight - 20;

                const shop: any = this.$refs.shopPos;
                let shopY = shop && shop.$el.offsetTop - this.headerbarHeight - 30;

                if (currentTop > 0 && currentTop < shopY) {
                    this.showHeaderTab = true;
                    this.selectedTabIndex = 0
                } else if (currentTop >= shopY && currentTop < infoY) {
                    this.showHeaderTab = true;
                    this.selectedTabIndex = 1
                } else if (currentTop >= infoY) {
                    this.showHeaderTab = true;
                    this.selectedTabIndex = 2
                } else {
                    this.showHeaderTab = false;
                }
            });
            this.$once('hook:beforeDestroy', () => {
                unbindEvent(document, 'scroll', eventHandler)
            });

            this.auctionDescription = this.$refs.goods_auction_description as HTMLElement;
        }

        /**
         * visibilitychange事件
         * @param callback
         */
        bindVisibilitychangeEvent(callback) {
            let hidden = "hidden";
            if (hidden in document)
                document.addEventListener("visibilitychange", onchange);
            else if ((hidden = "mozHidden") in document)
                document.addEventListener("mozvisibilitychange", onchange);
            else if ((hidden = "webkitHidden") in document)
                document.addEventListener("webkitvisibilitychange", onchange);
            else if ((hidden = "msHidden") in document)
                document.addEventListener("msvisibilitychange", onchange);
            // IE 9 and lower:
            else if ("onfocusin" in document)
                (document as any).onfocusin = (document as any).onfocusout = onchange;
            else
                window.onpageshow = window.onpagehide
                    = window.onfocus = window.onblur = onchange;

            function onchange(evt) {
                var result, v = "visible", h = "hidden",
                    evtMap = {
                        focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
                    };

                evt = evt || window.event;
                if (evt.type in evtMap)
                    result = evtMap[evt.type];
                else
                    result = this[hidden] ? "hidden" : "visible";
                try {
                    if (result == 'hidden' && this.$route.name != 'goodsDetail') {
                        if (hidden in document)
                            document.removeEventListener("visibilitychange", onchange);
                        else if ((hidden = "mozHidden") in document)
                            document.removeEventListener("mozvisibilitychange", onchange);
                        else if ((hidden = "webkitHidden") in document)
                            document.removeEventListener("webkitvisibilitychange", onchange);
                        else if ((hidden = "msHidden") in document)
                            document.removeEventListener("msvisibilitychange", onchange);
                        return;
                    }
                } catch (e) {
                    if (hidden in document)
                        document.removeEventListener("visibilitychange", onchange);
                    else if ((hidden = "mozHidden") in document)
                        document.removeEventListener("mozvisibilitychange", onchange);
                    else if ((hidden = "webkitHidden") in document)
                        document.removeEventListener("webkitvisibilitychange", onchange);
                    else if ((hidden = "msHidden") in document)
                        document.removeEventListener("msvisibilitychange", onchange);
                    return;
                }

                if (callback) callback(result)
            }
        }

        async checkPayNewUser() {
            let uid = Cookies.getUID();
            if (this.isAuctionGood && uid && localStorage.getItem('dt_auc_gd_' + uid) != '1') {
                let resp = await (new IsPayNewUser()).fetch();
                if (resp.result.state == 'success') {
                    this.isPayNewUser = String(resp.get('result') || '').toLowerCase() == 'true';
                }
            }
        }
    }
</script>

<style lang='less' scoped>
  @import '../common.less';

  .detail-container {
    background: white;
    /*position: fixed;*/
  }

  .showQrcode {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    z-index: 10001;

    .qrcode {
      position: absolute;
      top: 300px;
      left: 125px;
      width: 500px;
      height: 500px;
    }

    .closeQrcode {
      position: absolute;
      top: 830px;
      left: 339px;
      width: 72px;
      height: 72px;
    }
  }

  .blank-line {
    width: 100%;
    height: 1px;
  }

  .auctionTip {
    border-bottom: 24px solid #f8f8f8;
    padding-bottom: 40px;

    .tip-title {
      display: inline-block;
      font-family: PingFangSC-Medium, sans-serif;
      font-weight: 500;
      font-size: 36px;
      color: #2E3135;
      background: url("./asset/titleIcon.png") no-repeat left center;
      background-size: 8px 36px;
      padding-left: 15px;
      margin: 40px auto 48px 32px;
    }

    .arrow {
      float: right;
      margin-top: 47px;
      margin-right: 32px;
      width: 12px;
      height: 22px;
    }

    .tipBg {
      width: 597px;
      height: 132px;
      margin: 0 auto;
      background: url("./asset/intro.png") center;
      background-size: cover;
    }
  }
</style>
