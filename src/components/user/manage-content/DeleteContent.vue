<template>
    <div>
        <div class="modal fade" id="deleteContent" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel"><i class="fa-solid fa-triangle-exclamation"></i> Warning</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning" role="alert">
                            <p class="mb-2">Warning: These contents will be moved to <strong>{{ contentSelected.is_delete == 0 ? 'Deleted' : 'Normal'  }}</strong> status in the system !</p>
                            <div class="ml-3">
                                <p> Creator : <strong>{{ contentSelected.creator_name }}</strong>  </p>
                                <p> Updater : <strong>{{ contentSelected.updater_name }}</strong>  </p>
                            </div>
                            <div v-if="contentSelected.content_type == 'text'">
                                <div class="ml-3">
                                    Content Type : <strong class="text-uppercase colorText"> {{ contentSelected.content_type }} </strong><br>
                                    Content Data : <strong class="contentText">{{ contentSelected.content_data.text }}</strong> 
                                </div>
                            </div>
                            <div class="imgInTable" v-if="contentSelected.content_type == 'sticker'">
                                <div class="ml-3">
                                    Content Type : <strong class="text-uppercase colorSticker"> {{ contentSelected.content_type }} </strong><br>
                                    <div class="innerData">
                                        Content Data : <img :src="getStickerImageUrl(contentSelected.content_data.stickerId)" alt="Sticker" />
                                    </div>
                                </div>
                            </div>
                            <div class="imgInTable" v-if="contentSelected.content_type == 'image'">
                                <div class="ml-3">
                                    Content Type : <strong class="text-uppercase colorImage"> {{ contentSelected.content_type }} </strong><br>
                                    <div class="innerData">
                                        Content Data : <img :src="contentSelected.content_data.originalContentUrl" alt="Image" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" ref="closeButton"
                            id="close">Close</button>
                        <button type="button" :class="{'btn':true, 'btn-outline-danger' : contentSelected.is_delete == 0 , 'btn-outline-success' : contentSelected.is_delete == 1  }" @click="deleteBook">
                            <i :class="{'fa-solid':true, 'fa-trash' : contentSelected.is_delete == 0 , 'fa-trash-arrow-up' : contentSelected.is_delete == 1  }"></i>
                            {{ contentSelected.is_delete == 0 ? 'Delete' : 'Backup'  }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import UserRequest from '@/restful/UserRequest';
import useEventBus from '@/composables/useEventBus';
const { emitEvent, onEvent } = useEventBus();

export default {
    name: "DeleteContent",

    props: {
        getStickerImageUrl:Function
    },

    components: {
        
    },

    data() {
        return {
            contentSelected: {
                id: '',
                content_type: '',
                content_data: null,
                is_delete: null,
                creator_name: null,
                updater_name: null,
            },
            dataSubmit : {
                is_delete : '',
            }
        }
    },
    
    mounted() {
        onEvent('selectSimpleContent', (contentSelected) => {
            this.contentSelected = contentSelected;
        });
    },

    methods: {
        deleteBook: async function () {
            try {
                if(this.contentSelected.is_delete == 0) this.dataSubmit.is_delete = 1;
                else this.dataSubmit.is_delete = 0;
                const { messages } = await UserRequest.post('content/delete-content/' + this.contentSelected.id, this.dataSubmit, true);
                emitEvent('eventSuccess', messages[0]);
                const closeButton = this.$refs.closeButton;
                closeButton.click();
                emitEvent('eventUpdateIsDelete', this.contentSelected.id);
            }
            catch(error) {
                if (error.messages) emitEvent('eventError', error.messages[0]);
            }
        },
    }

}
</script>

<style scoped>

.modal-header .close {
    outline: none;
}

.imgInTable img {
    max-width: 100px;
}

.innerData {
    display: flex;
    align-items: center;
    align-content: center;
    margin-top: 10px;
}

.innerData img {
    margin-left: 3px;
    border-radius: 6px;
}
.modal-dialog {
    max-width: 600px;
}

.contentText {
    color: var(--user-color);
}

.colorImage {
    color: var(--blue-color);
}

.colorText {
    color: var(--brown-color)
}

.colorSticker {
    color: var(--yellow-color)
}

</style>