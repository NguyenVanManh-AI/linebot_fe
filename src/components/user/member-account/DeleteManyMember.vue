<template>
    <div>
        <div class="modal fade" id="deleteManyMember" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
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
                            <p>Warning: These people will be moved to <strong>{{ isDeleteChangeMany == 1 ? 'Deleted' :
                                'Normal' }}</strong> status in the system !</p>
                            <div v-for="(member, index) in members" :key="index">
                                <li class="mb-2" v-if="selectedMembers.includes(member.id)">
                                    <p>{{ index + 1 }}. Name : <strong>{{ member.name }}</strong></p>
                                    <div class="pl-6">
                                        <p>Email : <strong>{{ member.email }}</strong></p>
                                        <p>LINE User ID : <strong>{{ member.line_user_id }}</strong></p>
                                    </div>
                                </li>
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

const { emitEvent } = useEventBus();

export default {
    name: "DeleteManyMember",
    props: {
        selectedMembers: Array,
        members: Object,
        isDeleteChangeMany: Number
    },
    components: {
    },
    methods: {
        changeIsDeleteMany: async function () {
            const selectedManagarsArray = Object.values(this.selectedMembers);
            var data = {
                ids_member: selectedManagarsArray,
                is_delete: this.isDeleteChangeMany
            }
            try {
                const { messages } = await UserRequest.post('user/delete-many-member', data, true);
                emitEvent('eventSuccess', messages[0]);
                emitEvent('eventRegetMembers', '');
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

.modal-dialog {
    max-width: 650px;
}
</style>