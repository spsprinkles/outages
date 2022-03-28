import { CanvasForm } from "dattatable";
import { Components } from "gd-sprest-bs";
import { DataSource } from "../ds";

// Styling
import "./styles.scss";

// Status
const Status = {
    Working: 0,
    Degraded: 1,
    Down: 2
}

/**
 * Banner
 */
export class Banner {
    private _el: HTMLElement = null
    private _items: { [key: number]: Array<any> } = null;

    // Constructor
    constructor() {
        // Create the element
        this._el = document.createElement("div");
        this._el.classList.add("banner");
    }

    // Returns the items
    private getItems() {
        let items = [];

        // Parse the items
        for (let key in Status) {
            // Add an entry for this status
            items = items.concat(this._items[Status[key]]);
        }

        // Return the items
        return items;
    }

    // Determines if the page is a popup or not
    private get isDialog(): boolean {
        // Determine if this is a popup
        return document.location.search.indexOf("IsDlg") > 0;
    }

    // Loads the data
    private load(): PromiseLike<void> {
        // Return a promise
        return new Promise(resolve => {
            // Loads the data
            DataSource.load().then(items => {
                // Clear the items
                this._items = {};
                for (let key in Status) {
                    // Add an entry for this status
                    this._items[Status[key]] = [];
                }

                // Parse the items
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];

                    // Determine the status
                    switch (item["Status"]) {
                        case "Degraded":
                            // Add the item
                            this._items[Status.Degraded].push(item);
                            break;

                        case "Down":
                            // Add the item
                            this._items[Status.Down].push(item);
                            break;

                        default:

                            // Add the item
                            this._items[Status.Working].push(item);
                            break;
                    }
                }

                // Resolve the promise
                resolve();
            });
        });
    }

    // Renders the alert
    render(el) {
        // Do nothing if this is a dialog
        if (this.isDialog) { return; }

        // Set this element
        this._el = el;

        // Ensure the data is loaded
        this.load().then(() => {
            // Default the values
            let alertContent = "";
            let alertType = Status.Working;

            // See if any services are down
            if (this._items[Status.Down].length > 0) {
                // Get the services
                let services = [];
                for (let i = 0; i < this._items[Status.Down].length; i++) {
                    // Add the service
                    services.push(this._items[Status.Down][i].Title);
                }

                // Set the alert properties
                alertContent = [
                    "<span>",
                    "<b>One or More Services Down</b>",
                    services.join(", "),
                    "</span>"
                ].join('\n');
                alertType = Status.Down;
            }

            // See if any are degraded
            if (this._items[Status.Degraded].length > 0) {
                // Get the services
                let services = [];
                for (let i = 0; i < this._items[Status.Degraded].length; i++) {
                    // Add the service
                    services.push(this._items[Status.Degraded][i].Title);
                }

                // Set the alert properties
                alertContent += [
                    "<span>",
                    "<b>One or More Services Experiencing Issues</b>",
                    services.join(", "),
                    "</span>"
                ].join('\n');
                alertType = alertType != Status.Down ? Status.Degraded : alertType;
            }

            // See if everything is working
            if (this._items[Status.Down].length + this._items[Status.Degraded].length == 0) {
                alertContent = [
                    "<span>",
                    "<b>All Services Operational</b>",
                    "</span>"
                ].join('\n');
            }

            // Add a custom message
            alertContent += '<span style="font-size: 1rem; font-style: italic">Click to View Additional Information</span>';

            // Render the alert
            let elAlert = document.createElement("div");
            elAlert.innerHTML = alertContent;
            elAlert.addEventListener("click", () => {
                // Show the slider
                this.show();
            });
            this._el.appendChild(elAlert);

            // Set the style
            elAlert.style.border = "1px solid transparent";
            elAlert.style.cursor = "pointer";
            elAlert.style.display = "flex";
            elAlert.style.fontSize = "1rem";
            elAlert.style.justifyContent = "space-between";
            elAlert.style.padding = "1rem";
            switch (alertType) {
                case Status.Degraded:
                    elAlert.style.backgroundColor = "#fff3cd";
                    elAlert.style.borderColor = "#ffecb5";
                    elAlert.style.color = "#664d03";
                    break;
                case Status.Down:
                    elAlert.style.backgroundColor = "#f8d7da";
                    elAlert.style.borderColor = "#f5c2c7";
                    elAlert.style.color = "#842029";
                    break;
                case Status.Working:
                    elAlert.style.backgroundColor = "#d1e7dd";
                    elAlert.style.borderColor = "#badbcc";
                    elAlert.style.color = "#0f5132";
                    break;
            }

            // Find the collapse button
            let btnCollapse = document.querySelector('button[title="Collapse content"]');
            if (btnCollapse) {
                // Hide the alert
                elAlert.style.display = "none";
            } else {
                // Try to find the expand button
                btnCollapse = document.querySelector('button[title="Expand content"]');
            }

            // Ensure the button was found
            if (btnCollapse) {
                // Add a click event
                btnCollapse.addEventListener("click", () => {
                    // Show/hide the button
                    elAlert.style.display = elAlert.style.display == "none" ? "flex" : "none";
                });
            }
        });
    }

    // Renders the slideout
    show() {
        // Set the header
        CanvasForm.setHeader("Outages");

        // Set the body
        CanvasForm.setBody("<p>Loading the data...</p>");

        // Load the data
        this.load().then(() => {
            // Set the body
            CanvasForm.setBody(Components.Table({
                rows: this.getItems(),
                columns: [
                    {
                        name: "Title",
                        title: "Service"
                    },
                    {
                        name: "Status",
                        title: "Status"
                    },
                    {
                        name: "StatusNotes",
                        title: "Additional Details"
                    }
                ]
            }).el);
        });

        // Show the slideout
        CanvasForm.show();
    }
}