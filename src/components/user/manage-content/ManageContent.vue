<template>
    <div id="main">
        <div>
            <h3 class="titleChannel"><i class="fa-solid fa-envelope-open-text"></i> Manage Content </h3>
        </div>
        <div class="ml-2 mt-2">
            <div class="mt-3">
                <div class="mb-2">
                    <div class="colorTitle"><i class="fa-solid fa-bars-staggered"></i> Manage Content of Channel</div>
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
                    <div class="col-1 pl-0">
                        <select content="Sort by" v-tippy class="form-control form-control-sm" v-model="typesort">
                            <option value="new">New</option>
                            <option value="name">Name</option>
                            <option value="content_type">Content type</option>
                        </select>
                    </div>
                    <div class="col-1 pl-0">
                        <select content="In direction" v-tippy class="form-control form-control-sm" v-model="sortlatest">
                            <option value="false">Ascending</option>
                            <option value="true">Decrease</option>
                        </select>
                    </div>
                    <div class="col-2 pl-0">
                        <select content="Filter by delete" v-tippy class="form-control form-control-sm" v-model="is_delete">
                            <option value="all">All Content</option>
                            <option value="1">Deleted Content</option>
                            <option value="0">Normal Content</option>
                        </select>
                    </div>
                    <div class="col-2 pl-0">
                        <select content="Filter by content type" v-tippy class="form-control form-control-sm"
                            v-model="content_type">
                            <option value="all">All Content</option>
                            <option value="text">Text</option>
                            <option value="sticker">Sticker</option>
                            <option value="image">Image</option>
                        </select>
                    </div>
                    <div class="col-1 pl-0" v-if="user.role == 'manager'">
                        <select content="Role" v-tippy class="form-control form-control-sm" v-model="role">
                            <option value="all">All</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <div class="col-3 pl-0">
                        <div content="Search information content" v-tippy class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></div>
                            </div>
                            <input v-model="search" type="text" class="form-control form-control-sm"
                                id="inlineFormInputGroup" placeholder="Seach...">
                        </div>
                    </div>
                    <div class="pr-1">
                        <div class="input-group ">
                            <button content="Add Content" v-tippy data-toggle="modal" data-target="#addContent" type="button"
                                class="btn btn-success"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    <div class="pr-0" v-if="selectedContents.length > 0">
                        <div class="input-group">
                            <button @click="changeDeleteManyContent(1)" content="Delete Many Content" v-tippy
                                data-toggle="modal" data-target="#deleteManyContent" type="button"
                                class="btn btn-outline-danger mr-1"><i class="fa-solid fa-trash"></i></button>
                            <button @click="changeDeleteManyContent(0)" content="Backup Many Content" v-tippy
                                data-toggle="modal" data-target="#deleteManyContent" type="button"
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
                                <th scope="col"><i class="fa-solid fa-shapes"></i> Content Type</th>
                                <th scope="col"><i class="fa-solid fa-database"></i> Content Data</th>
                                <th scope="col"><i class="fa-solid fa-user-pen"></i> Creator</th>
                                <th scope="col"><i class="fa-solid fa-user-check"></i> Updater</th>
                                <th scope="col" class="text-center"><i class="fa-solid fa-calendar-day"></i> Created at</th>
                                <th scope="col" class="text-center"><i class="fa-solid fa-calendar-check"></i> Updated at</th>
                                <th scope="col" class="text-center"><i class="fa-solid fa-user-pen"></i> Acction</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(content, index) in contents" :key="index">
                                <th class="table-cell" scope="row"><input :checked="isSelected(content.id)" type="checkbox"
                                        class="" @change="handleSelect(content.id)"></th>
                                <th class="table-cell" scope="row">#{{ (page - 1) * perPage + index + 1 }}
                                </th>
                                <td :class="{'table-cell':true,'text-uppercase':true, 
                                    'colorText':content.content_type == 'text',
                                    'colorSticker':content.content_type == 'sticker',
                                    'colorImage':content.content_type == 'image'
                                    }"> 
                                    {{ content.content_type }}</td>
                                <td class="table-cell ">
                                    <div class="contentTextTable" v-if="content.content_type == 'text'" v-html="content.content_data.text">
                                    </div>
                                    <div class="imgInTable" v-if="content.content_type == 'sticker'">
                                        <img :src="getStickerImageUrl(content.content_data.stickerId)" alt="Sticker" />
                                    </div>
                                    <div class="imgInTable" v-if="content.content_type == 'image'">
                                        <img :src="content.content_data.originalContentUrl" alt="Image" />
                                    </div>
                                </td>
                                <td class="table-cell">
                                    <div class="nameAvatar">
                                        <img :src="content.creator_avatar ? content.creator_avatar : require('@/assets/avatar.jpg')"
                                            alt="">
                                        <span class="nameMember">{{ content.creator_name }}</span>
                                    </div>
                                </td>
                                <td class="table-cell">
                                    <div class="nameAvatar">
                                        <img :src="content.updater_avatar ? content.updater_avatar : require('@/assets/avatar.jpg')"
                                            alt="">
                                        <span class="nameMember">{{ content.updater_name }}</span>
                                    </div>
                                </td>
                                <td class="table-cell text-center">{{ formatDate(content.created_at) }}</td>
                                <td class="table-cell text-center">{{ formatDate(content.updated_at) }}</td>
                                <td class="table-cell text-center">
                                    <button data-toggle="modal" data-target="#viewDetailContent" v-tippy="{ content: 'View Detail' }"
                                        class="viewDetailContent text-success" @click="selectContent(content)">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                    <button data-toggle="modal" data-target="#updateContent" v-tippy="{ content: 'Update' }"
                                        class="updateContent text-primary" @click="selectContent(content)">
                                        <i :class="{ 'fa-solid': true, 'fa-pen': true }"></i>
                                    </button>
                                    <button data-toggle="modal" data-target="#deleteContent"
                                        v-tippy="{ content: content.is_delete == 0 ? 'Delete' : 'Backup' }"
                                        class="deleteContent text-danger" @click="selectContent(content)">
                                        <i
                                            :class="{ 'fa-solid': true, 'fa-trash': content.is_delete == 0, 'fa-trash-arrow-up': content.is_delete == 1 }"></i>
                                    </button>
                                </td>
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
                <AddContent :getContents="getContents"></AddContent>
                <UpdateContent :getContents="getContents" :contentSelected="contentSelected"></UpdateContent>
                <DeleteContent :contentSelected="contentSelected" :getStickerImageUrl="getStickerImageUrl"></DeleteContent>
                <DetailContent :contentSelected="contentSelected" :getStickerImageUrl="getStickerImageUrl"></DetailContent>
                <DeleteManyContent :isDeleteChangeMany="isDeleteChangeMany" :selectedContents="selectedContents" :getStickerImageUrl="getStickerImageUrl"></DeleteManyContent>
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
import AddContent from '@/components/user/manage-content/AddContent.vue'
import DeleteContent from '@/components/user/manage-content/DeleteContent.vue'
import DetailContent from '@/components/user/manage-content/DetailContent.vue'
import UpdateContent from '@/components/user/manage-content/UpdateContent.vue'
import DeleteManyContent from '@/components/user/manage-content/DeleteManyContent.vue'

