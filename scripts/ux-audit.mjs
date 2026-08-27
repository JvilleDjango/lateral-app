import { chromium } from "@playwright/test";

const baseUrl = "http://127.0.0.1:5173";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const apiContext = await browser.newContext();
const api = apiContext.request;
// Seed a real confirmation through the public API so that scenario tests no private state.
const bookingResponse = await api.post(`${baseUrl}/api/bookings`, {
  data: {
    stayId: "sonoran-casita",
    guestName: "UX Audit",
    guestEmail: "audit@example.com",
    checkIn: "2026-10-10",
    checkOut: "2026-10-13",
    guests: 2,
    paymentToken: "mock-audit",
  },
});
const booking = bookingResponse.ok() ? await bookingResponse.json() : null;
if (!booking) console.warn(`Confirmation setup failed with HTTP ${bookingResponse.status()}.`);

const scenarios = [
  { name: "browse-wide", width: 1440, height: 1000, path: "/" },
  { name: "browse-api-error", width: 768, height: 1024, path: "/", mockStayError: true },
  {
    name: "browse-empty-mobile",
    width: 375,
    height: 812,
    path: "/?destination=Nowhere&checkIn=2026-10-10&checkOut=2026-10-13&guests=2",
  },
  {
    name: "detail-tablet",
    width: 768,
    height: 1024,
    path: "/stays/desert-glass-house?checkIn=2026-10-10&checkOut=2026-10-13&guests=2",
  },
  { name: "detail-not-found", width: 375, height: 812, path: "/stays/not-a-stay" },
  {
    name: "checkout-mobile",
    width: 375,
    height: 812,
    path: "/checkout?stayId=sonoran-casita&checkIn=2026-10-10&checkOut=2026-10-13&guests=2",
  },
  { name: "checkout-invalid", width: 768, height: 1024, path: "/checkout" },
  ...(booking
    ? [{ name: "confirmation-wide", width: 1440, height: 1000, path: `/booking/${booking.id}` }]
    : []),
];

const failures = [];

// Isolated contexts let responsive and failure scenarios run concurrently without state leaks.
await Promise.all(
  scenarios.map(async (scenario) => {
    const context = await browser.newContext({
      viewport: { width: scenario.width, height: scenario.height },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    page.on("response", (response) => {
      if (response.status() >= 500 && !scenario.mockStayError)
        errors.push(`http ${response.status()}: ${response.url()}`);
    });
    page.on("requestfailed", (request) => {
      if (request.failure()?.errorText !== "net::ERR_ABORTED")
        errors.push(`request: ${request.url()}`);
    });

    if (scenario.mockStayError) {
      await page.route("**/api/stays?**", (route) =>
        route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: { code: "AUDIT_ERROR", message: "Audit failure" } }),
        }),
      );
    }
    await page.goto(`${baseUrl}${scenario.path}`, { waitUntil: "domcontentloaded" });
    await page.locator("h1").waitFor({ state: "visible", timeout: 4000 });
    await page
      .locator('[aria-busy="true"]')
      .waitFor({ state: "detached", timeout: 3000 })
      .catch(() => undefined);
    const images = page.locator("img");
    for (let index = 0; index < (await images.count()); index += 1) {
      const image = images.nth(index);
      await image.scrollIntoViewIfNeeded();
      await image
        .evaluate((element) => {
          if (element.complete) return;
          return new Promise((resolve) => {
            element.addEventListener("load", resolve, { once: true });
            element.addEventListener("error", resolve, { once: true });
          });
        })
        .catch(() => undefined);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const metrics = await page.evaluate(() => {
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          style.visibility !== "hidden" &&
          style.display !== "none"
        );
      };
      const controls = [...document.querySelectorAll("input, select, textarea, button")].filter(
        visible,
      );
      const unlabeled = controls
        .filter((element) => element.tagName !== "BUTTON")
        .filter((element) => {
          const id = element.getAttribute("id");
          return (
            !element.closest("label") &&
            !(id && document.querySelector(`label[for='${id}']`)) &&
            !element.getAttribute("aria-label")
          );
        })
        .map(
          (element) =>
            `${element.tagName.toLowerCase()}[name='${element.getAttribute("name") ?? ""}']`,
        );
      const smallControls = controls
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.height < 40)
        .map(
          ({ element, rect }) =>
            `${element.tagName.toLowerCase()}[name='${element.getAttribute("name") ?? ""}']:${Math.round(rect.height)}px`,
        );
      const brokenImages = [...document.images]
        .filter((image) => visible(image) && (!image.complete || image.naturalWidth === 0))
        .map((image) => image.currentSrc || image.src);
      return {
        horizontalOverflow:
          document.documentElement.scrollWidth > document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        headings: [...document.querySelectorAll("h1, h2, h3")].map(
          (heading) => `${heading.tagName}:${heading.textContent?.trim()}`,
        ),
        unlabeled,
        smallControls,
        brokenImages,
      };
    });

    const missingFocusIndicators = [];
    const focusSteps =
      scenario.name === "browse-wide" || scenario.name === "checkout-mobile" ? 10 : 0;
    for (let index = 0; index < focusSteps; index += 1) {
      await page.keyboard.press("Tab");
      const focus = await page.evaluate(() => {
        const element = document.activeElement;
        if (!(element instanceof HTMLElement) || element === document.body) return null;
        const style = getComputedStyle(element);
        return {
          name: `${element.tagName.toLowerCase()}:${element.textContent?.trim().slice(0, 30) ?? ""}`,
          type: element instanceof HTMLInputElement ? element.type : "",
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth,
        };
      });
      if (
        focus &&
        focus.type !== "date" &&
        (focus.outlineStyle === "none" || focus.outlineWidth === "0px")
      ) {
        missingFocusIndicators.push(focus.name);
      }
    }

    await page.screenshot({ path: `.artifacts/${scenario.name}.png` });
    const result = { name: scenario.name, errors, missingFocusIndicators, ...metrics };
    console.log(JSON.stringify(result));
    if (
      errors.length ||
      metrics.horizontalOverflow ||
      metrics.unlabeled.length ||
      metrics.smallControls.length ||
      metrics.brokenImages.length ||
      missingFocusIndicators.length
    )
      failures.push(result);
    await context.close();
  }),
);

await apiContext.close();
await browser.close();

if (failures.length) {
  console.error(`UX audit failed in ${failures.length} scenario(s).`);
  process.exit(1);
}
