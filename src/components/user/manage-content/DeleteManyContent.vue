<template>
    <div>
        <div class="modal fade" id="deleteManyContent" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel"><i class="fa-solid fa-triangle-exclamation"></i>
                            Warning</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true"><i class="fa-regular fa-circle-xmark"></i></span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning" role="alert">
                            <p class="mb-2">Warning: These contents will be moved to <strong>{{ isDeleteChangeMany == 1 ?
                                'Deleted' : 'Normal' }}</strong> status in the system !</p>
                            <div v-for="(content, index) in contents" :key="index">
                                <li class="mb-2" v-if="selectedContents.includes(content.id)">
                                    <p>{{ index + 1 }}. Creator : <strong>{{ content.creator_name }}</strong></p>
                                    <div class="pl-6">
                                        <div class="ml-3">
                                            <p> Updater : <strong>{{ content.updater_name }}</strong> </p>
                                        </div>
                                        <div v-if="content.content_type == 'text'">
                                            <div class="ml-3">
                                                Content Type : <strong class="text-uppercase colorText"> {{
                                                    content.content_type }} </strong><br>
                                                Content Data : <strong class="text-info">{{ content.content_data.text
                                                }}</strong>
                                            </div>
                                        </div>
                                        <div class="imgInTable" v-if="content.content_type == 'image'">
                                            <div class="ml-3">
                                                Content Type : <strong class="text-uppercase colorImage"> {{
                                                    content.content_type }} </strong><br>
                                                <div class="innerData">
                                                    Content Data : <img :src="content.content_data.originalContentUrl"
                                                        alt="Image" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <hr>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" ref="closeButton"
                            id="close">Close</button>
                        <button type="button"
                            :class="{ 'btn': true, 'btn-outline-danger': isDeleteChangeMany == 1, 'btn-outline-success': isDeleteChangeMany == 0 }"
                            @click="changeIsDeleteMany">
                            <i
                                :class="{ 'fa-solid': true, 'fa-trash': isDeleteChangeMany == 1, 'fa-trash-arrow-up': isDeleteChangeMany == 0 }"></i>
                            {{ isDeleteChangeMany == 1 ? 'Delete' : 'Backup' }}
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
    name: "DeleteManyContent",
    props: {
        selectedContents: Array,
        isDeleteChangeMany: Number,
    },
    components: {

    },
    data() {
        return {
            contents: null,
        }
    },
    mounted() {
        onEvent('selectManyContent', (contents) => {
            this.contents = contents;
        });
    },
    methods: {
        changeIsDeleteMany: async function () {
            const selectedContentsArray = Object.values(this.selectedContents);
            var data = {
                ids_content: selectedContentsArray,
                is_delete: this.isDeleteChangeMany
            }
            try {
                const { messages } = await UserRequest.post('content/delete-many-content', data, true);
                emitEvent('eventSuccess', messages[0]);
                emitEvent('eventRegetcontents', '');
                const closeButton = this.$refs.closeButton;
                closeButton.click();
            }
            catch (error) {
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

.contentType {
    color: var(--blue-color);
}

.colorImage {
    color: var(--blue-color);
}

.colorText {
    color: var(--brown-color)
}

</style>
