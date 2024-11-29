// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { bls } from "@avalabs/avalanchejs";
import { base64ToUint8Array, isBase64 } from "../utils/base64";
import { isHex } from "../utils/hex";
import { Auth, AuthFactory } from "./auth";
import { BLS, BLSFactory } from "./bls";
import { ED25519, ED25519Factory } from "./ed25519";
import { Buffer } from "buffer";

export type AuthType = "bls" | "ed25519";

function decodePrivateKey(privateKey: string): Uint8Array {
  if (isHex(privateKey)) {
    return Buffer.from(privateKey, "hex");
  } else if (isBase64(privateKey)) {
    return base64ToUint8Array(privateKey);
  } else {
    throw new Error("Unsupported private key format");
  }
}

export function getAuthFactory(
  authType: AuthType,
  privateKeyString: string
): AuthFactory {
  const privateKeyBytes = decodePrivateKey(privateKeyString);
  const privateKeyHex = Buffer.from(privateKeyBytes).toString("hex");

  if (authType === "bls") {
    const privateKey = BLSFactory.hexToPrivateKey(privateKeyHex);
    return new BLSFactory(privateKey);
  } else if (authType === "ed25519") {
    const privateKey = ED25519Factory.hexToPrivateKey(privateKeyHex);
    return new ED25519Factory(privateKey);
  } else {
    throw new Error("Unsupported key type");
  }
}

export function getAuth(
  authType: AuthType,
  signer: Uint8Array,
  signature: Uint8Array
): Auth {
  if (authType === "bls") {
    return new BLS(
      bls.publicKeyFromBytes(signer),
      bls.signatureFromBytes(signature)
    );
  } else if (authType === "ed25519") {
    return new ED25519(signer, signature);
  } else {
    throw new Error("Unsupported key type");
  }
}