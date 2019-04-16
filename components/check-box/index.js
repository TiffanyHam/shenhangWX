// components/check-box/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    label: String,
    color: String,
    checked: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    /* 选择复选框 */
    selectCheckBox: function (e) {
      this.setData({
        checked: !this.data.checked
      });
      var details = {
        checked: this.data.checked
      };
      this.triggerEvent('change', details, {});
    },

    /* 选中（外部调用） */
    select: function (status) {
      this.setData({
        checked: status
      });
    },

  }
})
