<template>
  <a-drawer
    placement="right"
    width="100%"
    :closable="false"
    :visible="orderShow"
    destroyOnClose
    wrapClassName="aa"
    :getContainer="false"
  >
    <div style="width: 100%">
      <a-icon type="arrow-left" style="position: absolute;z-index: 999;color: red;font-size: 20px;margin: 15px" @click="home"/>
      <a-row style="height:100vh;font-family: SimHei">
        <a-col :span="15" style="height: 100%;">
          <div id="areas" style="width: 100%;height: 100%;box-shadow: 3px 3px 3px rgba(0, 0, 0, .2);background:#ec9e3c;color:#fff"></div>
        </a-col>
        <a-col :span="9" style="height: 100%;box-shadow: 3px 3px 3px rgba(0, 0, 0, .2);color:#fff">
          <div>
            <div class="scenicInfo" style="height: 100vh; overflow-y: auto;padding-left: 5px;overflow-x: hidden">
              <a-carousel autoplay style="height: 300px;" v-if="orderData.images !== undefined && orderData.images !== ''">
                <div style="width: 100%;height: 300px" v-for="(item, index) in orderData.images.split(',')" :key="index">
                  <img :src="'http://127.0.0.1:9527/imagesWeb/' + item" style="width: 100%;height: 100%">
                </div>
              </a-carousel>
              <a-card :title="orderData.shopName" :bordered="false">
              </a-card>
              <div style="font-size: 12px;font-family: SimHei;color: #404040;margin-top: 15px">
                <div style="font-size: 12px;font-family: SimHei" v-if="orderData !== null">
                  <a-row style="padding-left: 24px;padding-right: 24px;">
                    <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">订单信息</span></a-col>
                    <a-col :span="12"><b>订单编号：</b>
                      {{ orderData.code }}
                    </a-col>
                    <a-col :span="12"><b>下单时间：</b>
                      {{ orderData.createDate }}
                    </a-col>
                    <br/>
                    <br/>
                    <a-col :span="12"><b>订单状态：</b>
                      <span v-if="orderData.orderStatus == 0">正在支付</span>
                      <span v-if="orderData.orderStatus == 1">已完成</span>
                      <span v-if="orderData.orderStatus == 2">拼单失败</span>
                      <span v-if="orderData.orderStatus == 3">已收货</span>
                    </a-col>
                  </a-row>
                  <br/>
                  <a-row style="padding-left: 24px;padding-right: 24px;">
                    <a-col :span="12"><b>发起人：</b>
                      <a-popover>
                        <template slot="content">
                          <a-avatar shape="square" size={132} icon="user" :src="orderData.avatar" />
                        </template>
                        <a>{{ orderData.userName }}</a>
                      </a-popover>
                    </a-col>
                    <a-col :span="12"><b>收货人：</b>
                      {{ orderData.taskUserName }}
                    </a-col>
                    <br/>
                    <br/>
                    <a-col :span="12"><b>联系方式：</b>
                      {{ orderData.phone }}
                    </a-col>
                  </a-row>
                  <br/>
                  <a-row style="padding-left: 24px;padding-right: 24px;">
                    <a-col :span="24"><b>收货地址：</b>
                      {{ orderData.address }}
                    </a-col>
                  </a-row>
                  <br/>
                  <br/>
                  <a-row style="padding-left: 24px;padding-right: 24px;">
                    <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">用户信息</span>
                    </a-col>
                    <a-col :span="24" v-if="detailTemp.length !== 0">
                      <a-list item-layout="horizontal" :data-source="detailTemp">
                        <a-list-item slot="renderItem" slot-scope="item, index">
                          <a-list-item-meta :description="'创建时间：' + item.createDate">
                            <a slot="title">{{ item.userName }}</a>
                          </a-list-item-meta>
                        </a-list-item>
                      </a-list>
                    </a-col>
                  </a-row>
                  <br/>
                  <br/>
                  <a-row style="padding-left: 24px;padding-right: 24px;">
                    <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">餐品信息 - </span>
                      <span style="font-size: 13px;color: #aaaaaa">
                        <a-popover>
                          <template slot="content">
                            <a-avatar shape="square" size={132} icon="user" :src="'http://127.0.0.1:9527/imagesWeb/' + orderData.shopAvatar" />
                          </template>
                          {{ orderData.shopName }}的小店
                        </a-popover>
                      </span>
                    </a-col>
                    <a-col :span="12"><b>餐品编号：</b>
                      {{ orderData.commodityCode }}
                    </a-col>
                    <a-col :span="12"><b>餐品名称：</b>
                      <a-tooltip>
                        <template slot="title">
                          {{ orderData.name }}
                        </template>
                        {{ orderData.name.slice(0, 7) }}...
                      </a-tooltip>
                    </a-col>
                    <br/>
                    <br/>
                    <a-col :span="12"><b>餐品类型：</b>
                      {{ orderData.typeName }}
                    </a-col>
                  </a-row>
                  <br/>
                  <a-row style="padding-left: 24px;padding-right: 24px;">
                    <a-col :span="12"><b>价格：</b>
                      ￥{{ orderData.orderPrice }}
                    </a-col>
                    <a-col :span="12"><b>上架状态：</b>
                      <a-tag v-if="orderData.onPut == 0" color="red">下架中</a-tag>
                      <a-tag v-if="orderData.onPut == 1" color="green">上架中</a-tag>
                    </a-col>
                  </a-row>
                  <br/>
                  <br/>
                  <a-row style="padding-left: 24px;padding-right: 24px;">
                    <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">餐品介绍</span></a-col>
                    <a-col :span="24">
                      {{ orderData.content !== null ? orderData.content : '- -' }}
                    </a-col>
                    <br/>
                  </a-row>
                  <br/>
                  <br/>
                  <a-row style="padding-left: 24px;padding-right: 24px;">
                    <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">订单评价</span></a-col>
                    <a-col :span="24">
                      <a-list
                        class="comment-list"
                        :header="`${replyList.length} 回复`"
                        item-layout="horizontal"
                        :data-source="replyList"
                      >
                        <a-list-item slot="renderItem" slot-scope="item, index">
                          <a-comment :author="item.author" :avatar="item.avatar">
                            <template slot="actions">
                              <span v-for="(action, index) in item.actions" :key="index">{{ action }}</span>
                            </template>
                            <p slot="content" style="margin-left: -40px">
                              {{ item.content }}
                            </p>
                            <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                              <span>{{ item.datetime.fromNow() }}</span>
                            </a-tooltip>
                          </a-comment>
                        </a-list-item>
                      </a-list>
                    </a-col>
                  </a-row>
                  <br/>
                  <br/>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
