<template>
  <a-modal v-model="show" title="订单详情" @cancel="onClose" :width="1000">
    <template slot="footer">
      <a-button key="back" @click="onClose" type="danger">
        关闭
      </a-button>
    </template>
    <div style="font-size: 12px;font-family: SimHei" v-if="orderData !== null">
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">订单信息</span></a-col>
        <a-col :span="8"><b>订单编号：</b>
          {{ orderData.code }}
        </a-col>
        <a-col :span="8"><b>下单时间：</b>
          {{ orderData.createDate }}
        </a-col>
        <a-col :span="8"><b>订单状态：</b>
          <span v-if="orderData.orderStatus == 0">正在支付</span>
          <span v-if="orderData.orderStatus == 1">已完成</span>
          <span v-if="orderData.orderStatus == 2">拼单失败</span>
          <span v-if="orderData.orderStatus == 3">已收货</span>
        </a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="8"><b>发起人：</b>
          <a-popover>
            <template slot="content">
              <a-avatar shape="square" size={132} icon="user" :src="orderData.avatar" />
            </template>
            <a>{{ orderData.userName }}</a>
          </a-popover>
        </a-col>
        <a-col :span="8"><b>收货人：</b>
          {{ orderData.taskUserName }}
        </a-col>
        <a-col :span="8"><b>联系方式：</b>
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
        <a-col :span="8"><b>餐品编号：</b>
          {{ orderData.commodityCode }}
        </a-col>
        <a-col :span="8"><b>餐品名称：</b>
          <a-tooltip>
            <template slot="title">
              {{ orderData.name }}
            </template>
            {{ orderData.name.slice(0, 7) }}...
          </a-tooltip>
        </a-col>
        <a-col :span="8"><b>餐品类型：</b>
          {{ orderData.typeName }}
        </a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="8"><b>价格：</b>
          ￥{{ orderData.orderPrice }}
        </a-col>
        <a-col :span="8"><b>上架状态：</b>
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
        <br/>
        <br/>
        <a-col :span="24">
          <a-upload
            name="avatar"
            action="http://127.0.0.1:9527/file/fileUpload/"
            list-type="picture-card"
            disabled
            :file-list="fileList"
            @preview="handlePreview"
            @change="picHandleChange"
          >
<!--            <div v-if="fileList.length < 8">-->
<!--              <a-icon type="plus" />-->
<!--              <div class="ant-upload-text">-->
<!--                Upload-->
<!--              </div>-->
<!--            </div>-->
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-col>
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
  </a-modal>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  name: 'orderView',
  props: {
    orderShow: {
      type: Boolean,
      default: false
    },
    orderData: {
      type: Object
    }
  },
  computed: {
    show: {
      get: function () {
        return this.orderShow
      },
      set: function () {
      }
    }
  },
  data () {
    return {
      loading: false,
      fileList: [],
      previewVisible: false,
      previewImage: '',
      replyList: [],
      orderTemp: null,
      detailTemp: []
    }
  },
  watch: {
    orderShow: function (value) {
      if (value && this.orderData.images !== null && this.orderData.images !== '') {
        this.imagesInit(this.orderData.images)
      }
      this.dataInit(this.orderData.code)
    }
  },
  methods: {
    dataInit (orderCode) {
      this.$get(`/cos/order-info/order/detail/${orderCode}`).then((r) => {
        this.orderTemp = r.data.order
        this.detailTemp = r.data.detail
      })
      this.$get('/cos/evaluation/getEvaluationByOrderId', {id: this.orderData.id}).then((r) => {
        let replyList = []
        r.data.data.forEach(item => {
          replyList.push({author: item.userName, avatar: item.avatar, content: item.content, datetime: moment(item.createDate)})
        })
        this.replyList = replyList
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    picHandleChange ({ fileList }) {
      this.fileList = fileList
    },
    imagesInit (images) {
      if (images !== null && images !== '') {
        let imageList = []
        images.split(',').forEach((image, index) => {
          imageList.push({uid: index, name: image, status: 'done', url: 'http://127.0.0.1:9527/imagesWeb/' + image})
        })
        this.fileList = imageList
      }
    },
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
