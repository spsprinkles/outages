import { Components } from "gd-sprest-bs";

/**
 * Canvas Form
 */
class _CanvasForm {
    private _canvas: Components.IOffcanvas = null;
    private _elBody: HTMLElement = null;
    private _elHeader: HTMLElement = null;

    // Constructor
    constructor() {
        // Render the canvas
        this.render();
    }

    // Hides the canvas
    hide() { this._canvas.hide(); }

    // Renders the canvas
    private render() {
        // Create the element
        let el = document.createElement("div");
        el.id = "outages-banner-canvas";
        document.body.appendChild(el);

        // Render the canvas
        this._canvas = Components.Offcanvas({
            el,
            type: Components.OffcanvasTypes.Bottom,
            options: {
                autoClose: true,
                backdrop: true,
                focus: true,
                keyboard: true,
                scroll: false
            },
            onRenderBody: el => { this._elBody = el; },
            onRenderHeader: el => { this._elHeader = el; }
        });
    }

    // Sets the body
    setBody(content) {
        // Clear the body
        while (this._elBody.firstChild) { this._elBody.removeChild(this._elBody.firstChild); }

        // See if content exists
        if (content) {
            // See if this is text
            if (typeof (content) == "string") {
                // Set the html
                this._elBody.innerHTML = content;
            } else {
                // Append the element
                this._elBody.appendChild(content);
            }
        }
    }

    // Sets the header
    setHeader(content) {
        // Clear the body
        while (this._elHeader.firstChild) { this._elHeader.removeChild(this._elHeader.firstChild); }

        // See if content exists
        if (content) {
            // See if this is text
            if (typeof (content) == "string") {
                // Set the html
                this._elHeader.innerHTML = content;
            } else {
                // Append the element
                this._elHeader.appendChild(content);
            }
        }
    }

    // Shows the canvas
    show() { this._canvas.show(); }
}
export const CanvasForm = new _CanvasForm();