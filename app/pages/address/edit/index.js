const app = getApp();
let http = require('../../../utils/request')
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		hidden: true,
		region: ['重庆市', '重庆市', '江北区'],
		name: '',
		phone: '',
		address: '',
		latitude: '',
		longitude: '',
		lnglat: '',
		defaultAddress: 1,
		addressId: 0,
	},
	onLoad: function (option) {
		this.setData({ addressId: option.addressId })
		this.getAddressInfo(option.addressId)
	},
	getAddressInfo(addressId) {
		http.get('addressInfoById', { addressId }).then((r) => {
			this.setData({
				name: r.data.name,
				address: r.data.address,
				phone: r.data.phone,
				defaultAddress: r.data.defaultAddress,
				latitude: r.data.latitude,
				longitude: r.data.longitude,
				lnglat: r.data.longitude + ', ' + r.data.latitude
			})
		})
	},
	delete() {
		let that = this
		wx.showModal({
			title: '提示',
			content: '确定要删除吗？',
			success: function (sm) {
				if (sm.confirm) {
					http.get('address/delete', { addressId: that.data.addressId }).then((r) => {
						wx.showToast({
							title: '删除成功',
							icon: 'success',
							duration: 2000
						})
						setTimeout(() => {
							wx.redirectTo({
								url: '/pages/user/address/index'
							});
						}, 1000)
					})
				} else if (sm.cancel) {
					console.log('取消')
				}
			}
		})
	},
	getLnglatValue() {
		const _this = this;
		wx.chooseLocation({
			success(res) {
				_this.setData({
					latitude: res.latitude,
					longitude: res.longitude,
					lnglat: res.longitude + ', ' + res.latitude
				})
			},
			fail(e) {
				console.log(e);
			}
		})
	},
	edit() {
		if (!this.data.latitude || !this.data.longitude) {
			wx.showToast({
				title: '请填写完成',
				icon: 'none',
				duration: 2000
			})
			return false
		}
		wx.getStorage({
			key: 'userInfo',
			success: (res) => {
				let data = { name: this.data.name, phone: this.data.phone, address: this.data.address, defaultAddress: this.data.defaultAddress, userId: res.data.id, id: this.data.addressId, longitude: this.data.longitude, latitude: this.data.latitude }
				this.addressEdit(data)
			},
			fail: res => {
				wx.showToast({
					title: '请先进行登录',
					icon: 'none',
					duration: 2000
				})
			}
		})
	},
	getNameValue(e) {
		this.setData({ name: e.detail.value })
	},
	getAddressValue(e) {
		this.setData({ address: e.detail.value })
	},
	getPhoneValue(e) {
		this.setData({ phone: e.detail.value })
	},
	addressEdit(address) {
		http.post('addressEdit', address).then((r) => {
			wx.showToast({
				title: '修改成功',
				icon: 'success',
				duration: 2000
			})
			setTimeout(() => {
				wx.redirectTo({
					url: '/pages/user/address/index'
				});
			}, 1000)
		})
	},
	switch1Change(event) {
		let defaultAddress = event.detail.value ? 1 : 0
		this.setData({ defaultAddress })
	}
});
