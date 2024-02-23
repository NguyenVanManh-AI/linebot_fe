<template>
    <div>
        <div id="big">
            <div class="bigContainer">
                <div class="modal fade" id="addBroadcast" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <h4 class="text-center text-success"><strong><i class="fa-solid fa-business-time"></i>
                                    Add Broadcast</strong></h4><br>
                            <div class="row">
                                <div class="col-12">
                                    <form action="">
                                        <div class="row">
                                            <div class="col-2">
                                                Broadcast time
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
                                            </div>
                                        </div>
                                        <br>
                                        <hr>
                                        <br>
                                    </form>
                                </div>
                            </div>
                            <form >

                            <div class="row">
                                <div class="col-9">
                                    <div class="row pr-2 mb-2 ">
                                        <input class="form-control form-control-sm col-12" required v-model="dataBroadcastSubmit.title" type="text" placeholder="Title">
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
                                        <div class="loadContent mainText" v-if="isTab == 'text'">
                                            <li v-for="text, index in dataContents.texts" :key="index" class="mt-2 mb-2" @click="selectedContent(text.id)">
                                                    <p><input
                                                    class="mr-2" type="checkbox" name="exampleRadios"
                                                    id="exampleRadios1" value="option1">{{ text.content_data.text }}</p>
                                                <hr>
                                            </li>
                                        </div>
                                        <div class="loadContent mainSticker" v-if="isTab == 'sticker'">
                                            <li v-for="sticker, index in dataContents.stickers" :key="index" @click="selectedContent(sticker.id)"
                                                class="itemSticker">
                                                <input
                                                    class="form-check-input" type="checkbox" name="exampleRadios"
                                                    id="exampleRadios1" value="option1">
                                                <img :src="getStickerImageUrl(sticker.content_data.stickerId)" alt="Sticker" />
                                            </li>
                                        </div>
                                        <div class="loadContent mainImage" v-if="isTab == 'image'">
                                            <li v-for="image, index in dataContents.images" :key="index" @click="selectedContent(image.id)"
                                                class="itemSticker">
                                                <input
                                                    class="form-check-input" type="checkbox" name="exampleRadios"
                                                    id="exampleRadios1" value="option1">
                                                <img :src="image.content_data.originalContentUrl" alt="Sticker" />
                                            </li>
                                        </div>

                                    </div>
                                </div>
                                <div class="col-3 preViewMessage">

                                </div>
                            </div>
                            <div class="row mt-4">
                                <div >
                                    <button @click="addBroadcast('draf')" type="button" class="mt-4 btn-pers" id="login_button"><i class="fa-solid fa-plus"></i> Draf</button>
                                        <button @click="addBroadcast('scheduled')" type="button" class="mt-4 ml-6 btn-pers" id="login_button"><i
                                        class="fa-solid fa-paper-plane"></i> Add</button>
                                        <div class="col-8 mx-auto">
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
const { emitEvent } = useEventBus();
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { formatDate } from '@/helper.js';
// import moment from 'moment';

export default {
    name: "AddBroadcast",
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
            optionSendnow: 'send_now',
            dataContents : {
                stickers: null,
                images: null,
                texts: null,
            },
            dataBroadcastSubmit : {
                title : null, 
                content_ids : [], 
                sent_at : null, 
                status : null, 
            },

            isTab: 'text',
            selectStickerId: null,
            previewImageSrc: null,
            member: {
                name: null,
                email: null,
                line_user_id: null,
            },
            errors: {
                content_type: null,
                content_data_type: null,
                content_data_text: null,
                content_data_packageId: null,
                content_data_stickerId: null,
                image_content: null,
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
        this.getDataContents();
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
        selectedContent: function (id_content) {
            this.dataBroadcastSubmit.content_ids. push(id_content);
        },
        getDataContents: async function () {
            var dataQuery = {
                search:''
            };
            try {
                const { data } = await UserRequest.post('content/for-broadcast', dataQuery )
                this.dataContents = data;
                this.total = data.total;
            }
            catch (error) {
                if (error.messages) emitEvent('eventError', error.messages[0]);
                this.isLoading = false;
            }
        },
        addBroadcast: async function (status) {
            console.log(this.dataBroadcastSubmit);

            this.dataBroadcastSubmit.status = status;
            if(this.optionSendnow == 'send_now') {
                const now = new Date();
                const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                this.dataBroadcastSubmit.sent_at = formattedDate;
            }
            try {
                const { messages } = await UserRequest.post('broadcast/add', this.dataBroadcastSubmit, true);
                emitEvent('eventSuccess', messages[0]);
                for (let key in this.errors) this.errors[key] = null;
                var closePW = window.document.getElementById('addBroadcast');
                closePW.click();
                this.dataBroadcastSubmit.content_ids = [];
                emitEvent('eventRegetcontents', '');
                console.log(this.dataBroadcastSubmit);

            }
            catch (error) {
                if (error.errors) this.errors = error.errors;
                else for (let key in this.errors) this.errors[key] = null;
                if (error.messages) emitEvent('eventError', error.messages[0]);
            }
        },
        // data Image 
        previewImage(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.previewImageSrc = e.target.result;
                    this.dataImage.image_content = file;
                };
                reader.readAsDataURL(file);
            } else this.removeFile();
        },
        removeFile: function () {
            this.previewImageSrc = null;
            this.dataImage.image_content = null;
            this.$refs.fileInput.value = '';
        },
    },
    watch: {
        dateTime: function (newDateTime) {
            if (newDateTime) {
                const date = new Date();
                const formattedDate = formatDate(date);
                this.dataBroadcastSubmit.sent_at = formattedDate;
                console.log(formattedDate); // Kết quả sẽ là chuỗi định dạng "YYYY-MM-DD HH:mm:ss"
            }
        },
        getTimeSendNow: function() {

        }
    },
}
</script>

<style scoped>

.preViewMessage {
    border: 1px solid red;
    background-color: pink;
    border-radius: 10px;
    height: 50vh;
}
.mainSticker {
    display: flex;
    flex-wrap: wrap;
    max-height: 400px;
    overflow-y: scroll;
}

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
    transition: all 0.5s ease;
}
.itemSticker input {
    z-index: 2;
}

.itemSticker:hover img {
    transform: scale(1.3);
    transition: all 0.5s ease;
}

.itemSticker img {
    object-fit: contain;
}

.itemSticker input {
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
    min-width: 1243px;
}

.mainText {
    max-height: 400px;
    overflow-y: scroll;
}

.colorImage {
    color: var(--blue-color);
}

.colorText {
    color: var(--brown-color)
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
}


/* data Image */
.minAvatar {
    background-color: #e9ecef;
    position: relative;
    text-align: center;
    width: 100%;
    height: 170px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease;
}

.minAvatar .preview {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 6px;
    cursor: default;
}

.minAvatar:hover {
    transition: all 0.5s ease;
    background: #E8F5E9;
}

.input-file {
    opacity: 0;
    top: 0px;
    left: 0px;
    position: absolute;
    cursor: pointer;
    width: 100%;
    height: 150px;
}

.box-preview {
    position: relative;
}

.iconClound {
    cursor: pointer;
    font-size: 60px;
    color: var(--user-color);
}

.close {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 16px;
}</style>

