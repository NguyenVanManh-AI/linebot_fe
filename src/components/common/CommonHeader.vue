<template>
    <div id="header">
        <div class="title">
          <span><i class="fa-brands fa-line"></i> LINE Bot</span><span>/</span><span v-html="title"></span>
        </div>
        <div id="contact">
            <li class="list_contact">
              <a class="facebook" href="https://www.facebook.com/IcassNiuTon" target="_blank" ><i class="fa-brands fa-square-facebook"></i></a>
              <a class="instagram" href="https://www.instagram.com/vanmanh_ai_machine_learning/" target="_blank" ><i class="fa-brands fa-square-instagram"></i></a>
              <a class="linkedin" href="https://www.linkedin.com/in/nvmanhfullstack/" target="_blank" ><i class="fa-brands fa-linkedin"></i></a>
            </li>
            <li class="contact_email"><a href="mailto:linebot.support@gmail.com" ><i class="fa-solid fa-envelope"></i> Email: linebot.support@gmail.com</a></li>
            <li class="contact_phone"><a href="tel:+84702518919" ><i class="fa-solid fa-phone"></i> Hotline 24/7 Phone: +84702518919</a></li>
            <li class="contact_help"><a href="#"><i class="fa-regular fa-circle-question"></i> Help </a></li>
        </div>
    </div>
</template>
<script>

import useEventBus from '@/composables/useEventBus';
const { onEvent } = useEventBus()

export default {
    name: "CommonHeader",
    components: {
    },
    data(){
      return{
        title:'LINE Bot - Support LINE OA',
      }
    },
    created () {
    },
    unmounted () {
    },
    mounted(){
      onEvent('eventTitleHeader',(title)=>{
        this.title = title;
      });
    },
    methods: {
      
    },
}
</script>

<style scoped>
#header {
  position: sticky;
  top: 6px;
  margin: 0px 10px;
  position: sticky;
  border: 2px solid var(--user-color);
  background-color: white;
  padding: 2px 6px;
  display: flex;
  align-items: center;
  align-content: center;
  border-radius: 4px;
  padding-right: 30px;
  z-index: 1; /* fix class bootstrap col đè lên header */
}

.title {
  width: 40%;
  font-weight: bold;
}
.title span:nth-child(1) {
  color: var(--user-color);
}
.title span:nth-child(2) {
  margin: 0px 6px;
}

.title span:nth-child(3) {
  color: rgb(80, 80, 80);
}

#contact a {
  transition: all 0.5s ease;
  text-decoration: none;
}

#contact a:hover {
  text-decoration: none;
  transition: all 0.5s ease;
}

#contact {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: flex-end;
  color: black;
  line-height: 30%;
  align-content: center;
  align-items: center;
}
#contact li {
  margin-left: 30px;
}

.contact_email, .contact_phone, .contact_help {
  color: rgb(112, 112, 112);
}

.contact_email a:hover {
  cursor: pointer;
  color: red;
}
.contact_phone a:hover {
  cursor: pointer;
  color: #0186ce;
}
.contact_help a:hover {
  cursor: pointer;
  color: green;
}

.list_contact a {
  font-size: 24px;
  margin-left: 6px;
  color: rgb(112, 112, 112);
}


.facebook:hover {
  color: #0863F7;
}
.instagram:hover {
  color: #E56D37;
}
.linkedin:hover {
  color: #0073B1;
}

</style>
