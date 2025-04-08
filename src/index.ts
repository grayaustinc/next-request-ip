import is from "./is";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

function getClientIpFromXForwardedFor(value?: string | null): string | null {
  if (!is.existy(value)) {
    return null;
  }

  if (!is.string(value)) {
    return null;
  }

  const forwardedIps = value.split(",").map((e) => {
    const ip = e.trim();
    if (ip.includes(":")) {
      const splitted = ip.split(":");
      // make sure we only use this if it's ipv4 (ip:port)
      if (splitted.length === 2) {
        return splitted[0];
      }
    }
    return ip;
  });

  for (let i = 0; i < forwardedIps.length; i++) {
    if (is.ip(forwardedIps[i])) {
      return forwardedIps[i];
    }
  }

  // If no value in the split list is an ip, return null
  return null;
}

function getClientIp(headers: ReadonlyHeaders): string | null {
  // Standard headers used by Amazon EC2, Heroku, and others.
  if (is.ip(headers.get("x-client-ip"))) {
    return headers.get("x-client-ip");
  }

  // Load-balancers (AWS ELB) or proxies.
  const xForwardedFor = getClientIpFromXForwardedFor(
    headers.get("x-forwarded-for")
  );
  if (is.ip(xForwardedFor)) {
    return xForwardedFor;
  }

  // Cloudflare.
  // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
  // CF-Connecting-IP - applied to every request to the origin.
  if (is.ip(headers.get("cf-connecting-ip"))) {
    return headers.get("cf-connecting-ip");
  }

  // DigitalOcean.
  // @see https://www.digitalocean.com/community/questions/app-platform-client-ip
  // DO-Connecting-IP - applied to app platform servers behind a proxy.
  if (is.ip(headers.get("do-connecting-ip"))) {
    return headers.get("do-connecting-ip");
  }

  // Fastly and Firebase hosting header (When forwared to cloud function)
  if (is.ip(headers.get("fastly-client-ip"))) {
    return headers.get("fastly-client-ip");
  }

  // Akamai and Cloudflare: True-Client-IP.
  if (is.ip(headers.get("true-client-ip"))) {
    return headers.get("true-client-ip");
  }

  // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.
  if (is.ip(headers.get("x-real-ip"))) {
    return headers.get("x-real-ip");
  }

  // (Rackspace LB and Riverbed's Stingray)
  // http://www.rackspace.com/knowledge_center/article/controlling-access-to-linux-cloud-sites-based-on-the-client-ip-address
  // https://splash.riverbed.com/docs/DOC-1926
  if (is.ip(headers.get("x-cluster-client-ip"))) {
    return headers.get("x-cluster-client-ip");
  }

  if (is.ip(headers.get("x-forwarded"))) {
    return headers.get("x-forwarded");
  }

  if (is.ip(headers.get("forwarded-for"))) {
    return headers.get("forwarded-for");
  }

  // Google Cloud App Engine
  // https://cloud.google.com/appengine/docs/standard/go/reference/request-response-headers

  if (is.ip(headers.get("x-appengine-user-ip"))) {
    return headers.get("x-appengine-user-ip");
  }

  // Cloudflare fallback
  // https://blog.cloudflare.com/eliminating-the-last-reasons-to-not-enable-ipv6/#introducingpseudoipv4
  if (headers) {
    if (is.ip(headers.get("Cf-Pseudo-IPv4"))) {
      return headers.get("Cf-Pseudo-IPv4");
    }
  }

  return null;
}

export default getClientIp;