import baiduMap from '@/utils/map/baiduMap'
import moment from 'moment'
export default {
  name: 'Map',
  props: {
    orderShow: {
      type: Boolean,
      default: false
    },
    orderData: {
      type: Object
    }
  },
  data () {
    return {
      userInfo: null,
      orderInfo: null,
      merchantInfo: null,
      orderItemInfo: [],
      addressInfo: null,
      staffInfo: null,
      evaluateInfo: null,
      staffList: [],
      communityRent: 0,
      rentShow: false,
      communityShow: false,
      communityData: null,
      checkedList: ['Apple', 'Orange'],
      indeterminate: true,
      checkAll: false,
      plainOptions: ['Apple', 'Pear', 'Orange'],
      visible: false,
      rentList: [],
      communityList: [],
      community: null,
      nowPoint: null,
      roadData: [],
      checkLoading: false,
      echartsShow: false,
      getShop: null,
      putShop: null,
      replyList: [],
      orderTemp: null,
      detailTemp: [],
      series: [{
        name: '得分',
        data: []
      }],
      chartOptions: {
        chart: {
          height: 380,
          type: 'radar'
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: ['交付得分', '价格得分', '质量得分', '准时得分', '服务得分', '综合得分']
        }
      }
    }
  },
  computed: {
    columns () {
      return [{
        title: '菜品名称',
        dataIndex: 'dishesName'
      }, {
        title: '图片',
        dataIndex: 'images',
        customRender: (text, record, index) => {
          if (!record.images) return <a-avatar shape="square" icon="user" />
          return <a-popover>
            <template slot="content">
              <a-avatar shape="square" size={132} icon="user" src={ 'http://127.0.0.1:9527/imagesWeb/' + record.images.split(',')[0] } />
            </template>
            <a-avatar shape="square" icon="user" src={ 'http://127.0.0.1:9527/imagesWeb/' + record.images.split(',')[0] } />
          </a-popover>
        }
      }, {
        title: '购买数量',
        dataIndex: 'amount'
      }, {
        title: '单价',
        dataIndex: 'unitPrice'
      }, {
        title: '总价格',
        dataIndex: 'totalPrice',
        customRender: (text, row, index) => {
          if (text !== null) {
            return text
          } else {
            return '- -'
          }
        }
      }]
    }
  },
  watch: {
    'orderShow': function (value) {
      if (value) {
        this.dataInit(this.orderData.code)
      }
    }
  },
  methods: {
    dataInit (orderCode) {
      this.$get(`/cos/order-info/order/detail/${orderCode}`).then((r) => {
        this.orderTemp = r.data.order
        this.detailTemp = r.data.detail
        setTimeout(() => {
          baiduMap.initMap('areas')
          this.getLocal()
          if (r.data.address && r.data.shop) {
            this.navigation(r.data.address, r.data.shop)
          }
        }, 200)
      })
      this.$get('/cos/evaluation/getEvaluationByOrderId', {id: this.orderData.id}).then((r) => {
        let replyList = []
        r.data.data.forEach(item => {
          replyList.push({author: item.userName, avatar: item.avatar, content: item.content, datetime: moment(item.createDate)})
        })
        this.replyList = replyList
      })
    },
    navigation (address, merchant) {
      baiduMap.clearOverlays()
      baiduMap.rMap().enableScrollWheelZoom(true)
      // eslint-disable-next-line no-undef
      let driving = new BMap.DrivingRoute(baiduMap.rMap(), {renderOptions: {map: baiduMap.rMap(), autoViewport: true}})
      // eslint-disable-next-line no-undef
      driving.search(new BMap.Point(merchant.longitude, merchant.latitude), new BMap.Point(address.longitude, address.latitude))
      // this.getRoadData(address, merchant)
    },
    getRoadData (address, merchant) {
      let options = {
        onSearchComplete: results => {
          // eslint-disable-next-line eqeqeq,no-undef
          if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
            // 获取第一条方案
            let plan = results.getPlan(0)
            // 获取方案的驾车线路
            // eslint-disable-next-line no-unused-vars
            let route = plan.getRoute(0)
            // 获取每个关键步骤,并输出到页面
            let s = []
            for (let j = 0; j < plan.getNumRoutes(); j++) {
              let route = plan.getRoute(j)
              for (let i = 0; i < route.getNumSteps(); i++) {
                let step = route.getStep(i)
                s.push((i + 1) + '. ' + step.getDescription())
              }
            }
            this.roadData = s
          }
        }
      }
      // eslint-disable-next-line no-undef
      let driving = new BMap.DrivingRoute(baiduMap.rMap(), options)
      // eslint-disable-next-line no-undef
      let start = new BMap.Point(this.nowPoint.lng, this.nowPoint.lat)
      let end = null
      if (this.rentShow) {
        end = new BMap.Point(this.rentData.longitude, this.rentData.latitude)
      } else {
        end = new BMap.Point(this.communityData.longitude, this.communityData.latitude)
      }
      // eslint-disable-next-line no-undef
      driving.search(start, end)
    },
    checkEvaluate (score) {
      let data = [score.deliverScore, score.priceScore, score.qualityScore, score.scheduleScore, score.serviceScore, score.overScore, 100]
      this.series[0].data = data
    },
    home () {
      this.$emit('close')
    },
    gisOnChange (e) {
      let data = null
      switch (e.target.value) {
        case '1':
          data = this.getShop
          break
        case '2':
          data = this.putShop
          break
      }
      baiduMap.rMap().enableScrollWheelZoom(true)
      // eslint-disable-next-line no-undef
      let driving = new BMap.DrivingRoute(baiduMap.rMap(), {renderOptions: {map: baiduMap.rMap(), autoViewport: true}})
      // eslint-disable-next-line no-undef
      driving.search(new BMap.Point(this.nowPoint.lng, this.nowPoint.lat), new BMap.Point(data.longitude, data.latitude))
    },
    getLocal () {
      // eslint-disable-next-line no-undef
      let geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(r => {
        this.nowPoint = r.point
      }, {enableHighAccuracy: true})
    }
  }
}
</script>

<style scoped>
  >>> .ant-drawer-body {
    padding: 0 !important;
  }
  >>> .ant-card-meta-title {
    font-size: 13px;
    font-family: SimHei;
  }
  >>> .ant-card-meta-description {
    font-size: 13px;
    font-family: SimHei;
  }
  >>> .ant-divider-with-text-left {
    margin: 0;
  }

  >>> .ant-card-head-title {
    font-size: 13px;
    font-family: SimHei;
  }
  >>> .ant-card-extra {
    font-size: 13px;
    font-family: SimHei;
  }
  >>> .ant-radio-button-wrapper {
    border-radius: 0;
  }
</style>
