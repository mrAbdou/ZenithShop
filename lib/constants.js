export const LIMIT = 9;//limit represents the number of items per page for infinite load .

export const PAGINATION_MIN_LIMIT = 5;
export const PAGINATION_MAX_LIMIT = 20;

export const MAX_VISIBLE_NAVIGATION_BTN = 7;

export const minPrice = 0;

export const minProductIdLength = 24;

export const minOrderTotalPrice = 0;

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
export const minPasswordLength = 8;

export const productNameRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z0-9\s\-'"]+$/;
export const minProductNameLength = 3;
export const maxProductNameLength = 255;
export const productDescriptionRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z0-9\s\-'"]+$/;
export const maxProductDescriptionLength = 2000;

export const minCurrentPage = 1;

export const minLimit = 5;
export const maxLimit = 20;

export const minLengthUserName = 3;
export const maxLengthUserName = 50;
export const userNameRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z\s\-'.,!?]+$/;

export const searchQueryRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z0-9\s\-'.,!?]+$/;
export const seachQueryMaxLength = 100;

export const phoneNumberRegex = /^(\+213[0-9]{9}|[0-9]{10})$/;

export const addressRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z0-9 ,\.\-\(\)\/\\]+$/;
export const minLengthAddress = 10;
export const maxLengthAddress = 500;