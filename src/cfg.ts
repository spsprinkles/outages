import { Helper, SPTypes } from "gd-sprest-bs";
import Strings from "./strings";

/**
 * SharePoint Assets
 */
export const Configuration = Helper.SPConfig({
    ListCfg: [
        {
            ListInformation: {
                Title: Strings.Lists.Outages,
                Description: Strings.ProjectDescription,
                BaseTemplate: SPTypes.ListTemplateType.GenericList
            },
            CustomFields: [
                {
                    name: "Status",
                    title: "Status",
                    type: Helper.SPCfgFieldType.Choice,
                    choices: [
                        "Coming Soon",
                        "Working",
                        "Degraded",
                        "Down"
                    ]
                } as Helper.IFieldInfoChoice,
                {
                    name: "StatusNotes",
                    title: "Status Notes",
                    type: Helper.SPCfgFieldType.Note,
                    noteType: SPTypes.FieldNoteType.EnhancedRichText
                } as Helper.IFieldInfoNote
            ],
            ViewInformation: [
                {
                    ViewName: "All Items",
                    ViewFields: [
                        "LinkTitle", "Status", "StatusNotes"
                    ],
                    ViewQuery: '<OrderBy><FieldRef Name="Title" /></OrderBy>'
                }
            ]
        }
    ]
});

// Installs a custom action to target classic pages
Configuration["CustomAction"] = Helper.SPConfig({
    CustomActionCfg: {
        Site: [
            {
                Name: Strings.GlobalVariable,
                Title: Strings.ProjectName,
                Location: "ScriptLink",
                Scope: 10000,
                ScriptBlock: 'var s = document.createElement("script"); s.src = "' + Strings.WebSourceUrl + '"; document.head.appendChild(s); SP.SOD.executeOrDelayUntilScriptLoaded(function() { ' + Strings.GlobalVariable + '.render(); }, "' + Strings.AppElementId + '");'
            }
        ]
    }
});