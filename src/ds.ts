import { ContextInfo, Types, Web } from "gd-sprest-bs";
import Strings from "./strings";

// Item
export interface IItem extends Types.SP.ListItem { }

/**
 * Data Source
 */
export class DataSource {
    // Loads the list data
    static load(): PromiseLike<Array<IItem>> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Load the data
            Web(ContextInfo.siteServerRelativeUrl).Lists(Strings.Lists.Outages).Items().query({
                GetAllItems: true,
                OrderBy: ["Title"],
                Top: 5000
            }).execute(
                // Success
                items => { resolve(items.results as any); },
                // Error
                reject
            );
        });
    }
}