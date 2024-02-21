<template>
    <div id="main">
        <div>
            <h3 class="titleChannel"><i class="fa-brands fa-line"></i> Channel management #{{ user.channel_id }}</h3>
        </div>
        <div class="ml-2 mt-2">
            <div>
                <div class="col-12 mt-2">
                    <div class="row">
                        <div class="colorTitle"><i class="fa-solid fa-key"></i> Information Channel</div>
                    </div>
                    <div class="row mb-3">
                        <UpdateInformationChannel></UpdateInformationChannel>
                    </div>
                </div>
            </div>
            <hr>
            <div class="mt-3">
                <div class="mb-2">
                    <div class="colorTitle"><i class="fa-solid fa-users-line"></i> Manage Account Members</div>
                </div>
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
                            <option value="gender">Gender</option>
                            <option value="address">Address</option>
                            <option value="phone">Phone</option>
                        </select>
                    </div>
                    <div class="col-2 pl-0">
                        <select content="In direction" v-tippy class="form-control form-control-sm" v-model="sortlatest">
                            <option value="false">Ascending</option>
                            <option value="true">Decrease</option>
                        </select>
                    </div>
                    <div class="col-2 pl-0">
                        <select content="Filter by delete" v-tippy class="form-control form-control-sm" v-model="is_delete">
                            <option value="all">All Member</option>
                            <option value="1">Deleted Member</option>
                            <option value="0">Normal Member</option>
                        </select>
                    </div>
                    <div class="col-3 pl-0">
                        <div content="Search information member" v-tippy class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></div>
                            </div>
                            <input v-model="search" type="text" class="form-control form-control-sm"
                                id="inlineFormInputGroup" placeholder="Seach...">
                        </div>
                    </div>
                    <div class="pr-1">
                        <div class="input-group ">
                            <button content="Add Account Member" v-tippy data-toggle="modal" data-target="#addMember"
                                type="button" class="btn btn-success"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    <div class="pr-0" v-if="selectedMembers.length > 0">
                        <div class="input-group">
                            <button @click="changeDeleteManyMember(1)" content="Delete Many Member" v-tippy
                                data-toggle="modal" data-target="#deleteManyMember" type="button"
                                class="btn btn-outline-danger mr-1"><i class="fa-solid fa-trash"></i></button>
                            <button @click="changeDeleteManyMember(0)" content="Backup Many Member" v-tippy
                                data-toggle="modal" data-target="#deleteManyMember" type="button"
                                class="btn btn-outline-success"><i class="fa-solid fa-trash-arrow-up"></i></button>
                        </div>
                    </div>
                </div>
                <div v-if="isLoading">
                    <TableLoading :cols="8" :rows="9"></TableLoading>
                </div>
                <div v-if="!isLoading" class="tableData">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col"><input ref="selectAllCheckbox" @change="selectAll()" type="checkbox"
                                        class=""></th>
                                <th scope="col">#</th>
                                <th scope="col"><i class="fa-solid fa-signature"></i> Full Name</th>
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
                            <tr v-for="(member, index) in members" :key="index">
                                <th class="table-cell" scope="row"><input :checked="isSelected(member.id)" type="checkbox"
                                        class="" @change="handleSelect(member.id)"></th>
                                <th class="table-cell" scope="row">#{{ (page - 1) * perPage + index + 1 }}</th>
                                <td class="table-cell">
                                    <div class="nameAvatar">
                                        <img :src="member.avatar ? member.avatar : require('@/assets/avatar.jpg')" alt="">
                                        <span class="nameMember">{{ member.name }}</span>
                                    </div>
                                </td>
                                <td class="table-cell">{{ truncatedTitle(member.email) }}</td>
                                <td class="table-cell">{{ truncatedTitle(member.line_user_id) }}</td>
                                <td class="table-cell text-center">{{ member.phone ? member.phone : 'N/A' }}</td>
                                <td class="table-cell">{{ member.address ? truncatedTitle(member.address) : 'N/A' }}</td>
                                <td class="table-cell text-center">{{ member.gender === 0 ? 'Male' : (member.gender === 1 ?
                                    'Female'
                                    : 'Others') }}</td>
                                <td class="table-cell text-center">{{ formatDate(member.created_at) }}</td>
                                <td class="table-cell text-center">{{ formatDate(member.updated_at) }}</td>
                                <td class="table-cell text-center">
                                    <button data-toggle="modal" data-target="#deleteMember"
                                        v-tippy="{ content: member.is_delete == 0 ? 'Delete' : 'Backup' }"
                                        class="deleteMember" @click="changeIsDelete(member)">
                                        <i
                                            :class="{ 'fa-solid': true, 'fa-trash': member.is_delete == 0, 'fa-trash-arrow-up': member.is_delete == 1 }"></i>
                                    </button>
                                    <button data-toggle="modal" data-target="#updateMember" v-tippy="{ content: 'Update' }"
                                        class="updateMember" @click="changeIsDelete(member)">
                                        <i :class="{ 'fa-solid': true, 'fa-pen': true }"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="divpaginate">
                    <paginate :page-count="Math.ceil(this.total / this.perPage)" :page-range="3" :margin-pages="2"
                        :click-handler="clickCallback" :initial-page="this.page" :prev-text="'Prev'" :next-text="'Next'"
                        :container-class="'pagination'" :page-class="'page-item'">
                    </paginate>
                </div>
                <AddMember :getMembers="getMembers"></AddMember>
                <DeleteMember :memberSelected="memberSelected"></DeleteMember>
                <DeleteManyMember :isDeleteChangeMany="isDeleteChangeMany" :selectedMembers="selectedMembers"
                    :members="members">
                </DeleteManyMember>
                <UpdateMember :memberSelected="memberSelected"></UpdateMember>
            </div>
        </div>
    </div>
