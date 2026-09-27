function rpIdOf(c: any, db: any): string {
  const explicit = getStrSetting(db, "webauthn_rp_id")
  if (explicit) return explicit

  // 优先从 Host 请求头拿域名（浏览器实际访问的域名）
  const host = c.req.header("Host") || c.req.header("host")
  if (host) {
    // 去掉端口号（IPv6 地址要用 [ ] 包裹，这里简单处理普通域名）
    return host.split(":")[0]
  }

  // 回退到 X-Forwarded-Host（反代/隧道场景）
  const xfh = c.req.header("X-Forwarded-Host") || c.req.header("x-forwarded-host")
  if (xfh) {
    return xfh.split(":")[0]
  }

  // 再回退到 URL
  try {
    return new URL(c.req.url).hostname
  } catch {
    return "localhost"
  }
}