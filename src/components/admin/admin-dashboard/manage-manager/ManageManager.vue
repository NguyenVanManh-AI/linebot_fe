<template>
    <div id="main">
        <div class="row m-0 pb-2 d-flex justify-content-end" id="search-sort">
            <div class="col-1 pl-0" id="page">
                <select content="Pagination" v-tippy class="form-control form-control-sm" v-model="perPage">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>
            <div class="col-2 pl-0">
                <select content="Sort by" v-tippy class="form-control form-control-sm" v-model="typesort">
                    <option value="new">New</option>
                    <option value="name">Name</option>
                    <option value="address">Address</option>
                    <option value="gender">Gender</option>
                </select>
            </div>
            <div class="col-2 pl-0">
                <select content="In direction" v-tippy class="form-control form-control-sm" v-model="sortlatest">
                    <option value="false">Ascending</option>
                    <option value="true">Decrease</option>
                </select>
            </div>
            <div class="col-2 pl-0">
                <select content="Filter by block" v-tippy class="form-control form-control-sm" v-model="is_block">
                    <option value="all">All Manager</option>
                    <option value="1">Locked Manager</option>
                    <option value="0">Normal Manager</option>
                </select>
            </div>
            <div class="col-3 pl-0">
                <div content="Search information manager" v-tippy class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></div>
                    </div>
                    <input v-model="search" type="text" class="form-control form-control-sm" id="inlineFormInputGroup"
                        placeholder="Seach...">
                </div>
            </div>
            <div class="pr-1">
                <div class="input-group ">
                    <button content="Add Account Manager" v-tippy data-toggle="modal" data-target="#addManager" type="button" class="btn btn-success"><i
                            class="fa-solid fa-plus"></i></button>
                </div>
            </div>
            <div class="pr-0" v-if="selectedManagers.length > 0">
                <div class="input-group">
                    <button @click="changeLockManyManager(1)" content="Lock Many Manager" v-tippy data-toggle="modal" data-target="#lockManyManager" type="button" class="btn btn-outline-danger mr-1"><i class="fa-solid fa-lock"></i></button>
                    <button @click="changeLockManyManager(0)" content="UnLock Many Manager" v-tippy data-toggle="modal" data-target="#lockManyManager" type="button" class="btn btn-outline-success"><i class="fa-solid fa-lock-open"></i></button>
                </div>
            </div>
        </div>
        <div v-if="isLoading"><TableLoading :cols="8" :rows="9"></TableLoading></div>
        <div v-if="!isLoading" class="tableData">
            <table class="table table-bordered" > <!-- table-striped -->
            <thead>
                <tr>
                    <th scope="col"><input ref="selectAllCheckbox" @change="selectAll()" type="checkbox" class=""></th>
                    <th scope="col">#</th>
                    <th scope="col"><i class="fa-solid fa-signature"></i> Full Name</th>
                    <th scope="col"><i class="fa-solid fa-users-between-lines"></i> Channel ID</th>
                    <th scope="col"><i class="fa-solid fa-envelope"></i> Email</th>
                    <th scope="col"><i class="fa-brands fa-line"></i> LINE User ID</th>
                    <th scope="col"><i class="fa-solid fa-phone"></i> Phone</th>
                    <th scope="col"><i class="fa-solid fa-location-dot"></i> Address</th>
                    <th scope="col"><i class="fa-solid fa-venus-mars"></i> Gender</th>
                    <th scope="col">Created at</th>
                    <th scope="col">Updated at</th>
                    <th scope="col"><i class="fa-solid fa-user-lock"></i> Acction</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(manager, index) in managers" :key="index">
                    <th class="table-cell" scope="row"><input :checked="isSelected(manager.id)" type="checkbox" class=""
                            @change="handleSelect(manager.id)"></th>
                    <th class="table-cell" scope="row">#{{(page-1)*perPage+index+1}}</th>
                    <td class="table-cell">
                        <div class="nameAvatar">
                            <img :src="manager.avatar ? manager.avatar : require('@/assets/avatar.jpg')" alt=""> <span class="nameManager">{{ manager.name}}</span> 
                        </div>
                    </td>
                    <td class="table-cell text-center">{{ manager.channel_id }}</td>
                    <td class="table-cell">{{ truncatedTitle(manager.email) }}</td>
                    <td class="table-cell">{{ truncatedTitle(manager.line_user_id) }}</td>
                    <td class="table-cell">{{ manager.phone ? manager.phone : 'N/A' }}</td>
                    <td class="table-cell">{{ manager.address ? truncatedTitle(manager.address) : 'N/A' }}</td>
                    <td class="table-cell">{{ manager.gender === 0 ? 'Male' : (manager.gender === 1 ? 'Female' : 'Others') }}</td>
                    <td class="table-cell">{{ formatDate(manager.created_at) }}</td>
                    <td class="table-cell">{{ formatDate(manager.updated_at) }}</td>
                    <td class="table-cell text-center">
                        <button data-toggle="modal" data-target="#lockManager" v-tippy="{ content: manager.is_block == 0 ? 'Lock' : 'UnLock' }" class="blockManager"  
                            @click="changeIsBlock(manager)">
                            <i :class="{'fa-solid':true, 'fa-lock' : manager.is_block == 0 , 'fa-lock-open' : manager.is_block == 1  }"></i>
                        </button>
                    </td>
                    <!-- @click="{manager.is_block = !manager.is_block ; changeIsBlock(manager)}"> -->
                </tr>
            </tbody>
        </table>
        </div>
        <div id="divpaginate" class="mt-2">
            <paginate :page-count="Math.ceil(this.total / this.perPage)" :page-range="3" :margin-pages="2"
                :click-handler="clickCallback" :initial-page="this.page" :prev-text="'Prev'" :next-text="'Next'"
                :container-class="'pagination'" :page-class="'page-item'">
            </paginate>
        </div>
        <AddManager :getManagers="getManagers"></AddManager>
        <LockManager :managerSelected="managerSelected"></LockManager>
        <LockManyManager :isLockChangeMany = "isLockChangeMany" :selectedManagers="selectedManagers" :managers="managers"></LockManyManager>
    </div>
