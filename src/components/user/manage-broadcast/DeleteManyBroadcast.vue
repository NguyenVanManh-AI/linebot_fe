<template>
    <div>
        <div class="modal fade" id="deleteManyBroadcast" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel"><i class="fa-solid fa-triangle-exclamation"></i> Warning</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true"><i class="fa-regular fa-circle-xmark"></i></span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning" role="alert">
                            <p class="mb-2">Warning: These broadcasts will be moved to <strong>{{ isDeleteChangeMany == 1 ? 'Deleted' : 'Normal'  }}</strong> status in the system !</p>
                            <div v-for="(broadcast, index) in broadcasts" :key="index">
                                <li class="mb-3 mt-3" v-if="selectedBroadcasts.includes(broadcast.id)">
                                    <div class="row font-weight-bold">
                                            <div class="col-4 text-info">{{ index+1 }}. <i class="fa-solid fa-user-clock"></i> Sender Name</div>
                                            <div class="col-8 text-success"> : {{ broadcast.sender_name }}</div>
                                        </div>
                                        <div class="row font-weight-bold pl-5">
                                            <div class="col-4 text-info"><i class="fa-solid fa-heading"></i> Title Broadcast</div>
                                            <div class="col-8 text-success"> : {{ broadcast.title }}</div>
                                        </div>
                                        <div class="row font-weight-bold pl-5">
                                            <div class="col-4 text-info"><i class="fa-solid fa-shapes"></i> Status</div>
                                            <div :class="{'col-8':true,'text-uppercase':true, 
                                                'colorDraf':broadcast.status == 'draf',
                                                'colorScheduled':broadcast.status == 'scheduled',
                                                'colorSent':broadcast.status == 'sent',
                                                'colorFailed':broadcast.status == 'failed',
                                                }" > : {{ broadcast.status }}</div>
                                        </div>
                                        <div class="row mb-2 font-weight-bold pl-5">
                                            <div class="col-4 text-info"><i class="fa-solid fa-clock"></i> Sent At</div>
                                            <div class="col-8 text-success"> : {{ broadcast.sent_at }}</div>
                                        </div>
                                </li>
                                <hr>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" ref="closeButton"
                            id="close">Close</button>
                        <button type="button" :class="{'btn':true, 'btn-outline-danger' : isDeleteChangeMany == 1 , 'btn-outline-success' : isDeleteChangeMany == 0  }" @click="changeIsDeleteMany">
                            <i :class="{'fa-solid':true, 'fa-trash' : isDeleteChangeMany == 1 , 'fa-trash-arrow-up' : isDeleteChangeMany == 0  }"></i>
                            {{ isDeleteChangeMany == 1 ? 'Delete' : 'Backup'  }}
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

const { emitEvent , onEvent } = useEventBus();

export default {
    name: "DeleteManyBroadcast",
    props: {
        selectedBroadcasts: Array,
        isDeleteChangeMany: Number,
        getStickerImageUrl:Function
    },
    components: {

    },
    data() {
        return {
            broadcasts: null,
        }
    },
    mounted() {
        onEvent('selectManyBroadcast', (broadcasts) => {
            this.broadcasts = broadcasts;
            console.log(this.broadcasts);
        });
    },
    methods: {
        changeIsDeleteMany: async function () {
            const selectedBroadcastsArray = Object.values(this.selectedBroadcasts);
            var data = {
                ids_broadcast: selectedBroadcastsArray,
                is_delete: this.isDeleteChangeMany
            }
            try {
                const { messages } = await UserRequest.post('broadcast/delete-many-broadcast', data, true);
                emitEvent('eventSuccess', messages[0]);
                emitEvent('eventRegetBroadcast', ''); 
                const closeButton = this.$refs.closeButton;
                closeButton.click();
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
    max-width: 620px;
}

.contentText {
    color: var(--user-color);
}

.contentType {
    color: var(--blue-color);
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
}

</style>