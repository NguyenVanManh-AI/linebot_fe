<template>
    <div>
        InformationChannel
    </div>
</template>

<script>
import useEventBus from '@/composables/useEventBus'
const { emitEvent } = useEventBus();

export default {
    name: "InformationChannel",
    props: {

    },
    setup() {
        document.title = "Information Channel | LINE Bot";
    },
    data() {

    },
    mounted() {
        emitEvent('eventTitleHeader', 'Information Channel');
    },
    components: {

    },
    computed: {

    },
    methods: {

    },
    watch: {

    },
}
</script>

<style scoped>
</style>