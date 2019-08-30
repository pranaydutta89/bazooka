import constants from "./constants";

export default {
  triggerAlert: (message, type = "info") => {
    const event = new CustomEvent(constants.domEvents.triggerAlert, {
      detail: {
        message,
        type
      }
    });

    document.dispatchEvent(event);
  },
  triggerSpinner: (show = true) => {
    const event = new CustomEvent(constants.domEvents.triggerSpinner, {
      detail: show
    });

    document.dispatchEvent(event);
  }
};
