// src/services/zohoToken.js
import fs from "fs";
import axios from "axios";
import path from "path";

const TOKEN_FILE = path.join(process.cwd(), "secrets", "zoho_tokens.json");

export async function getAccessToken(clientId, clientSecret, refreshToken) {
  let tokens = {};
  if (fs.existsSync(TOKEN_FILE)) {
    tokens = JSON.parse(fs.readFileSync(TOKEN_FILE));
  }

  let accessToken = tokens.access_token;
  let expiresAt = tokens.expires_at || 0;

  if (!accessToken || Date.now() / 1000 > expiresAt) {
    const url = "https://accounts.zoho.com/oauth/v2/token";
    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token"
    });

    const { data } = await axios.post(url, params);

    accessToken = data.access_token;
    tokens.access_token = accessToken;
    tokens.expires_at = Math.floor(Date.now() / 1000) + (data.expires_in_sec || 3600);

    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens));
  }

  return accessToken;
}
