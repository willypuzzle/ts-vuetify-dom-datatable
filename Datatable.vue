<template>
    <div style="width: 100%;">
        <v-card class="datatable_search">
            <v-card-title>
                <slot name="custom_actions" :datatable="thisObject" :config="config">

                </slot>
                <v-btn v-if="add" icon color="primary" dark @click="activeAdd">
                    <v-icon dark>add</v-icon>
                </v-btn>
                <v-dialog v-if="add" v-model="addDialog" persistent :max-width="addWindowMaxWidth">
                    <v-card>
                        <v-card-title :class="dialogStyleObj.title.classes">
                            <span class="headline">
                                <slot name="create_title">{{ lang.add.title }}</slot>
                            </span>
                        </v-card-title>
                        <v-card-text class="">
                            <slot name="create_content"></slot>
                        </v-card-text>
                        <slot name="create_actions">
                            <v-card-actions style="position: relative; height: 60px">
                                <template v-if="!creationInProgress">
                                    <v-spacer v-if="dialogStyleObj.actions.position != 'left'"></v-spacer>
                                    <v-btn class="grey  lighten-2" flat small @click.native="addDialog = false;resetCreateData()">{{ lang.add.buttons.close }}</v-btn>
                                    <v-btn class="grey  lighten-2" flat small @click="dt_create">{{ lang.add.buttons.confirm }}</v-btn>
                                    <v-spacer v-if="dialogStyleObj.actions.position != 'right'"></v-spacer>
                                    <v-btn class="blue--text darken-1" flat @click="dt_create">{{ lang.add.buttons.confirm }}
                                    </v-btn>
                                </template>
                                <template v-else>
                                    <v-progress-circular
                                            style="position: absolute; left: calc(50% - 16px); top: calc(50% - 16px)"
                                            indeterminate class="primary--text"></v-progress-circular>
                                </template>
                            </v-card-actions>
                        </slot>
                    </v-card>
                </v-dialog>
                <v-dialog v-if="!disableDelete && selected.length > 0" v-model="deleteDialog" persistent
                          max-width="600px">
                    <v-btn icon color="error" dark slot="activator">
                        <v-icon dark>delete</v-icon>
                    </v-btn>
                    <v-card>
                        <v-card-title :class="dialogStyleObj.title.classes">
                            <span class="headline">
                                <slot name="delete_title">{{ lang.delete.title }}</slot>
                            </span>
                        </v-card-title>
                        <v-card-text :style="dialogStyleObj.text.style">
                            <slot name="delete_content">
                                <div v-html="lang.delete.content"></div>
                            </slot>
                        </v-card-text>
                        <slot name="delete_multi_actions">
                            <v-card-actions :class="dialogStyleObj.actions.classes">
                                <template v-if="!deletionInProgress">
                                    <v-spacer v-if="dialogStyleObj.actions.position != 'left'"></v-spacer>
                                    <!-- blue--text darken-1 -->
                                    <v-btn
                                            :color="dialogStyleObj.closeButton.color"
                                            :class="dialogStyleObj.closeButton.classes"
                                            :flat="dialogStyleObj.closeButton.flat"
                                            :small="dialogStyleObj.closeButton.small"
                                            :depressed="dialogStyleObj.closeButton.depressed"
                                            @click.native="deleteDialog = false"
                                    >{{ lang.delete.buttons.close }}
                                    </v-btn>
                                    <v-btn
                                            :color="dialogStyleObj.confirmButton.color"
                                            :class="dialogStyleObj.confirmButton.classes"
                                            :flat="dialogStyleObj.confirmButton.flat"
                                            :small="dialogStyleObj.confirmButton.small"
                                            :depressed="dialogStyleObj.confirmButton.depressed"
                                            @click="dt_multi_delete();"
                                    >
                                        {{ lang.delete.buttons.confirm }}
                                    </v-btn>
                                    <v-spacer v-if="dialogStyleObj.actions.position != 'right'"></v-spacer>
                                </template>
                                <template v-else>
                                    <v-progress-circular
                                            style="position: absolute; left: calc(50% - 16px); top: calc(50% - 16px)"
                                            indeterminate class="primary--text"></v-progress-circular>
                                </template>
                            </v-card-actions>
                        </slot>
                    </v-card>
                </v-dialog>
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
                    <tr class="primary white--text">
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
                        <th
                                v-for="header in props.headers"
                                v-if="!header.hidden"
                                class="white--text"
                                :width="header.width || ''"
                                :key="header.text"
                                :class="[header.sortable !== false ? 'column sortable' : '', pagination.descending ? 'desc' : 'asc', header.align ? `text-xs-${header.align}` : '', header.value === pagination.sortBy ? 'active' : '', header.class ? header.class : '']"
                                :style="header.style"
                                @click.prevent.stop="sort(header.value, header.sortable !== false)"
                        >
                            <v-icon dark class="yellow--text accent-4" v-if="header.sortable !== false">arrow_upward
                            </v-icon>
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
                    <slot
                            name="tr_columns"
                            :selected="props.selected || false"
                            :index="props.index"
                            :item="props.item"
                            :checkable="checkable"
                            :edit="dt_updateField"
                            :delete="!props.item.datatable_no_deletable_item ? dt_delete : null"
                    >
                        <tr :active="props.selected">
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
                    </slot>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-if="!disableGeneralError" v-model="generalErrorDialog" max-width="600px">
            <v-card>
                <v-card-title :class="dialogStyleObj.title.classes">
                    <slot name="general_error_title">
                        <span class="headline">
                            {{ lang.errors.general.title }}
                        </span>
                    </slot>
                </v-card-title>
                <v-card-text :style="dialogStyleObj.text.style">
                    <slot name="general_error_content">
                        {{ lang.errors.general.content }}
                    </slot>
                </v-card-text>
                <slot name="delete_actions">
                    <v-card-actions :class="dialogStyleObj.actions.classes">
                        <v-spacer v-if="dialogStyleObj.actions.position != 'left'"></v-spacer>
                        <v-btn
                                :color="dialogStyleObj.closeButton.color"
                                :class="dialogStyleObj.closeButton.classes"
                                :flat="dialogStyleObj.closeButton.flat"
                                :small="dialogStyleObj.closeButton.small"
                                :depressed="dialogStyleObj.closeButton.depressed"
                                @click.native="generalErrorDialog = false"
                        >
                            {{ lang.errors.general.buttons.close }}
                        </v-btn>
                        <v-spacer v-if="dialogStyleObj.actions.position != 'right'"></v-spacer>
                    </v-card-actions>
                </slot>
            </v-card>
        </v-dialog>
        <v-dialog v-model="singleDeleteDialog" persistent max-width="600px">
            <v-card>
                <v-card-title :class="dialogStyleObj.title.classes">
                    <slot name="single_delete_title">
                        <span class="headline">
                            {{ lang.single_delete.title }}
                        </span>
                    </slot>
                </v-card-title>
                <v-card-text :style="dialogStyleObj.text.style">
                    <slot name="single_delete_content">
                        <div v-html="lang.single_delete.content"></div>
                    </slot>
                </v-card-text>
                <slot name="delete_actions">
                    <v-card-actions :class="dialogStyleObj.actions.classes">
                        <v-spacer v-if="dialogStyleObj.actions.position != 'left'"></v-spacer>
                        <v-btn
                                :color="dialogStyleObj.closeButton.color"
                                :class="dialogStyleObj.closeButton.classes"
                                :flat="dialogStyleObj.closeButton.flat"
                                :small="dialogStyleObj.closeButton.small"
                                :depressed="dialogStyleObj.closeButton.depressed"
                                @click.native="singleDeleteDialog = false"
                        >
                            {{ lang.single_delete.buttons.close }}
                        </v-btn>
                        <v-btn
                                :color="dialogStyleObj.confirmButton.color"
                                :class="dialogStyleObj.confirmButton.classes"
                                :flat="dialogStyleObj.confirmButton.flat"
                                :small="dialogStyleObj.confirmButton.small"
                                :depressed="dialogStyleObj.confirmButton.depressed"
                                @click="dt_single_delete();"
                        >
                            {{ lang.single_delete.buttons.confirm }}
                        </v-btn>
                        <v-spacer v-if="dialogStyleObj.actions.position != 'right'"></v-spacer>
                    </v-card-actions>
                </slot>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
    import Vue, {ComponentOptions} from 'vue';
    import messages from './i18n/messages';
    import axios, {AxiosStatic} from 'axios'
    import _ from 'lodash'
    import {GENERAL_HELPER} from 'ts-vue-dom-helper';

    let clone = GENERAL_HELPER.clone;

    interface TransportCreateData {
        models: object;
        defaults?: object;
    }

    interface TransportCreate {
        data?: TransportCreateData;
        url: string;
        errors?: {
            codes?: {
                disabled?: Array<number>
            }
        }
    }

    interface TransportDelete {
        url(obj: any): string;
    }

    interface TransportRead {
        path?: string;
        data?: string;
        url?: string;
    }

    interface TransportMultiDelete {
        url: string;
    }

    interface TransportUpdate {
        url(obj: any): string;
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
        fallback: string;
        field?: string;
        json: string;
        searchable?: boolean;
        sortable?: boolean;
        text: string;
        value: string;
        width?: string;
    }

    interface DatatableComponent extends Vue {
        add: boolean;
        addDialog: boolean;
        axios: AxiosStatic;
        cacheDeleteItem: any;
        checkable: boolean;
        checkCodeErrors: Function;
        config: any;
        configuration: any;

        configureDialogStyle();

        configureDialogStyleDefault();

        configureDialogStyleSmileChat();

        creationInProgress: boolean;
        debounceSearchTime: number;
        deleteDialog: boolean;
        deletionInProgress: boolean;
        disableGeneralError: boolean;
        disableDelete: boolean;
        dialogsStyle: String;
        dialogStyleObj: any;
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
        created() {
            this.noDataText = this.lang.table.no_data_text;

            this.noResultsText = this.lang.table.no_results_text;

            this.rowsPerPageItems = [
                5,
                10,
                20,
                50,
                100,
                {text: this.lang.table.row_per_page_items.all, value: -1}
            ];

            this.rowsPerPageText = this.lang.table.row_per_page_text;

            this.resetCreateData();

            this.configureDialogStyle()
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
                default() {
                    return {
                        pagination: {
                            rowsPerPage: 10,
                            descending: false
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
            dialogsStyle: {
                type: String,
                default: 'default'
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
                required: true,
                default() {
                    return {
                        read: {},
                        create: {},
                        update: {},
                        delete: {},
                        multi_delete: {},
                    }
                }
            }
        },
        data() {
            return {
                thisObject: this,
                addDialog: false,
                axios: this.transport.axios || axios,
                cacheDeleteItem: null,
                config: {},
                creationInProgress: false,
                deleteDialog: false,
                deletionInProgress: false,
                dialogStyleObj: {},
                extra: {},
                generalErrorDialog: false,
                items: [],
                loading: false,
                noDataText: '',
                noResultsText: '',
                pagination: clone(this.configuration.pagination),
                rowsPerPageItems: [],
                rowsPerPageText: '',
                searching: '',
                selected: [],
                singleDeleteDialog: false,
                totalItems: 0
            }
        },
        computed: {
            lang() {
                let m = messages[this.locale];
                if (!m) {
                    return messages['it'];
                }
                return m;
            }
        },
        methods: {
            activeAdd() {
                this.resetCreateData();
                this.$nextTick(() => {
                    this.addDialog = true;
                })
            },
            changeSort(column: Header) {
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
            checkCodeErrors(err, codeErrors) {
                let c = false;
                if (err.response && codeErrors) {
                    let code = err.response.status;
                    _.each(codeErrors, (el) => {
                        if (el === code) {
                            c = true;
                        }
                    })
                }

                return c;
            },
            configureDialogStyle() {
                switch (this.dialogsStyle) {
                    case 'default':
                        this.configureDialogStyleDefault()
                        break;
                    case 'smile-chat':
                        this.configureDialogStyleSmileChat()
                        break;
                }
            },
            configureDialogStyleDefault() {
                this.dialogStyleObj.title = {
                    classes: ''
                }

                this.dialogStyleObj.text = {
                    style: ''
                }

                this.dialogStyleObj.actions = {
                    classes: '',
                    position: 'right'
                }

                this.dialogStyleObj.closeButton = {
                    classes: 'blue--text darken-1',
                    color: '',
                    flat: true,
                    small: false,
                    depressed: false
                }

                this.dialogStyleObj.confirmButton = {
                    classes: 'blue--text darken-1',
                    color: '',
                    flat: true,
                    small: false,
                    depressed: false
                }
            },
            configureDialogStyleSmileChat() {
                this.dialogStyleObj.title = {
                    classes: 'title primary white--text pa-3 justify-center dt-title-uppercase'
                }

                this.dialogStyleObj.text = {
                    style: 'min-height: 100px; text-align: center !important;'
                }

                this.dialogStyleObj.actions = {
                    classes: 'pb-3 pt-3',
                    position: 'center'
                }

                this.dialogStyleObj.closeButton = {
                    classes: '',
                    color: 'grey lighten-2',
                    flat: false,
                    small: true,
                    depressed: true
                }

                this.dialogStyleObj.confirmButton = {
                    classes: '',
                    color: 'grey lighten-2',
                    flat: false,
                    small: true,
                    depressed: true
                }
            },
            debounceSearch: _.debounce(function (value) {
                this.searching = value;
                let pagination = clone(this.pagination);
                pagination.page = 1;
                this.pagination = pagination;
            }, this.debounceSearchTime),
            dt_create() {
                let creationFunction = ($validator?) => {
                    let url = this.transport.create.url || false;
                    if (!url) {
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
                        let disableDialog = this.checkCodeErrors(err, _.get(this, 'transport.create.errors.codes.disabled', null));
                        this.generalErrorDialog = !disableDialog && true;
                        if ($validator && err.response && err.response.data) {
                            $validator.setErrors(err.response.data);
                        }
                        this.$emit('created-error', err);
                    }).then(() => {
                        this.creationInProgress = false;
                    });
                }

                let parent: any = this.$parent;

                if (parent.$validator && parent.$validator.validateAll) {
                    parent.$validator.validateAll().then((response) => {
                        if (response) {
                            creationFunction(parent.$validator);
                        }
                    })
                } else {
                    creationFunction();
                }
            },
            dt_delete(item) {
                this.cacheDeleteItem = item;
                this.singleDeleteDialog = true;
            },
            dt_multi_delete() {
                let url: string | boolean = this.transport.multi_delete.url || false;
                if (!url || this.selected.length === 0) {
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
                    let disableDialog = this.checkCodeErrors(err, _.get(this, 'transport.multi_delete.errors.codes.disabled', null));
                    this.generalErrorDialog = !disableDialog && true;
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
                    let disableDialog = this.checkCodeErrors(err, _.get(this, 'transport.delete.errors.codes.disabled', null));
                    this.generalErrorDialog = !disableDialog && true;
                    this.$emit('deleted-error', err);
                }).then(() => {
                    this.loading = false;
                });
            },
            dt_updateField(item, field, val, validator?: string) {
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
                        let disableDialog = this.checkCodeErrors(err, _.get(this, 'transport.update.errors.codes.disabled', null));
                        this.generalErrorDialog = !disableDialog && true;
                        this.$emit('update-error', err);
                    }).then(() => {
                        this.loading = false;
                    });
                }

                let parent: any = this.$parent;

                if (parent.$validator && parent.$validator.validate && validator) {
                    parent.$validator.validate(validator).then((response) => {
                        if (response) {
                            updateFunction();
                        }
                    })
                } else {
                    updateFunction();
                }
            },
            getColumns() {
                class LocalColumn {
                    public columns: Array<any> | string
                }

                let c = new LocalColumn();

                c.columns = [];

                let columns: Array<any> = c.columns;

                _.forEach(this.headers, (el) => {
                    columns.push(
                        {
                            name: el.field || el.value,
                            searchable: el.searchable !== undefined ? el.searchable : !el.checkbox,
                            json: el.json || false,
                            fallback: el.fallback || false
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
                params['extra'] = this.config.extra;
                params['search'] = {
                    value: this.searching
                };
                params['locale'] = this.locale;
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
                if (this.transport.read.data) {
                    return this.getDataFromObject(this.transport.read.data);
                }
                this.loading = true;
                return axios.get((this.transport.read.url), {
                    params: this.getParams()
                }).then(response => {
                    this.getDataFromObject(response.data);
                    this.loading = false;
                });
            },
            resetCreateData() {
                if (!this.transport.create.data) {
                    return;
                }
                let createData = this.transport.create.data.models;
                let defaults = this.transport.create.data.defaults || {};
                for (let index in createData) {
                    createData[index] = defaults[index] !== undefined ? clone(defaults[index]) : undefined;
                }
            },
            sort(value, sortable) {
                if (sortable) {
                    (<any>this.$refs.datatable).sort(value);
                }
            },
            toggle($event) {
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

