<template>
  <a-modal v-model="show" title="评价信息" @cancel="onClose" :width="800">
    <template slot="footer">
      <a-button key="back" @click="onClose" type="danger">
        关闭
      </a-button>
    </template>
    <div style="font-size: 13px;font-family: SimHei" v-if="evaluationData !== null">
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">评价信息</span></a-col>
        <a-col :span="12"><b>分数：</b>
          <a-rate :value="evaluationData.score" disabled/>
        </a-col>
        <a-col :span="12"><b>评价时间：</b>
          {{ evaluationData.evaluationDate }}
        </a-col>
        <br/>
        <br/>
        <a-col :span="24"><b>评价内容：</b>
          {{ evaluationData.evaluationContent }}
        </a-col>
      </a-row>
      <br/>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">订单信息</span></a-col>
        <a-col :span="8"><b>订单编号：</b>
          {{ evaluationData.code }}
        </a-col>
        <a-col :span="8"><b>下单时间：</b>
          {{ evaluationData.createDate }}
        </a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="8"><b>购买人：</b>
          <a-popover>
            <template slot="content">
              <a-avatar shape="square" size={132} icon="user" :src="evaluationData.avatar" />
            </template>
            <a>{{ evaluationData.userName }}</a>
          </a-popover>
        </a-col>
        <a-col :span="8"><b>收货人：</b>
          {{ evaluationData.userName }}
        </a-col>
        <a-col :span="8"><b>联系方式：</b>
          {{ evaluationData.phone }}
        </a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="24"><b>收货地址：</b>
          {{ evaluationData.address }}
        </a-col>
      </a-row>
      <br/>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">餐品信息 - </span>
          <span style="font-size: 13px;color: #aaaaaa">
            <a-popover>
              <template slot="content">
                <a-avatar shape="square" size={132} icon="user" :src="evaluationData.shopAvatar" />
              </template>
              {{ evaluationData.shopName }}的小店
            </a-popover>
          </span>
        </a-col>
        <a-col :span="8"><b>餐品编号：</b>
          {{ evaluationData.commodityCode }}
        </a-col>
        <a-col :span="8"><b>餐品名称：</b>
          <a-tooltip>
            <template slot="title">
              {{ evaluationData.name }}
            </template>
            {{ evaluationData.name.slice(0, 7) }}...
          </a-tooltip>
        </a-col>
        <a-col :span="8"><b>餐品类型：</b>
          {{ evaluationData.typeName }}
        </a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="8"><b>餐品价格：</b>
          ￥{{ evaluationData.price }}
        </a-col>
        <a-col :span="8"><b>上架状态：</b>
          <a-tag v-if="evaluationData.onPut == 0" color="red">下架中</a-tag>
          <a-tag v-if="evaluationData.onPut == 1" color="green">上架中</a-tag>
        </a-col>
      </a-row>
      <br/>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">餐品介绍</span></a-col>
        <a-col :span="24">
          {{ evaluationData.content !== null ? evaluationData.content : '- -' }}
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
  name: 'EvaluationView',
  props: {
    evaluationShow: {
      type: Boolean,
      default: false
    },
    evaluationData: {
      type: Object
    }
  },
  computed: {
    show: {
      get: function () {
        return this.evaluationShow
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
      replyList: []
    }
  },
  watch: {
    evaluationShow: function (value) {
      if (value && this.evaluationData.images !== null && this.evaluationData.images !== '') {
        this.imagesInit(this.evaluationData.images)
      }
      // this.dataInit()
    }
  },
  methods: {
    dataInit () {
      this.$get('/cos/evaluation-info/reply', {evaluationId: this.evaluationData.id}).then((r) => {
        let replyList = []
        r.data.data.forEach(item => {
          replyList.push({author: item.userName, avatar: item.avatar, content: item.content, datetime: moment(item.createDate)})
        })
        this.replyList = replyList
        console.log(JSON.stringify(this.replyList))
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
