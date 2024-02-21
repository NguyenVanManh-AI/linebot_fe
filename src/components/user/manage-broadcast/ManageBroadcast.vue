<template>
    <div>
        ManageBroadcast {{ dateTime }}
        <form action="">
            <VueDatePicker class="col-3" v-model="dateTime" required></VueDatePicker>
            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script>
import useEventBus from '@/composables/useEventBus'
const { emitEvent } = useEventBus();

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { formatDate } from '@/helper.js';

export default {
    name: "ManageBroadcast",
    props: {

    },
    setup() {
        document.title = "Manage Broadcast | LINE Bot";
    },
    data() {
        return {
            dateTime: new Date().toISOString(),
        }
    },
    mounted() {
        emitEvent('eventTitleHeader', 'Manage Broadcast');
    },
    components: {
        VueDatePicker
    },
    methods: {

    },
    watch: {
        dateTime: function(newDateTime) {
            if (newDateTime) {
                const date = new Date();
                const formattedDate = formatDate(date);
                console.log(formattedDate); // Kết quả sẽ là chuỗi định dạng "YYYY-MM-DD HH:mm:ss"
            }
        }
    },
}
</script>


<style scoped>
</style>