export default {
    name: "ManageContent",
    components: {
        paginate: Paginate,
        TableLoading,
        AddContent,
        DeleteContent,
        DeleteManyContent,
        DetailContent,
        UpdateContent,
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
            content_type: 'all',
            role: 'all',
            query: '',
            contents: [],
            contentSelected: {
                id: '',
                content_type: '',
                content_data: null,
                is_delete: null,
                creator_name: null,
                updater_name: null,
            },
            selectedContents: [],
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
        document.title = "Manages Content | LINE Bot"
    },

    mounted() {
        emitEvent('eventTitleHeader', 'Channel Manages Content');
        this.user = JSON.parse(localStorage.getItem('user'));
        const queryString = window.location.search;
        const searchParams = new URLSearchParams(queryString);
        this.perPage = parseInt(searchParams.get('paginate')) || 5;
        this.typesort = searchParams.get('typesort') || 'new';
        this.sortlatest = searchParams.get('sortlatest') || 'true';
        this.search = searchParams.get('search') || '';
        this.is_delete = searchParams.get('is_delete') || '0';
        this.role = searchParams.get('role') || 'all';
        this.content_type = searchParams.get('content_type') || 'all';
        this.getContents();

        onEvent('updateContentSuccess', (contentUpdate) => {
            this.contents.forEach(content => {
                if (content.id == contentUpdate.id) {
                    content.name = contentUpdate.name;
                    content.email = contentUpdate.email;
                    content.line_user_id = contentUpdate.line_user_id;
                }
            });
        });
        onEvent('eventUpdateIsDeleteContent', (id_content) => {
            this.contents.forEach(content => {
                if (content.id == id_content) {
                    if (content.is_delete == 0) content.is_delete = 1;
                    else content.is_delete = 0;
                }
            });
        });

        onEvent('eventRegetcontents', () => {
            this.getContents();
        });
    },

    methods: {
        getStickerImageUrl(stickerId) {
            return `https://stickershop.line-scdn.net/stickershop/v1/sticker/${stickerId}/ANDROID/sticker.png`;
        },
        generateNumbers(start, end) {
            return Array.from({ length: end - start + 1 }, (_, index) => start + index);
        },
        getContents: async function () {
            this.selectedContents = [];
            this.isLoading = true;
            this.query = '?search=' + this.search + '&typesort=' + this.typesort + '&sortlatest=' + this.sortlatest
                + '&is_delete=' + this.is_delete + '&content_type=' + this.content_type + '&role=' + this.role + '&paginate=' + this.perPage + '&page=' + this.page;
            window.history.pushState({}, null, this.query);

            try {
                const { data } = await UserRequest.get('content/all' + this.query)
                this.contents = data.data
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
            this.getContents();
        },

        selectContent: function (contentSelected) {
            emitEvent('selectSimpleContent', contentSelected);
            this.contentSelected = contentSelected;
        },

        isSelected(contentId) {
            return this.selectedContents.includes(contentId);
        },

        handleSelect: function (contentId) {
            const index = this.selectedContents.indexOf(contentId);
            if (index === -1) this.selectedContents.push(contentId);
            else this.selectedContents.splice(index, 1);
        },

        selectAll: function () {
            const checkbox = this.$refs.selectAllCheckbox;
            if (checkbox.checked) this.selectedContents = this.contents.map(content => content.id);
            else this.selectedContents = [];
        },

        changeIsDelete: async function (content) {
            this.contentSelected = content;
        },

        changeDeleteManyContent: function (is_delete) {
            emitEvent('selectManyContent', this.contents);
            this.isDeleteChangeMany = is_delete;
        }

    },
    watch: {
        search: _.debounce(function () {
            this.handleSearchSelect();
        }, 500),
        'perPage': 'handleSearchSelect',
        'selectedCategory': 'handleSearchSelect',
        'page': 'getContents',
        'typesort': 'getContents',
        'sortlatest': 'getContents',
        'is_delete': 'getContents',
        'content_type': 'getContents',
        'role': 'getContents',
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

.deleteContent .fa-trash:hover {
    transition: all 0.5s ease;
    color: red;
}

.deleteContent .fa-trash-arrow-up:hover {
    transition: all 0.5s ease;
    color: green;
}

.deleteContent {
    transition: all 0.5s ease;
    font-size: 22px;
}

.updateContent {
    transition: all 0.5s ease;
    font-size: 22px;
}

.updateContent .fa-pen:hover {
    transition: all 0.5s ease;
    color: #3366FF;
}

.viewDetailContent {
    transition: all 0.5s ease;
    font-size: 22px;
}
.viewDetailContent i:hover {
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

.imgInTable  img {
    border-radius: 4px;
}

table button {
    padding: 1px 3px;
    margin-right: 2px;
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
