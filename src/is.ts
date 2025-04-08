const regexes = {
  ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
  ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
};

function existy(value?: string | null): value is string {
  return value != null;
}

function ip(value?: string | null): value is string {
  return (
    (existy(value) && regexes.ipv4.test(value)) ||
    (existy(value) && regexes.ipv6.test(value))
  );
}

function string(value?: string | null): value is string {
  return typeof value === "string";
}

export default {
  ip: ip,
  existy: existy,
  string: string,
};
