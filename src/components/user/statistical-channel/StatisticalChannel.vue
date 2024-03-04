<template>
    <div id="main">
        <div>
            <h3 class="titleChannel"><i class="fa-solid fa-chart-pie"></i> Statistical Channel </h3>
            <div class="p-2">
                <div class="row">
                    <div class="col-2">
                        <div class="label_date"><i class="fa-solid fa-calendar-day"></i> Start Date</div>
                        <div><input v-model="big_search.start_date" type="date" required format="YYYY MM DD"
                                class="form-control">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="label_date"><i class="fa-solid fa-calendar-day"></i> End Date</div>
                        <div><input v-model="big_search.end_date" type="date" required format="YYYY MM DD"
                                class="form-control"></div>
                    </div>
                    <div class="col-3">
                        <div class="label_date"><i class="fa-solid fa-chart-simple"></i> Type Chart</div>
                        <div>
                            <select v-model="big_search.type_chart" class="form-control" id="exampleFormControlSelect1">
                                <option value="bar">Bar Chart</option>
                                <option value="line">Line Chart</option>
                                <option value="radar">Radar Chart</option>
                                bubble
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <BarChart :type_chart="big_search.type_chart"></BarChart>
                </div>
                <div class="col-12 shadow">
                    <DoughnutChart :type_chart="big_search.type_chart"></DoughnutChart>
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
            big_search: {
                start_date: '',
                end_date: '',
                type_chart: 'bar',
            },
            dataChannel: null,
        }
    },
    mounted() {
        this.checkManager();
        emitEvent('eventTitleHeader', 'Statistical Channel');
        const queryString = window.location.search;
        const searchParams = new URLSearchParams(queryString);
        this.big_search.start_date = searchParams.get('start_date') || ''; 
        this.big_search.end_date = searchParams.get('end_date') || ''; 
        this.big_search.type_chart = searchParams.get('type_chart') || 'bar'; 
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
            this.query = '?start_date=' + this.big_search.start_date + '&end_date=' + this.big_search.end_date;
            window.history.pushState({}, null, this.query + '&type_chart=' + this.big_search.type_chart);
            try {
                const { data } = await UserRequest.get('statistical' + this.query)
                this.dataChannel = data;
                this.big_search.start_date = data.start_date;
                this.big_search.end_date = data.end_date;
                emitEvent('eventPropStatistical', data);
            }
            catch (error) {
                if (error.messages) emitEvent('eventError', error.messages[0]);
            }
        },
    },
    watch: {
        big_search: {
            handler: function () {
                this.getDataChannel();
            },
            deep: true
        },
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