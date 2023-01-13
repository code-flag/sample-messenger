
import crypto from 'crypto';

export const UUID = () => {
    const id = crypto.randomBytes(16).toString("hex");
    return id;
}
