<template>
    <div style="width: 100%;">
        <v-card class="datatable_search">
            <v-card-title>
                <v-dialog v-if="add" v-model="addDialog" persistent :max-width="addWindowMaxWidth">
                    <v-btn icon color="primary" dark slot="activator" >
                        <v-icon dark>add</v-icon>
                    </v-btn>
                    <v-card>
                        <v-card-title>
                            <span class="headline">
                                <slot name="create_title">{{ lang.add.title }}</slot>
                            </span>
                        </v-card-title>
                        <v-card-text>
                            <slot name="create_content"></slot>
                        </v-card-text>
                        <slot name="create_actions">
                            <v-card-actions style="position: relative; height: 60px">
                                <template v-if="!creationInProgress">
                                    <v-spacer></v-spacer>
                                    <v-btn class="blue--text darken-1" flat @click.native="addDialog = false;resetCreateData()">{{ lang.add.buttons.close }}</v-btn>
                                    <v-btn class="blue--text darken-1" flat @click="dt_create">{{ lang.add.buttons.confirm }}</v-btn>
                                </template>
                                <template v-else>
                                    <v-progress-circular style="position: absolute; left: calc(50% - 16px); top: calc(50% - 16px)" indeterminate class="primary--text"></v-progress-circular>
                                </template>
                            </v-card-actions>
                        </slot>
                    </v-card>
                </v-dialog>
                <v-dialog v-if="!disableDelete && selected.length > 0" v-model="deleteDialog" persistent>
                    <v-btn icon error dark slot="activator">
                        <v-icon dark>delete</v-icon>
                    </v-btn>
                    <v-card>
                        <v-card-title>
                            <span class="headline">
                                <slot name="delete_title">{{ lang.delete.title }}</slot>
                            </span>
                        </v-card-title>
                        <v-card-text>
                            <slot name="delete_content">
                                <div v-html="lang.delete.content"></div>
                            </slot>
                        </v-card-text>
                        <slot name="delete_multi_actions">
                            <v-card-actions>
                                <template v-if="!deletionInProgress">
                                    <v-spacer></v-spacer>
                                    <v-btn class="blue--text darken-1" flat @click.native="deleteDialog = false">{{ lang.delete.buttons.close }}</v-btn>
                                    <v-btn class="blue--text darken-1" flat @click="dt_multi_delete();">{{ lang.delete.buttons.confirm }}</v-btn>
                                </template>
                                <template v-else>
                                    <v-progress-circular style="position: absolute; left: calc(50% - 16px); top: calc(50% - 16px)" indeterminate class="primary--text"></v-progress-circular>
                                </template>
                            </v-card-actions>
                        </slot>
                    </v-card>
                </v-dialog>
                <slot name="custom_actions">

                </slot>
                <v-spacer></v-spacer>
                <v-text-field
                        append-icon="search"
                        :label="lang.search.fields.main"
                        single-line
                        hide-details
                        v-on:input="debounceSearch"
                        :disabled="hideActions"
                ></v-text-field>
            </v-card-title>
            <v-data-table
                    ref="datatable"
                    v-bind:headers="headers"
                    v-bind:items="items"
                    v-bind:pagination.sync="pagination"
                    :total-items="totalItems"
                    :loading="loading"
                    v-model="selected"
                    selected-key="id"
                    :select-all="checkable"
                    class="elevation-1"
                    :no-results-text="noResultsText"
                    :no-data-text="noDataText"
                    :rows-per-page-items="rowsPerPageItems"
                    :rows-per-page-text="rowsPerPageText"
                    :hide-actions="hideActions"
            >
                <template slot="headers" slot-scope="props">
                    <tr class="primary white--text" >
                        <th v-if="checkable" width="50px">
                            <v-checkbox
                                    primary
                                    dark
                                    class="white--text"
                                    @change="toggle"
                                    :input-value="props.all"
                                    :indeterminate="props.indeterminate"
                            ></v-checkbox>
                        </th>
                        <th class="white--text" :width="header.width || ''" v-for="header in props.headers" :key="header.text"
                            :class="[header.sortable !== false ? 'column sortable' : '', pagination.descending ? 'desc' : 'asc', header.align ? `text-xs-${header.align}` : '', header.value === pagination.sortBy ? 'active' : '', header.class ? header.class : '']" :style="header.style"
                            @click.prevent.stop="sort(header.value, header.sortable !== false)"
                        >
                            <v-icon dark class="yellow--text accent-4" v-if="header.sortable !== false">arrow_upward</v-icon>
                            <v-tooltip bottom>
                                <span slot="activator">
                                  {{ header.text }}
                                </span>
                                        <span>
                                  {{ header.text }}
                                </span>
                            </v-tooltip>
                        </th>
                    </tr>
                </template>
                <template slot="items" slot-scope="props">
                    <tr :active="props.selected" >
                        <td v-if="checkable">
                            <v-checkbox
                                    v-if="!props.item.datatable_no_deletable_item"
                                    primary
                                    class="primary--text"
                                    hide-details
                                    v-model="props.selected"
                            ></v-checkbox>
                        </td>
                        <slot
                                name="columns"
                                :selected="props.selected || false"
                                :index="props.index"
                                :item="props.item"
                                :edit="dt_updateField"
                                :delete="!props.item.datatable_no_deletable_item ? dt_delete : null"
                        ></slot>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-if="!disableGeneralError" v-model="generalErrorDialog">
            <v-card>
                <v-card-title>
                    <slot name="general_error_title">
                        <span class="headline">
                            {{ lang.errors.general.title }}
                        </span>
                    </slot>
                </v-card-title>
                <v-card-text>
                    <slot name="general_error_content">
                        {{ lang.errors.general.content }}
                    </slot>
                </v-card-text>
                <slot name="delete_actions">
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="blue--text darken-1" flat @click.native="generalErrorDialog = false">
                            {{ lang.errors.general.buttons.close }}
                        </v-btn>
                    </v-card-actions>
                </slot>
            </v-card>
        </v-dialog>
        <v-dialog v-model="singleDeleteDialog" persistent>
            <v-card>
                <v-card-title>
                    <slot name="single_delete_title">
                        <span class="headline">
                            {{ lang.single_delete.title }}
                        </span>
                    </slot>
                </v-card-title>
                <v-card-text>
                    <slot name="single_delete_content">
                        <div v-html="lang.single_delete.content"></div>
                    </slot>
                </v-card-text>
                <slot name="delete_actions">
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="blue--text darken-1" flat @click.native="singleDeleteDialog = false">
                            {{ lang.single_delete.buttons.close }}
                        </v-btn>
                        <v-btn class="blue--text darken-1" flat @click="dt_single_delete();">
                            {{ lang.single_delete.buttons.confirm }}
                        </v-btn>
                    </v-card-actions>
                </slot>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
    import Vue, { ComponentOptions } from 'vue';
    import messages from './i18n/messages';
    import axios, {AxiosStatic} from 'axios'
    import _ from 'lodash'

    let clone = (obj) : any => {
        if(Array.isArray(obj)){
            return obj.slice(0)
        }else if(obj !== null && typeof obj === 'object'){
            return _.extend({}, obj);
        }else{
            return obj;
        }
    }

    interface TransportCreateData {
        models: object;
        defaults?: object;
    }

    interface TransportCreate {
        data: TransportCreateData;
        url: string;
        errors?: {
            codes?: {
                disabled?: Array<number>
            }
        }
    }

    interface TransportDelete {
        url(obj: any) : string;
    }

    interface TransportRead {
        path?: string;
        url: string;
    }

    interface TransportMultiDelete {
        url: string;
    }

    interface TransportUpdate {
        url(obj: any) : string;
    }

    interface Transport {
        axios?: AxiosStatic;
        create: TransportCreate;
        delete: TransportDelete;
        multi_delete: TransportMultiDelete;
        read: TransportRead;
        update: TransportUpdate;
    }

    interface Header {
        align?: string;
        checkbox?: boolean;
        class?: string;
        field?: string;
        sortable?: boolean;
        text: string;
        value: string;
        width?: string;
    }

    interface DatatableComponent extends Vue{
        add: boolean;
        addDialog: boolean;
        axios: AxiosStatic;
        cacheDeleteItem: any;
        checkable: boolean;
        configuration: any;
        creationInProgress: boolean;
        debounceSearchTime: number;
        deleteDialog: boolean;
        deletionInProgress: boolean;
        disableGeneralError: boolean;
        disableDelete: boolean;
        generalErrorDialog: boolean;
        getColumns: Function;
        getDataFromObject: Function;
        getSortColumn: Function;
        getParams: Function;
        headers: Array<Header>;
        hideActions: boolean;
        items: Array<any>;
        lang: object;
        loadDataTablesData: Function;
        loading: boolean;
        locale: string;
        noDataText: string;
        noResultsText: string;
        pagination: any;
        resetCreateData: Function;
        rowsPerPageItems: Array<any>;
        rowsPerPageText: string;
        transport: Transport;
        searching: string;
        selected: Array<any>;
        singleDeleteDialog: boolean;
        sort: Function;
        toggle: Function;
        totalItems: number;
    }

    export {
        Header,
        Transport
    }

    export default {
        created(){
            this.noDataText = this.lang.table.no_data_text;

            this.noResultsText = this.lang.table.no_results_text;

            this.rowsPerPageItems = [
                5,
                10,
                20,
                50,
                100,
                { text: this.lang.table.row_per_page_items.all, value: -1 }
            ];

            this.rowsPerPageText = this.lang.table.row_per_page_text;

            this.resetCreateData();
        },
        props: {
            add: {
                type: Boolean,
                default: true
            },
            addWindowMaxWidth: {
                type: String,
                default: '500px'
            },
            checkable: {
                type: Boolean,
                default: true
            },
            configuration: {
                type: Object,
                default(){
                    return {
                        pagination: {
                            rowsPerPage: 10
                        }
                    }
                }
            },
            debounceSearchTime: {
                type: Number,
                default: 500
            },
            disableDelete: {
                type: Boolean,
                default: false
            },
            disableGeneralError: {
                type: Boolean,
                default: false
            },
            headers: {
                type: Array,
                required: true
            },
            hideActions: {
                type: Boolean,
                default: false
            },
            locale: {
                type: String,
                default: 'it'
            },
            transport: {
                type: Object,
                required: true
            }
        },
        data(){
            return {
                addDialog: false,
                axios: this.transport.axios || axios,
                cacheDeleteItem: null,
                creationInProgress: false,
                deleteDialog: false,
                deletionInProgress: false,
                generalErrorDialog: false,
                items: [],
                loading: false,
                noDataText: '',
                noResultsText: '',
                pagination: this.configuration.pagination,
                rowsPerPageItems: [],
                rowsPerPageText: '',
                searching: '',
                selected: [],
                singleDeleteDialog: false,
                totalItems: 0
            }
        },
        computed: {
            lang(){
                let m = messages[this.locale];
                if(!m){
                    return messages['it'];
                }
                return m;
            }
        },
        methods: {
            changeSort(column : Header) {
                let sortBy = column.value;

                if (column.sortable === false)
                    return false;

                if (this.pagination.sortBy === sortBy) {
                    if (this.pagination.descending)
                        this.pagination.sortBy = null;
                    else
                        this.pagination.descending = !this.pagination.descending;

                } else {
                    this.pagination.sortBy = sortBy;
                    this.pagination.descending = false;
                }
            },
            debounceSearch: _.debounce(function (value) {
                this.searching = value;
                let pagination = clone(this.pagination);
                pagination.page = 1;
                this.pagination = pagination;
            }, this.debounceSearchTime),
            dt_create() {
                let creationFunction = () => {
                    let url = this.transport.create.url || false;
                    if (!url){
                        return false;
                    }

                    this.creationInProgress = true;

                    let res = this.axios.post(url, this.transport.create.data.models).then((response) => {
                        this.addDialog = false;
                        this.resetCreateData();
                        this.loadDataTablesData();
                        this.$nextTick(() => {
                            this.$emit('created', response);
                        });
                        return response;
                    }).catch((err) => {
                        console.trace();
                        console.log(err)
                        let disableDialog = false;
                        let codeErrors = _.get(this, 'transport.create.errors.codes.disabled', null);
                        if(err.response && codeErrors){
                            let code = err.response.status;
                            _.each(codeErrors, (el) => {
                                if(el === code){
                                    disableDialog = true;
                                }
                            })
                        }
                        this.generalErrorDialog = !disableDialog && true;
                        this.$emit('created-error', err);
                    }).then(() => {
                        this.creationInProgress = false;
                    });
                }

                let parent : any = this.$parent;

                if(parent.$validator && parent.$validator.validateAll){
                    parent.$validator.validateAll().then((response) => {
                        if(response){
                            creationFunction();
                        }
                    })
                }else{
                    creationFunction();
                }
            },
            dt_delete(item) {
                this.cacheDeleteItem = item;
                this.singleDeleteDialog = true;
            },
            dt_multi_delete() {
                let url : string | boolean = this.transport.multi_delete.url || false;
                if (!url || this.selected.length === 0){
                    return false;
                }
                this.deletionInProgress = true;

                let res = axios.delete(url, {params: {items: JSON.stringify(this.selected)}}).then((response) => {
                    this.loadDataTablesData();
                    this.selected = [];
                    this.deleteDialog = false;
                    this.$nextTick(() => {
                        this.$emit('multi-deleted', response);
                    })
                }).catch((err) => {
                    console.trace();
                    console.log(err);
                    this.generalErrorDialog = true;
                    this.$emit('multi-deleted-error', err);
                }).then(() => {
                    this.deletionInProgress = false;
                });
            },
            dt_single_delete() {
                let url = this.transport.delete.url(this.cacheDeleteItem);

                this.loading = true;

                let res = axios.delete(url).then((response) => {
                    this.loadDataTablesData();
                    this.singleDeleteDialog = false
                    this.$nextTick(() => {
                        this.$emit('deleted', response);
                    });
                }).catch((err) => {
                    console.trace();
                    console.log(err);
                    this.generalErrorDialog = true;
                    this.$emit('deleted-error', err);
                }).then(() => {
                    this.loading = false;
                });
            },
            dt_updateField(item, field, val, validator? : string) {
                // Bug vuetify
                if (_.isObject(val) && !_.isArray(val))
                    return false;

                field = field.split(":");
                let field_db = field[1] || field[0];
                let field_param = field[0];
                this.loading = true;
                let obj = {
                    field: field_db,
                    [field_db]: val
                };

                let updateFunction = () => {
                    this.axios.put(this.transport.update.url(item), obj).then(response => {
                        item[field_param] = val;
                        this.$emit('update', response);
                    }).catch(err => {
                        console.trace();
                        console.log(err);
                        this.generalErrorDialog = true;
                        this.$emit('update-error', err);
                    }).then(() => {
                        this.loading = false;
                    });
                }

                let parent : any = this.$parent;

                if(parent.$validator && parent.$validator.validate && validator){
                    parent.$validator.validate(validator).then((response) => {
                        if(response){
                            updateFunction();
                        }
                    })
                }else{
                    updateFunction();
                }
            },
            getColumns() {
                class LocalColumn {
                    public columns: Array<any> | string
                }
                let c = new LocalColumn();

                c.columns = [];

                let columns : Array<any> = c.columns;

                _.forEach(this.headers, (el) => {
                    columns.push(
                        {
                            name: el.field || el.value,
                            searchable: el.searchable !== undefined ? el.searchable : !el.checkbox
                        }
                    )
                });

                c.columns = JSON.stringify(columns);

                return c;
            },
            getDataFromObject(response) {
                let result = this.transport.read.path ? _.get(response, this.transport.read.path) : response;
                this.items = result.data || result;
                this.totalItems = result.recordsTotal || this.items.length;
                this.$emit('loaded', result);
            },
            getParams(query_string) {
                let params = {};
                params['sort'] = clone(this.pagination);
                params['sort'].sortBy = this.getSortColumn(params['sort'].sortBy);
                params['search'] = {
                    value: this.searching
                };
                params = _.assign(params, this.getColumns());
                return query_string ? "?" + Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&') : params;
            },
            getSortColumn(field) {

                let f = _.find(this.headers, (el) => {
                    return el.value === field;
                });

                return !f ? "" : f.field || f.value;
            },
            loadDataTablesData() {
                this.loading = true;
                return axios.get((this.transport.read.url), {
                    params: this.getParams()
                }).then(response => {
                    this.getDataFromObject(response.data);
                    this.loading = false;
                });
            },
            resetCreateData(){
                let createData = this.transport.create.data.models;
                let defaults = this.transport.create.data.defaults || {};
                for(let index in createData){
                    createData[index] = defaults[index] !== undefined ? defaults[index] : null;
                }
            },
            sort(value, sortable){
                if(sortable){
                    (<any>this.$refs.datatable).sort(value);
                }
            },
            toggle($event){
                (<any>this.$refs.datatable).toggle($event)
            }
        },
        watch: {
            pagination: {
                handler() {
                    this.loadDataTablesData();
                },
                deep: true
            },
            'transport.read.url': function () {
                this.loadDataTablesData();
            }
        },
    } as ComponentOptions<DatatableComponent>;
</script>

