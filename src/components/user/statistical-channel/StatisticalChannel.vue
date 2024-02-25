<template>
    <div id="main">
        <div>
            <h3 class="titleChannel"><i class="fa-solid fa-chart-pie"></i> Statistical Channel </h3>
            <div class="p-2">
                <div class="row">
                    <div class="col-2">
                        <div class="label_date"><i class="fa-solid fa-calendar-day"></i> Start Date</div>
                        <div><input v-model="start_date" type="date" required format="YYYY MM DD" class="form-control">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="label_date"><i class="fa-solid fa-calendar-day"></i> End Date</div>
                        <div><input v-model="end_date" type="date" required format="YYYY MM DD" class="form-control"></div>
                    </div>
                    <div class="col-3">
                        <div class="label_date"><i class="fa-solid fa-chart-simple"></i> Type Chart</div>
                        <div>
                            <select v-model="typeChart" class="form-control" id="exampleFormControlSelect1">
                                <option value="bar">Bar Chart</option>
                                <option value="line">Line Chart</option>
                                <option value="radar">Radar Chart</option>
                                bubble
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <BarChart :typeChart=typeChart></BarChart>
                </div>
                <div class="col-12 shadow">
                    <DoughnutChart :typeChart=typeChart></DoughnutChart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserRequest from '@/restful/UserRequest';
import useEventBus from '@/composables/useEventBus'
const { emitEvent } = useEventBus();
import BarChart from '@/components/user/statistical-channel/BarChart.vue'
import DoughnutChart from '@/components/user/statistical-channel/DoughnutChart.vue'

export default {
    name: "StatisticalChannel",
    setup() {
        document.title = "Statistical Channel | LINE Bot";
    },
    props: {

    },
    components: {
        BarChart,
        DoughnutChart
    },
    data() {
        return {
            start_date: null,
            end_date: null,
            dataChannel: null,
            typeChart: 'bar',
        }
    },
    mounted() {
        this.checkManager();
        emitEvent('eventTitleHeader', 'Statistical Channel');
        const queryString = window.location.search;
        const searchParams = new URLSearchParams(queryString);
        this.start_date = searchParams.get('start_date') || ""; // null 
        this.end_date = searchParams.get('end_date') || ""; // như thế này thì lên api có nghĩ là null
        this.getDataChannel();
    },
    computed: {

    },
    methods: {
        checkManager: function () {
            var user = JSON.parse(localStorage.getItem('user'));
            if (user.role != 'manager') this.$router.push({ name: 'AccountSetting' });
        },
        getDataChannel: async function () {
            this.isLoading = true;
            this.query = '?start_date=' + this.start_date + '&end_date=' + this.end_date;
            window.history.pushState({}, null, this.query);
            try {
                const { data } = await UserRequest.get('statistical' + this.query)
                this.dataChannel = data;
                this.start_date = data.start_date;
                this.end_date = data.end_date;
                emitEvent('eventPropStatistical', data);
                this.isLoading = false;
            }
            catch (error) {
                if (error.messages) emitEvent('eventError', error.messages[0]);
                this.isLoading = false;
            }
        },
    },
    watch: {
        'start_date': 'getDataChannel',
        'end_date': 'getDataChannel',
        'typeChart': 'getDataChannel',
    },
}
</script>

<style >
.titleChannel {
    font-size: 19px;
    color: var(--user-color);
}

.label_date {
    color: var(--user-color);
}

.shadow {
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

</style>