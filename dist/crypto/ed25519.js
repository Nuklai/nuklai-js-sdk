"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIGNATURE_LENGTH = exports.PRIVATE_KEY_LENGTH = exports.PUBLIC_KEY_LENGTH = void 0;
exports.secretKeyFromBytes = secretKeyFromBytes;
exports.secretKeyToBytes = secretKeyToBytes;
exports.publicKeyFromBytes = publicKeyFromBytes;
exports.publicKeyToBytes = publicKeyToBytes;
exports.signatureFromBytes = signatureFromBytes;
exports.signatureToBytes = signatureToBytes;
exports.verify = verify;
exports.sign = sign;
const avalanchejs_1 = require("@avalabs/avalanchejs");
const ed25519_1 = require("@noble/ed25519");
const crypto_1 = require("crypto");
exports.PUBLIC_KEY_LENGTH = 32;
exports.PRIVATE_KEY_LENGTH = 32;
exports.SIGNATURE_LENGTH = 64;
function secretKeyFromBytes(skBytes) {
    return typeof skBytes === 'string' ? avalanchejs_1.utils.hexToBuffer(skBytes) : skBytes;
}
function secretKeyToBytes(sk) {
    return sk;
}
function publicKeyFromBytes(pkBytes) {
    return typeof pkBytes === 'string' ? avalanchejs_1.utils.hexToBuffer(pkBytes) : pkBytes;
}
function publicKeyToBytes(pk) {
    return pk;
}
function signatureFromBytes(sigBytes) {
    return sigBytes;
}
function signatureToBytes(sig) {
    return sig;
}
function verify(pk, sig, msg) {
    const message = typeof msg === 'string' ? avalanchejs_1.utils.hexToBuffer(msg) : msg;
    return (0, ed25519_1.verify)(sig, message, pk);
}
function sign(msg, sk) {
    const message = typeof msg === 'string' ? avalanchejs_1.utils.hexToBuffer(msg) : msg;
    return (0, ed25519_1.sign)(message, sk);
}
// Set the synchronous SHA-512 function
ed25519_1.etc.sha512Sync = (...messages) => {
    const hash = (0, crypto_1.createHash)('sha512');
    for (const message of messages) {
        hash.update(message);
    }
    return new Uint8Array(hash.digest());
};
//# sourceMappingURL=ed25519.js.map