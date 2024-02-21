<template>
    <div>
        StatisticalChannel
    </div>
</template>

<script>
// import UserRequest from '@/restful/UserRequest';
import useEventBus from '@/composables/useEventBus'
const { emitEvent } = useEventBus();

export default {
    name: "StatisticalChannel",
    props: {

    },
    data() {

    },
    setup() {
        document.title = "Statistical Channel | LINE Bot";
    },
    mounted() {
        this.checkManager();
        emitEvent('eventTitleHeader', 'Statistical Channel');
    },
    components: {

    },
    computed: {

    },
    methods: {
        checkManager: function() {
            var user = JSON.parse(localStorage.getItem('user'));
            if(user.role != 'manager') this.$router.push({ name: 'AccountSetting' });
        },
    },
    watch: {

    },
}
</script>

<style scoped>
</style>