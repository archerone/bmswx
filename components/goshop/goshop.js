// components/goshop/goshop.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses:['my-class'],
  properties: {
     testdata:{
       type:Array,
       value:[],
       observer:function(newVal,oldVal){

       }
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
      ontap(){
        const myEventDetail = {"a":"gaa"};
        const myEventOption = {bubbles:true,composed:true};
        this.triggerEvent('myevent',myEventDetail,myEventOption)
      },
      comevent(e){
         console.log("goo",e.detail);
      },
  },
  lifetimes: {
      attached(){  //组件实例进入页面

      },
      detached(){

      }
  },
  pageLifetimes: {
      show(){  //页面被展示

      },
      hide(){},
      resize(size){}

  }
})
