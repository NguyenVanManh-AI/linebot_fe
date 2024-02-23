<template>
    <div>
        <div>
            <UserSidebar></UserSidebar>
        </div>
        <div class="rightBar">
            <CommonHeader></CommonHeader>
            <div class="innerContent">
                <router-view></router-view>
            </div>
            <!-- <CommonFooter></CommonFooter> -->
        </div>
    </div>
</template>
<script>

import UserSidebar from '@/components/user/user-components/UserSidebar.vue'
// import CommonFooter from '@/components/common/CommonFooter.vue'
import CommonHeader from '@/components/common/CommonHeader.vue'
// import useEventBus from '@/composables/useEventBus'
// const { onEvent } = useEventBus()

export default {
    name: "UserMain",
    mounted(){
        
    },
    data() {
      return {

    };
    },
    components: {
        UserSidebar,
        // CommonFooter,
        CommonHeader,
    },
    methods: {
        
    },

}
</script>
<style scoped>
.rightBar {
    transition: width 0.5s ease;
    min-height: 100vh;
    /* padding: 6px; */
}

.innerContent {
    border-radius: 4px;
    margin: 6px 10px;
    background-color: white;
    padding: 10px;
    margin-top: 16px;
}

.innerContent > div {
    box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;
    border-radius: 4px;
    padding: 10px 15px;
    padding-bottom: 20px;
    background-color: white;
}

</style>