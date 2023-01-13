import { getVendors } from "../../model/database/main-database/file-storage/storage.manager";

export const initData = async () => {
    let vendorList = await getVendors();
    // console.log('vendors list', vendorList);
    return vendorList;
}

