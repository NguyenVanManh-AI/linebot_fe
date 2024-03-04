<template>
    <div>
        <div id="big">
            <div class="bigContainer">
                <div class="modal fade" id="viewDetailBroadcast" tabindex="-1" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel"><strong><i
                                            class="fa-solid fa-bars-staggered"></i>
                                        View Detail Broadcast</strong></h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" class="text-danger"><i
                                            class="fa-regular fa-circle-xmark"></i></span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">
                                        <div class="col-12 preViewMessage p-0">
                                            <div class="row font-weight-bold">
                                                <div class="col-4 text-info"><i class="fa-solid fa-user-clock"></i> Sender
                                                    Name</div>
                                                <div class="col-8 text-success"> : {{ this.broadcastSelected.sender_name }}
                                                </div>
                                            </div>
                                            <div class="row font-weight-bold">
                                                <div class="col-4 text-info"><i class="fa-solid fa-heading"></i> Title
                                                    Broadcast</div>
                                                <div class="col-8 text-success"> : {{ this.broadcastSelected.title }}</div>
                                            </div>
                                            <div class="row font-weight-bold">
                                                <div class="col-4 text-info"><i class="fa-solid fa-shapes"></i> Status</div>
                                                <div :class="{
                                                    'col-8': true, 'text-uppercase': true,
                                                    'colorDraf': broadcastSelected.status == 'draf',
                                                    'colorScheduled': broadcastSelected.status == 'scheduled',
                                                    'colorSent': broadcastSelected.status == 'sent',
                                                    'colorFailed': broadcastSelected.status == 'failed',
                                                }"> : {{ broadcastSelected.status }}</div>
                                            </div>
                                            <div class="row mb-2 font-weight-bold">
                                                <div class="col-4 text-info"><i class="fa-solid fa-clock"></i> Sent At</div>
                                                <div class="col-8 text-success"> : {{ this.broadcastSelected.sent_at }}
                                                </div>
                                            </div>
                                            <div class="title_preview"> <i class="fa-solid fa-caret-down"></i>
                                                <span>Preview</span> <i class="fa-solid fa-circle-question"></i> </div>
                                            <div class="inner_preview">
                                                <div v-for="content, index in previewContents" :key="index">
                                                    <div class="rowContent" v-if="content.content_type == 'text'">
                                                        <div class="avatar_chat">
                                                            <img :src="channel.picture_url ? channel.picture_url : require('@/assets/line_logo.jpg')"
                                                                alt="">
                                                        </div>
                                                        <div class="content_chat">
                                                            <div class="nameChannel">{{ channel.channel_name }}</div>
                                                            <div class="contentText">
                                                                {{ content.content_data.text }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="rowContent imgInTable"
                                                        v-if="content.content_type == 'sticker'">
                                                        <div class="avatar_chat">
                                                            <img :src="channel.picture_url ? channel.picture_url : require('@/assets/line_logo.jpg')"
                                                                alt="">
                                                        </div>
                                                        <div class="content_chat">
                                                            <div class="nameChannel">{{ channel.channel_name }}</div>
                                                            <div class="innerData">
                                                                <img :src="getStickerImageUrl(content.content_data.stickerId)"
                                                                    alt="Sticker" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="rowContent imgInTable"
                                                        v-if="content.content_type == 'image'">
                                                        <div class="avatar_chat">
                                                            <img :src="channel.picture_url ? channel.picture_url : require('@/assets/line_logo.jpg')"
                                                                alt="">
                                                        </div>
                                                        <div class="content_chat">
                                                            <div class="nameChannel">{{ channel.channel_name }}</div>
                                                            <div class="innerData">
                                                                <img :src="content.content_data.originalContentUrl"
                                                                    alt="Image" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import useEventBus from '@/composables/useEventBus'
const { onEvent } = useEventBus();
import '@vuepic/vue-datepicker/dist/main.css';

export default {
    name: "DetailBroadcast",
    props: {
        channel: Object,
        dataContents: Object,
    },
    setup() {

    },
    components: {
    },
    data() {
        return {
            broadcastSelected: {
                sender_name: null,
                title: null,
                sent_at: null,
                status: null,
            },
            previewContents: [],
        }
    },
    mounted() {
        onEvent('selectSimpleBroadcast', (broadcast) => {
            this.broadcastSelected = Object.assign({}, broadcast);
            this.dateTime = broadcast.sent_at;
            this.previewContents = broadcast.contents;
        });

    },

    computed: {

    },
    methods: {
        getStickerImageUrl(stickerId) {
            return `https://stickershop.line-scdn.net/stickershop/v1/sticker/${stickerId}/ANDROID/sticker.png`;
        },
        generateNumbers(start, end) {
            return Array.from({ length: end - start + 1 }, (_, index) => start + index);
        },
    },
    watch: {
    },
}
</script>

<style scoped>
.modal.fade.show {
    padding-left: 0px;
}

.modal-content {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 10px;
}

.title_preview {
    background-color: black;
    color: white;
    padding: 10px;
    font-size: 20px;
    background-color: #353A40;
}

.title_preview span {
    margin: 0px 6px;
}

.inner_preview {
    padding: 10px;
    height: 60vh;
    background-color: #8CABD9;
    overflow-y: scroll;
}

.inner_preview::-webkit-scrollbar-track {
    background: #8CABD9;
}

.rowContent {
    display: flex;
    margin-bottom: 10px;
}

.avatar_chat {
    width: 50px;
    height: 50px;
    background-color: white;
    border-radius: 200px;
    margin-right: 10px;
}

.content_chat {
    width: 80%;
}

.content_chat img {
    max-width: 200px;
    max-height: 120px;
    border-radius: 10px;
}

.avatar_chat img {
    width: 50px;
    height: 50px;
    border-radius: 200px;
}

.nameChannel {
    color: white;
}

.contentText {
    background-color: white;
    border-radius: 10px;
    width: fit-content;
    padding: 10px;

}

@import url('https://fonts.googleapis.com/css2?family=Reem+Kufi+Ink');

#big {
    display: flex;
    position: relative;
}

.colorDraf {
    color: silver;
}

.colorScheduled {
    color: var(--blue-color)
}

.colorSent {
    color: var(--user-color)
}

.colorFailed {
    color: red;
}</style>

