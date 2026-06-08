/** Query-param keys for deep-linked client / record modals */

export const CLIENT_MODAL_PARAMS = {
  TAB: "tab",
  WEB_CLIENT: "webClient",
  FISA: "fisa",
  CUSTOMERS_CLIENT: "client",
};

export const buildHomeRemindersWebClientSearch = (id) =>
  `${CLIENT_MODAL_PARAMS.TAB}=reminders&${CLIENT_MODAL_PARAMS.WEB_CLIENT}=${id}`;

export const buildHomeRemindersFisaSearch = (id) =>
  `${CLIENT_MODAL_PARAMS.TAB}=reminders&${CLIENT_MODAL_PARAMS.FISA}=${id}`;

export const buildHomeFisaSearch = (id) => `${CLIENT_MODAL_PARAMS.FISA}=${id}`;

export const buildCustomersClientSearch = (id) =>
  `${CLIENT_MODAL_PARAMS.CUSTOMERS_CLIENT}=${id}`;
