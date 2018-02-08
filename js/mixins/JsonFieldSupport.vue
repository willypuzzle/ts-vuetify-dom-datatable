
<script>import Vue from 'vue';
import _ from 'lodash';
import axios from 'axios';
import randomstring from 'randomstring';
export default Vue.extend({
    methods: {
        changeJson: _.debounce(function (value, item, jsonPath, field, urlBuilderFunction) {
            if (field === void 0) { field = 'label'; }
            if (urlBuilderFunction === void 0) { urlBuilderFunction = null; }
            var a = this.$axios || axios;
            var updateFunctionUrl = _.get(this, 'transport.update.url', null);
            var updateUrl = null;
            if (updateFunctionUrl) {
                updateUrl = updateFunctionUrl(item);
            }
            else if (urlBuilderFunction) {
                updateUrl = urlBuilderFunction(item);
            }
            else {
                throw "changeLabel: url builder function not found";
            }
            a.put(updateUrl, (_a = {
                    field: field
                },
                _a[field] = value,
                _a.path = jsonPath,
                _a));
            var _a;
        }, 500),
        manageJsonInCreation: function (value, models, pathField, randomField, field, path) {
            if (randomField === void 0) { randomField = null; }
            if (field === void 0) { field = 'label'; }
            if (path === void 0) { path = 'locale'; }
            if (randomField) {
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
