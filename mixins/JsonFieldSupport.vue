<script lang="ts">
    import Vue from 'vue';
    import _ from 'lodash';
    import axios from 'axios'
    import randomstring from 'randomstring'

    export default Vue.extend({
        methods: {
            changeJson: _.debounce(function(value, item, jsonPath, field = 'label', urlBuilderFunction : Function = null){
                let a = this.$axios || axios;
                let updateFunctionUrl = _.get(this, 'transport.update.url', null);
                let updateUrl : any = null;
                if(updateFunctionUrl){
                    updateUrl = updateFunctionUrl(item)
                }else if(urlBuilderFunction){
                    updateUrl = urlBuilderFunction(item)
                }else{
                    throw `changeLabel: url builder function not found`
                }
                a.put(updateUrl, {
                    field: field,
                    [field]: value,
                    path: jsonPath
                })
            }, 500),
            manageJsonInCreation(value, models, pathField, randomField = null, field = 'label', path = 'locale'){
                if(randomField){
                    models[randomField] = randomstring.generate({
                        length: 32,
                        charset: 'hex'
                    });
                }

                models[field] = value;
                models[path] = pathField;
            }
        }
    });
</script>