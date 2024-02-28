<template>
    <div>
        <div class="modal fade" id="lockManager" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
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
                            <p>Warning: These people will be moved to <strong>{{ managerSelected.is_block == 0 ? 'Locked' :
                                'Normal' }}</strong> status in the system !</p>
                            <p>Name : <strong>{{ managerSelected.name }}</strong> </p>
                            <p>Email : <strong>{{ managerSelected.email }}</strong> </p>
                            <p>LINE User ID : <strong>{{ managerSelected.line_user_id }}</strong></p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" ref="closeButton"
                            id="close">Close</button>
                        <button type="button"
                            :class="{ 'btn': true, 'btn-outline-danger': managerSelected.is_block == 0, 'btn-outline-success': managerSelected.is_block == 1 }"
                            @click="deleteBook">
                            <i
                                :class="{ 'fa-solid': true, 'fa-lock': managerSelected.is_block == 0, 'fa-lock-open': managerSelected.is_block == 1 }"></i>
                            {{ managerSelected.is_block == 0 ? 'Lock' : 'UnLock' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import AdminRequest from '@/restful/AdminRequest';
import useEventBus from '@/composables/useEventBus';
const { emitEvent } = useEventBus();

export default {
    name: "LockManager",
    props: {
        managerSelected: Object
    },
    components: {

    },
    data() {
        return {
            dataSubmit: {
                is_block: '',
            }
        }
    },
    methods: {
        deleteBook: async function () {
            try {
                if (this.managerSelected.is_block == 0) this.dataSubmit.is_block = 1;
                else this.dataSubmit.is_block = 0;

                const { messages } = await AdminRequest.post('admin/block-manager/' + this.managerSelected.id, this.dataSubmit, true);
                emitEvent('eventSuccess', messages[0]);
                const closeButton = this.$refs.closeButton;
                closeButton.click();
                emitEvent('eventUpdateIsBlock', this.managerSelected.id); // gán lại giá trị is block  
            }
            catch (error) {
                if (error.errors) this.errors = error.errors;
                else for (let key in this.errors) this.errors[key] = null;
                if (error.messages) emitEvent('eventError', error.messages[0]);
            }
        },
    }
}
</script>

<style scoped>.modal-header .close {
    outline: none;
}</style>