<template>
    <div id="main">
        <div>
            <h3 class="titleChannel"><i class="fa-brands fa-line"></i> Manage Broadcast - Mutilcast </h3>
        </div>
        <div class="ml-2 mt-2">
            <div class="mt-3">
                <div class="mb-2">
                    <div class="colorTitle"><i class="fa-solid fa-comments"></i> Manage Broadcast of Channel</div>
                </div>
                <div class="row m-0 pb-2 d-flex justify-content-end" id="search-sort">
                    <div class="col-1 pl-0" id="page">
                        <select content="Pagination" v-tippy class="form-control form-control-sm"
                            v-model="big_search.perPage">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div class="col-1 pl-0">
                        <select content="Sort by" v-tippy class="form-control form-control-sm"
                            v-model="big_search.typesort">
                            <option value="new">New</option>
                            <option value="name">Name</option>
                            <option value="status">Status</option>
                            <option value="status">Titile</option>
                        </select>
                    </div>
                    <div class="col-1 pl-0">
                        <select content="In direction" v-tippy class="form-control form-control-sm"
                            v-model="big_search.sortlatest">
                            <option value="false">Ascending</option>
                            <option value="true">Decrease</option>
                        </select>
                    </div>
                    <div class="col-2 pl-0">
                        <select content="Filter by delete" v-tippy class="form-control form-control-sm"
                            v-model="big_search.is_delete">
                            <option value="all">All Content</option>
                            <option value="1">Deleted Broadcast</option>
                            <option value="0">Normal Broadcast</option>
                        </select>
                    </div>
                    <div class="col-2 pl-0">
                        <select content="Filter by broadcast status" v-tippy class="form-control form-control-sm"
                            v-model="big_search.status">
                            <option value="all">All Broadcast</option>
                            <option value="draf">Draf</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="sent">Sent</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div class="col-1 pl-0" v-if="user.role == 'manager'">
                        <select content="Role" v-tippy class="form-control form-control-sm" v-model="big_search.role">
                            <option value="all">All</option>
                            <option value="manager">Manager</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    <div class="col-2 pl-0">
                        <div content="Search information broadcast" v-tippy class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></div>
                            </div>
                            <input v-model="search" type="text" class="form-control form-control-sm"
                                id="inlineFormInputGroup" placeholder="Seach...">
                        </div>
                    </div>
                    <div class="pr-1">
                        <div class="input-group ">
                            <button content="Test Send Mutilcast" v-tippy data-toggle="modal"
                                data-target="#testSendMutilcast" type="button" class="btn btn-info"><i
                                    class="fa-solid fa-message"></i></button>
                        </div>
                    </div>
                    <div class="pr-1">
                        <div class="input-group ">
                            <button content="Add Broadcast" v-tippy data-toggle="modal" data-target="#addBroadcast"
                                type="button" class="btn btn-success"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    <div class="pr-0" v-if="selectedBroadcasts.length > 0">
                        <div class="input-group">
                            <button @click="changedeleteManyBroadcast(1)" content="Delete Many Content" v-tippy
                                data-toggle="modal" data-target="#deleteManyBroadcast" type="button"
                                class="btn btn-outline-danger mr-1"><i class="fa-solid fa-trash"></i></button>
                            <button @click="changedeleteManyBroadcast(0)" content="Backup Many Content" v-tippy
                                data-toggle="modal" data-target="#deleteManyBroadcast" type="button"
                                class="btn btn-outline-success"><i class="fa-solid fa-trash-arrow-up"></i></button>
                        </div>
                    </div>
                </div>
                <div v-if="isLoading">
                    <TableLoading :cols="6" :rows="9"></TableLoading>
                </div>
                <div v-if="!isLoading" class="tableData">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col"><input ref="selectAllCheckbox" @change="selectAll()" type="checkbox"
                                        class=""></th>
                                <th scope="col">#</th>
                                <th scope="col"><i class="fa-solid fa-shapes"></i> Status</th>
                                <th scope="col"><i class="fa-solid fa-heading"></i> Title</th>
                                <th scope="col"><i class="fa-solid fa-user-clock"></i> Sender</th>
                                <th scope="col" class="text-center"><i class="fa-solid fa-clock"></i> Send At</th>
                                <th scope="col" class="text-center"><i class="fa-solid fa-calendar-day"></i> Created at</th>
                                <th scope="col" class="text-center"><i class="fa-solid fa-calendar-check"></i> Updated at
                                </th>
                                <th scope="col" class="text-center"><i class="fa-solid fa-user-pen"></i> Acction</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(broadcast, index) in broadcasts" :key="index">
                                <th class="table-cell" scope="row"><input :checked="isSelected(broadcast.id)"
                                        type="checkbox" class="" @change="handleSelect(broadcast.id)"></th>
                                <th class="table-cell" scope="row">#{{ (big_search.page - 1) * big_search.perPage + index +
                                    1 }}</th>
                                <td :class="{
                                    'table-cell': true, 'text-uppercase': true,
                                    'colorDraf': broadcast.status == 'draf',
                                    'colorScheduled': broadcast.status == 'scheduled',
                                    'colorSent': broadcast.status == 'sent',
                                    'colorFailed': broadcast.status == 'failed',
                                }">
                                    {{ broadcast.status }}</td>
                                <td class="table-cell ">
                                    <div class="contentTextTable" v-html="broadcast.title"></div>
                                </td>
                                <td class="table-cell">
                                    <div class="nameAvatar">
                                        <img :src="broadcast.sender_avatar ? broadcast.sender_avatar : require('@/assets/avatar.jpg')"
                                            alt="">
                                        <span class="nameMember">{{ broadcast.sender_name }}</span>
                                    </div>
                                </td>
                                <td class="table-cell text-center">{{ broadcast.sent_at }}</td>
                                <td class="table-cell text-center">{{ formatDate(broadcast.created_at) }}</td>
                                <td class="table-cell text-center">{{ formatDate(broadcast.updated_at) }}</td>
                                <td class="table-cell text-center">
                                    <button data-toggle="modal" data-target="#viewDetailBroadcast"
                                        v-tippy="{ content: 'View Detail' }" class="viewDetailBroadcast text-success"
                                        @click="selectBroadcast(broadcast)">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                    <button data-toggle="modal" data-target="#updateBroadcast"
                                        v-tippy="{ content: 'Update' }" class="updateBroadcast text-primary"
                                        @click="selectBroadcast(broadcast)">
                                        <i :class="{ 'fa-solid': true, 'fa-pen': true }"></i>
                                    </button>
                                    <button data-toggle="modal" data-target="#deleteBroadcast"
                                        v-tippy="{ content: broadcast.is_delete == 0 ? 'Delete' : 'Backup' }"
                                        class="deleteBroadcast text-danger" @click="selectBroadcast(broadcast)">
                                        <i
                                            :class="{ 'fa-solid': true, 'fa-trash': broadcast.is_delete == 0, 'fa-trash-arrow-up': broadcast.is_delete == 1 }"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="divpaginate" class="mt-2">
                    <paginate v-if="paginateVisible" :page-count="last_page" :page-range="3" :margin-pages="2"
                        :click-handler="clickCallback" :initial-page="big_search.page" :prev-text="'Prev'"
                        :next-text="'Next'" :container-class="'pagination'" :page-class="'page-item'">
                    </paginate>
                </div>
                <AddBroadcast :dataContents="dataContents" :channel="channel" :getBroadcasts="getBroadcasts"></AddBroadcast>
                <TestSendMulticast :dataContents="dataContents" :channel="channel" :getBroadcasts="getBroadcasts">
                </TestSendMulticast>
                <UpdateBroadcast :dataContents="dataContents" :channel="channel" :getBroadcasts="getBroadcasts"
                    :broadcastSelected="broadcastSelected"></UpdateBroadcast>
                <DeleteBroadcast :dataContents="dataContents" :channel="channel" :broadcastSelected="broadcastSelected"
                    :getStickerImageUrl="getStickerImageUrl"></DeleteBroadcast>
                <DetailBroadcast :dataContents="dataContents" :channel="channel" :broadcastSelected="broadcastSelected"
                    :getStickerImageUrl="getStickerImageUrl"></DetailBroadcast>
                <DeleteManyBroadcast :isDeleteChangeMany="isDeleteChangeMany" :selectedBroadcasts="selectedBroadcasts"
                    :getStickerImageUrl="getStickerImageUrl"></DeleteManyBroadcast>
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
import AddBroadcast from '@/components/user/manage-broadcast/AddBroadcast.vue'
import TestSendMulticast from '@/components/user/manage-broadcast/TestSendMulticast.vue'
import DeleteBroadcast from '@/components/user/manage-broadcast/DeleteBroadcast.vue'
import DetailBroadcast from '@/components/user/manage-broadcast/DetailBroadcast.vue'
import UpdateBroadcast from '@/components/user/manage-broadcast/UpdateBroadcast.vue'
import DeleteManyBroadcast from '@/components/user/manage-broadcast/DeleteManyBroadcast.vue'

