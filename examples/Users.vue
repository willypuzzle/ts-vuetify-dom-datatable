<template>
    <div>
        <div v-if="dataLoaded">
            <my-datatable :headers="headers" :transport="transport" add>
                <template slot="columns" slot-scope="props">
                    <td class="text-xs-center">{{ props.item.id }}</td>
                    <td class="">
                        <v-edit-dialog
                                @open="props.item._name = props.item.name"
                                @cancel="props.item.name = props.item._name || props.item.name"
                                lazy
                        >
                            {{ props.item.name }}
                            <v-text-field
                                    slot="input"
                                    :label="$t('app.customer.sites.main.table.inputs.name.label')"
                                    single-line
                                    :value="props.item.name"
                                    v-validate="'required'"
                                    :name="'table-name-' + props.item.id"
                                    @change="props.edit(props.item,'name', $event, 'table-name-' + props.item.id)"
                            ></v-text-field>
                        </v-edit-dialog>
                    </td>
                    <td class="">
                        <v-edit-dialog
                                @open="props.item._address = props.item.address"
                                @cancel="props.item.address = props.item._address || props.item.address"
                                lazy
                        >
                            {{ props.item.address }}
                            <v-text-field
                                    slot="input"
                                    :label="$t('app.customer.sites.main.table.inputs.address.label')"
                                    single-line
                                    :value="props.item.address"
                                    v-validate="'required'"
                                    :name="'table-address-' + props.item.id"
                                    @change="props.edit(props.item,'address', $event, 'table-address-' + props.item.id)"
                            ></v-text-field>
                        </v-edit-dialog>
                    </td>
                    <td class="">
                        <v-select
                                :items="defaultVariableValuesSelectSiteStates"
                                v-model="props.item.state"
                                :label="$t('app.customer.sites.main.table.inputs.state.label')"
                                v-validate="'required'"
                                :name="'table-state-' + props.item.id"
                                @change="props.edit(props.item,'state', $event, 'table-state-' + props.item.id)"
                                single-line
                                bottom
                        ></v-select>
                    </td>
                    <td class="">
                        <v-btn @click="props.delete(props.item, $event)" icon color="error" dark>
                            <v-icon dark>delete</v-icon>
                        </v-btn>
                    </td>
                </template>
                <div slot="create_title">{{ $t('app.customer.sites.main.table.create.title') }}</div>
                <template slot="create_content" slot-scope="props">
                    <div>
                        <v-text-field
                                :label="$t('app.customer.sites.main.table.create.fields.name.label')"
                                v-validate="'required'"
                                name="create-name"
                                v-model="transport.create.data.models.name"
                                autocomplete="off"
                        ></v-text-field>
                        <v-text-field
                                :label="$t('app.customer.sites.main.table.create.fields.address.label')"
                                v-validate="'required'"
                                name="create-address"
                                v-model="transport.create.data.models.address"
                                autocomplete="off"
                        ></v-text-field>
                        <v-select
                                :items="defaultVariableValuesSelectSiteStates"
                                v-model="transport.create.data.models.state"
                                :label="$t('app.customer.sites.main.table.create.fields.state.label')"
                                v-validate="'required'"
                                name="create-state"
                                single-line
                                bottom
                        ></v-select>
                    </div>
                </template>
            </my-datatable>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue, { ComponentOptions } from 'vue';
    import axios from '../../../../wrappers/axios';

    import DefaultVariablesValues from '../../mixins/DefaultVariablesValues.vue';

    import {Header, Transport} from '../../../../libs/interfaces/datatable'
    import * as USER_STATES from '../../../../libs/constants/user-states'

    interface UsersComponent extends Vue{
        customer: any;
        dataLoaded: boolean;
        headers: Array<Header>;
        transport: Transport;
    }

    export default {
        mixins: [DefaultVariablesValues],
        props:{
            customer: {
                required: true
            }
        },
        data() {
            return {
                dataLoaded: false,
                headers: [
                    {
                        align: 'center',
                        class: 'text-xs-center',
                        text: this.$t('app.customer.users.main.table.headers.id.text'),
                        value: 'id',
                        width: '80px'
                    },
                    {
                        align: 'center',
                        text: this.$t('app.customer.users.main.table.headers.name.text'),
                        value: 'name',
                    },
                    {
                        align: 'center',
                        text: this.$t('app.customer.users.main.table.headers.address.text'),
                        value: 'role',//TODO
                    },
                    {
                        align: 'center',
                        text: this.$t('app.customer.users.main.table.headers.state.text'),
                        value: 'state',
                    },
                    {
                        align: 'center',
                        searchable: false,
                        sortable: false,
                        text: this.$t('app.customer.users.main.table.headers.delete.text'),
                        value: 'delete',
                        width: '50px'
                    }
                ],
                transport: {
                    axios: axios,
                    create: {
                        url: '',
                        data: {
                            models: {
                                address: null,
                                name: null,
                                state: null
                            },
                            defaults: {
                                address: null,
                                name: null,
                                state: USER_STATES.DISABLED
                            }
                        }
                    },
                    delete:{
                        url(obj : any) : string {
                            return '/admin/users/' + obj.id
                        }
                    },
                    multi_delete: {
                        url: '/admin/users/multi_delete'
                    },
                    read: {
                        url: ``
                    },
                    update: {
                        url(obj: any) : string {
                            return '/admin/users/' + obj.id
                        }
                    }
                },
            }
        },
        watch: {
            customer: {
                handler(value){
                    if(value){
                        let customerId = this.customer.id;
                        this.transport.read.url = `/admin/users/data/${customerId}`;
                        this.transport.create.url = `/admin/users/${customerId}`
                        this.dataLoaded = true;
                    }
                },
                deep: true
            }
        }
    } as ComponentOptions<UsersComponent>;
</script>