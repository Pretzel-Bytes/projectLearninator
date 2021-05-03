import { TemplateTemplate } from "./template-template.html.js";

const Template = {
    template: TemplateTemplate,
    mounted:function () {
       // Functions and Commands they get run when loaded
    },
    data: function () {
        return {
            // Shared variables and variables that will be in HTML
        }
    },
    methods: {
        // Functions that can be access via this.FunctionName() or via HTML
    } // end methods
} // end Template


export { Template }