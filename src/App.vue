<template>
  <div >
    <!-- ta có thể thêm style="background-color: aqua;" vào thẻ breeding-rhombus-spinner-->
    <template :class="{loading:true, hide:!isLoading, show:isLoading}">
      <breeding-rhombus-spinner class="loading-component" :animation-duration="2000" :size="65" color="#06C755"  />
      <div id="titleLoading">
        <i class="fa-brands fa-line"></i> LINE Bot - Support LINE OA
      </div>
    </template>
    <template id="appMain" :class="{hide:isLoading, show:!isLoading}">
      <router-view></router-view>
      <CommonNotification></CommonNotification>
    </template>
  </div>
</template>
<script>

import CommonNotification from '@/components/common/CommonNotification'
import { BreedingRhombusSpinner } from 'epic-spinners';
import useEventBus from '@/composables/useEventBus'
const { onEvent } = useEventBus()

export default {
  name: 'App',
  components: {
    CommonNotification,
    BreedingRhombusSpinner
  },
  setup() {
    document.title = "LINE Bot - Support LINE OA";
  },
  data() {
    return {
      isLoading: false,
    }
  },
  mounted() {
    onEvent('eventLoading',(isLoading)=>{
      this.isLoading = isLoading;
    })
  },
  watch:{

  }
  // async mounted() {
  //   await new Promise((r) => setTimeout(r, 10000));
  //   this.loading = true;
  // },
}
</script>
<!-- Giải thích không được dùng v-if và v-else đối với ẩn hiện loading 
  Trong mounted() của các component con , khi mà cho isLoading true và false dẫn đến sẽ cho v-if làm cho 
  <template id="appMain" :class="{hide:isLoading, show:!isLoading}">
    <router-view></router-view>
    <CommonNotification></CommonNotification>
  </template>

  xóa đi khỏi DOM nếu isLoading là true và render ra lại nếu là fase 
  => khi render ra lại thì vô tình nó cũng làm cho các component con nằm trong nó render ra lại và khi render ra lại 
  thì các component con đó lại mounted() dẫn đến vòng lặp  
  => dùng bind class cũng được 
-->
<style >

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
}

body {
  background-color: #F0F2F5 !important;
}

/* color default */
:root {
  --user-color: #06C755;
  --admin-color: #06C755;
  --blue-color: #007BFF;
  --brown-color: #8B4513;
  --yellow-color: #c0b01d;
  /* --admin-color: #096a31; */
}
/* color default */


::-webkit-scrollbar {
  width: 13px;
}

::-webkit-scrollbar-track {
  background: white;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
  border: 3px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--user-color);
  border-radius: 10px;
  border: 3px solid transparent;
  background-clip: content-box;
}

#view {
  display: grid;
  width: 100%;
  overflow-y: scroll;
}

#view::-webkit-scrollbar {
  display: none;
}

#view {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */

.modal-open .modal {
  background-color: #0000008a;
}

.btn {
  outline: none;
}

button {
  outline: none !important;
}

.loading-component {
  margin: auto;
  margin-top: 300px;
}

#titleLoading {
  margin-top: 25px;
  text-align: center;
  font-weight: bold;
  color: var(--user-color);
}

/* animation */
#titleLoading {
  animation: titleLoading 2s linear infinite;
}

@keyframes titleLoading {
  50% {
    opacity: 0;
  }
}
/* animation */

.hide {
  display: none;
}

.show {
  display: block;
}



/*  */
.btn-pers {
	position: relative;
	left: 50%;
	padding: 1em 2.5em;
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 2.5px;
	font-weight: 700;
	color: #000;
	background-color: #fff;
	border: none;
	border-radius: 45px;
	box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease 0s;
	cursor: pointer;
	outline: none;
	transform: translateX(-50%);
}

.btn-pers:hover {
	background-color: var(--user-color);
	box-shadow: 0px 15px 20px #80ffb5;
	color: #fff;
	transform: translate(-50%, -7px);
}

.btn-pers:active {
	transform: translate(-50%, -1px);
}
/*  */


</style>