</template>
<script>
import useEventBus from '@/composables/useEventBus'
import AdminRequest from '@/restful/AdminRequest';
const { emitEvent , onEvent } = useEventBus();
import Paginate from 'vuejs-paginate-next';
import config from '@/config';
import TableLoading from '@/components/common/TableLoading'
import AddManager from '@/components/admin/admin-dashboard/manage-manager/AddManager.vue'
import _ from 'lodash';
import LockManager from '@/components/admin/admin-dashboard/manage-manager/LockManager.vue'
import LockManyManager from '@/components/admin/admin-dashboard/manage-manager/LockManyManager.vue'

export default {
    name: "ManageManager",
    mounted() {
        emitEvent('eventTitleHeader', 'Manager Account');
        const queryString = window.location.search;
        const searchParams = new URLSearchParams(queryString);
        this.perPage = parseInt(searchParams.get('paginate')) || 5;
        this.typesort = searchParams.get('typesort') || 'new';
        this.sortlatest = searchParams.get('sortlatest') || 'true';
        this.search = searchParams.get('search') || '';
        this.is_delete = searchParams.get('is_delete') || 'all';
        this.is_block = searchParams.get('is_block') || 'all';
        this.getManagers();

        onEvent('eventRegetManagers',()=>{ this.getManagers();}); // add manager => reget
        onEvent('eventUpdateIsBlock',(id_manager)=>{ 
            this.managers.forEach(manager => {
                if(manager.id == id_manager) {
                    if(manager.is_block == 0) manager.is_block = 1;
                    else manager.is_block = 0;
                }
            });
        }); 
    },
    data() {
        return {
            config: config,
            total: 0,
            perPage: 5,
            page: 1,
            typesort: 'new',
            sortlatest: 'true',
            search: '',
            is_delete: 'all',
            is_block: 'all',
            query: '',
            managers: [],
            managerSelected: {
                id:'',
                name: '',
                email: '',
                line_user_id: '',
                is_block: null // thêm đây dấu , thì eslint sẽ báo lỗi 
            },
            selectedManagers: [],
            isLoading:false,
            isLockChangeMany : 0,
        }
    },
    setup() {
        document.title = "Manager Account | LINE Bot"
    },
    components: {
        paginate: Paginate,
        TableLoading,
        AddManager,
        LockManager,
        LockManyManager
    },
    methods: {
        getManagers: async function () {
            this.selectedManagers = [];
            this.isLoading = true;
            this.query = '?search=' + this.search + '&typesort=' + this.typesort + '&sortlatest=' + this.sortlatest
                + '&is_delete=' + this.is_delete + '&is_block=' + this.is_block + '&role=manager' + '&paginate=' + this.perPage + '&page=' + this.page;
            window.history.pushState({}, null, this.query);

            try {
                const { data } = await AdminRequest.get('admin/managers' + this.query)
                    this.managers = data.data
                    this.total = data.total;
                    this.isLoading = false;
            }
            catch(error) {
                if (error.messages) emitEvent('eventError', error.messages[0]);
                this.isLoading = false;
            }
        },
        truncatedTitle(title) {
            const maxLength = 150;
            if (title.length > maxLength) return title.slice(0, maxLength) + '...';
            else return title;
        },
        formatDate: function (date) {
            return date.split('T')[0]
        },
        clickCallback: function (pageNum) {
            this.page = pageNum;
        },
        handleSearchSelect() {
            this.page = 1;
            this.getManagers();
        },
        selectManager: function (managerSelected) {
            this.managerSelected = managerSelected;
        },
        // delete many 
        isSelected(managerId) {
            return this.selectedManagers.includes(managerId);
        },
        handleSelect: function (managerId) {
            const index = this.selectedManagers.indexOf(managerId);
            if (index === -1) this.selectedManagers.push(managerId);
            else this.selectedManagers.splice(index, 1);
        },
        selectAll: function () {
            const checkbox = this.$refs.selectAllCheckbox;
            if (checkbox.checked) this.selectedManagers = this.managers.map(manager => manager.id);
            else this.selectedManagers = [];
        },
        changeIsBlock: async function(manager) {
            this.managerSelected = manager;
        },
        changeLockManyManager: function(is_lock) {
            this.isLockChangeMany = is_lock;
        } 

    },
    watch: {
        search: _.debounce(function() {
            this.handleSearchSelect();
        }, 500), // search thì nên để ENGLISH 
        // 'search': 'handleSearchSelect', // không nên dùng như này // dẫn đến 429 to many request 
        'perPage': 'handleSearchSelect',
        'selectedCategory': 'handleSearchSelect',
        'page': 'getManagers',
        'typesort': 'getManagers',
        'sortlatest': 'getManagers',
        'is_block': 'getManagers',
    }

}
</script>
<style scoped>

tr th {
    color: var(--user-color);
}
.tableData {
    min-height: 40vh;
}
.nameAvatar {
    display: flex;
    align-items: center;
    align-content: center;
}

.blockManager .fa-lock:hover {
    transition: all 0.5s ease;
    color: red;
}
.blockManager .fa-lock-open:hover {
    transition: all 0.5s ease;
    color: green;
}

.blockManager {
    transition: all 0.5s ease;
    font-size: 22px;
}

.nameAvatar img {
    border-radius: 6px;
}

.nameManager {
    margin-left: 10px;    
}

#main {
    padding: 10px 20px;
}

#page {
    margin-right: auto;
}

table {
    font-size: 12px;
}

table img {
    width: 60px;
    height: 60px;
    object-fit: cover;
}

.table-cell {
    font-weight: bold;
    vertical-align: middle; 
    /* HAY - Canh giữa nội dung của ô trong table */
}

table button {
    padding: 1px 3px;
    margin-right: 2px;
}
</style>