export default {
    name: "ManageBroadcast",
    components: {
        paginate: Paginate,
        TableLoading,
        AddBroadcast,
        DeleteBroadcast,
        DeleteManyBroadcast,
        DetailBroadcast,
        UpdateBroadcast,
        TestSendMulticast,
    },

    data() {
        return {
            config: config,
            total: 0,
            last_page: 1,
            query: '',
            search: '',
            paginateVisible: true,
            big_search: {
                perPage: 5,
                page: 1,
                typesort: 'new',
                sortlatest: 'true',
                is_delete: '0',
                status: 'all',
                role: 'all',
            },
            broadcasts: [],
            broadcastSelected: {
                id: '',
                status: '',
                content_data: null,
                is_delete: null,
                creator_name: null,
                updater_name: null,
            },
            channel: {
                channel_id: null,
                channel_name: null,
                channel_secret: null,
                channel_access_token: null,
                picture_url: null,
            },
            dataContents: {
                stickers: null,
                images: null,
                texts: null,
            },
            selectedBroadcasts: [],
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
            // perPage: 5,
            // page: 1,
            // typesort: 'new',
            // sortlatest: 'true',
            // search: '',
            // is_delete: '0',
            // status: 'all',
            // role: 'all',
        }
    },

    setup() {
        document.title = "Manages Broadcast - Mutilcast | LINE Bot"
    },

    mounted() {
        emitEvent('eventTitleHeader', 'Channel Manages Broadcast - Mutilcast');
        this.user = JSON.parse(localStorage.getItem('user'));
        const queryString = window.location.search;
        const searchParams = new URLSearchParams(queryString);
        this.search = searchParams.get('search') || '';
        this.big_search = {
            perPage : parseInt(searchParams.get('paginate')) || 5,
            page : searchParams.get('page') || 1,
            typesort : searchParams.get('typesort') || 'new',
            sortlatest : searchParams.get('sortlatest') || 'true',
            is_delete : searchParams.get('is_delete') || '0',
            role : searchParams.get('role') || 'all',
            status : searchParams.get('status') || 'all',
        }
        // Note vì dưới có watch nên các tham số khởi tạo ban đầu này phải giống return data nếu không có sẽ gọi nhiều lần ứng với số param khác trên kia 
        // ví dụ trên is_delete là 'all' mà dưới này là 0 thì nó khác 
        this.getInforChannel();
        this.getBroadcasts();
        this.getDataContents();

        onEvent('updateBroadcastSuccess', (contentUpdate) => {
            this.contents.forEach(content => {
                if (content.id == contentUpdate.id) {
                    content.name = contentUpdate.name;
                    content.email = contentUpdate.email;
                    content.line_user_id = contentUpdate.line_user_id;
                }
            });
        });
        onEvent('eventUpdateIsDeleteBroadcast', (id_broadcast) => {
            this.broadcasts.forEach(broadcast => {
                if (broadcast.id == id_broadcast) {
                    if (broadcast.is_delete == 0) broadcast.is_delete = 1;
                    else broadcast.is_delete = 0;
                }
            });
        });

        onEvent('eventRegetBroadcast', () => {
            this.getBroadcasts();
        });
    },

    methods: {
        getStickerImageUrl(stickerId) {
            return `https://stickershop.line-scdn.net/stickershop/v1/sticker/${stickerId}/ANDROID/sticker.png`;
        },
        generateNumbers(start, end) {
            return Array.from({ length: end - start + 1 }, (_, index) => start + index);
        },
        getInforChannel: async function () {
            try {
                const { data } = await UserRequest.get('user/infor-channel');
                this.channel = data;
            }
            catch (error) {
                if (error.messages) emitEvent('eventError', error.messages[0]);
            }
        },
        getDataContents: async function () {
            var dataQuery = {
                search: ''
            };
            try {
                const { data } = await UserRequest.post('content/for-broadcast', dataQuery)
                this.dataContents = data;
            }
            catch (error) {
                if (error.messages) emitEvent('eventError', error.messages[0]);
            }
        },
        reRenderPaginate: function () { // cách xử lí initial-page cho paginate và v-if nó vì vuejs v-if là xóa hoàn toàn khỏi DOM 
            if (this.big_search.page > this.last_page) this.big_search.page = this.last_page; // cách xử lí page vượt quá dữ liệu đổ ra  
            this.paginateVisible = false;
            this.$nextTick(() => { this.paginateVisible = true; });
        },
        getBroadcasts: async function () {
            this.selectedBroadcasts = [];
            this.isLoading = true;
            this.query = '?search=' + this.search + '&typesort=' + this.big_search.typesort + '&sortlatest=' + this.big_search.sortlatest
                + '&is_delete=' + this.big_search.is_delete + '&status=' + this.big_search.status + '&role=' + this.big_search.role + '&paginate=' + this.big_search.perPage + '&page=' + this.big_search.page;
            window.history.pushState({}, null, this.query);

            try {
                const { data } = await UserRequest.get('broadcast/all' + this.query)
                this.broadcasts = data.data
                this.total = data.total;
                this.last_page = data.last_page;
                this.isLoading = false;
            }
            catch (error) {
                if (error.messages) emitEvent('eventError', error.messages[0]);
                this.isLoading = false;
            }
            this.reRenderPaginate();
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
            this.big_search.page = pageNum;
        },
        selectBroadcast: function (broadcastSelected) {
            emitEvent('selectSimpleBroadcast', broadcastSelected);
            this.broadcastSelected = broadcastSelected;
        },
        isSelected(contentId) {
            return this.selectedBroadcasts.includes(contentId);
        },
        handleSelect: function (contentId) {
            const index = this.selectedBroadcasts.indexOf(contentId);
            if (index === -1) this.selectedBroadcasts.push(contentId);
            else this.selectedBroadcasts.splice(index, 1);
        },
        selectAll: function () {
            const checkbox = this.$refs.selectAllCheckbox;
            if (checkbox.checked) this.selectedBroadcasts = this.broadcasts.map(broadcast => broadcast.id);
            else this.selectedBroadcasts = [];
        },
        changeIsDelete: async function (content) {
            this.broadcastSelected = content;
        },
        changedeleteManyBroadcast: function (is_delete) {
            emitEvent('selectManyBroadcast', this.broadcasts);
            this.isDeleteChangeMany = is_delete;
        },
    },
    watch: {
        big_search: {
            handler: function () {
                this.getBroadcasts();
            },
            deep: true // Theo dõi sâu vào các thuộc tính con của big_search
        }, // nên dùng như này thay vì tách các param ra riêng vì nó sẽ gọi hàm getBroadcasts nhiều lần , các param con thay đổi thì chỉ gọi hàm getBroadcasts 1 lần 
        search: _.debounce(function () {
            this.getBroadcasts();
        }, 500),
        // 'perPage': 'handleSearchSelect',
        // 'page': 'getBroadcasts',
        // 'typesort': 'getBroadcasts',
        // 'sortlatest': 'getBroadcasts',
        // 'is_delete': 'getBroadcasts',
        // 'status': 'getBroadcasts',
        // 'role': 'getBroadcasts',
    }
}
</script>

<style scoped>
.contentTextTable {
    max-width: 120px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

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

.nameAvatar img {
    width: 60px;
    height: 60px;
    object-fit: cover;
}

.deleteBroadcast .fa-trash:hover {
    transition: all 0.5s ease;
    color: red;
}

.deleteBroadcast .fa-trash-arrow-up:hover {
    transition: all 0.5s ease;
    color: green;
}

.deleteBroadcast {
    transition: all 0.5s ease;
    font-size: 22px;
}

.updateBroadcast {
    transition: all 0.5s ease;
    font-size: 22px;
}

.updateBroadcast .fa-pen:hover {
    transition: all 0.5s ease;
    color: #3366FF;
}

.viewDetailBroadcast {
    transition: all 0.5s ease;
    font-size: 22px;
}

.viewDetailBroadcast i:hover {
    transition: all 0.5s ease;
    color: var(--user-color);
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
    max-width: 100px;
    height: auto;
    object-fit: cover;
}

.table-cell {
    font-weight: bold;
    vertical-align: middle;
}

.imgInTable {
    display: flex;
    justify-content: center;
}

.imgInTable img {
    border-radius: 4px;
}

table button {
    padding: 1px 3px;
    margin-right: 2px;
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
