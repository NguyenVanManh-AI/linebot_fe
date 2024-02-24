<template>
    <div>
        <div id="big">
            <div class="bigContainer">
                <div class="modal fade" id="updateBroadcast" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <h4 class="text-center text-success"><strong><i class="fa-solid fa-business-time"></i>
                                    Update Broadcast</strong></h4><br>
                            <div class="row">
                                <div class="col-12">
                                    <form action="">
                                        <div class="row">
                                            <div class="col-2">
                                                <strong>Broadcast time</strong> 
                                            </div>
                                            <div class="col-10">
                                                <div class="row">
                                                    <input v-model="optionSendnow" class="form-check-input" type="radio"
                                                        name="sent_at" id="exampleRadios1" value="send_now"> Send Now
                                                </div>
                                                <div class="row">
                                                    <input v-model="optionSendnow" class="form-check-input" type="radio"
                                                        name="sent_at" id="exampleRadios1" value="select_time">
                                                    <VueDatePicker class="col-6 ml-0 pl-0" v-model="dateTime" required>
                                                    </VueDatePicker>
                                                </div>
                                                <span v-if="errors.sent_at" class="text-danger">{{ errors.sent_at[0]}}<br></span>
                                            </div>
                                        </div>
                                        <br>
                                        <hr>
                                        <br>
                                    </form>
                                </div>
                            </div>
                            <form>
                                <div class="row">
                                    <div class="col-9">
                                        <div class="row pr-2 mb-2 ">
                                            <input class="form-control form-control-sm col-12" required
                                                v-model="dataBroadcastSubmit.title" type="text" placeholder="Title">
                                            <span v-if="errors.title" class="text-danger">{{ errors.title[0]}}<br></span>
                                        </div>
                                        <div class="row pr-2">
                                            <ul class="nav nav-tabs mainTab">
                                                <li @click="isTab = 'text'" class="nav-item  font-weight-bold">
                                                    <a :class="{ 'nav-link': true, 'colorText': true, 'active': isTab == 'text' }"
                                                        aria-current="page" href="#"><i class="fa-solid fa-quote-left"></i>
                                                        Text</a>
                                                </li>
                                                <li @click="isTab = 'sticker'" class="nav-item font-weight-bold">
                                                    <a :class="{ 'nav-link': true, 'colorSticker': true, 'active': isTab == 'sticker' }"
                                                        href="#"><i class="fa-solid fa-icons"></i> Sticker</a>
                                                </li>
                                                <li @click="isTab = 'image'" class="nav-item font-weight-bold">
                                                    <a :class="{ 'nav-link': true, 'colorImage': true, 'active': isTab == 'image' }"
                                                        href="#"><i class="fa-solid fa-image"></i> Image</a>
                                                </li>
                                            </ul>
                                            <div class="loadContent col-12 mainText" v-if="isTab == 'text'">
                                                <li v-for="text, index in dataContents.texts" :key="index"
                                                    class="mt-2 mb-2">
                                                    <p><input @click="selectedIdContent(text, text.id)"
                                                            :checked="checkChecked(text.id)" class="mr-2" type="checkbox"
                                                            name="exampleRadios" id="exampleRadios1" value="option1">{{
                                                                text.content_data.text }}</p>
                                                    <hr>
                                                </li>
                                            </div>
                                            <div class="loadContent col-12 mainSticker" v-if="isTab == 'sticker'">
                                                <li v-for="sticker, index in dataContents.stickers" :key="index"
                                                    class="itemSticker">
                                                    <input @click="selectedIdContent(sticker, sticker.id)"
                                                        :checked="checkChecked(sticker.id)" class="form-check-input"
                                                        type="checkbox" name="exampleRadios" id="exampleRadios1"
                                                        value="option1">
                                                    <img :src="getStickerImageUrl(sticker.content_data.stickerId)"
                                                        alt="Sticker" />
                                                </li>
                                            </div>
                                            <div class="loadContent col-12 mainImage" v-if="isTab == 'image'">
                                                <li v-for="image, index in dataContents.images" :key="index"
                                                    class="itemImage">
                                                    <input @click="selectedIdContent(image, image.id)"
                                                        :checked="checkChecked(image.id)" class="form-check-input"
                                                        type="checkbox" name="exampleRadios" id="exampleRadios1"
                                                        value="option1">
                                                    <img :src="image.content_data.originalContentUrl" alt="Sticker" />
                                                </li>
                                            </div>
                                            <span v-if="errors.content_ids" class="text-danger">{{ errors.content_ids[0]}}<br></span>
                                        </div>
                                        <div class="row">
                                            <div class="col-12 mt-4">
                                                <div>
                                                    <button @click="updateBroadcast('draf')" type="button"
                                                        class="mt-4 btn-pers" id="login_button"><i
                                                            class="fa-solid fa-plus"></i> Draf</button>  
                                                    <button @click="updateBroadcast('scheduled')" type="button" 
                                                        class="mt-4 ml-6 btn-pers" id="login_button"><i class="fa-solid fa-floppy-disk"></i> Update</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-3 preViewMessage p-0">
                                        <div class="title_preview"> <i class="fa-solid fa-caret-down"></i> <span>Preview</span> <i class="fa-solid fa-circle-question"></i> </div>
                                        <div class="inner_preview">
                                            <div v-for="content, index in previewContents" :key="index">
                                                <div class="rowContent" v-if="content.content_type == 'text'">
                                                    <div class="avatar_chat">
                                                        <img :src="require('@/assets/line_logo.jpg')" alt="">
                                                    </div>
                                                    <div class="content_chat">
                                                        <div class="nameChannel">{{ channel.channel_name }}</div>
                                                        <div class="contentText">
                                                            {{ content.content_data.text }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="rowContent imgInTable" v-if="content.content_type == 'sticker'">
                                                    <div class="avatar_chat">
                                                        <img :src="require('@/assets/line_logo.jpg')" alt="">
                                                    </div>
                                                    <div class="content_chat">
                                                        <div class="nameChannel">{{ channel.channel_name }}</div>
                                                            <div class="innerData">
                                                                <img :src="getStickerImageUrl(content.content_data.stickerId)"
                                                                alt="Sticker" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="rowContent imgInTable" v-if="content.content_type == 'image'">
                                                    <div class="avatar_chat">
                                                        <img :src="require('@/assets/line_logo.jpg')" alt="">
                                                    </div>
                                                    <div class="content_chat">
                                                        <div class="nameChannel">{{ channel.channel_name }}</div>
                                                        <div class="innerData">
                                                            <img :src="content.content_data.originalContentUrl" alt="Image" />
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
</template>

<script>
import useEventBus from '@/composables/useEventBus'
import UserRequest from '@/restful/UserRequest';
const { emitEvent , onEvent } = useEventBus();
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { formatDate } from '@/helper.js';
// import moment from 'moment';

export default {
    name: "UpdateBroadcast",
    props: {

    },
    setup() {

    },
    components: {
        VueDatePicker
    },
    data() {
        return {
            dateTime: new Date().toISOString(),
            optionSendnow: 'select_time',
            dataContents: {
                stickers: null,
                images: null,
                texts: null,
            },
            dataBroadcastSubmit: {
                id: null,
                title: null,
                content_ids: [],
                sent_at: null,
                status: null,
            },
            previewContents: [],
            channel: {
                channel_id : null,
                channel_name : null,
                channel_secret : null,
                channel_access_token : null,
            },

            isTab: 'text',
            previewImageSrc: null,
            errors: {
                title: null,
                content_ids: null,
                sent_at: null,
                status: null
            },
            packageStickers: [
                {
                    packageId: "446",
                    stickerIds: {
                        start: 1988,
                        end: 2027
                    }
                },
                {
                    packageId: "789",
                    stickerIds: {
                        start: 10855,
                        end: 10894
                    }
                },
                {
                    packageId: "6136",
                    stickerIds: {
                        start: 10551376,
                        end: 10551399
                    }
                },
                {
                    packageId: "6325",
                    stickerIds: {
                        start: 10979904,
                        end: 10979927
                    }
                }
            ],
        }
    },
    mounted() {
        this.getInforChannel();
        this.getDataContents();
        onEvent('selectSimpleBroadcast', (broadcast) => {
            this.dataBroadcastSubmit = Object.assign({}, broadcast); // tránh gán tham chiếu 
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
        selectedIdContent: function (content, id_content) {
            if (event.target.checked == true) {
                if (this.dataBroadcastSubmit.content_ids.length == 5) {
                    this.dataBroadcastSubmit.content_ids.shift(); // nếu đã đủ 5 thì xóa phần tử đầu tiên đi 
                    this.previewContents.shift();
                }
                this.dataBroadcastSubmit.content_ids.push(id_content);
                this.previewContents.push(content);
            }
            else {
                // xóa id ra khỏi mảng 
                let indexId = this.dataBroadcastSubmit.content_ids.indexOf(id_content);
                if (indexId !== -1) this.dataBroadcastSubmit.content_ids.splice(indexId, 1);

                // xóa content ra khỏi mảng 
                let indexToRemove = this.previewContents.findIndex(content => content.id === id_content);
                if (indexToRemove !== -1) this.previewContents.splice(indexToRemove, 1);
            }
        },
        getDataContents: async function () {
            var dataQuery = {
                search: ''
            };
            try {
                const { data } = await UserRequest.post('content/for-broadcast', dataQuery)
                this.dataContents = data;
                this.total = data.total;
            }
            catch (error) {
                if (error.messages) emitEvent('eventError', error.messages[0]);
                this.isLoading = false;
            }
        },
        getInforChannel: async function() {
            try {
                const { data } = await UserRequest.get('user/infor-channel');
                this.channel = data;
            }
            catch (error) {
                if (error.messages) emitEvent('eventError', error.messages[0]);
            }
        },
        updateBroadcast: async function (status) {
            this.dataBroadcastSubmit.status = status;
            if (this.optionSendnow == 'send_now') {
                const now = new Date();
                const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                this.dataBroadcastSubmit.sent_at = formattedDate;
            }
            try {
                const { messages } = await UserRequest.post('broadcast/update/'+this.dataBroadcastSubmit.id, this.dataBroadcastSubmit, true);
                emitEvent('eventSuccess', messages[0]);
                for (let key in this.errors) this.errors[key] = null;
                var closePW = window.document.getElementById('updateBroadcast');
                closePW.click();
                this.dataBroadcastSubmit = {
                    title: null,
                    content_ids: [],
                    sent_at: null,
                    status: null,
                },
                this.previewContents = [];
                emitEvent('eventRegetBroadcast', '');
            }
            catch (error) {
                if (error.errors) this.errors = error.errors;
                else for (let key in this.errors) this.errors[key] = null;
                if (error.messages) emitEvent('eventError', error.messages[0]);
            }
        },
        checkChecked: function (id_content) {
            return this.dataBroadcastSubmit.content_ids.includes(parseInt(id_content));
        }
    },
    watch: {
        dateTime: function (newDateTime) {
            if(typeof newDateTime === 'string') { // mounted gán cho dateTime đầu tiên {
                this.dataBroadcastSubmit.sent_at = newDateTime;
            } 
            else {
                if(newDateTime) { // tránh trường hợp clear input dateTime 
                    const formattedDate = formatDate(newDateTime);
                    this.dataBroadcastSubmit.sent_at = formattedDate;
                    this.optionSendnow = 'select_time';
                    console.log(this.dataBroadcastSubmit.sent_at);
                }
            }
        },
    },
}
</script>

<style scoped>
.itemSticker {
    width: 80px;
    display: flex;
    justify-content: center;
    border: 1px solid silver;
    position: relative;
    margin: 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.5s ease;
}

.itemSticker:hover {
    transition: all 0.5s ease;
    box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;
}

.itemSticker img {
    object-fit: contain;
    transition: all 0.5s ease;
}

.itemSticker input {
    z-index: 2;
    position: absolute;
    top: -2px;
    right: 2px;
}

.itemSticker:hover img {
    transform: scale(1.3);
    transition: all 0.5s ease;
}

.itemImage {
    width: 80px;
    display: flex;
    justify-content: center;
    position: relative;
    margin: 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.5s ease;
}

.itemImage:hover {
    transition: all 0.5s ease;
    box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;
}

.itemImage img {
    object-fit: contain;
    transition: all 0.5s ease;
    object-fit: cover;
    transition: all 0.5s ease;
    width: 80px;
    height: 80px;
    border-radius: 6px;
}

.itemImage:hover img {
    transform: scale(1.2);
    transition: all 0.5s ease;
}

.itemImage input {
    z-index: 2;
    position: absolute;
    top: -2px;
    right: 2px;
}


.loadContent {
    border: 1px solid;
    border-color: #dee2e6;
    margin-top: -1px;
    padding: 10px;
    /* min-height: 200px; */
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
}

.mainImage {
    display: flex;
    flex-wrap: wrap;
}

.mainText {
    max-height: 400px;
    overflow-y: scroll;
}

.mainSticker {
    display: flex;
    flex-wrap: wrap;
    max-height: 400px;
    overflow-y: scroll;
}

.colorImage {
    color: var(--blue-color);
}

.colorText {
    color: var(--brown-color)
}

.mainTab {
    z-index: 1;
    /* fix border bottom */
}

.mainTab>li:hover {
    transition: all 0.5s;
}

.mainTab>li {
    transition: all 0.5s;
}

.colorSticker {
    color: var(--yellow-color)
}

.modal.fade.show {
    padding-left: 0px;
}

.modal-content {
    height: 90vh;
    margin-top: 10px;
    padding: 26px;
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

#inputPassword {
    padding-right: 26px;
}


.modal-dialog {
    max-width: 90vw;
}</style>

