import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'OutagesBannerApplicationCustomizerStrings';

const LOG_SOURCE: string = 'OutagesBannerApplicationCustomizer';

// Reference the library
import "../../../../dist/outages.min.js";
declare var Outages;

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IOutagesBannerApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class OutagesBannerApplicationCustomizer
  extends BaseApplicationCustomizer<IOutagesBannerApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    // Initialize the solution
    Outages.init(this.context.pageContext);

    // Handle possible changes to the existence of placeholders
    this.context.placeholderProvider.changedEvent.add(this, this.renderBanner);

    // Resolve the request
    return Promise.resolve();
  }

  private _elBanner: HTMLElement = null;
  private renderBanner() {
    // Do nothing if we have already rendered it
    if (this._elBanner || document.querySelector("#outages-banner")) { return; }

    // Create the element
    this._elBanner = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top).domElement;
    if (this._elBanner) {
      this._elBanner.id = "outages-banner";

      // Generate the banner
      Outages.render(this._elBanner);

      // Add a click event
      window.addEventListener("click", () => {
        // Set the visibility
        this.setVisibility();
      });

      // Set the visibility
      this.setVisibility();
    } else {
      // Log
      console.log("[Outages] Error - Unable to create the banner element to render to.");
    }
  }

  // Sets the visibility of the banner
  private setVisibility() {
    // Ensure the element exists
    if (this._elBanner && this._elBanner.firstElementChild) {
      // See if the focus option is set
      if (document.querySelector(".od-TopBar-header-hidden")) {
        // Hide the banner
        this._elBanner.firstElementChild.classList.add("d-none");
      } else {
        // Show the banner
        this._elBanner.firstElementChild.classList.remove("d-none");
      }
    } else {
      // Log
      console.log("[Outages] Error - Unable to set visibility, the element doesn't exist.");
    }
  }
}