</template>
<script>
import useEventBus from '@/composables/useEventBus'
import UserRequest from '@/restful/UserRequest';
const { emitEvent, onEvent } = useEventBus();
import Paginate from 'vuejs-paginate-next';
import config from '@/config';
import TableLoading from '@/components/common/TableLoading'
import _ from 'lodash';
import AddMember from '@/components/user/member-account/AddMember.vue'
import DeleteMember from '@/components/user/member-account/DeleteMember.vue'
import DeleteManyMember from '@/components/user/member-account/DeleteManyMember.vue'
import UpdateMember from '@/components/user/member-account/UpdateMember.vue'
import UpdateInformationChannel from '@/components/user/member-account/UpdateInformationChannel.vue'

export default {
    name: "ManageMember",
    mounted() {
        this.checkManager();
        emitEvent('eventTitleHeader', 'Channel manages - Member Account');
        const queryString = window.location.search;
        const searchParams = new URLSearchParams(queryString);
        this.perPage = parseInt(searchParams.get('paginate')) || 5;
        this.typesort = searchParams.get('typesort') || 'new';
        this.sortlatest = searchParams.get('sortlatest') || 'true';
        this.search = searchParams.get('search') || '';
        this.is_delete = searchParams.get('is_delete') || '0';
        this.getMembers();

        onEvent('updateMemberSuccess', (memberUpdate) => {
            this.members.forEach(member => {
                if (member.id == memberUpdate.id) {
                    member.name = memberUpdate.name;
                    member.email = memberUpdate.email;
                    member.line_user_id = memberUpdate.line_user_id;
                }
            });
        });
        onEvent('eventUpdateIsDelete', (id_member) => {
            this.members.forEach(member => {
                if (member.id == id_member) {
                    if (member.is_delete == 0) member.is_delete = 1;
                    else member.is_delete = 0;
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
            query: '',
            members: [],
            memberSelected: {
                id: '',
                name: '',
                email: '',
                line_user_id: '',
                is_delete: null
            },
            selectedMembers: [],
            isLoading: false,
            isDeleteChangeMany: 0,
            user: {
                id: null,
                email: null,
                role: null,
                line_user_id: null,
                channel_id: null,
                name: null,
                phone: null,
                avatar: null,
                address: null,
                gender: null,
                date_of_birth: null,
                is_block: null,
                is_delete: null,
                email_verified_at: null,
                created_at: null,
                updated_at: null,
                expires_in: null,
                token_type: null,
                access_token: null,
            },
        }
    },

    setup() {
        document.title = "Member Account | LINE Bot"
    },

    components: {
        paginate: Paginate,
        TableLoading,
        AddMember,
        DeleteMember,
        DeleteManyMember,
        UpdateMember,
        UpdateInformationChannel
    },

    methods: {
        checkManager: function () {
            var user = JSON.parse(localStorage.getItem('user'));
            if (user.role != 'manager') this.$router.push({ name: 'AccountSetting' });
            else this.user = user;
        },
        getMembers: async function () {
            this.selectedMembers = [];
            this.isLoading = true;
            this.query = '?search=' + this.search + '&typesort=' + this.typesort + '&sortlatest=' + this.sortlatest
                + '&is_delete=' + this.is_delete + '&is_delete=' + this.is_delete + '&role=user' + '&paginate=' + this.perPage + '&page=' + this.page;
            window.history.pushState({}, null, this.query);

            try {
                const { data } = await UserRequest.get('user/members' + this.query)
                this.members = data.data
                this.total = data.total;
                this.isLoading = false;
            }
            catch (error) {
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
            this.getMembers();
        },

        selectMember: function (memberSelected) {
            this.memberSelected = memberSelected;
        },

        isSelected(memberId) {
            return this.selectedMembers.includes(memberId);
        },

        handleSelect: function (memberId) {
            const index = this.selectedMembers.indexOf(memberId);
            if (index === -1) this.selectedMembers.push(memberId);
            else this.selectedMembers.splice(index, 1);
        },

        selectAll: function () {
            const checkbox = this.$refs.selectAllCheckbox;
            if (checkbox.checked) this.selectedMembers = this.members.map(member => member.id);
            else this.selectedMembers = [];
        },

        changeIsDelete: async function (member) {
            this.memberSelected = member;
        },

        changeDeleteManyMember: function (is_delete) {
            this.isDeleteChangeMany = is_delete;
        }

    },
    watch: {
        search: _.debounce(function () {
            this.handleSearchSelect();
        }, 500),
        'perPage': 'handleSearchSelect',
        'selectedCategory': 'handleSearchSelect',
        'page': 'getMembers',
        'typesort': 'getMembers',
        'sortlatest': 'getMembers',
        'is_delete': 'getMembers',
    }
}
</script>

<style scoped>
.titleChannel {
    font-size: 19px;
    color: var(--user-color);
}

tr th {
    color: var(--user-color);
}

.colorTitle {
    color: gray;
}

.tableData {
    min-height: 20vh;
}

.nameAvatar {
    display: flex;
    align-items: center;
    align-content: center;
}

.deleteMember .fa-trash:hover {
    transition: all 0.5s ease;
    color: red;
}

.deleteMember .fa-trash-arrow-up:hover {
    transition: all 0.5s ease;
    color: green;
}

.deleteMember {
    transition: all 0.5s ease;
    font-size: 16px;
}

.updateMember {
    transition: all 0.5s ease;
    font-size: 16px;
}

.updateMember .fa-pen:hover {
    transition: all 0.5s ease;
    color: #3366FF;
}

.nameAvatar img {
    border-radius: 6px;
}

.nameMember {
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
}

table button {
    padding: 1px 3px;
    margin-right: 2px;
}
</style>
