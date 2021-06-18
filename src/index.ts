import { ContextInfo, Helper } from "gd-sprest-bs";
import { Banner } from "./banner";
import { Configuration } from "./cfg";
import Strings from "./strings";

// Create the banner
const banner = new Banner();

// Create the global variable for this solution
window[Strings.GlobalVariable] = {
    Configuration,
    init: context => {
        // Set the page context
        ContextInfo.setPageContext(context);
    },
    render: el => {
        // Ensure an element was defined
        if (el == null) {
            // Create an element to render the banner to
            el = document.createElement("div");

            // Add the banner element as the first element on the page
            document.body.insertBefore(el, document.body.firstChild);
        }

        // Render the banner
        banner.render(el);
    },
    show: () => { banner.show(); }
}

// Notify SharePoint that the library has been loaded
Helper.SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs(Strings.AppElementId);