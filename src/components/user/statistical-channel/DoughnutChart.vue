<template>
    <div>
        <div class="row mt-4">
            <div class="col-4 pl-0 pr-2">
                <canvas class=" p-2" id="chartDoughnutMessage"></canvas>
            </div>
            <div class="col-4 pr-0 pl-2">
                <canvas class=" p-2" id="chartDoughnutFollow"></canvas>
            </div>
        </div>
    </div>
</template>

<script >
import Chart from 'chart.js/auto';
import useEventBus from '@/composables/useEventBus';
const { onEvent } = useEventBus();

export default {
    name: 'DoughnutChart',
    data() {
        return {

        }
    },
    mounted() {

        var doughnutChartMessage  = document.getElementById('chartDoughnutMessage');
        var chartMessage = new Chart(doughnutChartMessage , {}); 

        var doughnutChartFollow  = document.getElementById('chartDoughnutFollow');
        var chartFollow  = new Chart(doughnutChartFollow , {}); 

        onEvent('eventPropStatistical', dataChannel => {
            chartMessage.destroy(); 
            chartFollow.destroy();

            // message
            var dataMessage = {
                labels: dataChannel.doughnut_chart.message.label,
                datasets: [{
                    label: 'Order number',
                    data: dataChannel.doughnut_chart.message.data,
                    backgroundColor: [
                        'rgb(255, 205, 86)',
                        'rgb(54, 162, 235)',
                    ],
                    hoverOffset: 4
                }]
            };
            chartMessage = new Chart(doughnutChartMessage, {
                type: 'doughnut',
                data: dataMessage,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Donut chart statistics the number of messages'
                        }
                    }
                }
            });

            // follow 
            var dataFollow = {
                labels: dataChannel.doughnut_chart.followers.label,
                datasets: [{
                    label: 'Order number',
                    data: dataChannel.doughnut_chart.followers.data,
                    backgroundColor: [
                        '#7ED957',
                        '#008037',
                        'rgb(255, 99, 132)',
                    ],
                    hoverOffset: 4
                }]
            };
            chartFollow = new Chart(doughnutChartFollow, {
                type: 'doughnut',
                data: dataFollow,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Donut chart statistics the number of messages'
                        }
                    }
                }
            });
        });
    },
}

</script>
