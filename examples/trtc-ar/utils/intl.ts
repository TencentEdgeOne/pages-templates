/**
 * true为独立站，false为国内站
 * @returns {boolean}
 */
export const isIntl = () => {
  return window.location.hostname.includes('.edgeone.app');
};
