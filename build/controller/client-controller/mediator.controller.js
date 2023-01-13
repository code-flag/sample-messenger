"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initData = void 0;
const storage_manager_1 = require("../../model/database/main-database/file-storage/storage.manager");
const initData = () => __awaiter(void 0, void 0, void 0, function* () {
    let vendorList = yield (0, storage_manager_1.getVendors)();
    // console.log('vendors list', vendorList);
    return vendorList;
});
exports.initData = initData;
