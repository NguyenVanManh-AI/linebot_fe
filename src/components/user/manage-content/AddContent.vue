<template>
    <div>
        <div id="big">
            <div class="bigContainer">
                <div class="modal fade" id="addContent" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <form @submit.prevent="addContent()">
                                <h4 class="text-center text-success"><strong><i class="fa-solid fa-envelope-open-text"></i>
                                        Add Content Channel</strong></h4><br>
                                <ul class="nav nav-tabs mainTab">
                                    <li @click="isTab = 'text'" class="nav-item  font-weight-bold">
                                        <a :class="{ 'nav-link': true, 'colorText': true, 'active': isTab == 'text' }"
                                            aria-current="page" href="#"><i class="fa-solid fa-quote-left"></i> Text</a>
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
                                <div class="loadContent" v-if="isTab == 'text'">
                                    <div class="col-12 mx-auto">
                                        <div class="input-form">
                                            <textarea v-model="dataText.content_data.text" type="text" required
                                                class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                                placeholder="Content Text">
                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="loadContent mainSticker" v-if="isTab == 'sticker'">
                                    <div class="listSticker"
                                        v-for="(packageSticker, indexPackageSticker) in packageStickers"
                                        :key="indexPackageSticker">
                                        <li @click="selectedSticker(stickerId, packageSticker.packageId)" class="itemSticker" v-for="stickerId in generateNumbers(packageSticker.stickerIds.start, packageSticker.stickerIds.end)"
                                            :key="stickerId">
                                            <input :checked="this.dataSticker.content_data.stickerId == stickerId" class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1">
                                            <img :src="getStickerImageUrl(stickerId)" alt="Sticker" />
                                        </li>
                                    </div>
                                </div>
                                <div class="loadContent" v-if="isTab == 'image'">
                                    <div class="minAvatar">
                                        <input required class="input-file" type="file" @change="previewImage" accept="image/*"
                                            ref="fileInput" />
                                        <span class="iconClound" v-if="previewImageSrc == null"><i
                                                class="fa-solid fa-cloud-arrow-up"></i></span>
                                        <div v-if="previewImageSrc" class="box-preview">
                                            <img class="preview" :src="previewImageSrc" alt="Preview" />
                                            <img src="@/assets/error.png" @click="removeFile" class="close" alt="Remove">
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" class="mt-4 btn-pers" id="login_button"><i
                                        class="fa-solid fa-paper-plane"></i> Add</button>
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

export default {
    name: "AddContent",
    props: {

    },
    setup() {

    },
    data() {
        return {
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
            dataText: {
                content_type: 'text',
                content_data: {
                    type: 'text',
                    text: null,
                },
            },
            dataSticker: {
                content_type: 'sticker',
                content_data : {
                    type: 'sticker',
                    packageId: null,
                    stickerId: null
                }
            },
            dataImage: {
                content_type: 'image',
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
    },
    components: {

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
        selectedSticker: function(stickerId, packageId){
            this.dataSticker.content_data.packageId = String(packageId);
            this.dataSticker.content_data.stickerId = String(stickerId);
        },
        addContent: async function () {
            try {
                var dataSubmit = null;
                if (this.isTab == 'text') dataSubmit = this.dataText;
                if (this.isTab == 'sticker') dataSubmit = this.dataSticker;
                if (this.isTab == 'image') {
                    dataSubmit = new FormData();
                    dataSubmit.append('content_type', 'image');
                    dataSubmit.append('image_content', this.dataImage.image_content);
                }
                const { messages } = await UserRequest.post('content/add', dataSubmit, true);
                emitEvent('eventSuccess', messages[0]);
                for (let key in this.errors) this.errors[key] = null;
                var closePW = window.document.getElementById('addContent');
                closePW.click();
                this.resetData();
                emitEvent('eventRegetcontents', '');
            }
            catch (error) {
                if (error.errors) this.errors = error.errors;
                else for (let key in this.errors) this.errors[key] = null;
                if (error.messages) emitEvent('eventError', error.messages[0]);
            }
        },
        resetData: function () {
            this.dataText = {
                content_type: 'text',
                content_data: {
                    type: 'text',
                    text: null,
                },
            };
            this.dataSticker = {
                content_type: 'sticker',
                content_data: {
                    type: "sticker",
                    packageId: null,
                    stickerId: null
                }
            };
            this.dataImage = {
                content_type: 'image',
                image_content: null,
            };
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

    },
}
</script>

<style scoped>

.mainSticker {
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
.itemSticker:hover img {
    transform: scale(1.5);
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

.listSticker {
    display: flex;
    flex-wrap: wrap;
}

.listSticker img {
    max-width: 60px
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
    margin-top: 100px;
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
    max-width: 1000px;
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
}

</style>

